/**
 * core/sync.js
 * Granular Event Logging, 1-Minute Online Batch Sync, Pagehide Flush, and 24-Hour Practice Sync (D1, F1, F2).
 * - Exports both `recordEvent(evt)` AND `recordAction(action, payload, context)`.
 * - Exports both `flushNow(options)` AND `flushOnlineBatch(options)`.
 * - Exports both `syncPracticeIfEligible(options)` AND `flushPracticeIfDue(forceOrOptions)`.
 * - Subscribes to `MathCoreNetwatch.onGreenFlush` so pending events are flushed sequentially by `seq`
 *   when returning to Macau/unrestricted network (`🟢`), emitting receipt `"已提交 N 笔 ✓"`.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(
      require('./config.js'),
      require('./crypto.js'),
      require('./storage.js'),
      require('./netwatch.js'),
      require('./api.js')
    );
  } else {
    root.MathCoreSync = factory(
      root.MathCoreConfig,
      root.MathCoreCrypto,
      root.MathCoreStorage,
      root.MathCoreNetwatch,
      root.MathCoreApi
    );
  }
})(
  typeof globalThis !== 'undefined' ? globalThis : window,
  function (CONFIG, CRYPTO, STORAGE, NETWATCH, API) {
    'use strict';

    const ONLINE_INTERVAL_MS =
      (CONFIG && CONFIG.sync && CONFIG.sync.onlineBatchIntervalMs) || 60 * 1000;
    const PRACTICE_INTERVAL_MS =
      (CONFIG && CONFIG.sync && CONFIG.sync.practiceIntervalMs) || 24 * 60 * 60 * 1000;

    let onlineTimerId = null;
    let pagehideBound = false;
    let netwatchUnsub = null;
    let defaultContext = {};
    const receiptListeners = new Set();

    function getSessionFallback() {
      if (!STORAGE || typeof STORAGE.getItem !== 'function') return {};
      const key =
        (STORAGE.storageKeys && STORAGE.storageKeys.sessionKey) || 'MP_V2_SESSION';
      return STORAGE.getItem(key, {}) || {};
    }

    function setDefaultContext(ctx) {
      defaultContext = Object.assign({}, defaultContext, ctx || {});
    }

    function onReceipt(listener) {
      if (typeof listener !== 'function') return function () {};
      receiptListeners.add(listener);
      return function unsubscribe() {
        receiptListeners.delete(listener);
      };
    }

    function emitReceipt(count, mode, result) {
      const msg = `已提交 ${count} 笔 ✓`;
      const payload = {
        message: msg,
        count: count,
        mode: mode || 'online',
        ts: Date.now(),
        result: result,
      };
      receiptListeners.forEach(function (fn) {
        try {
          fn(payload);
        } catch (e) {
          // ignore
        }
      });
      return payload;
    }

    /**
     * Records a granular interaction event (keyboard, click, hint_use, answer, adaptive_add, etc.)
     * immediately to `MathCoreStorage` with millisecond `clientTs`, monotonic `seq`, HMAC `sig`,
     * and `offline` flag based on `MathCoreNetwatch.getState().status !== 'GREEN'`.
     */
    async function recordEvent(evt) {
      if (!evt || typeof evt !== 'object') {
        throw new Error('recordEvent requires an event object');
      }
      const sess = getSessionFallback();
      const netState =
        NETWATCH && typeof NETWATCH.getState === 'function'
          ? NETWATCH.getState()
          : { status: 'GREEN' };
      const isOffline = netState.status !== 'GREEN';

      const classID = String(
        evt.classID || defaultContext.classID || sess.classID || 'UNKNOWN'
      ).toUpperCase();
      const studentID =
        evt.studentID !== undefined
          ? evt.studentID
          : defaultContext.studentID !== undefined
            ? defaultContext.studentID
            : sess.studentID !== undefined
              ? sess.studentID
              : 0;
      const sid = evt.sid || defaultContext.sid || sess.sid || `${classID}_${studentID}`;
      const token = evt.token || defaultContext.token || sess.token || '';
      const examId = evt.examId || defaultContext.examId || 'general';
      const qid = evt.qid !== undefined ? evt.qid : defaultContext.qid || '';
      const mode = evt.mode || defaultContext.mode || 'online';
      const action = evt.action || 'interaction';
      const payload = evt.payload !== undefined ? evt.payload : {};
      const clientTs = typeof evt.clientTs === 'number' ? evt.clientTs : Date.now();
      const seq =
        typeof evt.seq === 'number' && evt.seq > 0 ? evt.seq : STORAGE.nextSeq();
      const secretKey =
        evt.secretKey ||
        defaultContext.secretKey ||
        sess.secretKey ||
        `${classID}${String(studentID).padStart(2, '0')}-KEY`;

      let sig = evt.sig || '';
      if (!sig && CRYPTO && typeof CRYPTO.signSubmission === 'function') {
        sig = await CRYPTO.signSubmission(
          {
            sid: sid,
            examId: examId,
            qid: qid,
            action: action,
            payload: payload,
            clientTs: clientTs,
            seq: seq,
          },
          secretKey
        );
      }

      const stored = STORAGE.appendEvent({
        token: token,
        sid: sid,
        classID: classID,
        studentID: studentID,
        examId: examId,
        qid: qid,
        action: action,
        payload: payload,
        mode: mode,
        clientTs: clientTs,
        seq: seq,
        sig: sig,
        offline: evt.offline !== undefined ? Boolean(evt.offline) : isOffline,
        secretKey: secretKey,
      });

      return stored;
    }

    /**
     * Alias for `recordEvent` matching PROJECT.md Interface Contract 2:
     * `recordAction(action, payload, context)`
     */
    async function recordAction(action, payload, context) {
      if (action && typeof action === 'object' && payload === undefined) {
        return recordEvent(action);
      }
      const ctx = Object.assign({}, defaultContext, context || {}, {
        action: String(action || 'interaction'),
        payload: payload !== undefined ? payload : {},
      });
      return recordEvent(ctx);
    }

    /**
     * Flushes all pending online events (`mode !== 'practice'`) via `MathCoreApi.postFormEvents`.
     * When `netwatch` is not `'GREEN'` (unless `options.ignoreNetwatch` is true), keeps events queued locally.
     */
    async function flushNow(options) {
      const opts = options || {};
      const netState =
        NETWATCH && typeof NETWATCH.getState === 'function'
          ? NETWATCH.getState()
          : { status: 'GREEN' };

      if (!opts.ignoreNetwatch && netState.status !== 'GREEN') {
        return {
          ok: false,
          skipped: true,
          reason: 'network_not_green:' + netState.status,
          eventsSent: 0,
          batchesSent: 0,
        };
      }

      const pendingOnline = STORAGE.getPendingEvents(function (ev) {
        if (opts.includePractice) return true;
        return ev.mode !== 'practice';
      });

      if (pendingOnline.length === 0) {
        return {
          ok: true,
          skipped: false,
          eventsSent: 0,
          batchesSent: 0,
          receipt: null,
        };
      }

      const apiRes = await API.postFormEvents(pendingOnline, {
        useBeacon: Boolean(opts.useBeacon),
        transportFn: opts.transportFn,
        maxEventsPerFormPost: opts.maxEventsPerFormPost,
      });

      if (apiRes.ok && Array.isArray(apiRes.syncedSeqs) && apiRes.syncedSeqs.length > 0) {
        STORAGE.markEventsSynced(apiRes.syncedSeqs);
        STORAGE.setLastOnlineSyncTs(Date.now());
        const receipt = emitReceipt(apiRes.syncedSeqs.length, 'online', apiRes);
        return Object.assign({}, apiRes, { receipt: receipt.message });
      }

      return apiRes;
    }

    // Alias matching PROJECT.md Interface Contract 2
    const flushOnlineBatch = flushNow;

    /**
     * Offline Practice 24-Hour Batch Policy (D1, F2, Edge Case E3).
     * Checks `Date.now() - getLastPracticeSyncTs() >= 24 * 60 * 60 * 1000`.
     * If `< 24h` (and not `force`), sends 0 network requests.
     * If `>= 24h` (or `force: true`) and network is `'GREEN'`, posts practice batch and updates `lastPracticeSyncTs`.
     */
    async function syncPracticeIfEligible(optionsOrForce) {
      const opts =
        typeof optionsOrForce === 'boolean'
          ? { force: optionsOrForce }
          : optionsOrForce || {};
      const force = Boolean(opts.force);
      const now = typeof opts.nowTs === 'number' ? opts.nowTs : Date.now();
      const lastSyncTs = STORAGE.getLastPracticeSyncTs();
      const elapsed = now - lastSyncTs;

      if (!force && lastSyncTs > 0 && elapsed < PRACTICE_INTERVAL_MS) {
        return {
          ok: true,
          eligible: false,
          skipped: true,
          reason: 'interval_not_reached',
          elapsedMs: elapsed,
          remainingMs: PRACTICE_INTERVAL_MS - elapsed,
          eventsSent: 0,
          batchesSent: 0,
        };
      }

      const netState =
        NETWATCH && typeof NETWATCH.getState === 'function'
          ? NETWATCH.getState()
          : { status: 'GREEN' };

      if (!opts.ignoreNetwatch && netState.status !== 'GREEN') {
        return {
          ok: false,
          eligible: true,
          skipped: true,
          reason: 'network_not_green:' + netState.status,
          eventsSent: 0,
          batchesSent: 0,
        };
      }

      const pendingPractice = STORAGE.getPendingEvents(function (ev) {
        return ev.mode === 'practice';
      });

      if (pendingPractice.length === 0) {
        return {
          ok: true,
          eligible: true,
          skipped: false,
          eventsSent: 0,
          batchesSent: 0,
        };
      }

      const apiRes = await API.postFormEvents(pendingPractice, {
        mode: 'practice',
        transportFn: opts.transportFn,
        maxEventsPerFormPost: opts.maxEventsPerFormPost,
      });

      if (apiRes.ok && Array.isArray(apiRes.syncedSeqs) && apiRes.syncedSeqs.length > 0) {
        STORAGE.markEventsSynced(apiRes.syncedSeqs);
        STORAGE.setLastPracticeSyncTs(now);
        const receipt = emitReceipt(apiRes.syncedSeqs.length, 'practice', apiRes);
        return Object.assign({}, apiRes, {
          eligible: true,
          skipped: false,
          receipt: receipt.message,
        });
      }

      return Object.assign({}, apiRes, { eligible: true, skipped: false });
    }

    // Alias matching PROJECT.md Interface Contract 2
    const flushPracticeIfDue = syncPracticeIfEligible;

    /**
     * Binds granular `keydown` and `click` (including hint buttons) listeners to `rootElement`.
     * Returns an `unbind()` cleanup function.
     */
    function bindGranularListeners(rootElement, contextProvider) {
      if (!rootElement || typeof rootElement.addEventListener !== 'function') {
        return function () {};
      }
      const getCtx =
        typeof contextProvider === 'function'
          ? contextProvider
          : function () {
              return contextProvider || defaultContext;
            };

      function onKeyDown(ev) {
        const ctx = getCtx() || {};
        recordEvent(
          Object.assign({}, ctx, {
            action: 'keydown',
            payload: {
              key: ev.key || '',
              code: ev.code || '',
              targetId: (ev.target && ev.target.id) || '',
            },
          })
        );
      }

      function onClick(ev) {
        const ctx = getCtx() || {};
        const target = ev.target || {};
        const isHint =
          Boolean(target.dataset && target.dataset.hint) ||
          (typeof target.className === 'string' &&
            target.className.indexOf('hint') !== -1) ||
          (typeof target.id === 'string' && target.id.indexOf('hint') !== -1);
        recordEvent(
          Object.assign({}, ctx, {
            action: isHint ? 'hint_click' : 'click',
            payload: {
              targetId: target.id || '',
              tagName: target.tagName || '',
              text: String(target.textContent || '').trim().slice(0, 40),
              isHint: isHint,
            },
          })
        );
      }

      rootElement.addEventListener('keydown', onKeyDown);
      rootElement.addEventListener('click', onClick);

      return function unbind() {
        if (typeof rootElement.removeEventListener === 'function') {
          rootElement.removeEventListener('keydown', onKeyDown);
          rootElement.removeEventListener('click', onClick);
        }
      };
    }

    function handlePageHide() {
      flushNow({ useBeacon: true });
    }

    function start(options) {
      const opts = options || {};
      stop();
      const interval = opts.intervalMs || ONLINE_INTERVAL_MS;
      onlineTimerId = setInterval(function () {
        flushNow(opts);
      }, interval);
      if (onlineTimerId && typeof onlineTimerId.unref === 'function') {
        onlineTimerId.unref();
      }

      if (NETWATCH && typeof NETWATCH.onGreenFlush === 'function') {
        netwatchUnsub = NETWATCH.onGreenFlush(function () {
          flushNow(opts);
          syncPracticeIfEligible(opts);
        });
      }

      if (
        !pagehideBound &&
        typeof globalThis !== 'undefined' &&
        typeof globalThis.addEventListener === 'function'
      ) {
        globalThis.addEventListener('pagehide', handlePageHide);
        pagehideBound = true;
      }
      return onlineTimerId;
    }

    function stop() {
      if (onlineTimerId !== null) {
        clearInterval(onlineTimerId);
        onlineTimerId = null;
      }
      if (typeof netwatchUnsub === 'function') {
        netwatchUnsub();
        netwatchUnsub = null;
      }
      if (
        pagehideBound &&
        typeof globalThis !== 'undefined' &&
        typeof globalThis.removeEventListener === 'function'
      ) {
        globalThis.removeEventListener('pagehide', handlePageHide);
        pagehideBound = false;
      }
    }

    return {
      recordEvent: recordEvent,
      recordAction: recordAction,
      flushNow: flushNow,
      flushOnlineBatch: flushOnlineBatch,
      syncPracticeIfEligible: syncPracticeIfEligible,
      flushPracticeIfDue: flushPracticeIfDue,
      bindGranularListeners: bindGranularListeners,
      start: start,
      stop: stop,
      setDefaultContext: setDefaultContext,
      onReceipt: onReceipt,
    };
  }
);
