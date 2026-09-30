/**
 * face_auth.js - Pure Frontend Face Recognition & Authentication Module
 * High School Mobile Math Practice & Anti-Cheating Quiz Platform
 * 
 * Capabilities:
 * 1. Web camera access with mirroring, 320x240 canvas snapshot, 0.70 JPEG compression.
 * 2. Integration with @vladmandic/face-api (TinyFaceDetector, FaceLandmark68TinyNet, FaceRecognitionNet).
 * 3. 128-dimensional face embedding extraction and Cosine Similarity calculation (>= 85% threshold).
 * 4. Deterministic Demo / Fallback Mode generating 128-d pseudo-vectors and simulated avatar snapshots
 *    when cameras are unavailable, denied, or running in automated test suites.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.FaceAuthModule = factory();
    // Expose convenient global methods for vanilla script tags
    root.captureFace = root.FaceAuthModule.captureFace;
    root.verifyFace = root.FaceAuthModule.verifyFace;
    root.getDemoDescriptor = root.FaceAuthModule.getDemoDescriptor;
    root.generateDemoSnapshot = root.FaceAuthModule.generateDemoSnapshot;
    root.computeCosineSimilarity = root.FaceAuthModule.computeCosineSimilarity;
    root.initFaceApi = root.FaceAuthModule.initFaceApi;
    root.isDemoMode = root.FaceAuthModule.isDemoMode;
    root.setDemoMode = root.FaceAuthModule.setDemoMode;
    root.startCamera = root.FaceAuthModule.startCamera;
    root.stopCamera = root.FaceAuthModule.stopCamera;
    root.serializeDescriptor = root.FaceAuthModule.serializeDescriptor;
    root.deserializeDescriptor = root.FaceAuthModule.deserializeDescriptor;
    root.serializeDescriptorWithTimestamp = root.FaceAuthModule.serializeDescriptorWithTimestamp;
    root.isCameraRunning = root.FaceAuthModule.isCameraRunning;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Constants
  const DEFAULT_MODEL_URI = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
  const DEFAULT_SIMILARITY_THRESHOLD = 0.85; // 85% cosine similarity required
  const SNAPSHOT_WIDTH = 320;
  const SNAPSHOT_HEIGHT = 240;
  const JPEG_QUALITY = 0.70;

  // Module state
  let isModelsLoaded = false;
  let isModelLoading = false;
  let demoModeActive = false;
  let activeMediaStream = null;

  /**
   * Check if running in demo/fallback mode
   */
  function isDemoMode() {
    return demoModeActive;
  }

  /**
   * Explicitly set or toggle demo mode
   * @param {boolean} enabled 
   */
  function setDemoMode(enabled) {
    demoModeActive = !!enabled;
  }

  /**
   * Probe camera availability and permissions in current browser environment
   * @returns {Promise<{available: boolean, reason: string}>}
   */
  async function checkCameraAvailability() {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return { available: false, reason: "Browser does not support getUserMedia WebRTC API." };
    }
    try {
      if (navigator.mediaDevices.enumerateDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasVideo = devices.some(function (d) { return d.kind === 'videoinput'; });
        if (!hasVideo) {
          return { available: false, reason: "No video input hardware detected." };
        }
      }
      return { available: true, reason: "Camera hardware available." };
    } catch (err) {
      return { available: false, reason: err.message || "Failed to query media devices." };
    }
  }

  /**
   * Initialize @vladmandic/face-api models with jsDelivr CDN
   * @param {string} [modelBaseUri]
   * @returns {Promise<boolean>}
   */
  async function initFaceApi(modelBaseUri) {
    if (isModelsLoaded) return true;
    if (isModelLoading) {
      // Wait for existing load promise
      while (isModelLoading) {
        await new Promise(function (res) { setTimeout(res, 100); });
      }
      return isModelsLoaded;
    }

    const faceapi = (typeof globalThis !== 'undefined' && globalThis.faceapi) ||
                    (typeof window !== 'undefined' && window.faceapi);

    if (!faceapi) {
      console.warn("[FaceAuth] vladmandic/face-api global library not found in window. Falling back to Demo Mode.");
      demoModeActive = true;
      return false;
    }

    const uri = modelBaseUri || DEFAULT_MODEL_URI;
    isModelLoading = true;

    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(uri),
        faceapi.nets.faceLandmark68TinyNet.loadFromUri(uri),
        faceapi.nets.faceRecognitionNet.loadFromUri(uri)
      ]);
      isModelsLoaded = true;
      console.log("[FaceAuth] @vladmandic/face-api models successfully loaded from", uri);
      return true;
    } catch (err) {
      console.warn("[FaceAuth] Failed to load face-api models from CDN:", err.message, "Falling back to Demo Mode.");
      demoModeActive = true;
      return false;
    } finally {
      isModelLoading = false;
    }
  }

  /**
   * Start camera video stream
   * @param {HTMLVideoElement} videoElement 
   * @returns {Promise<MediaStream>}
   */
  async function startCamera(videoElement) {
    if (!videoElement) {
      throw new Error("No video element provided to startCamera.");
    }
    // Clean up any existing active media stream before acquiring a new one
    if (activeMediaStream) {
      stopCamera(videoElement);
    }
    if (demoModeActive) {
      console.log("[FaceAuth] Demo mode active, skipping physical camera start.");
      return null;
    }

    const constraints = {
      video: {
        facingMode: "user",
        width: { ideal: 640 },
        height: { ideal: 480 }
      },
      audio: false
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      activeMediaStream = stream;
      videoElement.srcObject = stream;
      videoElement.setAttribute("playsinline", "true");
      videoElement.setAttribute("autoplay", "true");
      videoElement.muted = true;

      await new Promise(function (resolve) {
        if (videoElement.readyState >= 2) {
          videoElement.play().catch(function () {});
          resolve();
        } else {
          videoElement.onloadedmetadata = function () {
            videoElement.play().catch(function () {});
            resolve();
          };
        }
      });
      return stream;
    } catch (err) {
      console.warn("[FaceAuth] Camera start failed or denied:", err.message, "Activating Demo Mode.");
      demoModeActive = true;
      throw err;
    }
  }

  /**
   * Stop camera video stream
   * @param {HTMLVideoElement} [videoElement] 
   */
  function stopCamera(videoElement) {
    if (activeMediaStream) {
      activeMediaStream.getTracks().forEach(function (track) {
        track.stop();
      });
      activeMediaStream = null;
    }
    if (videoElement && videoElement.srcObject) {
      videoElement.srcObject = null;
    }
  }

  /**
   * Check if live camera stream is actively running
   * @returns {boolean}
   */
  function isCameraRunning() {
    return !!(activeMediaStream && activeMediaStream.active);
  }

  /**
   * Compute Cosine Similarity between two 128-dimensional vectors
   * Cosine(A, B) = (A . B) / (||A|| * ||B||)
   * @param {Float32Array|Array<number>} vecA 
   * @param {Float32Array|Array<number>} vecB 
   * @returns {number} Clamped similarity in [0.0, 1.0]
   */
  function computeCosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== 128 || vecB.length !== 128) {
      return 0;
    }
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < 128; i++) {
      const a = vecA[i];
      const b = vecB[i];
      dot += a * b;
      normA += a * a;
      normB += b * b;
    }
    if (normA === 0 || normB === 0) return 0;
    const similarity = dot / (Math.sqrt(normA) * Math.sqrt(normB));
    return Math.max(0, Math.min(1, similarity));
  }

  /**
   * Verify face match against stored target descriptor
   * @param {Float32Array|Array<number>} currentDescriptor 
   * @param {Float32Array|Array<number>} targetDescriptor 
   * @param {number} [threshold=0.85] 
   * @returns {{isMatch: boolean, similarity: number, percentage: number, thresholdPercentage: number}}
   */
  function verifyFace(currentDescriptor, targetDescriptor, threshold) {
    const t = typeof threshold === 'number' ? threshold : DEFAULT_SIMILARITY_THRESHOLD;
    const similarity = computeCosineSimilarity(currentDescriptor, targetDescriptor);
    const percentage = Math.round(similarity * 1000) / 10; // e.g. 92.4%
    return {
      isMatch: similarity >= t,
      similarity: similarity,
      percentage: percentage,
      thresholdPercentage: Math.round(t * 100)
    };
  }

  /**
   * Linear Congruential Generator for deterministic pseudo-random vectors
   */
  function createPrng(seed) {
    let s = (Math.abs(seed) % 2147483647) || 123456789;
    return function () {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646; // [0, 1)
    };
  }

  /**
   * Generate deterministic 128-dimensional pseudo-vector based on classID and studentID
   * @param {string} classID 
   * @param {number|string} studentID 
   * @param {boolean} [addNoise=false] Set to true for secondary authentication to simulate natural slight variance
   * @param {number} [version=1] Feature version number (increments alter base seed for re-registration)
   * @returns {Float32Array} 128-element normalized vector
   */
  function getDemoDescriptor(classID, studentID, addNoise, version) {
    const clsStr = String(classID || "4D").trim().toUpperCase();
    const idNum = parseInt(studentID, 10) || 1;
    const vNum = parseInt(version, 10) || 1;

    // Compute composite numerical seed from class and ID
    let classHash = 0;
    for (let i = 0; i < clsStr.length; i++) {
      classHash = (classHash * 31 + clsStr.charCodeAt(i)) & 0x7FFFFFFF;
    }
    const baseSeed = (classHash * 10007 + idNum * 2627 + (vNum - 1) * 7919) & 0x7FFFFFFF;

    const prng = createPrng(baseSeed);
    const vector = new Float32Array(128);
    let norm = 0;

    for (let i = 0; i < 128; i++) {
      // Box-Muller transform for normal distribution
      const u1 = Math.max(1e-7, prng());
      const u2 = prng();
      const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      vector[i] = z0;
      norm += z0 * z0;
    }

    // Normalize base vector
    norm = Math.sqrt(norm);
    if (norm > 0) {
      for (let i = 0; i < 128; i++) {
        vector[i] /= norm;
      }
    }

    // If simulating secondary scan of the SAME student, add controlled micro-noise (+- 2% to 3%)
    // resulting in cosine similarity >= 92% (easily passing the 85% threshold)
    if (addNoise) {
      let noisyNorm = 0;
      for (let i = 0; i < 128; i++) {
        const jitter = (Math.random() - 0.5) * 0.05; // small perturbation
        vector[i] += jitter;
        noisyNorm += vector[i] * vector[i];
      }
      noisyNorm = Math.sqrt(noisyNorm);
      if (noisyNorm > 0) {
        for (let i = 0; i < 128; i++) {
          vector[i] /= noisyNorm;
        }
      }
    }

    return vector;
  }

  /**
   * Generate simulated avatar snapshot image (320x240 JPEG Base64) for demo / headless mode
   * @param {string} classID 
   * @param {number|string} studentID 
   * @param {string} studentName 
   * @param {number} [version=1]
   * @returns {{imageBase64: string, descriptor: Float32Array, sizeKb: number}}
   */
  function generateDemoSnapshot(classID, studentID, studentName, version) {
    const vNum = parseInt(version, 10) || 1;
    const descriptor = getDemoDescriptor(classID, studentID, false, vNum);
    
    // In browser environment, draw on canvas; in Node.js test environment, synthesize minimal JPEG base64
    let base64Data = "";
    if (typeof document !== 'undefined' && document.createElement) {
      const canvas = document.createElement("canvas");
      canvas.width = SNAPSHOT_WIDTH;
      canvas.height = SNAPSHOT_HEIGHT;
      const ctx = canvas.getContext("2d");

      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, SNAPSHOT_WIDTH, SNAPSHOT_HEIGHT);
      grad.addColorStop(0, "#1e293b");
      grad.addColorStop(1, "#0f172a");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, SNAPSHOT_WIDTH, SNAPSHOT_HEIGHT);

      // Card border
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 3;
      ctx.strokeRect(6, 6, SNAPSHOT_WIDTH - 12, SNAPSHOT_HEIGHT - 12);

      // Face silhouette avatar circle
      ctx.fillStyle = "#334155";
      ctx.beginPath();
      ctx.arc(SNAPSHOT_WIDTH / 2, 85, 45, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#60a5fa";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Student initial avatar letter
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 34px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const initial = (studentName || "學").charAt(0);
      ctx.fillText(initial, SNAPSHOT_WIDTH / 2, 85);

      // Student info text
      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText(`${classID} 班  ${studentID} 號`, SNAPSHOT_WIDTH / 2, 150);

      ctx.fillStyle = "#93c5fd";
      ctx.font = "16px sans-serif";
      ctx.fillText(studentName || "測試學生", SNAPSHOT_WIDTH / 2, 175);

      // Watermark / demo badge
      ctx.fillStyle = "#10b981";
      ctx.fillRect(SNAPSHOT_WIDTH / 2 - 80, 195, 160, 24);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText("✓ DEMO AUTH PASS", SNAPSHOT_WIDTH / 2, 207);

      base64Data = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
    } else {
      // Minimal test stub for Node.js
      base64Data = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAAPAA8BAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=";
    }

    const sizeKb = Math.round((base64Data.length * 3 / 4) / 1024);
    return {
      imageBase64: base64Data,
      descriptor: descriptor,
      sizeKb: sizeKb
    };
  }

  /**
   * Capture face snapshot and 128-d descriptor from live camera video or fallback generator
   * @param {HTMLVideoElement} [videoElement] 
   * @param {Object} [contextInfo] { classID, studentID, studentName }
   * @returns {Promise<{descriptor: Float32Array, imageBase64: string, sizeKb: number, isDemo: boolean}>}
   */
  async function captureFace(videoElement, contextInfo) {
    const info = contextInfo || {};
    const cls = info.classID || "4D";
    const sid = info.studentID || 1;
    const sname = info.studentName || "";

    // 1. Check if forced demo mode or no video stream
    if (demoModeActive || !videoElement || !videoElement.srcObject || videoElement.readyState < 2) {
      console.log("[FaceAuth] Operating in Demo / Fallback capture mode.");
      const demoResult = info.version ? generateDemoSnapshot(cls, sid, sname, info.version) : generateDemoSnapshot(cls, sid, sname);
      return {
        descriptor: demoResult.descriptor,
        imageBase64: demoResult.imageBase64,
        sizeKb: demoResult.sizeKb,
        isDemo: true
      };
    }

    // 2. Physical camera snapshot capture (320x240 @ 0.70 JPEG)
    const canvas = document.createElement("canvas");
    canvas.width = SNAPSHOT_WIDTH;
    canvas.height = SNAPSHOT_HEIGHT;
    const ctx = canvas.getContext("2d");

    // Mirror horizontally for front-facing selfie camera
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    // Reset transform
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    const base64Data = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
    const sizeKb = Math.round((base64Data.length * 3 / 4) / 1024);

    // 3. Extract 128-d feature descriptor via vladmandic/face-api
    const faceapi = (typeof globalThis !== 'undefined' && globalThis.faceapi) ||
                    (typeof window !== 'undefined' && window.faceapi);

    if (faceapi && isModelsLoaded) {
      try {
        const options = new faceapi.TinyFaceDetectorOptions({
          inputSize: 224,
          scoreThreshold: 0.5
        });

        const detection = await faceapi.detectSingleFace(videoElement, options)
          .withFaceLandmarks(true)
          .withFaceDescriptor();

        if (detection && detection.descriptor) {
          return {
            descriptor: detection.descriptor,
            imageBase64: base64Data,
            sizeKb: sizeKb,
            isDemo: false
          };
        } else {
          console.warn("[FaceAuth] No clear face detected in camera stream. Using fallback descriptor.");
        }
      } catch (err) {
        console.warn("[FaceAuth] face-api detection threw error:", err.message);
      }
    }

    // If face-api did not return descriptor, fallback to deterministic descriptor
    const fallbackDesc = getDemoDescriptor(cls, sid, false, info.version || 1);
    return {
      descriptor: fallbackDesc,
      imageBase64: base64Data,
      sizeKb: sizeKb,
      isDemo: true
    };
  }

  /**
   * Serialize 128-d descriptor into compact comma-separated string (4 decimal places)
   * Suitable for Google Form entry.1972335137
   * @param {Float32Array|Array<number>} descriptor 
   * @returns {string}
   */
  function serializeDescriptor(descriptor) {
    if (!descriptor) return "";
    const arr = [];
    for (let i = 0; i < descriptor.length; i++) {
      arr.push(descriptor[i].toFixed(4));
    }
    return arr.join(",");
  }

  /**
   * Serialize 128-d descriptor with version and timestamp metadata
   * Format: CSV_FLOATS|TS:timestamp|V:version
   * @param {Float32Array|Array<number>} descriptor 
   * @param {number} [timestamp] 
   * @param {number} [version] 
   * @returns {string}
   */
  function serializeDescriptorWithTimestamp(descriptor, timestamp, version) {
    const raw = serializeDescriptor(descriptor);
    const ts = timestamp || Date.now();
    const ver = version || 1;
    return `${raw}|TS:${ts}|V:${ver}`;
  }

  /**
   * Deserialize string back into 128-d Float32Array
   * @param {string} serializedStr 
   * @returns {Float32Array}
   */
  function deserializeDescriptor(serializedStr) {
    if (!serializedStr || typeof serializedStr !== 'string') {
      return new Float32Array(128);
    }
    let vectorStr = serializedStr;
    if (vectorStr.includes("|")) {
      vectorStr = vectorStr.split("|")[0];
    }
    if (vectorStr.includes(":")) {
      const parts = vectorStr.split(":");
      vectorStr = parts[parts.length - 1];
    }
    const parts = vectorStr.split(",").map(Number);
    const result = new Float32Array(128);
    for (let i = 0; i < Math.min(128, parts.length); i++) {
      result[i] = isNaN(parts[i]) ? 0 : parts[i];
    }
    return result;
  }

  return {
    DEFAULT_SIMILARITY_THRESHOLD: DEFAULT_SIMILARITY_THRESHOLD,
    SNAPSHOT_WIDTH: SNAPSHOT_WIDTH,
    SNAPSHOT_HEIGHT: SNAPSHOT_HEIGHT,
    JPEG_QUALITY: JPEG_QUALITY,
    isDemoMode: isDemoMode,
    setDemoMode: setDemoMode,
    checkCameraAvailability: checkCameraAvailability,
    initFaceApi: initFaceApi,
    startCamera: startCamera,
    stopCamera: stopCamera,
    isCameraRunning: isCameraRunning,
    computeCosineSimilarity: computeCosineSimilarity,
    verifyFace: verifyFace,
    getDemoDescriptor: getDemoDescriptor,
    generateDemoSnapshot: generateDemoSnapshot,
    captureFace: captureFace,
    serializeDescriptor: serializeDescriptor,
    serializeDescriptorWithTimestamp: serializeDescriptorWithTimestamp,
    deserializeDescriptor: deserializeDescriptor
  };
});
