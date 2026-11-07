/**
 * core/crypto.js
 * High-Security Cryptographic Module (S1, S2, S4, D6)
 * - Replaces 12 duplicated SHA-256 implementations across HTML/JS files.
 * - Uses PBKDF2-HMAC-SHA256 (100,000 iterations) + AES-256-GCM per student key.
 * - Zero shared decryption key in frontend code.
 * - Provides HMAC-SHA256 event signing for submission integrity (S4).
 * - Provides deterministic HMAC anonymization for research export (`R-xxxxxxxx`, D6).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./config.js'));
  } else {
    root.MathCoreCrypto = factory(root.MathCoreConfig);
  }
})(typeof globalThis !== 'undefined' ? globalThis : window, function (CONFIG) {
  'use strict';

  const ITERATIONS = (CONFIG && CONFIG.crypto && CONFIG.crypto.pbkdf2Iterations) || 100000;
  const SALT_PREFIX = (CONFIG && CONFIG.crypto && CONFIG.crypto.saltPrefix) || 'MATHPLATFORM_V2_SALT';

  function getSubtleCrypto() {
    if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.subtle) {
      return globalThis.crypto.subtle;
    }
    if (typeof require === 'function') {
      const nodeCrypto = require('crypto');
      if (nodeCrypto.webcrypto && nodeCrypto.webcrypto.subtle) {
        return nodeCrypto.webcrypto.subtle;
      }
    }
    throw new Error('WebCrypto API is required for MathCoreCrypto');
  }

  function getRandomBytes(len) {
    const arr = new Uint8Array(len);
    if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.getRandomValues) {
      globalThis.crypto.getRandomValues(arr);
      return arr;
    }
    if (typeof require === 'function') {
      const nodeCrypto = require('crypto');
      return new Uint8Array(nodeCrypto.randomBytes(len));
    }
    throw new Error('Secure random generator unavailable');
  }

  function utf8ToBytes(str) {
    return new TextEncoder().encode(String(str));
  }

  function bytesToUtf8(bytes) {
    return new TextDecoder().decode(bytes);
  }

  function bytesToHex(bytes) {
    const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
    let hex = '';
    for (let i = 0; i < u8.length; i++) {
      hex += u8[i].toString(16).padStart(2, '0');
    }
    return hex;
  }

  function hexToBytes(hex) {
    const clean = String(hex).trim();
    const out = new Uint8Array(clean.length / 2);
    for (let i = 0; i < out.length; i++) {
      out[i] = parseInt(clean.substr(i * 2, 2), 16);
    }
    return out;
  }

  function bytesToBase64(bytes) {
    const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(u8).toString('base64');
    }
    let binary = '';
    for (let i = 0; i < u8.length; i++) {
      binary += String.fromCharCode(u8[i]);
    }
    return btoa(binary);
  }

  function base64ToBytes(b64) {
    if (typeof Buffer !== 'undefined') {
      return new Uint8Array(Buffer.from(b64, 'base64'));
    }
    const binary = atob(b64);
    const out = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      out[i] = binary.charCodeAt(i);
    }
    return out;
  }

  function normalizeStudentSecret(secretKey) {
    return String(secretKey || '')
      .trim()
      .toUpperCase()
      .replace(/\s+/g, '');
  }

  async function sha256Hex(input) {
    const subtle = getSubtleCrypto();
    const digest = await subtle.digest('SHA-256', utf8ToBytes(input));
    return bytesToHex(digest);
  }

  /**
   * Derive an AES-256-GCM CryptoKey from a student's secret key via PBKDF2-HMAC-SHA256.
   */
  async function deriveAesKey(studentSecret, saltContext, iterations) {
    const subtle = getSubtleCrypto();
    const normalized = normalizeStudentSecret(studentSecret);
    if (!normalized || normalized.length < 6) {
      throw new Error('Student secret key must be at least 6 characters');
    }
    const baseKey = await subtle.importKey(
      'raw',
      utf8ToBytes(normalized),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
    const fullSalt = `${SALT_PREFIX}:${saltContext || 'DEFAULT'}`;
    return subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: utf8ToBytes(fullSalt),
        iterations: iterations || ITERATIONS,
        hash: 'SHA-256',
      },
      baseKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Encrypt a student's record (e.g. {classID, studentID, name, grade}) with their secret key.
   * Output object contains { iv, ct, s } in base64 and a lookup tag derived from the key.
   */
  async function encryptStudentRecord(recordObj, studentSecret, saltContext) {
    const subtle = getSubtleCrypto();
    const ctx = saltContext || 'ROSTER_V2';
    const aesKey = await deriveAesKey(studentSecret, ctx);
    const iv = getRandomBytes(12);
    const plaintext = utf8ToBytes(JSON.stringify(recordObj));
    const cipherBuf = await subtle.encrypt({ name: 'AES-GCM', iv: iv }, aesKey, plaintext);
    const lookupId = (
      await sha256Hex(`LOOKUP_V2:${normalizeStudentSecret(studentSecret)}:${SALT_PREFIX}`)
    ).slice(0, 24);
    return {
      lookupId: lookupId,
      iv: bytesToBase64(iv),
      ct: bytesToBase64(cipherBuf),
      ctx: ctx,
    };
  }

  /**
   * Decrypt a student's record from an encrypted roster map using ONLY the student's secret key.
   * Returns null if the secret key is wrong or not found.
   */
  async function decryptStudentFromRoster(encryptedRosterMap, studentSecret) {
    if (!encryptedRosterMap || !studentSecret) return null;
    try {
      const normalized = normalizeStudentSecret(studentSecret);
      const lookupId = (await sha256Hex(`LOOKUP_V2:${normalized}:${SALT_PREFIX}`)).slice(0, 24);
      const entry = encryptedRosterMap[lookupId];
      if (!entry || !entry.iv || !entry.ct) return null;

      const subtle = getSubtleCrypto();
      const aesKey = await deriveAesKey(normalized, entry.ctx || 'ROSTER_V2');
      const plainBuf = await subtle.decrypt(
        { name: 'AES-GCM', iv: base64ToBytes(entry.iv) },
        aesKey,
        base64ToBytes(entry.ct)
      );
      return JSON.parse(bytesToUtf8(plainBuf));
    } catch (e) {
      return null;
    }
  }

  /**
   * Compute HMAC-SHA256 signature for an event batch or exam submission (S4).
   */
  async function signSubmission(payloadObjOrStr, studentSecret) {
    const subtle = getSubtleCrypto();
    const normalized = normalizeStudentSecret(studentSecret);
    const hmacKey = await subtle.importKey(
      'raw',
      utf8ToBytes(`SIGN_V2:${normalized}:${SALT_PREFIX}`),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const canonical =
      typeof payloadObjOrStr === 'string' ? payloadObjOrStr : JSON.stringify(payloadObjOrStr);
    const sigBuf = await subtle.sign('HMAC', hmacKey, utf8ToBytes(canonical));
    return bytesToHex(sigBuf).slice(0, 32);
  }

  /**
   * Compute password verification hash stored on Google Sheet (S3: server never stores plaintext).
   */
  async function computeServerVerifierHash(classID, studentID, studentSecret) {
    const subtle = getSubtleCrypto();
    const normalized = normalizeStudentSecret(studentSecret);
    const baseKey = await subtle.importKey(
      'raw',
      utf8ToBytes(normalized),
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );
    const salt = `${SALT_PREFIX}:VERIFY:${String(classID).toUpperCase()}_${String(studentID)}`;
    const bits = await subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: utf8ToBytes(salt),
        iterations: ITERATIONS,
        hash: 'SHA-256',
      },
      baseKey,
      256
    );
    return bytesToHex(bits);
  }

  /**
   * Deterministic research anonymization ID (`R-xxxxxxxx`, D6).
   * Teacher keeps `researchSecret` offline; same student maps to same ID across exams.
   */
  async function anonymizeStudentForResearch(classID, studentID, researchSecret) {
    if (!researchSecret) {
      throw new Error('researchSecret is required for research anonymization');
    }
    const subtle = getSubtleCrypto();
    const key = await subtle.importKey(
      'raw',
      utf8ToBytes(String(researchSecret)),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const msg = `${String(classID).trim().toUpperCase()}_${String(studentID).trim()}`;
    const sig = await subtle.sign('HMAC', key, utf8ToBytes(msg));
    return 'R-' + bytesToHex(sig).slice(0, 8);
  }

  return {
    sha256Hex: sha256Hex,
    normalizeStudentSecret: normalizeStudentSecret,
    deriveAesKey: deriveAesKey,
    encryptStudentRecord: encryptStudentRecord,
    decryptStudentFromRoster: decryptStudentFromRoster,
    signSubmission: signSubmission,
    computeServerVerifierHash: computeServerVerifierHash,
    anonymizeStudentForResearch: anonymizeStudentForResearch,
    bytesToHex: bytesToHex,
    hexToBytes: hexToBytes,
    bytesToBase64: bytesToBase64,
    base64ToBytes: base64ToBytes,
  };
});
