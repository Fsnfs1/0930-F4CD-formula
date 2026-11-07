/**
 * core/auth.js
 * Student & Teacher Authentication and Research Informed Consent Module (S1, S2, S3, D6, F3, F20).
 * - `loginStudent({ classID, studentID, secretKey, encryptedRosterMap })`:
 *   - Supports decrypting from `encryptedRosterMap` via `MathCoreCrypto.decryptStudentFromRoster` (S2)
 *   - AND looking up student in `MathPlatformRegistry.getMergedRoster()` (`js/roster.js` + `extraRoster`)
 *     with secretKey verification (minimum 6 chars, teacher-issued key e.g. `K7M2-QX9P`, or `${classID}${pad2(studentID)}-KEY`).
 *   - Issues session `{ token, sid: "${classID}_${studentID}", classID, studentID, name, grade, role: 'student', secretKey, loginTs }`
 *     stored in `MP_V2_SESSION`.
 * - `loginTeacher({ username, password })`: Verifies teacher credentials and issues `{ role: 'teacher', ... }` session.
 * - `getSession()`, `logout()`, `requireAuth()`.
 * - Research Informed Consent (D6):
 *   - `getConsentStatus(sid)`, `needsConsentPrompt(sid)`, `setConsentStatus(sid, { agreed, parentalConsent })`, `withdrawConsent(sid)`.
 *   - Declining (`agreed: false`) or withdrawing (`withdrawn: true`) NEVER blocks platform features (Edge Case E13).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(
      require('./config.js'),
      require('./crypto.js'),
      require('./registry.js'),
      require('./storage.js')
    );
  } else {
    root.MathCoreAuth = factory(
      root.MathCoreConfig,
      root.MathCoreCrypto,
      root.MathPlatformRegistry,
      root.MathCoreStorage
    );
  }
})(
  typeof globalThis !== 'undefined' ? globalThis : window,
  function (CONFIG, CRYPTO, REGISTRY, STORAGE) {
    'use strict';

    const SESSION_KEY =
      (STORAGE && STORAGE.storageKeys && STORAGE.storageKeys.sessionKey) ||
      (CONFIG && CONFIG.storageKeys && CONFIG.storageKeys.sessionKey) ||
      'MP_V2_SESSION';
    const CONSENT_PREFIX =
      (STORAGE && STORAGE.storageKeys && STORAGE.storageKeys.consentKeyPrefix) ||
      (CONFIG && CONFIG.storageKeys && CONFIG.storageKeys.consentKeyPrefix) ||
      'MP_V2_CONSENT_';
    const CONSENT_VERSION =
      (CONFIG && CONFIG.crypto && CONFIG.crypto.consentVersion) || '2026-11-v1';

    function inferGrade(classID) {
      const c = String(classID || '').trim().toUpperCase();
      if (c.startsWith('4')) return 10;
      if (c.startsWith('5')) return 11;
      if (c.startsWith('6')) return 12;
      return 10;
    }

    function normalizeSecret(secretKey) {
      if (CRYPTO && typeof CRYPTO.normalizeStudentSecret === 'function') {
        return CRYPTO.normalizeStudentSecret(secretKey);
      }
      return String(secretKey || '')
        .trim()
        .toUpperCase()
        .replace(/\s+/g, '');
    }

    /**
     * Validates a student secretKey against teacher-issued keys in storage (`MP_V2_STUDENT_KEYS`),
     * standard key pattern `${classID}${pad2(studentID)}-KEY`, or >= 6 character secret key.
     */
    function verifyStudentRosterKey(classID, studentID, normalizedKey) {
      if (!normalizedKey || normalizedKey.length < 6) {
        return false;
      }
      const sid = `${classID}_${studentID}`;
      if (STORAGE && typeof STORAGE.getItem === 'function') {
        const keyTable = STORAGE.getItem('MP_V2_STUDENT_KEYS', null);
        if (keyTable && typeof keyTable === 'object' && keyTable[sid]) {
          const expected = normalizeSecret(keyTable[sid]);
          return normalizedKey === expected;
        }
      }
      return true;
    }

    /**
     * Logs in a student via either:
     *  1. Encrypted roster map (`encryptedRosterMap` + `secretKey` via `MathCoreCrypto.decryptStudentFromRoster`)
     *  2. Merged roster lookup (`MathPlatformRegistry.getMergedRoster()`) + `secretKey` validation.
     */
    async function loginStudent(params) {
      if (!params || typeof params !== 'object') {
        throw new Error('loginStudent requires parameter object');
      }
      const rawKey = params.secretKey || params.password || '';
      const normKey = normalizeSecret(rawKey);
      if (!normKey || normKey.length < 6) {
        throw new Error('密鑰長度不足（至少需要 6 位字符）');
      }

      let studentProfile = null;

      // Path 1: S2 Encrypted Roster Map decryption using ONLY the student's secret key
      const encMap =
        params.encryptedRosterMap ||
        (typeof globalThis !== 'undefined' ? globalThis.ENCRYPTED_ROSTER_MAP : null);
      if (encMap && CRYPTO && typeof CRYPTO.decryptStudentFromRoster === 'function') {
        const decrypted = await CRYPTO.decryptStudentFromRoster(encMap, normKey);
        if (decrypted && decrypted.classID && decrypted.studentID !== undefined) {
          if (
            params.classID &&
            String(params.classID).trim().toUpperCase() !==
              String(decrypted.classID).trim().toUpperCase()
          ) {
            throw new Error('班級與密鑰不匹配');
          }
          if (
            params.studentID !== undefined &&
            parseInt(params.studentID, 10) !== parseInt(decrypted.studentID, 10)
          ) {
            throw new Error('學號與密鑰不匹配');
          }
          studentProfile = {
            classID: String(decrypted.classID).trim().toUpperCase(),
            studentID: parseInt(decrypted.studentID, 10),
            name: decrypted.name,
            grade: decrypted.grade || inferGrade(decrypted.classID),
          };
        } else if (!params.classID || params.studentID === undefined) {
          throw new Error('密鑰無效或找不到對應學生記錄');
        }
      }

      // Path 2: Merged Roster Lookup (`js/roster.js` + `registry.extraRoster`)
      if (!studentProfile) {
        const classID = String(params.classID || '').trim().toUpperCase();
        const studentID = parseInt(params.studentID, 10);
        if (!classID || isNaN(studentID)) {
          throw new Error('請選擇班級與學號，或輸入有效密鑰');
        }
        const mergedRoster =
          REGISTRY && typeof REGISTRY.getMergedRoster === 'function'
            ? REGISTRY.getMergedRoster(params.baseRosterData)
            : {};
        const classList = Array.isArray(mergedRoster[classID])
          ? mergedRoster[classID]
          : [];
        const found = classList.find(function (s) {
          return parseInt(s.id !== undefined ? s.id : s.studentID, 10) === studentID;
        });
        if (!found) {
          throw new Error(`找不到學生記錄 (${classID} #${studentID})`);
        }
        if (!verifyStudentRosterKey(classID, studentID, normKey)) {
          throw new Error('學生密鑰不正確');
        }
        studentProfile = {
          classID: classID,
          studentID: studentID,
          name: found.name,
          grade: found.grade || inferGrade(classID),
        };
      }

      const sid = `${studentProfile.classID}_${studentProfile.studentID}`;
      const loginTs = Date.now();
      let token = `STU_${sid}_${loginTs}`;
      if (CRYPTO && typeof CRYPTO.sha256Hex === 'function') {
        const hash = await CRYPTO.sha256Hex(`${sid}:${normKey}:${loginTs}`);
        token = `tk_${hash.slice(0, 24)}`;
      }

      const session = {
        token: token,
        sid: sid,
        classID: studentProfile.classID,
        studentID: studentProfile.studentID,
        name: studentProfile.name,
        grade: studentProfile.grade,
        role: 'student',
        secretKey: normKey,
        loginTs: loginTs,
        consentNeeded: needsConsentPrompt(sid),
      };

      if (STORAGE && typeof STORAGE.setItem === 'function') {
        STORAGE.setItem(SESSION_KEY, session);
      }
      return session;
    }

    /**
     * Logs in a teacher using `window.TEACHER_CREDENTIALS_5BC`, custom storage credentials, or default admin credentials.
     */
    async function loginTeacher(params) {
      if (!params || typeof params !== 'object') {
        throw new Error('loginTeacher requires credentials');
      }
      const username = String(params.username || 'teacher').trim();
      const password = String(params.password || params.secretKey || '').trim();
      if (!password) {
        throw new Error('請輸入教師密碼');
      }

      const scope = typeof globalThis !== 'undefined' ? globalThis : {};
      const customCreds =
        (STORAGE && typeof STORAGE.getItem === 'function'
          ? STORAGE.getItem('MP_V2_TEACHER_CREDENTIALS', null)
          : null) ||
        scope.TEACHER_CREDENTIALS_5BC ||
        null;

      let valid = false;
      if (customCreds && typeof customCreds === 'object') {
        if (customCreds.password && password === String(customCreds.password)) {
          valid = true;
        } else if (customCreds[username] && password === String(customCreds[username])) {
          valid = true;
        }
      }
      // Standard built-in teacher passwords
      if (
        password === 'TEACHER-ADMIN-2026' ||
        password === 'MATH-TEACHER-2026' ||
        password === 'admin1234' ||
        password === '5BC_TEACHER_2026'
      ) {
        valid = true;
      }

      if (!valid) {
        throw new Error('教師帳號或密碼錯誤');
      }

      const loginTs = Date.now();
      let token = `TCH_${username}_${loginTs}`;
      if (CRYPTO && typeof CRYPTO.sha256Hex === 'function') {
        const hash = await CRYPTO.sha256Hex(`TEACHER:${username}:${loginTs}`);
        token = `tch_${hash.slice(0, 24)}`;
      }

      const session = {
        token: token,
        sid: `TEACHER_${username.toUpperCase()}`,
        username: username,
        name: params.name || '任課教師',
        role: 'teacher',
        loginTs: loginTs,
      };

      if (STORAGE && typeof STORAGE.setItem === 'function') {
        STORAGE.setItem(SESSION_KEY, session);
      }
      return session;
    }

    function getSession() {
      if (!STORAGE || typeof STORAGE.getItem !== 'function') return null;
      return STORAGE.getItem(SESSION_KEY, null);
    }

    function logout() {
      if (STORAGE && typeof STORAGE.removeItem === 'function') {
        STORAGE.removeItem(SESSION_KEY);
      }
      return true;
    }

    function requireAuth(expectedRole) {
      const sess = getSession();
      if (!sess || !sess.token) {
        throw new Error('AUTH_REQUIRED: 請先登錄系統');
      }
      if (expectedRole && sess.role !== expectedRole) {
        throw new Error(`AUTH_FORBIDDEN: 需要 ${expectedRole} 權限`);
      }
      return sess;
    }

    // =========================================================================
    // Research Informed Consent (D6, F20, Edge Case E13)
    // =========================================================================

    function getConsentStorageKey(sid) {
      const normSid = String(sid || '').trim().toUpperCase();
      if (!normSid) throw new Error('sid is required for consent status');
      return CONSENT_PREFIX + normSid;
    }

    /**
     * Returns consent status for `sid`.
     * Schema: `{ sid, agreed: boolean, version: string, ts: number, parentalConsent: boolean, withdrawn: boolean, prompted: boolean }`
     */
    function getConsentStatus(sid) {
      const key = getConsentStorageKey(sid);
      const saved =
        STORAGE && typeof STORAGE.getItem === 'function'
          ? STORAGE.getItem(key, null)
          : null;
      if (!saved || typeof saved !== 'object') {
        return {
          sid: String(sid).trim().toUpperCase(),
          agreed: false,
          version: CONSENT_VERSION,
          ts: 0,
          parentalConsent: false,
          withdrawn: false,
          prompted: false,
        };
      }
      return Object.assign(
        {
          sid: String(sid).trim().toUpperCase(),
          agreed: false,
          version: CONSENT_VERSION,
          ts: 0,
          parentalConsent: false,
          withdrawn: false,
          prompted: true,
        },
        saved
      );
    }

    /**
     * Returns true on first login (`!prompted`) or when the stored consent `version !== CONFIG.crypto.consentVersion`.
     */
    function needsConsentPrompt(sid) {
      const status = getConsentStatus(sid);
      if (!status.prompted || !status.ts) return true;
      if (status.version !== CONSENT_VERSION) return true;
      return false;
    }

    /**
     * Records student's informed consent choice (`agreed: true | false`) and optional `parentalConsent`.
     * Edge Case E13: Declining (`agreed: false`) NEVER blocks any platform feature; it only excludes
     * the student from anonymized research CSV export (`isEligibleForResearchExport(sid) === false`).
     */
    function setConsentStatus(sid, options) {
      const opts = options || {};
      const key = getConsentStorageKey(sid);
      const prev = getConsentStatus(sid);
      const agreed = opts.agreed !== undefined ? Boolean(opts.agreed) : prev.agreed;
      const parentalConsent =
        opts.parentalConsent !== undefined
          ? Boolean(opts.parentalConsent)
          : prev.parentalConsent;
      const withdrawn =
        opts.withdrawn !== undefined
          ? Boolean(opts.withdrawn)
          : agreed
            ? false
            : prev.withdrawn;

      const updated = {
        sid: String(sid).trim().toUpperCase(),
        agreed: agreed && !withdrawn,
        version: opts.version || CONSENT_VERSION,
        ts: Date.now(),
        parentalConsent: parentalConsent,
        withdrawn: withdrawn,
        prompted: true,
        featureAccessBlocked: false, // Edge Case E13: Never block platform features
      };

      if (STORAGE && typeof STORAGE.setItem === 'function') {
        STORAGE.setItem(key, updated);
      }
      return updated;
    }

    /**
     * Withdraws research consent at any time (`withdrawn: true, agreed: false`).
     * Never blocks platform features (Edge Case E13).
     */
    function withdrawConsent(sid) {
      return setConsentStatus(sid, {
        agreed: false,
        withdrawn: true,
      });
    }

    /**
     * Checks whether a student's data can be included in the anonymized research CSV export (D6).
     */
    function isEligibleForResearchExport(sid, requireParental) {
      const status = getConsentStatus(sid);
      if (!status.agreed || status.withdrawn) return false;
      if (status.version !== CONSENT_VERSION) return false;
      if (requireParental && !status.parentalConsent) return false;
      return true;
    }

    return {
      loginStudent: loginStudent,
      loginTeacher: loginTeacher,
      getSession: getSession,
      logout: logout,
      requireAuth: requireAuth,
      getConsentStatus: getConsentStatus,
      needsConsentPrompt: needsConsentPrompt,
      setConsentStatus: setConsentStatus,
      withdrawConsent: withdrawConsent,
      isEligibleForResearchExport: isEligibleForResearchExport,
    };
  }
);
