/**
 * core/netwatch.js
 * Dual-Layer Network Region Monitor (F19, Edge Cases E4, E5).
 * - Layer 1: Probes Google connectivity (`networkProbeTimeoutMs` = 3500ms, injectable `probeFn`).
 *   - `navigator.onLine === false` -> `'RED'` (`🔴`, `offline`)
 *   - Online + Google probe ok -> `'GREEN'` (`🟢`, `online_macau`)
 *   - Online + Google probe fail/timeout -> `'YELLOW'` (`🟡`, `restricted_mainland`)
 * - Layer 2 (optional when `requireMacauGeo: true`): Calls IP geo check (`country === 'MO'`).
 *   - If geo check returns non-MO (`country !== 'MO'`), downgrades to `'YELLOW'`.
 *   - If geo service errors or times out, falls back to Layer 1 result (Edge Case E5).
 * - Tracks state transitions `{ from, to, ts, reason }` in storage.
 * - Periodic check every 30s (`start()`, `stop()`, `probeNow()`) + browser `online`/`offline` listeners.
 * - `onChange(listener)` callback registration; triggers auto-flush callbacks when transitioning to `'GREEN'`.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./config.js'), require('./storage.js'));
  } else {
    root.MathCoreNetwatch = factory(root.MathCoreConfig, root.MathCoreStorage);
  }
})(typeof globalThis !== 'undefined' ? globalThis : window, function (CONFIG, STORAGE) {
  'use strict';

  const PROBE_TIMEOUT_MS =
    (CONFIG && CONFIG.sync && CONFIG.sync.networkProbeTimeoutMs) || 3500;
  const INTERVAL_MS =
    (CONFIG && CONFIG.sync && CONFIG.sync.netwatchIntervalMs) || 30 * 1000;
  const TRANSITIONS_KEY =
    (STORAGE && STORAGE.storageKeys && STORAGE.storageKeys.netwatchTransitionsKey) ||
    'MP_V2_NETWATCH_TRANSITIONS';

  const LABELS = {
    GREEN: '🟢',
    YELLOW: '🟡',
    RED: '🔴',
  };

  const REGIONS = {
    GREEN: 'online_macau',
    YELLOW: 'restricted_mainland',
    RED: 'offline',
  };

  let currentState = {
    status: 'GREEN',
    label: LABELS.GREEN,
    region: REGIONS.GREEN,
    isMacau: true,
    lastCheckedTs: 0,
    reason: 'init',
    transitions: [],
  };

  let timerId = null;
  let customProbeFn = null;
  let customGeoProbeFn = null;
  let customNavigatorOnlineFn = null;
  let requireMacauGeoDefault = false;
  const changeListeners = new Set();
  const greenFlushListeners = new Set();
  let browserListenersBound = false;

  function loadTransitions() {
    if (!STORAGE || typeof STORAGE.getItem !== 'function') {
      return currentState.transitions;
    }
    const list = STORAGE.getItem(TRANSITIONS_KEY, []);
    return Array.isArray(list) ? list : [];
  }

  function saveTransition(transition) {
    const list = loadTransitions();
    list.push(transition);
    // Keep last 200 transitions to prevent unbounded growth
    while (list.length > 200) {
      list.shift();
    }
    currentState.transitions = list;
    if (STORAGE && typeof STORAGE.setItem === 'function') {
      STORAGE.setItem(TRANSITIONS_KEY, list);
    }
  }

  function isBrowserOnline() {
    if (typeof customNavigatorOnlineFn === 'function') {
      return Boolean(customNavigatorOnlineFn());
    }
    if (
      typeof globalThis !== 'undefined' &&
      globalThis.navigator &&
      typeof globalThis.navigator.onLine === 'boolean'
    ) {
      return globalThis.navigator.onLine;
    }
    return true;
  }

  function withTimeout(promise, timeoutMs, timeoutErrorMsg) {
    return new Promise(function (resolve, reject) {
      let settled = false;
      const timer = setTimeout(function () {
        if (!settled) {
          settled = true;
          reject(new Error(timeoutErrorMsg || 'Probe timeout'));
        }
      }, timeoutMs);

      Promise.resolve(promise)
        .then(function (val) {
          if (!settled) {
            settled = true;
            clearTimeout(timer);
            resolve(val);
          }
        })
        .catch(function (err) {
          if (!settled) {
            settled = true;
            clearTimeout(timer);
            reject(err);
          }
        });
    });
  }

  async function defaultGoogleProbe(timeoutMs) {
    if (typeof fetch !== 'function') {
      return true;
    }
    const url =
      (CONFIG && CONFIG.endpoints && CONFIG.endpoints.gasSheetReaderUrl) ||
      'https://docs.google.com/generate_204';
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = setTimeout(function () {
      if (controller) controller.abort();
    }, timeoutMs);
    try {
      await fetch(url + (url.indexOf('?') >= 0 ? '&' : '?') + '_ping=' + Date.now(), {
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-store',
        signal: controller ? controller.signal : undefined,
      });
      clearTimeout(timer);
      return true;
    } catch (e) {
      clearTimeout(timer);
      return false;
    }
  }

  async function defaultGeoProbe(timeoutMs) {
    if (typeof fetch !== 'function') {
      throw new Error('fetch unavailable for geo probe');
    }
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = setTimeout(function () {
      if (controller) controller.abort();
    }, timeoutMs);
    try {
      const resp = await fetch('https://ipapi.co/json/', {
        method: 'GET',
        cache: 'no-store',
        signal: controller ? controller.signal : undefined,
      });
      clearTimeout(timer);
      if (!resp || !resp.ok) {
        throw new Error('Geo HTTP ' + (resp ? resp.status : 'err'));
      }
      return await resp.json();
    } catch (e) {
      clearTimeout(timer);
      throw e;
    }
  }

  function applyState(nextStatus, reason, isMacau) {
    const prevStatus = currentState.status;
    const now = Date.now();
    const transitions = loadTransitions();

    if (prevStatus !== nextStatus || currentState.lastCheckedTs === 0) {
      if (currentState.lastCheckedTs !== 0 && prevStatus !== nextStatus) {
        saveTransition({
          from: prevStatus,
          to: nextStatus,
          ts: now,
          reason: reason || '',
        });
      } else {
        currentState.transitions = transitions;
      }
    } else {
      currentState.transitions = transitions;
    }

    currentState = {
      status: nextStatus,
      label: LABELS[nextStatus] || LABELS.RED,
      region: REGIONS[nextStatus] || REGIONS.RED,
      isMacau: Boolean(isMacau),
      lastCheckedTs: now,
      reason: reason || '',
      transitions: currentState.transitions,
    };

    if (prevStatus !== nextStatus) {
      changeListeners.forEach(function (fn) {
        try {
          fn(getState(), prevStatus);
        } catch (e) {
          // ignore listener errors
        }
      });

      if (nextStatus === 'GREEN') {
        greenFlushListeners.forEach(function (fn) {
          try {
            fn(getState(), prevStatus);
          } catch (e) {
            // ignore
          }
        });
      }
    }

    return getState();
  }

  /**
   * Executes dual-layer network probe immediately.
   * @param {Object} [options]
   * @param {boolean} [options.requireMacauGeo] - Enable Layer 2 Macau IP check
   * @param {Function} [options.probeFn] - Optional override for Layer 1 Google probe
   * @param {Function} [options.geoProbeFn] - Optional override for Layer 2 Geo probe
   * @param {number} [options.timeoutMs] - Probe timeout in ms (default 3500ms)
   */
  async function probeNow(options) {
    const opts = options || {};
    const timeoutMs = opts.timeoutMs || PROBE_TIMEOUT_MS;
    const requireGeo =
      opts.requireMacauGeo !== undefined ? Boolean(opts.requireMacauGeo) : requireMacauGeoDefault;

    if (!isBrowserOnline()) {
      return applyState('RED', 'navigator_offline', false);
    }

    const layer1Fn = opts.probeFn || customProbeFn || defaultGoogleProbe;
    let layer1Ok = false;
    let layer1Reason = 'google_probe_ok';

    try {
      const res = await withTimeout(layer1Fn(timeoutMs), timeoutMs, 'google_probe_timeout');
      if (res === false || (res && typeof res === 'object' && res.ok === false)) {
        layer1Ok = false;
        layer1Reason = (res && res.reason) || 'google_probe_failed';
      } else {
        layer1Ok = true;
      }
    } catch (err) {
      layer1Ok = false;
      layer1Reason = err && err.message ? err.message : 'google_probe_error';
    }

    if (!layer1Ok) {
      return applyState('YELLOW', layer1Reason, false);
    }

    // Layer 1 succeeded -> candidate GREEN
    if (!requireGeo) {
      return applyState('GREEN', 'layer1_google_ok', true);
    }

    // Layer 2: Optional Macau IP geo check (Edge Case E5: fallback to Layer 1 on error/timeout)
    const layer2Fn = opts.geoProbeFn || customGeoProbeFn || defaultGeoProbe;
    try {
      const geoData = await withTimeout(layer2Fn(timeoutMs), timeoutMs, 'geo_probe_timeout');
      if (geoData && typeof geoData === 'object') {
        const country = String(
          geoData.country || geoData.country_code || geoData.countryCode || ''
        )
          .trim()
          .toUpperCase();
        if (country && country !== 'MO' && country !== 'MACAU' && country !== 'MACAO') {
          return applyState('YELLOW', 'geo_non_macau:' + country, false);
        }
        return applyState('GREEN', 'layer2_macau_verified', true);
      }
      return applyState('GREEN', 'layer2_empty_fallback_layer1', true);
    } catch (geoErr) {
      // Edge Case E5: Third-party IP geo failure/timeout falls back to Layer 1 result (GREEN)
      return applyState('GREEN', 'layer2_fallback_layer1:' + (geoErr.message || 'err'), true);
    }
  }

  function getState() {
    return Object.assign({}, currentState, {
      transitions: loadTransitions().slice(),
    });
  }

  function setStateForTest(status, reason) {
    const norm = String(status || 'GREEN').toUpperCase();
    return applyState(norm, reason || 'manual_set', norm === 'GREEN');
  }

  function configure(options) {
    const opts = options || {};
    if (opts.probeFn !== undefined) customProbeFn = opts.probeFn;
    if (opts.geoProbeFn !== undefined) customGeoProbeFn = opts.geoProbeFn;
    if (opts.navigatorOnlineFn !== undefined) customNavigatorOnlineFn = opts.navigatorOnlineFn;
    if (opts.requireMacauGeo !== undefined) requireMacauGeoDefault = Boolean(opts.requireMacauGeo);
  }

  function onChange(listener) {
    if (typeof listener !== 'function') return function () {};
    changeListeners.add(listener);
    return function unsubscribe() {
      changeListeners.delete(listener);
    };
  }

  function onGreenFlush(listener) {
    if (typeof listener !== 'function') return function () {};
    greenFlushListeners.add(listener);
    return function unsubscribe() {
      greenFlushListeners.delete(listener);
    };
  }

  function handleBrowserOnline() {
    probeNow();
  }

  function handleBrowserOffline() {
    applyState('RED', 'window_offline_event', false);
  }

  function start(options) {
    if (options) configure(options);
    stop();
    const interval = (options && options.intervalMs) || INTERVAL_MS;
    if (
      !browserListenersBound &&
      typeof globalThis !== 'undefined' &&
      typeof globalThis.addEventListener === 'function'
    ) {
      globalThis.addEventListener('online', handleBrowserOnline);
      globalThis.addEventListener('offline', handleBrowserOffline);
      browserListenersBound = true;
    }
    probeNow(options);
    timerId = setInterval(function () {
      probeNow(options);
    }, interval);
    if (timerId && typeof timerId.unref === 'function') {
      timerId.unref();
    }
    return timerId;
  }

  function stop() {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
    if (
      browserListenersBound &&
      typeof globalThis !== 'undefined' &&
      typeof globalThis.removeEventListener === 'function'
    ) {
      globalThis.removeEventListener('online', handleBrowserOnline);
      globalThis.removeEventListener('offline', handleBrowserOffline);
      browserListenersBound = false;
    }
  }

  function resetForTest() {
    stop();
    customProbeFn = null;
    customGeoProbeFn = null;
    customNavigatorOnlineFn = null;
    requireMacauGeoDefault = false;
    changeListeners.clear();
    greenFlushListeners.clear();
    if (STORAGE && typeof STORAGE.removeItem === 'function') {
      STORAGE.removeItem(TRANSITIONS_KEY);
    }
    currentState = {
      status: 'GREEN',
      label: LABELS.GREEN,
      region: REGIONS.GREEN,
      isMacau: true,
      lastCheckedTs: 0,
      reason: 'reset',
      transitions: [],
    };
  }

  return {
    LABELS: LABELS,
    REGIONS: REGIONS,
    start: start,
    stop: stop,
    probeNow: probeNow,
    getState: getState,
    onChange: onChange,
    onGreenFlush: onGreenFlush,
    configure: configure,
    setStateForTest: setStateForTest,
    resetForTest: resetForTest,
  };
});
