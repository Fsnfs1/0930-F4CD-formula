/**
 * persistence.js - Dual Persistence & Offline Sync Engine
 * High School Mobile Math Practice & Anti-Cheating Quiz Platform
 * 
 * Channels:
 * 1. Image Channel: Google Apps Script Web App POST uploader for Google Drive (Folder ID: 1oY52JyAqLLQQiETq8A-hre9jZ_goLHiY).
 * 2. Data Channel: Google Form no-cors POST submission (classID, studentID, dateID/vector, score/tag).
 * 3. OfflineSyncManager: LocalStorage FIFO queue, exponential backoff with jitter retry, online/offline listeners, UI badge indicator.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PersistenceModule = factory();
    // Expose convenient globals for browser runtime
    root.submitFormRecord = root.PersistenceModule.submitFormRecord;
    root.uploadDrivePhoto = root.PersistenceModule.uploadDrivePhoto;
    root.saveStudentProfile = root.PersistenceModule.saveStudentProfile;
    root.getStudentProfile = root.PersistenceModule.getStudentProfile;
    root.hasStudentProfile = root.PersistenceModule.hasStudentProfile;
    root.getStudentProfileHistory = root.PersistenceModule.getStudentProfileHistory;
    root.getLatestStudentVector = root.PersistenceModule.getLatestStudentVector;
    root.normalizeVector = root.PersistenceModule.normalizeVector;
    root.getAllStudentProfiles = root.PersistenceModule.getAllStudentProfiles;
    root.fetchStudentFromSheet = root.PersistenceModule.fetchStudentFromSheet;
    root.syncAllProfilesFromSheet = root.PersistenceModule.syncAllProfilesFromSheet;
    root.OfflineSyncManager = root.PersistenceModule.OfflineSyncManager;
    root.PERSISTENCE_CONFIG = root.PersistenceModule.PERSISTENCE_CONFIG;
    root.probeMacauNetwork = root.PersistenceModule.probeMacauNetwork;
    root.auditAndCleanseProfiles = root.PersistenceModule.auditAndCleanseProfiles;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Global configuration
  const PERSISTENCE_CONFIG = {
    // Google Form formResponse endpoint
    googleFormUrl: "https://docs.google.com/forms/u/0/d/e/1FAIpQLSeLZ6E4kLjJ26aWrKRPRPtDdthkxRHqOPX5AOwAq8_TYiT-OQ/formResponse",
    // Field mappings for Google Form
    formFields: {
      classID: "entry.543502435",
      studentID: "entry.1745113091",
      dateID: "entry.1972335137",
      score: "entry.2095507383"
    },
    // Google Apps Script Drive Uploader Web App URL (Target folder: 1oY52JyAqLLQQiETq8A-hre9jZ_goLHiY)
    gasDriveUploaderUrl: "https://script.google.com/macros/s/AKfycbxjkXzqp4WOghvi__SF8qoVBGAcXcSKv96JoRsKN3hLU6xHwLjK4rHyaXODIv_fE9Ak/exec",
    // Google Apps Script Sheet Data Reader Web App URL
    gasSheetReaderUrl: "https://script.google.com/macros/s/AKfycbwNAQNxmNsNa8rWGp48qnYRrjA2WFLGIzKqSel2r8MilRp59s3ZfBJjeKXIrUfoS-Zp-g/exec",
    // LocalStorage keys
    queueStorageKey: "MATH_OFFLINE_QUEUE_V1",
    profilePrefix: "math_student_profile_"
  };

  /**
   * Helper: extract millisecond timestamp from profile record or timestamp field
   * Supports numbers, numeric strings, ISO date strings, and serialized |TS: timestamp tags.
   * @param {Object|string} item 
   * @returns {number}
   */
  function extractTimestamp(item) {
    if (!item) return 0;
    if (typeof item === 'string') {
      if (item.includes('|TS:')) {
        const match = item.match(/\|TS:(\d+)/);
        if (match) return Number(match[1]) || 0;
      }
      const num = Number(item);
      if (!isNaN(num) && num > 0) return num;
      const parsed = Date.parse(item);
      if (!isNaN(parsed) && parsed > 0) return parsed;
      return 0;
    }
    if (typeof item.updatedAt === 'number' && !isNaN(item.updatedAt) && item.updatedAt > 0) return item.updatedAt;
    if (typeof item.timestamp === 'number' && !isNaN(item.timestamp) && item.timestamp > 0) return item.timestamp;
    if (typeof item.updatedAt === 'string') {
      const num = Number(item.updatedAt);
      if (!isNaN(num) && num > 0) return num;
      const parsed = Date.parse(item.updatedAt);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    if (typeof item.timestamp === 'string') {
      const num = Number(item.timestamp);
      if (!isNaN(num) && num > 0) return num;
      const parsed = Date.parse(item.timestamp);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    if (typeof item.registeredAt === 'string') {
      const parsed = Date.parse(item.registeredAt);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return 0;
  }

  /**
   * Helper: normalize vector representation into standard Array<number> of length 128
   * Accepts Array, Float32Array, object with index keys 0..127 (from stringified TypedArray), or CSV string
   * @param {*} vec 
   * @returns {Array<number>|null}
   */
  function normalizeVector(vec) {
    if (!vec) return null;
    if (vec instanceof Float32Array && vec.length === 128) {
      return Array.from(vec);
    }
    if (Array.isArray(vec) && vec.length === 128) {
      return vec.map(Number);
    }
    if (typeof vec === 'string') {
      let s = vec.trim();
      if (s.startsWith('ABNORMAL_DUPLICATE')) return null;
      if (s.includes('|')) s = s.split('|')[0];
      if (s.includes(':')) {
        const parts = s.split(':');
        s = parts[parts.length - 1];
      }
      const nums = s.split(',').map(Number);
      if (nums.length === 128 && !nums.some(isNaN)) {
        return nums;
      }
    }
    if (typeof vec === 'object') {
      if (typeof vec.length === 'number' && vec.length === 128) {
        return Array.from(vec).map(Number);
      }
      const keys = Object.keys(vec);
      if (keys.length === 128) {
        const arr = new Array(128);
        let valid = true;
        for (let i = 0; i < 128; i++) {
          if (vec[i] === undefined) { valid = false; break; }
          arr[i] = Number(vec[i]) || 0;
        }
        if (valid) return arr;
      }
    }
    return null;
  }

  /**
   * Save student identity and facial vector profile to LocalStorage
   * If existing records are found, compares timestamps and unconditionally replaces with latest features.
   * @param {Object} profile { classID, studentID, name, vector, photoJpgBase64, registeredAt, updatedAt, timestamp, version, forceLatest }
   * @returns {boolean}
   */
  function saveStudentProfile(profile, options) {
    if (!profile || !profile.classID || !profile.studentID) return false;
    const key = PERSISTENCE_CONFIG.profilePrefix + String(profile.classID).trim().toUpperCase() + "_" + String(profile.studentID).trim();
    try {
      // 1. Read existing profile if present
      let existing = null;
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(key);
        if (raw) {
          try {
            existing = JSON.parse(raw);
          } catch (e) {
            existing = null;
          }
        }
      }

      // 2. Compute incoming timestamp and version
      const incomingTime = extractTimestamp(profile) || Date.now();

      let existingTime = 0;
      let existingVersion = 0;
      let historyList = [];

      if (existing) {
        if (Array.isArray(existing)) {
          // Legacy or multi-array storage
          for (let i = 0; i < existing.length; i++) {
            const itm = existing[i];
            const t = extractTimestamp(itm);
            if (t > existingTime) existingTime = t;
            const v = itm.version || (i + 1);
            if (v > existingVersion) existingVersion = v;
            historyList.push(itm);
          }
        } else {
          existingTime = extractTimestamp(existing);
          existingVersion = existing.version || 1;
          if (Array.isArray(existing.history)) {
            historyList = existing.history.slice();
          }
        }
      }

      const versionNum = typeof profile.version === 'number'
        ? profile.version
        : (existingVersion > 0 ? existingVersion + 1 : 1);

      // 3. Timestamp comparison: unconditionally replace with latest feature
      const isForceLatest = !!profile.forceLatest;
      const shouldPromote = !existing || incomingTime >= existingTime || isForceLatest;

      let activeVector;
      let activePhoto;
      let activeTime;
      let activeVersion;

      const incomingNormVec = normalizeVector(profile.vector);

      // R3: Duplicate registration defense check (similarity >= 92% alert/reject)
      const allowDuplicate = (options && (options.allowDuplicate || options.skipDeduplication)) || !!profile.allowDuplicate;
      if (!allowDuplicate && incomingNormVec) {
        const faceAuth = (typeof globalThis !== 'undefined' && globalThis.FaceAuthModule) ||
                         (typeof window !== 'undefined' && window.FaceAuthModule);
        if (faceAuth && typeof faceAuth.checkDuplicateFace === 'function') {
          const allProfiles = getAllStudentProfiles();
          const dupCheck = faceAuth.checkDuplicateFace(
            incomingNormVec,
            profile.classID,
            profile.studentID,
            allProfiles,
            0.92
          );
          if (dupCheck.isDuplicate && dupCheck.duplicateStudent) {
            console.warn(`[Persistence] Rejected duplicate face binding for ${profile.classID}_${profile.studentID}, matches ${dupCheck.duplicateStudent.classID}_${dupCheck.duplicateStudent.studentID} (${dupCheck.percentage}%)`);
            return false;
          }
        }
      }

      if (shouldPromote) {
        // Enforce monotonicity for administrative re-registration or clock skew
        activeTime = (existing && existingTime >= incomingTime) ? (existingTime + 1) : incomingTime;
        activeVersion = (existing && existingVersion >= versionNum) ? (existingVersion + 1) : versionNum;
        activeVector = incomingNormVec || (existing ? normalizeVector(existing.vector) : null) || [];
        activePhoto = profile.photoJpgBase64 || "";

        // Archive previous active record if one existed
        if (existing && existing.vector) {
          const oldNorm = normalizeVector(existing.vector);
          if (oldNorm) {
            historyList.push({
              version: existing.version || existingVersion || 1,
              vector: oldNorm,
              photoJpgBase64: existing.photoJpgBase64 || "",
              registeredAt: existing.registeredAt || "",
              updatedAt: existing.updatedAt || existing.timestamp || existingTime,
              timestamp: existing.timestamp || existing.updatedAt || existingTime
            });
          }
        }
      } else {
        // Out-of-order older record arriving without forceLatest: preserve existing active
        console.warn(`[Persistence] Incoming profile timestamp (${incomingTime}) is older than existing (${existingTime}). Preserving latest.`);
        activeVector = (existing ? normalizeVector(existing.vector) : null) || incomingNormVec || [];
        activePhoto = existing ? (existing.photoJpgBase64 || "") : (profile.photoJpgBase64 || "");
        activeTime = existingTime;
        activeVersion = existingVersion;
        if (incomingNormVec) {
          historyList.push({
            version: versionNum,
            vector: incomingNormVec,
            photoJpgBase64: profile.photoJpgBase64 || "",
            registeredAt: profile.registeredAt || new Date(incomingTime).toISOString(),
            updatedAt: incomingTime,
            timestamp: incomingTime
          });
        }
      }

      // Deduplicate history by version and retain up to 10 latest entries to protect LocalStorage quota
      const seenVersions = new Set();
      historyList = historyList.filter(function (h) {
        if (!h || !h.vector) return false;
        const norm = normalizeVector(h.vector);
        if (!norm) return false;
        h.vector = norm;
        const v = h.version || 0;
        if (v === activeVersion) return false; // Invariant: history cannot duplicate active version
        if (seenVersions.has(v)) return false;
        seenVersions.add(v);
        return true;
      });
      if (historyList.length > 10) {
        historyList = historyList.slice(-10);
      }

      const data = {
        classID: String(profile.classID).trim().toUpperCase(),
        studentID: parseInt(profile.studentID, 10),
        name: profile.name || (existing && existing.name ? existing.name : ""),
        vector: activeVector,
        photoJpgBase64: activePhoto,
        registeredAt: (existing && existing.registeredAt) ? existing.registeredAt : (profile.registeredAt || new Date(incomingTime).toISOString()),
        updatedAt: activeTime,
        timestamp: activeTime,
        version: activeVersion,
        history: historyList
      };

      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(data));
      }
      return true;
    } catch (e) {
      console.error("[Persistence] Failed to save student profile to localStorage:", e);
      return false;
    }
  }

  /**
   * Retrieve saved student profile from LocalStorage
   * Strictly resolves the feature vector with the latest timestamp.
   * Filters out obsolete historical entries and normalizes vector format.
   * @param {string} classID 
   * @param {number|string} studentID 
   * @returns {Object|null}
   */
  function getStudentProfile(classID, studentID) {
    if (!classID || studentID === undefined || studentID === null) return null;
    const key = PERSISTENCE_CONFIG.profilePrefix + String(classID).trim().toUpperCase() + "_" + String(studentID).trim();
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        let parsed = JSON.parse(raw);
        if (!parsed) return null;

        // Candidate version array to sort by timestamp descending
        let candidates = [];

        if (Array.isArray(parsed)) {
          // If stored as an array of versions
          parsed.forEach(function (itm) {
            const norm = itm && normalizeVector(itm.vector);
            if (norm) {
              candidates.push(Object.assign({}, itm, { vector: norm }));
            }
          });
        } else if (parsed && typeof parsed === 'object') {
          // Top-level item
          const topNorm = normalizeVector(parsed.vector);
          if (topNorm) {
            candidates.push(Object.assign({}, parsed, { vector: topNorm }));
          }
          // History items
          if (Array.isArray(parsed.history)) {
            parsed.history.forEach(function (h) {
              const hNorm = h && normalizeVector(h.vector);
              if (hNorm) {
                candidates.push(Object.assign({}, h, {
                  classID: parsed.classID,
                  studentID: parsed.studentID,
                  name: parsed.name,
                  vector: hNorm
                }));
              }
            });
          }
        }

        if (candidates.length === 0) {
          if (parsed && !Array.isArray(parsed) && parsed.classID) {
            const fallbackNorm = normalizeVector(parsed.vector);
            if (fallbackNorm) {
              parsed.vector = new Float32Array(fallbackNorm);
            }
            return parsed;
          }
          return null;
        }

        // Sort descending: candidate with maximum timestamp comes first, tie-break by version
        candidates.sort(function (a, b) {
          const tA = extractTimestamp(a);
          const tB = extractTimestamp(b);
          if (tB !== tA) return tB - tA;
          return (b.version || 0) - (a.version || 0);
        });

        const latestRecord = candidates[0];
        const latestTime = extractTimestamp(latestRecord);

        // Filter history to exclude the active version
        const cleanHistory = (Array.isArray(parsed.history) ? parsed.history : []).filter(function (h) {
          return h && (h.version || 0) !== (latestRecord.version || 1);
        });

        // Construct standard profile object with latest vector
        const result = {
          classID: String(latestRecord.classID || parsed.classID).trim().toUpperCase(),
          studentID: parseInt(latestRecord.studentID || parsed.studentID, 10),
          name: latestRecord.name || parsed.name || "",
          vector: new Float32Array(latestRecord.vector),
          photoJpgBase64: latestRecord.photoJpgBase64 || parsed.photoJpgBase64 || "",
          registeredAt: parsed.registeredAt || latestRecord.registeredAt || new Date().toISOString(),
          updatedAt: latestTime,
          timestamp: latestTime,
          version: latestRecord.version || parsed.version || 1,
          history: cleanHistory
        };

        return result;
      }
      return null;
    } catch (e) {
      console.warn("[Persistence] Failed to read student profile:", e);
      return null;
    }
  }

  /**
   * Check if student profile exists and is locked
   * @param {string} classID 
   * @param {number|string} studentID 
   * @returns {boolean}
   */
  function hasStudentProfile(classID, studentID) {
    const prof = getStudentProfile(classID, studentID);
    if (!prof || prof.isAbnormal || prof.abnormal) return false;
    return !!(prof && prof.vector && prof.vector.length === 128);
  }

  /**
   * Retrieve complete history of student facial profiles sorted by timestamp descending
   * @param {string} classID 
   * @param {number|string} studentID 
   * @returns {Array<Object>}
   */
  function getStudentProfileHistory(classID, studentID) {
    if (!classID || studentID === undefined || studentID === null) return [];
    const prof = getStudentProfile(classID, studentID);
    if (!prof) return [];
    const list = [];
    if (prof.vector && prof.vector.length === 128) {
      list.push({
        version: prof.version || 1,
        vector: prof.vector,
        timestamp: prof.timestamp || prof.updatedAt,
        updatedAt: prof.updatedAt || prof.timestamp,
        registeredAt: prof.registeredAt,
        photoJpgBase64: prof.photoJpgBase64,
        isActive: true
      });
    }
    if (Array.isArray(prof.history)) {
      prof.history.forEach(function (h) {
        const norm = normalizeVector(h.vector);
        if (norm) {
          list.push({
            version: h.version || 1,
            vector: new Float32Array(norm),
            timestamp: h.timestamp || h.updatedAt || extractTimestamp(h),
            updatedAt: h.updatedAt || h.timestamp || extractTimestamp(h),
            registeredAt: h.registeredAt,
            photoJpgBase64: h.photoJpgBase64,
            isActive: false
          });
        }
      });
    }
    list.sort(function (a, b) {
      return (b.timestamp || 0) - (a.timestamp || 0);
    });
    return list;
  }

  /**
   * Directly get latest Float32Array vector and timestamp for a student
   * @param {string} classID 
   * @param {number|string} studentID 
   * @returns {{vector: Float32Array, timestamp: number, version: number}|null}
   */
  function getLatestStudentVector(classID, studentID) {
    const prof = getStudentProfile(classID, studentID);
    if (!prof || prof.isAbnormal || prof.abnormal || !prof.vector || prof.vector.length !== 128) return null;
    return {
      vector: prof.vector,
      timestamp: prof.timestamp || prof.updatedAt || 0,
      version: prof.version || 1
    };
  }

  /**
   * Retrieve all saved student profiles from LocalStorage
   * @returns {Array<Object>}
   */
  function getAllStudentProfiles() {
    const profiles = [];
    if (typeof localStorage === 'undefined') return profiles;
    const prefix = PERSISTENCE_CONFIG.profilePrefix;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.indexOf(prefix) === 0) {
          const rest = key.substring(prefix.length); // e.g. "4C_1"
          const parts = rest.split("_");
          if (parts.length >= 2) {
            const cls = parts[0];
            const sid = parts[1];
            const p = getStudentProfile(cls, sid);
            if (p && !p.isAbnormal && !p.abnormal && p.vector && (p.vector.length === 128 || (Array.isArray(p.vector) && p.vector.length === 128))) {
              profiles.push(p);
            }
          }
        }
      }
    } catch (e) {
      console.warn("[Persistence] Error getting all student profiles:", e);
    }
    return profiles;
  }

  /**
   * Query student face record from deployed Google Sheet GAS Web App
   * @param {string} classID 
   * @param {string|number} studentID 
   * @returns {Promise<Object|null>}
   */
  async function fetchStudentFromSheet(classID, studentID) {
    if (!classID || !studentID) return null;
    const gasUrl = PERSISTENCE_CONFIG.gasSheetReaderUrl;
    if (!gasUrl) return null;
    const cTarget = String(classID).trim().toUpperCase();
    const sTarget = parseInt(studentID, 10);
    try {
      const response = await fetch(gasUrl, { method: "GET", mode: "cors" });
      if (!response.ok) return null;
      const data = await response.json();
      let candidateRow = null;

      if (Array.isArray(data)) {
        // Filter rows matching this student where dateID contains a face vector embedding
        const matches = data.filter(function (r) {
          const rc = String(r.classID || "").trim().toUpperCase();
          const rs = parseInt(r.studentID, 10);
          const did = String(r.dateID || "");
          return rc === cTarget && rs === sTarget && did.includes("|TS:");
        });
        if (matches.length > 0) {
          matches.sort(function (a, b) {
            const tsA = extractTimestamp(a.dateID);
            const tsB = extractTimestamp(b.dateID);
            return tsB - tsA;
          });
          candidateRow = matches[0];
        }
      } else if (data && !data.error && typeof data === 'object') {
        candidateRow = data;
      }

      if (candidateRow) {
        console.log("[Persistence] Successfully matched student record from Sheet:", candidateRow);
        const vecCandidate = candidateRow.vector || candidateRow.featureVector || candidateRow.dateID;
        const norm = normalizeVector(vecCandidate);
        if (norm) {
          candidateRow.normalizedVector = norm;
          candidateRow.vector = norm;
        }
        return candidateRow;
      }
      return null;
    } catch (e) {
      console.warn("[Persistence] Failed to query student from Sheet:", e.message);
      return null;
    }
  }

  /**
   * Synchronize all registered face profiles from deployed Google Sheet GAS Web App
   * Populates localStorage so 1:N recognition & dropdown exclusion work seamlessly across all devices
   * @returns {Promise<{success: boolean, count: number, students: string[]}>}
   */
  async function syncAllProfilesFromSheet() {
    const gasUrl = PERSISTENCE_CONFIG.gasSheetReaderUrl;
    if (!gasUrl) return { success: false, count: 0, students: [] };
    try {
      const response = await fetch(gasUrl, { method: 'GET', mode: 'cors' });
      if (!response.ok) return { success: false, count: 0, students: [] };
      const rows = await response.json();
      if (!Array.isArray(rows)) return { success: false, count: 0, students: [] };

      let syncedCount = 0;
      const syncedStudents = [];
      const faceMap = {};

      // Group face vector records by student to find their latest registration
      rows.forEach(function (r) {
        if (r && (r.isAbnormal || r.abnormal)) return;
        const did = String(r.dateID || "");
        if (!did.includes("|TS:")) return;
        if (did.includes("ABNORMAL_DUPLICATE")) return;
        const cid = String(r.classID || "").trim().toUpperCase();
        const sid = parseInt(r.studentID, 10);
        if (!cid || isNaN(sid)) return;

        const ts = extractTimestamp(did);
        const k = `${cid}_${sid}`;
        if (!faceMap[k] || ts > faceMap[k].ts) {
          faceMap[k] = { classID: cid, studentID: sid, dateID: did, ts: ts };
        }
      });

      for (const k in faceMap) {
        const item = faceMap[k];
        const norm = normalizeVector(item.dateID);
        if (norm && norm.length === 128) {
          const existing = getStudentProfile(item.classID, item.studentID);
          const existingTime = existing ? extractTimestamp(existing) : 0;
          if (!existing || item.ts >= existingTime) {
            const studentName = (typeof window !== 'undefined' && window.getStudentName) ?
              window.getStudentName(item.classID, item.studentID) : `學生 ${item.studentID}`;
            saveStudentProfile({
              classID: item.classID,
              studentID: item.studentID,
              name: studentName,
              vector: norm,
              registeredAt: new Date(item.ts || Date.now()).toISOString(),
              updatedAt: item.ts || Date.now(),
              timestamp: item.ts || Date.now(),
              version: 1,
              forceLatest: true
            });
            syncedCount++;
            syncedStudents.push(k);
          }
        }
      }
      console.log(`[Persistence] Cloud sync finished: ${syncedCount} profile(s) synced:`, syncedStudents);
      return { success: true, count: syncedCount, students: syncedStudents };
    } catch (err) {
      console.warn("[Persistence] Failed to sync profiles from sheet:", err);
      return { success: false, count: 0, students: [] };
    }
  }

  /**
   * Audit and Cleanse Profiles (R3):
   * Audits registered profiles in LocalStorage, detects duplicate bindings (similarity >= 92%),
   * especially historical anomalous clones (e.g. 4D 21 contaminated with 4D 4 features),
   * purges corrupted records so the victim student returns to an unregistered state.
   * @returns {{cleansedCount: number, cleansedStudents: Array<{classID: string, studentID: number, reason: string}>}}
   */
  function auditAndCleanseProfiles() {
    const cleansed = [];
    if (typeof localStorage === 'undefined') return { cleansedCount: 0, cleansedStudents: cleansed };

    const faceAuth = (typeof globalThis !== 'undefined' && globalThis.FaceAuthModule) ||
                     (typeof window !== 'undefined' && window.FaceAuthModule);

    const allProfiles = getAllStudentProfiles();
    const prefix = PERSISTENCE_CONFIG.profilePrefix;

    for (let i = 0; i < allProfiles.length; i++) {
      const prof = allProfiles[i];
      if (!prof) continue;
      const key = prefix + String(prof.classID).trim().toUpperCase() + "_" + String(prof.studentID).trim();

      // 1. Direct abnormal flag or contaminated string
      const raw = localStorage.getItem(key);
      if (prof.isAbnormal || prof.abnormal || (raw && raw.includes("ABNORMAL_DUPLICATE"))) {
        localStorage.removeItem(key);
        cleansed.push({ classID: prof.classID, studentID: prof.studentID, reason: "Flagged abnormal/contaminated" });
        continue;
      }

      // 2. Check for duplicate face against older or authoritative registrations
      if (faceAuth && typeof faceAuth.checkDuplicateFace === 'function' && prof.vector) {
        const others = allProfiles.filter(function (p, idx) { return idx !== i; });
        const dup = faceAuth.checkDuplicateFace(prof.vector, prof.classID, prof.studentID, others, 0.92);
        if (dup.isDuplicate && dup.duplicateStudent) {
          const myTime = extractTimestamp(prof) || 0;
          const otherTime = extractTimestamp(dup.duplicateStudent) || 0;
          if (myTime >= otherTime) {
            localStorage.removeItem(key);
            cleansed.push({
              classID: prof.classID,
              studentID: prof.studentID,
              reason: `Duplicate match with ${dup.duplicateStudent.classID}_${dup.duplicateStudent.studentID} (${dup.percentage}%)`
            });
          }
        }
      }
    }

    if (cleansed.length > 0) {
      console.log(`[Persistence] auditAndCleanseProfiles cleansed ${cleansed.length} record(s):`, cleansed);
    }
    return { cleansedCount: cleansed.length, cleansedStudents: cleansed };
  }

  /**
   * Submit telemetry / facial record / answer to Google Form via mode: 'no-cors' POST
   * @param {Object} record { classID, studentID, dateID, scoreTag }
   * @returns {Promise<boolean>}
   */
  async function submitFormRecord(record) {
    if (!record) return false;
    const classID = String(record.classID || "").trim().toUpperCase();
    const studentID = String(record.studentID || "").trim();
    const dateID = String(record.dateID || "").trim();
    const scoreTag = String(record.scoreTag !== undefined ? record.scoreTag : (record.score !== undefined ? record.score : "")).trim();

    const payload = {};
    payload[PERSISTENCE_CONFIG.formFields.classID] = classID;
    payload[PERSISTENCE_CONFIG.formFields.studentID] = studentID;
    payload[PERSISTENCE_CONFIG.formFields.dateID] = dateID;
    payload[PERSISTENCE_CONFIG.formFields.score] = scoreTag;

    // Check online status; if offline, automatically enqueue
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    if (!isOnline) {
      console.log("[Persistence] Browser is offline. Enqueuing Form record to LocalStorage queue.");
      OfflineSyncManager.enqueue("FORM", PERSISTENCE_CONFIG.googleFormUrl, payload);
      return true;
    }

    try {
      const bodyParams = new URLSearchParams(payload);
      await fetch(PERSISTENCE_CONFIG.googleFormUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: bodyParams.toString()
      });
      console.log("[Persistence] Form record successfully submitted (no-cors).");
      return true;
    } catch (err) {
      console.warn("[Persistence] Form submission network error, saving to offline queue:", err.message);
      OfflineSyncManager.enqueue("FORM", PERSISTENCE_CONFIG.googleFormUrl, payload);
      return false;
    }
  }

  /**
   * Upload facial snapshot JPEG (Base64) to Google Drive via GAS Web App POST
   * @param {Object} uploadData { classID, studentID, studentName, imageBase64, tag }
   * @returns {Promise<{success: boolean, fileId?: string, error?: string}>}
   */
  async function uploadDrivePhoto(uploadData) {
    if (!uploadData || !uploadData.imageBase64) {
      return { success: false, error: "Missing imageBase64 payload" };
    }

    const payload = {
      classID: String(uploadData.classID || "").trim().toUpperCase(),
      studentID: String(uploadData.studentID || "").trim(),
      studentName: String(uploadData.studentName || "").trim(),
      imageBase64: uploadData.imageBase64,
      tag: String(uploadData.tag || "REGISTRATION").trim().toUpperCase(),
      folderId: uploadData.folderId || "1oY52JyAqLLQQiETq8A-hre9jZ_goLHiY"
    };
    if (uploadData.timestamp || uploadData.updatedAt) {
      payload.timestamp = uploadData.timestamp || uploadData.updatedAt;
    }
    if (uploadData.version) {
      payload.version = uploadData.version;
    }

    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    const targetUrl = uploadData.gasUrl || PERSISTENCE_CONFIG.gasDriveUploaderUrl;

    // If offline or placeholder URL, manage queue or simulated completion
    if (!isOnline) {
      console.log("[Persistence] Offline: enqueuing Drive photo upload.");
      OfflineSyncManager.enqueue("DRIVE", targetUrl, payload);
      return { success: true, queued: true, message: "Queued for upload when online" };
    }

    // Check if real GAS URL configured
    const isPlaceholder = targetUrl.includes("placeholder_drive_uploader");
    if (isPlaceholder) {
      console.log("[Persistence] GAS Drive URL is placeholder. Simulated local archive complete.");
      const ts = payload.timestamp || Date.now();
      return {
        success: true,
        simulated: true,
        fileId: "mock_drive_file_" + ts,
        fileName: `${payload.classID}_${payload.studentID}_${payload.studentName}_${ts}_${payload.tag}.jpg`,
        folderId: payload.folderId,
        tag: payload.tag,
        timestamp: ts,
        version: payload.version || 1
      };
    }

    try {
      // Use text/plain;charset=utf-8 to bypass CORS OPTIONS preflight check in GAS
      const res = await fetch(targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data && data.success === false) {
        throw new Error(data.error || "GAS photo upload rejected");
      }
      return data;
    } catch (err) {
      console.warn("[Persistence] Drive photo upload failed, enqueuing:", err.message);
      OfflineSyncManager.enqueue("DRIVE", targetUrl, payload);
      return { success: false, queued: true, error: err.message };
    }
  }

  /**
   * Offline Sync Manager with LocalStorage Queue & Exponential Backoff + Jitter
   */
  const OfflineSyncManager = {
    isFlushing: false,
    timerId: null,
    listeners: [],

    init: function () {
      if (typeof window !== 'undefined') {
        window.addEventListener("online", function () {
          console.log("[OfflineSyncManager] Network online detected. Triggering queue flush.");
          OfflineSyncManager.flushQueue();
        });
        window.addEventListener("offline", function () {
          console.log("[OfflineSyncManager] Network offline detected.");
          OfflineSyncManager.notifyListeners();
        });

        // Periodic queue inspection every 25 seconds
        if (!this.timerId) {
          this.timerId = setInterval(function () {
            OfflineSyncManager.flushQueue();
          }, 25000);
        }
      }
      this.notifyListeners();
    },

    getQueue: function () {
      try {
        if (typeof localStorage !== 'undefined') {
          const parsed = JSON.parse(localStorage.getItem(PERSISTENCE_CONFIG.queueStorageKey) || "[]");
          if (Array.isArray(parsed)) return parsed;
        }
      } catch (e) {
        console.warn("[OfflineSyncManager] Failed to read queue:", e);
      }
      return [];
    },

    saveQueue: function (queue) {
      try {
        if (typeof localStorage !== 'undefined') {
          let safeQueue = Array.isArray(queue) ? queue : [];
          if (safeQueue.length > 200) {
            safeQueue = safeQueue.slice(-200);
          }
          try {
            localStorage.setItem(PERSISTENCE_CONFIG.queueStorageKey, JSON.stringify(safeQueue));
          } catch (storageErr) {
            console.warn("[OfflineSyncManager] LocalStorage quota exceeded, pruning oldest queue items.");
            safeQueue = safeQueue.slice(Math.floor(safeQueue.length / 2));
            localStorage.setItem(PERSISTENCE_CONFIG.queueStorageKey, JSON.stringify(safeQueue));
          }
        }
      } catch (e) {
        console.error("[OfflineSyncManager] Failed to persist queue:", e);
      }
      this.notifyListeners();
    },

    clearQueue: function () {
      this.saveQueue([]);
    },

    enqueue: function (channel, url, payload) {
      const queue = this.getQueue();
      const item = {
        id: "sync_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
        channel: channel, // "FORM" or "DRIVE"
        url: url,
        payload: payload,
        createdAt: Date.now(),
        retryCount: 0,
        nextRetryTime: Date.now(),
        status: "pending"
      };
      queue.push(item);
      this.saveQueue(queue);

      const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
      if (isOnline) {
        this.flushQueue();
      }
      return item.id;
    },

    flushQueue: async function () {
      if (this.isFlushing) return;
      const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
      if (!isOnline) {
        this.notifyListeners();
        return;
      }

      const queue = this.getQueue();
      if (queue.length === 0) {
        this.notifyListeners();
        return;
      }

      this.isFlushing = true;
      this.updateUI("syncing", queue.length);

      const succeededIds = new Set();
      const failedItemsMap = new Map();

      try {
        const now = Date.now();
        for (let i = 0; i < queue.length; i++) {
          const item = queue[i];
          if (item.nextRetryTime && item.nextRetryTime > now) {
            continue;
          }

          try {
            if (item.channel === "FORM") {
              const bodyParams = new URLSearchParams(item.payload);
              await fetch(item.url, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: bodyParams.toString()
              });
            } else if (item.channel === "DRIVE") {
              // If placeholder, skip real fetch
              if (!item.url.includes("placeholder_drive_uploader")) {
                const res = await fetch(item.url, {
                  method: "POST",
                  headers: { "Content-Type": "text/plain;charset=utf-8" },
                  body: JSON.stringify(item.payload)
                });
                if (!res.ok) {
                  throw new Error(`HTTP ${res.status}`);
                }
                const data = await res.json();
                if (data && data.success === false) {
                  throw new Error(data.error || "GAS photo upload rejected");
                }
              }
            }
            // Request succeeded
            succeededIds.add(item.id);
          } catch (err) {
            console.warn(`[OfflineSyncManager] Retry failed for ${item.id}:`, err.message);
            item.retryCount = (item.retryCount || 0) + 1;
            // Exponential backoff with jitter: min(2000 * 2^retryCount, 60000) + rand(0..1000)
            const backoff = Math.min(2000 * Math.pow(2, item.retryCount), 60000) + Math.random() * 1000;
            item.nextRetryTime = Date.now() + backoff;
            item.status = "failed";
            failedItemsMap.set(item.id, item);
          }
        }

        // Re-read fresh queue from localStorage and filter out only succeeded items
        // to prevent overwriting newly enqueued items while fetch was in-flight
        const freshQueue = this.getQueue();
        const updatedQueue = freshQueue
          .filter(item => !succeededIds.has(item.id))
          .map(item => failedItemsMap.get(item.id) || item);
        this.saveQueue(updatedQueue);
      } finally {
        this.isFlushing = false;
        this.notifyListeners();
      }
    },

    getStatus: function () {
      const queue = this.getQueue();
      const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
      return {
        pendingCount: queue.length,
        isOnline: isOnline,
        isFlushing: this.isFlushing
      };
    },

    subscribe: function (callback) {
      if (typeof callback === 'function') {
        this.listeners.push(callback);
      }
    },

    notifyListeners: function () {
      const status = this.getStatus();
      this.listeners.forEach(function (cb) {
        try { cb(status); } catch (e) {}
      });

      if (!status.isOnline) {
        this.updateUI("offline", status.pendingCount);
      } else if (status.pendingCount === 0) {
        this.updateUI("synced", 0);
      } else if (this.isFlushing) {
        this.updateUI("syncing", status.pendingCount);
      } else {
        this.updateUI("pending", status.pendingCount);
      }
    },

    updateUI: function (state, count) {
      if (typeof document === 'undefined') return;
      const badges = [
        document.getElementById("syncStatusBadge"),
        document.getElementById("queueSyncBadge")
      ];

      badges.forEach(function (badge) {
        if (!badge) return;
        badge.className = "sync-badge " + state;
        if (state === "synced") {
          badge.innerHTML = `<span class="badge-dot dot-green"></span> 數據已全部同步`;
        } else if (state === "syncing") {
          badge.innerHTML = `<span class="badge-spinner"></span> 正在同步 (${count})...`;
        } else if (state === "offline") {
          badge.innerHTML = `<span class="badge-dot dot-red"></span> 離線模式 (待傳送 ${count})`;
        } else if (state === "pending") {
          badge.innerHTML = `<span class="badge-dot dot-yellow"></span> 離線隊列暫存 (${count})`;
        }
      });
    }
  };

  // Initialize offline sync listeners if running in browser
  if (typeof window !== 'undefined') {
    OfflineSyncManager.init();
  }

  /**
   * Fast Google Macau Network Probe (R5)
   * Concurrently races lightweight Google 204 endpoints with timeout via AbortController.
   * Supports test bypass hook window.__BYPASS_MACAU_PROBE__ and URL param ?test_bypass_probe=1.
   * 
   * @param {number} timeoutMs Probe timeout in milliseconds (default: 3500ms)
   * @returns {Promise<boolean>} Resolves true if Macau network signal is verified
   */
  async function probeMacauNetwork(timeoutMs) {
    if (typeof timeoutMs !== 'number' || timeoutMs <= 0) {
      timeoutMs = 3500;
    }

    // 1. Check test bypass hooks for offline/test environments
    if (typeof window !== 'undefined') {
      if (window.__BYPASS_MACAU_PROBE__ === true) {
        return true;
      }
      try {
        if (window.location && window.location.search) {
          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.get('test_bypass_probe') === '1' || urlParams.get('bypass_macau') === '1') {
            return true;
          }
        }
      } catch (e) {}
    }

    // 2. Immediate fail if browser reports offline
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      return false;
    }

    // 3. Fallback if fetch is unavailable
    if (typeof fetch !== 'function') {
      return false;
    }

    // 4. Candidate endpoints to race
    const endpoints = [
      "https://connectivitycheck.gstatic.com/generate_204",
      "https://www.google.com/generate_204"
    ];

    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    let timeoutId = null;

    if (controller) {
      timeoutId = setTimeout(function () {
        controller.abort();
      }, timeoutMs);
    }

    const testEndpoint = async function (baseUrl) {
      const cacheBuster = `${baseUrl}?_t=${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const fetchOpts = {
        method: "HEAD",
        mode: "no-cors",
        cache: "no-store"
      };
      if (controller) {
        fetchOpts.signal = controller.signal;
      }
      await fetch(cacheBuster, fetchOpts);
      return true;
    };

    const raceFirstSuccess = function (promises) {
      if (typeof Promise.any === 'function') {
        return Promise.any(promises);
      }
      return new Promise(function (resolve, reject) {
        let rejectedCount = 0;
        const errors = [];
        promises.forEach(function (p) {
          Promise.resolve(p).then(resolve, function (err) {
            rejectedCount++;
            errors.push(err);
            if (rejectedCount === promises.length) {
              reject(errors);
            }
          });
        });
      });
    };

    try {
      await raceFirstSuccess(endpoints.map(testEndpoint));
      if (timeoutId) clearTimeout(timeoutId);
      return true;
    } catch (err) {
      if (timeoutId) clearTimeout(timeoutId);
      return false;
    }
  }

  return {
    PERSISTENCE_CONFIG: PERSISTENCE_CONFIG,
    saveStudentProfile: saveStudentProfile,
    getStudentProfile: getStudentProfile,
    hasStudentProfile: hasStudentProfile,
    getStudentProfileHistory: getStudentProfileHistory,
    getLatestStudentVector: getLatestStudentVector,
    getAllStudentProfiles: getAllStudentProfiles,
    fetchStudentFromSheet: fetchStudentFromSheet,
    syncAllProfilesFromSheet: syncAllProfilesFromSheet,
    normalizeVector: normalizeVector,
    extractTimestamp: extractTimestamp,
    submitFormRecord: submitFormRecord,
    uploadDrivePhoto: uploadDrivePhoto,
    probeMacauNetwork: probeMacauNetwork,
    OfflineSyncManager: OfflineSyncManager,
    auditAndCleanseProfiles: auditAndCleanseProfiles
  };
});
