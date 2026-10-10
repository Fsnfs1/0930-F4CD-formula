// ==========================================
// 1. 全局配置與客觀題標準答案
// ==========================================
const CONFIG = {
  MODE: (typeof window !== 'undefined' && window.location && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) ? 'mock' : 'production',
  MOCK_GAS_URL: 'http://localhost:3000/api/gas-upload',
  MOCK_FORM_URL: 'http://localhost:3000/api/form-submit',
  PROD_GAS_URL: 'https://script.google.com/macros/s/AKfycbxjkXzqp4WOghvi__SF8qoVBGAcXcSKv96JoRsKN3hLU6xHwLjK4rHyaXODIv_fE9Ak/exec',
  PROD_FORM_URL: 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSeLZ6E4kLjJ26aWrKRPRPtDdthkxRHqOPX5AOwAq8_TYiT-OQ/formResponse',
  STORAGE_KEY: 'ADVANCE_MATH_EXAM_STATE',
  TOTAL_SECONDS: 3000,    // 50 分鐘總時長 (3000 秒)
  PHASE1_SECONDS: 2400,   // 40 分鐘第一階段 (2400 秒)
  BUFFER_SECONDS: 600,    // 10 分鐘緩衝時間 (600 秒)
  FORM_ENTRIES: {
    classId: 'entry.543502435',
    studentId: 'entry.1745113091',
    dateID: 'entry.1972335137',
    score: 'entry.2095507383'
  },
  get GAS_URL() { return this.MODE === 'production' ? this.PROD_GAS_URL : this.MOCK_GAS_URL; },
  get FORM_URL() { return this.MODE === 'production' ? this.PROD_FORM_URL : this.MOCK_FORM_URL; }
};

// 官方答案鍵 (滿分 22 分：第 1~6 題是非題每題 2 分，第 7~11 題單選題每題 2 分)
const ANSWER_KEY = {
  q1: 'X', q2: 'O', q3: 'O', q4: 'X', q5: 'X', q6: 'X',
  q7: 'D', q8: 'B', q9: 'A', q10: 'B', q11: 'A'
};

// 全局考試運行時狀態
var ExamState = {
  currentStudent: null,   // { classID, studentID, name, grade, isTeacher }
  phase: 1,               // 1: 40分鐘全卷, 2: 10分鐘緩衝
  timeLeft: CONFIG.TOTAL_SECONDS,
  timerInterval: null,
  isLocked: false,
  isSubmitting: false,
  pendingSubmission: false,
  isExamStarted: false,
  questionPhotos: {},     // { q20: dataUrl, q21: dataUrl, q22: dataUrl, q23: dataUrl }
  uploadedPhotoUrls: {},  // { q20: driveUrl, q21: driveUrl, q22: driveUrl, q23: driveUrl }
  currentCompressedBase64: '',
  uploadedFileUrl: '',
  activeCameraStream: null
};

if (typeof window !== 'undefined') {
  window.ExamState = ExamState;
}

// 觸發 MathJax 3 數學公式顯影 (含非同步啟動守護)
function triggerMathJaxTypeset() {
  if (typeof window !== 'undefined' && window.MathJax) {
    try {
      if (window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise().catch(function(err) {
          console.warn('MathJax typeset error:', err);
        });
      } else if (window.MathJax.startup && window.MathJax.startup.promise) {
        window.MathJax.startup.promise.then(function() {
          if (window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise().catch(function(err) {
              console.warn('MathJax typeset error:', err);
            });
          }
        });
      }
    } catch (e) {
      console.warn('MathJax execution error:', e);
    }
  }
}

// ==========================================
// 2. 人臉向量提取、特徵比對與 1:N 識別算法
// ==========================================
function computeCosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function generatePseudoDescriptor(studentIdStr) {
  const vec = new Float32Array(128);
  let hash = 0;
  for (let i = 0; i < studentIdStr.length; i++) {
    hash = ((hash << 5) - hash) + studentIdStr.charCodeAt(i);
    hash |= 0;
  }
  for (let i = 0; i < 128; i++) {
    const x = Math.sin(hash + i) * 10000;
    vec[i] = (x - Math.floor(x)) * 2 - 1;
  }
  let norm = 0;
  for (let i = 0; i < 128; i++) norm += vec[i] * vec[i];
  norm = Math.sqrt(norm);
  for (let i = 0; i < 128; i++) vec[i] /= norm;
  return vec;
}

function identifyFace1toN(descriptor, profiles, threshold) {
  const t = typeof threshold === 'number' ? threshold : 0.80;
  if (!descriptor || !Array.isArray(profiles) || profiles.length === 0) {
    return { isMatch: false, bestMatch: null, delta: 0, candidates: [] };
  }

  const scoredList = [];
  profiles.forEach(p => {
    if (!p) return;
    const targetDesc = p.descriptor || generatePseudoDescriptor(p.classID + p.studentID);
    const sim = computeCosineSimilarity(descriptor, targetDesc);
    scoredList.push({
      profile: p,
      similarity: sim,
      percentage: Math.round(Math.max(0, sim) * 1000) / 10
    });
  });

  scoredList.sort((a, b) => b.similarity - a.similarity);
  if (scoredList.length === 0) {
    return { isMatch: false, bestMatch: null, delta: 0, candidates: [] };
  }

  const top1 = scoredList[0];
  const top2 = scoredList.length > 1 ? scoredList[1] : null;
  const delta = top2 ? (top1.similarity - top2.similarity) : 1.0;

  return {
    isMatch: top1.similarity >= t,
    bestMatch: top1.profile,
    topCandidate: top1.profile,
    similarity: top1.similarity,
    percentage: top1.percentage,
    secondMatch: top2 ? top2.profile : null,
    delta: delta,
    candidates: scoredList.slice(0, 3)
  };
}

// ==========================================
// 3. 智能刷臉首頁、相機辨識與密碼二次驗證
// ==========================================
let faceFirstStream = null;
let selectedModalCandidate = null;

function getStudentsListForClass(cls) {
  const list = [];
  const norm = String(cls).trim().toUpperCase();
  if (typeof ROSTER_DATA !== 'undefined' && ROSTER_DATA[norm]) {
    ROSTER_DATA[norm].forEach(s => {
      list.push({ classID: norm, studentID: s.id, id: s.id, name: s.name, grade: s.grade });
    });
  }
  // 全班級均支援 99 號教師測試員
  list.push({
    classID: norm,
    studentID: 99,
    id: 99,
    name: '教師測試員',
    grade: norm === '5B' ? 11 : 10,
    isTeacher: true
  });
  return list;
}

function getAllStudentProfiles() {
  const all = [];
  ['4C', '4D', '5B'].forEach(cls => {
    const list = getStudentsListForClass(cls);
    list.forEach(s => {
      let desc = null;
      if (typeof window !== 'undefined' && window.FaceAuthModule && window.FaceAuthModule.getDemoDescriptor) {
        desc = window.FaceAuthModule.getDemoDescriptor(s.classID, s.studentID);
      } else {
        desc = generatePseudoDescriptor(s.classID + s.studentID);
      }
      all.push({
        classID: s.classID,
        studentID: s.studentID,
        name: s.name,
        isTeacher: s.isTeacher,
        descriptor: desc
      });
    });
  });
  return all;
}

let faceFirstBlinkTracker = null;
let isFaceFirstScanning = false;

function startLivenessAnd1toN() {
  const video = document.getElementById('faceFirstVideo');
  if (!video) return;
  if (faceFirstBlinkTracker) {
    faceFirstBlinkTracker.stop();
    faceFirstBlinkTracker = null;
  }
  if (typeof window !== 'undefined' && window.FaceAuthModule && window.FaceAuthModule.startBlinkDetection) {
    faceFirstBlinkTracker = window.FaceAuthModule.startBlinkDetection(video, {
      blinkThreshold: 0.20,
      openThreshold: 0.25,
      onBlink: function(blinkData) {
        console.log('[FaceFirst] 活體眨眼檢測通過，觸發自動辨識：', blinkData);
        if (!isFaceFirstScanning) {
          captureFaceFirstAndVerify('liveness_blink');
        }
      },
      onStatusUpdate: function(status) {
        if (isFaceFirstScanning) return;
        const overlay = document.getElementById('faceFirstOverlay');
        if (overlay) {
          if (status.isFaceDetected) {
            overlay.textContent = '🟢 偵測到面孔 · 請眨眨眼完成活體驗證';
          } else {
            overlay.textContent = '🟡 請將面部置於引導線中央';
          }
        }
      }
    });
  }
}

async function startFaceFirstCamera(isAuto) {
  const video = document.getElementById('faceFirstVideo');
  const btnStart = document.getElementById('btnFaceFirstStart');
  const btnCapture = document.getElementById('btnFaceFirstCapture');
  const overlay = document.getElementById('faceFirstOverlay');
  const alertBox = document.getElementById('faceFirstAlert');

  if (alertBox) alertBox.style.display = 'none';

  try {
    let stream = null;
    if (typeof window !== 'undefined' && window.FaceAuthModule && window.FaceAuthModule.startCamera && video) {
      stream = await window.FaceAuthModule.startCamera(video);
    } else if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false
      });
      if (video) {
        video.srcObject = stream;
        await video.play();
      }
    }
    faceFirstStream = stream;
    if (btnStart) btnStart.style.display = 'none';
    if (btnCapture) btnCapture.style.display = 'inline-flex';
    if (overlay) overlay.textContent = '🟢 正在檢測面孔... 請正對鏡頭並眨眨眼';
    startLivenessAnd1toN();
  } catch (err) {
    console.warn('相機存取失敗或未配置鏡頭：', err);
    if (typeof window !== 'undefined' && window.FaceAuthModule && window.FaceAuthModule.setDemoMode) {
      window.FaceAuthModule.setDemoMode(true);
    }
    if (btnStart) btnStart.style.display = 'none';
    if (btnCapture) btnCapture.style.display = 'inline-flex';
    if (alertBox) {
      alertBox.className = 'alert-box alert-warning';
      alertBox.style.display = 'block';
      alertBox.textContent = '⚠️ 無法開啟相機或處於無鏡頭環境，已啟用測試模式；亦可點擊下方「前往身分選擇」進行手動登記。';
    }
    if (overlay) overlay.textContent = '⚠️ 相機未就緒（測試模式中，點擊下方「拍照識別身分」）';
  }
}

function stopFaceFirstCamera() {
  if (faceFirstBlinkTracker) {
    faceFirstBlinkTracker.stop();
    faceFirstBlinkTracker = null;
  }
  if (typeof window !== 'undefined' && window.FaceAuthModule && window.FaceAuthModule.stopCamera) {
    window.FaceAuthModule.stopCamera();
  }
  if (faceFirstStream) {
    faceFirstStream.getTracks().forEach(t => t.stop());
    faceFirstStream = null;
  }
}

async function captureFaceFirstAndVerify(triggerSource) {
  const video = document.getElementById('faceFirstVideo');
  const btnCapture = document.getElementById('btnFaceFirstCapture');
  const overlay = document.getElementById('faceFirstOverlay');
  const alertBox = document.getElementById('faceFirstAlert');

  if (isFaceFirstScanning) return;
  isFaceFirstScanning = true;

  if (faceFirstBlinkTracker) {
    faceFirstBlinkTracker.stop();
    faceFirstBlinkTracker = null;
  }

  if (btnCapture) {
    btnCapture.disabled = true;
    btnCapture.innerHTML = '<span>⏳ 正在特徵提取比對...</span>';
  }
  if (overlay) overlay.textContent = '⏳ 正在提取人臉 128D 特徵向量並檢索特徵庫...';

  try {
    let snap = null;
    if (typeof window !== 'undefined' && window.FaceAuthModule && window.FaceAuthModule.captureFace && video) {
      snap = await window.FaceAuthModule.captureFace(video);
    } else {
      const canvas = document.createElement('canvas');
      canvas.width = 320;
      canvas.height = 240;
      const ctx = canvas.getContext('2d');
      if (video && video.videoWidth) ctx.drawImage(video, 0, 0, 320, 240);
      const imgData = canvas.toDataURL('image/jpeg', 0.7);
      const demoDesc = (typeof window !== 'undefined' && window.FaceAuthModule && window.FaceAuthModule.getDemoDescriptor)
        ? window.FaceAuthModule.getDemoDescriptor('4C', 1)
        : generatePseudoDescriptor('SAMPLE_' + Date.now());
      snap = { descriptor: demoDesc, imageBase64: imgData, isDemo: true };
    }

    ExamState.capturedSnapshot = snap;

    // 檢索學生特徵清單 (優先自 PersistenceModule 讀取真實資料)
    let profiles = (typeof window !== 'undefined' && window.PersistenceModule && window.PersistenceModule.getAllStudentProfiles)
      ? window.PersistenceModule.getAllStudentProfiles()
      : [];

    if (!profiles || profiles.length === 0) {
      profiles = getAllStudentProfiles();
    }

    // 進行 1:N 特徵向量識別
    let matchResult = null;
    if (typeof window !== 'undefined' && window.FaceAuthModule && window.FaceAuthModule.identifyFace1toN && snap.descriptor) {
      matchResult = window.FaceAuthModule.identifyFace1toN(snap.descriptor, profiles, 0.82);
    } else {
      matchResult = identifyFace1toN(snap.descriptor, profiles, 0.82);
    }

    // R1 核心防護：無論唯一匹配或相似邊界，均強制彈出密碼輸入框進行二次身分驗證
    if (alertBox) {
      alertBox.className = 'alert-box alert-warning';
      alertBox.style.display = 'block';
      if (matchResult && matchResult.bestMatch) {
        alertBox.innerHTML = `🟢 <strong>偵測到相近面孔 (${matchResult.bestMatch.classID} 班 ${matchResult.bestMatch.name} 同學)</strong><br><small>依安全防冒用機制，請在彈出視窗輸入個人身分密碼以確認本人！</small>`;
      } else {
        alertBox.innerHTML = '⚠️ <strong>偵測到多位相似特徵 (無法唯一確認本人)</strong><br><small>差距小於安全邊際，請在彈出視窗確認姓名並輸入身分密碼完成二次驗證！</small>';
      }
    }

    if (overlay) overlay.textContent = '🔒 比對完成 · 請輸入身分密碼二次驗證';

    const candidateList = (matchResult && matchResult.candidates && matchResult.candidates.length > 0)
      ? matchResult.candidates
      : (matchResult && matchResult.bestMatch ? [{ profile: matchResult.bestMatch, percentage: matchResult.percentage || 94.6 }] : []);

    if (candidateList.length === 0 && profiles.length > 0) {
      candidateList.push({ profile: profiles[0], percentage: 85.0 });
    }

    showPasswordAuthModal(candidateList);
  } catch (err) {
    console.warn('人臉識別比對異常：', err);
    if (alertBox) {
      alertBox.className = 'alert-box alert-warning';
      alertBox.style.display = 'block';
      alertBox.textContent = '⚠️ 人臉識別比對異常，請點擊下方「前往身分選擇」進行身分確認。';
    }
  } finally {
    isFaceFirstScanning = false;
    if (btnCapture) {
      btnCapture.disabled = false;
      btnCapture.innerHTML = '<span>🔍 拍照識別身分</span>';
    }
  }
}

function showPasswordAuthModal(candidates) {
  const modal = document.getElementById('modalPasswordAuth');
  const candidateSection = document.getElementById('authCandidateSection');
  const candidateList = document.getElementById('authCandidateList');
  const alertErr = document.getElementById('alertPasswordAuthError');
  const pwdInput = document.getElementById('inputAuthPassword');

  if (modal) modal.style.display = 'flex';
  if (alertErr) alertErr.style.display = 'none';
  if (pwdInput) { pwdInput.value = ''; pwdInput.focus(); }

  if (candidates && candidates.length > 0 && candidateSection && candidateList) {
    candidateSection.style.display = 'block';
    candidateList.innerHTML = '';

    candidates.forEach((c, idx) => {
      const p = c.profile;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'auth-candidate-btn' + (idx === 0 ? ' active' : '');
      btn.id = 'btnCandidate_' + p.classID + '_' + p.studentID;
      btn.innerHTML = '<span><strong>Top ' + (idx + 1) + ':</strong> ' + p.classID + ' 班 ' + p.studentID + ' 號 ' + p.name + '</span><span style="font-size: 12px; color: #94a3b8;">相似度: ' + c.percentage + '%</span>';
      btn.onclick = () => selectModalCandidate(p, btn);
      candidateList.appendChild(btn);
    });

    selectModalCandidate(candidates[0].profile, candidateList.firstChild);
  } else {
    if (candidateSection) candidateSection.style.display = 'none';
  }
}

function selectModalCandidate(profile, btnElement) {
  selectedModalCandidate = profile;
  const info = document.getElementById('authStudentInfo');
  if (info) {
    info.textContent = profile.classID + ' 班 ' + profile.studentID + ' 號 ' + profile.name + ' 同學';
  }
  if (btnElement && btnElement.parentElement) {
    const allBtns = btnElement.parentElement.querySelectorAll('.auth-candidate-btn');
    allBtns.forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');
  }
}

function toggleAuthManualSelect() {
  const fields = document.getElementById('authManualSelectFields');
  const link = document.getElementById('linkAuthManualSelect');
  if (!fields) return;
  const isHidden = fields.style.display === 'none';
  fields.style.display = isHidden ? 'block' : 'none';
  if (link) link.textContent = isHidden ? '收起手動選擇 ▴' : '非以上候選人？手動選擇其他學生 ▾';
}

function onAuthClassSelectChange(cls) {
  const studentSelect = document.getElementById('authStudentSelect');
  if (!studentSelect) return;
  studentSelect.innerHTML = '<option value="" disabled selected>-- 選擇學號 --</option>';
  if (!cls) { studentSelect.disabled = true; return; }

  const list = getStudentsListForClass(cls);
  list.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.studentID;
    opt.textContent = s.studentID + ' 號 - ' + s.name;
    studentSelect.appendChild(opt);
  });
  studentSelect.disabled = false;
}

function onAuthStudentSelectChange(sid) {
  const classSelect = document.getElementById('authClassSelect');
  if (!classSelect || !sid) return;
  const cls = classSelect.value;
  const list = getStudentsListForClass(cls);
  const found = list.find(s => String(s.studentID) === String(sid));
  if (found) {
    selectModalCandidate(found, null);
  }
}

function toggleAuthChangePassword(checked) {
  const fields = document.getElementById('authChangePasswordFields');
  if (fields) fields.style.display = checked ? 'block' : 'none';
}

function hidePasswordAuthModal() {
  const modal = document.getElementById('modalPasswordAuth');
  if (modal) modal.style.display = 'none';
}

function verifyStudentCredentials(classID, studentID, password) {
  if (!classID || studentID === undefined || studentID === null) return false;
  const pwd = String(password !== undefined && password !== null ? password : '').trim();
  if (!pwd) return false;

  // 優先使用 PersistenceModule 經 Salted SHA-256 密碼雜湊核驗 (比對 ADMIN_STUDENT_PASSWORDS 與 LocalStorage)
  if (typeof PersistenceModule !== 'undefined' && PersistenceModule.verifyStudentPassword) {
    return PersistenceModule.verifyStudentPassword(classID, studentID, pwd);
  }
  if (typeof window !== 'undefined' && window.PersistenceModule && window.PersistenceModule.verifyStudentPassword) {
    return window.PersistenceModule.verifyStudentPassword(classID, studentID, pwd);
  }

  // 獨立單元測試沙盒回退相容 (若沙盒未載入 persistence.js)
  const cid = String(classID).trim().toUpperCase();
  const sid = parseInt(studentID, 10);
  if (sid === 99 && pwd === '1234') return true;
  const customPwdKey = 'CUSTOM_PWD_' + cid + '_' + sid;
  if (typeof localStorage !== 'undefined') {
    const customPwd = localStorage.getItem(customPwdKey);
    if (customPwd) return pwd === customPwd;
  }
  return pwd === '1234';
}

function submitPasswordAuth() {
  const alertErr = document.getElementById('alertPasswordAuthError');
  const pwdInput = document.getElementById('inputAuthPassword');
  const chkChange = document.getElementById('chkAuthChangePassword');
  const newPwdInput = document.getElementById('inputAuthNewPassword');
  const confirmPwdInput = document.getElementById('inputAuthConfirmPassword');

  if (!selectedModalCandidate) {
    if (alertErr) {
      alertErr.style.display = 'block';
      alertErr.textContent = '⚠️ 請先選擇您的學生身分！';
    }
    return;
  }

  const pwd = pwdInput ? pwdInput.value.trim() : '';
  if (!pwd) {
    if (alertErr) {
      alertErr.style.display = 'block';
      alertErr.textContent = '⚠️ 請輸入個人密碼！';
    }
    return;
  }

  const cls = selectedModalCandidate.classID;
  const sid = selectedModalCandidate.studentID;

  if (!verifyStudentCredentials(cls, sid, pwd)) {
    if (alertErr) {
      alertErr.style.display = 'block';
      alertErr.textContent = '⚠️ 密碼驗證失敗，請輸入正確的個人密碼！';
    }
    return;
  }

  // 檢查是否修改新密碼
  if (chkChange && chkChange.checked) {
    const np = newPwdInput ? newPwdInput.value.trim() : '';
    const cp = confirmPwdInput ? confirmPwdInput.value.trim() : '';
    if (!/^\d{4,}$/.test(np)) {
      if (alertErr) {
        alertErr.style.display = 'block';
        alertErr.textContent = '⚠️ 新密碼必須為至少 4 位純數字！';
      }
      return;
    }
    if (np === '1234') {
      if (alertErr) {
        alertErr.style.display = 'block';
        alertErr.textContent = '⚠️ 新密碼不得為預設密碼 1234！';
      }
      return;
    }
    if (np !== cp) {
      if (alertErr) {
        alertErr.style.display = 'block';
        alertErr.textContent = '⚠️ 兩次輸入的新密碼不一致！';
      }
      return;
    }

    if (typeof PersistenceModule !== 'undefined' && PersistenceModule.updateStudentPassword) {
      PersistenceModule.updateStudentPassword(cls, sid, pwd, np);
    } else if (typeof window !== 'undefined' && window.PersistenceModule && window.PersistenceModule.updateStudentPassword) {
      window.PersistenceModule.updateStudentPassword(cls, sid, pwd, np);
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('CUSTOM_PWD_' + cls + '_' + sid, np);
    }
  }

  // 特徵融合增強 (Vector Enhancement)
  const snap = ExamState.capturedSnapshot;
  if (snap && snap.descriptor) {
    if (typeof PersistenceModule !== 'undefined' && PersistenceModule.enhanceStudentVector) {
      PersistenceModule.enhanceStudentVector(cls, sid, snap.descriptor, 0.7);
    } else if (typeof window !== 'undefined' && window.PersistenceModule && window.PersistenceModule.enhanceStudentVector) {
      window.PersistenceModule.enhanceStudentVector(cls, sid, snap.descriptor, 0.7);
    }
  }

  ExamState.isAuthenticated = true;
  ExamState.currentStudent = selectedModalCandidate;

  hidePasswordAuthModal();
  stopFaceFirstCamera();
  proceedToPreExamConfirm(selectedModalCandidate);
}

// 手動身分切換視圖
function showManualSelectView() {
  stopFaceFirstCamera();
  const faceCard = document.getElementById('cardFaceFirstLogin');
  const manualCard = document.getElementById('cardFirstTimeSelect');
  if (faceCard) faceCard.style.display = 'none';
  if (manualCard) manualCard.style.display = 'block';
  const selClass = document.getElementById('selectClass');
  onClassChange(selClass ? selClass.value : '4C');
}

function showFaceFirstView() {
  const faceCard = document.getElementById('cardFaceFirstLogin');
  const manualCard = document.getElementById('cardFirstTimeSelect');
  if (manualCard) manualCard.style.display = 'none';
  if (faceCard) faceCard.style.display = 'block';
  startFaceFirstCamera();
}

function onClassChange(cls) {
  const studentSelect = document.getElementById('selectStudent');
  if (!studentSelect) return;
  studentSelect.innerHTML = '<option value="" disabled selected>-- 請選擇學生學號與姓名 --</option>';

  const list = getStudentsListForClass(cls);
  list.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.studentID;
    if (s.isTeacher) {
      opt.textContent = cls === '5B' ? '... (教師測試員 99號)' : '99 - 教師測試員';
    } else {
      const padded = String(s.studentID).padStart(2, '0');
      opt.textContent = padded + ' - ' + s.name;
    }
    studentSelect.appendChild(opt);
  });
  studentSelect.disabled = false;
  onStudentChange('');
}

function onStudentChange(sid) {
  const cls = document.getElementById('selectClass')?.value;
  const nameDisplay = document.getElementById('loginStudentNamePreview');
  const btnLogin = document.getElementById('btnLogin');

  if (!sid || !cls) {
    if (nameDisplay) nameDisplay.textContent = '請選擇班別與學號';
    if (btnLogin) btnLogin.disabled = true;
    return;
  }

  const list = getStudentsListForClass(cls);
  const found = list.find(s => String(s.studentID) === String(sid));
  if (found) {
    if (nameDisplay) nameDisplay.textContent = found.name;
    if (btnLogin) btnLogin.disabled = false;
  }
}

function handlePasswordLogin() {
  const cls = document.getElementById('selectClass')?.value;
  const sid = document.getElementById('selectStudent')?.value;
  const pwd = document.getElementById('inputPassword')?.value;
  const alertErr = document.getElementById('authErrorMessage');

  if (!cls || !sid) {
    if (alertErr) {
      alertErr.style.display = 'block';
      alertErr.textContent = '⚠️ 請先選擇班別與學生！';
    }
    return;
  }

  if (!verifyStudentCredentials(cls, sid, pwd)) {
    if (alertErr) {
      alertErr.style.display = 'block';
      alertErr.textContent = '⚠️ 密碼驗證失敗，請輸入正確的個人身分密碼！';
    }
    return;
  }

  const list = getStudentsListForClass(cls);
  const student = list.find(s => String(s.studentID) === String(sid));
  if (!student) {
    if (alertErr) {
      alertErr.style.display = 'block';
      alertErr.textContent = '⚠️ 未找到對應學生資料！';
    }
    return;
  }

  ExamState.isAuthenticated = true;
  ExamState.currentStudent = student;
  proceedToPreExamConfirm(student);
}

// 進入考前核對確認畫面
function proceedToPreExamConfirm(student) {
  ExamState.currentStudent = student;
  saveExamState();

  const authScreen = document.getElementById('authScreen');
  const confirmScreen = document.getElementById('screenPreExamConfirm');

  if (authScreen) authScreen.style.display = 'none';
  if (confirmScreen) confirmScreen.style.display = 'block';

  const cDisplay = document.getElementById('confirmClassDisplay');
  const idDisplay = document.getElementById('confirmIdDisplay');
  const nDisplay = document.getElementById('confirmNameDisplay');
  const badge = document.getElementById('examStudentBadge');

  if (cDisplay) cDisplay.textContent = student.classID;
  if (idDisplay) idDisplay.textContent = student.studentID;
  if (nDisplay) nDisplay.textContent = student.name;
  if (badge) badge.textContent = student.classID + ' 班 ' + student.studentID + ' 號 ' + student.name + ' 同學';
}

function returnToLogin() {
  const authScreen = document.getElementById('authScreen');
  const confirmScreen = document.getElementById('screenPreExamConfirm');
  if (confirmScreen) confirmScreen.style.display = 'none';
  if (authScreen) authScreen.style.display = 'block';
  showFaceFirstView();
}

// ==========================================
// 4. 測驗倒數計時與滿 40 分鐘客觀題鎖定機制
// ==========================================
function startExamCountdown() {
  if (!ExamState.isAuthenticated || !ExamState.currentStudent) {
    alert('⚠️ 測驗尚未完成身分與密碼安全核驗，試卷保持安全鎖定！');
    return;
  }

  const confirmScreen = document.getElementById('screenPreExamConfirm');
  const examContainer = document.getElementById('examContainer');
  const stickyTimer = document.getElementById('stickyTimer');

  if (confirmScreen) confirmScreen.style.display = 'none';
  if (examContainer) examContainer.style.display = 'block';
  if (stickyTimer) stickyTimer.style.display = 'block';

  ExamState.isExamStarted = true;
  saveExamState();

  // 啟用倒數計時器
  if (ExamState.timerInterval) clearInterval(ExamState.timerInterval);
  ExamState.timerInterval = setInterval(tickTimer, 1000);
  updateTimerDisplay();

  // 滾動至試卷頂部並觸發公式顯影
  window.scrollTo({ top: 0, behavior: 'smooth' });
  triggerMathJaxTypeset();
}

function tickTimer() {
  if (ExamState.timeLeft > 0) {
    ExamState.timeLeft--;
  }

  // 滿 40 分鐘 (剩餘時間 <= 600 秒) 瞬間進入 Phase 2 緩衝並全面鎖定客觀題
  if (ExamState.timeLeft <= CONFIG.BUFFER_SECONDS && ExamState.phase === 1) {
    ExamState.phase = 2;
    lockObjectiveQuestions();
  }

  updateTimerDisplay();

  // 每 10 秒自動存檔
  if (ExamState.timeLeft % 10 === 0) {
    saveExamState();
  }

  // 時間終止
  if (ExamState.timeLeft <= 0) {
    clearInterval(ExamState.timerInterval);
    ExamState.timerInterval = null;
    alert('⏱️ 考試 50 分鐘時間已全數截止！系統將自動進行強制交卷。');
    submitExam(true);
  }
}

function updateTimerDisplay() {
  const timerDisplay = document.getElementById('timerCountdownDisplay');
  const badge = document.getElementById('timerPhaseBadge');
  if (!timerDisplay) return;

  const mins = Math.floor(ExamState.timeLeft / 60);
  const secs = ExamState.timeLeft % 60;
  const timeStr = String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
  timerDisplay.textContent = timeStr;

  if (ExamState.phase === 1) {
    if (badge) {
      badge.textContent = '【第一階段：客觀題作答】剩餘：';
      badge.className = 'timer-phase-badge phase1';
    }
  } else {
    if (badge) {
      badge.textContent = '【第二階段：10分鐘拍照與修訂緩衝】剩餘：';
      badge.className = 'timer-phase-badge phase2';
    }
    if (ExamState.timeLeft <= 180) {
      timerDisplay.classList.add('urgent');
    }
  }
}

function lockObjectiveQuestions() {
  ExamState.isLocked = true;

  const part1 = document.getElementById('sectionPart1');
  const part2 = document.getElementById('sectionPart2');
  const banner = document.getElementById('objectiveLockBanner');

  if (part1) {
    part1.classList.add('locked');
    const inputs1 = part1.querySelectorAll('input[type="radio"]');
    inputs1.forEach(inp => inp.disabled = true);
  }

  if (part2) {
    part2.classList.add('locked');
    const inputs2 = part2.querySelectorAll('input[type="radio"]');
    inputs2.forEach(inp => inp.disabled = true);
  }

  if (banner) {
    banner.classList.add('visible');
  }

  saveExamState();
}

// ==========================================
// 5. 單題獨立相機拍照與等比 1200px 壓縮模組 (Q20~Q23)
// ==========================================
let activeQuestionCamId = null;

async function startQuestionCamera(qid) {
  stopQuestionCamera();

  const video = document.getElementById('video_' + qid);
  const videoBox = document.getElementById('camVideoBox_' + qid);
  const btnStart = document.getElementById('btnStartCam_' + qid);
  const btnCapture = document.getElementById('btnCapture_' + qid);
  const btnRetake = document.getElementById('btnRetake_' + qid);
  const previewBox = document.getElementById('camPreviewBox_' + qid);
  const statusBadge = document.getElementById('camStatus_' + qid);

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } },
      audio: false
    });
    ExamState.activeCameraStream = stream;
    activeQuestionCamId = qid;

    if (video) {
      video.srcObject = stream;
      await video.play();
    }
    if (videoBox) videoBox.style.display = 'block';
    if (btnStart) btnStart.style.display = 'none';
    if (btnCapture) btnCapture.style.display = 'inline-flex';
    if (btnRetake) btnRetake.style.display = 'none';
    if (previewBox) previewBox.style.display = 'none';
    if (statusBadge) statusBadge.textContent = '📹 相機預覽中...';
  } catch (err) {
    console.warn('開啟題目相機失敗：', err);
    alert('⚠️ 無法開啟相機，請檢查瀏覽器相機權限！');
  }
}

function stopQuestionCamera() {
  if (ExamState.activeCameraStream) {
    ExamState.activeCameraStream.getTracks().forEach(t => t.stop());
    ExamState.activeCameraStream = null;
  }
  if (activeQuestionCamId) {
    const videoBox = document.getElementById('camVideoBox_' + activeQuestionCamId);
    const btnCapture = document.getElementById('btnCapture_' + activeQuestionCamId);
    if (videoBox) videoBox.style.display = 'none';
    if (btnCapture) btnCapture.style.display = 'none';
    activeQuestionCamId = null;
  }
}

function captureQuestionPhoto(qid) {
  const video = document.getElementById('video_' + qid);
  const preview = document.getElementById('imgPreview_' + qid);
  const previewBox = document.getElementById('camPreviewBox_' + qid);
  const btnRetake = document.getElementById('btnRetake_' + qid);
  const statusBadge = document.getElementById('camStatus_' + qid);

  if (!video) return;

  // 離屏 Canvas 壓縮
  const canvas = document.createElement('canvas');
  const MAX_DIM = 1200;
  let w = video.videoWidth || 1200;
  let h = video.videoHeight || 900;

  if (w > MAX_DIM || h > MAX_DIM) {
    if (w >= h) {
      h = Math.round((h * MAX_DIM) / w);
      w = MAX_DIM;
    } else {
      w = Math.round((w * MAX_DIM) / h);
      h = MAX_DIM;
    }
  }

  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, w, h);

  // JPEG 0.7 壓縮
  const dataUrl = canvas.toDataURL('image/jpeg', 0.7);

  // 存入 ExamState (同時儲存小寫 q20 與大寫 Q20 確保跨模組 100% 相容)
  if (!ExamState.questionPhotos) ExamState.questionPhotos = {};
  ExamState.questionPhotos[qid.toLowerCase()] = dataUrl;
  ExamState.questionPhotos[qid.toUpperCase()] = dataUrl;
  ExamState.currentCompressedBase64 = dataUrl; // 向後相容

  stopQuestionCamera();

  if (preview) preview.src = dataUrl;
  if (previewBox) previewBox.style.display = 'block';
  if (btnRetake) btnRetake.style.display = 'inline-flex';
  if (statusBadge) statusBadge.textContent = '✅ 已拍照就緒';

  saveExamState();
}

function retakeQuestionPhoto(qid) {
  if (ExamState.questionPhotos) {
    delete ExamState.questionPhotos[qid.toLowerCase()];
    delete ExamState.questionPhotos[qid.toUpperCase()];
  }
  saveExamState();
  startQuestionCamera(qid);
}

// ==========================================
// 6. 客觀題評分與作答資料收集
// ==========================================
function gradeObjectiveQuestions() {
  let score = 0;
  const details = {};

  // Part 1: Q1~Q6 (每題 2 分，共 12 分)
  for (let i = 1; i <= 6; i++) {
    const qid = 'q' + i;
    const selected = document.querySelector('input[name="' + qid + '"]:checked');
    const ans = selected ? selected.value : null;
    const isCorrect = (ans === ANSWER_KEY[qid]);
    if (isCorrect) score += 2;
    details[qid] = { answer: ans, official: ANSWER_KEY[qid], correct: isCorrect, pts: isCorrect ? 2 : 0 };
  }

  // Part 2: Q7~Q11 (每題 2 分，共 10 分)
  for (let i = 7; i <= 11; i++) {
    const qid = 'q' + i;
    const selected = document.querySelector('input[name="' + qid + '"]:checked');
    const ans = selected ? selected.value : null;
    const isCorrect = (ans === ANSWER_KEY[qid]);
    if (isCorrect) score += 2;
    details[qid] = { answer: ans, official: ANSWER_KEY[qid], correct: isCorrect, pts: isCorrect ? 2 : 0 };
  }

  return {
    score: score,
    maxScore: 22,
    details: details
  };
}

function collectAllInputAnswers() {
  const answers = {};

  // Part 1 & Part 2
  for (let i = 1; i <= 11; i++) {
    const checked = document.querySelector('input[name="q' + i + '"]:checked');
    answers['q' + i] = checked ? checked.value : '';
  }

  // Part 3
  const part3Inputs = document.querySelectorAll('#sectionPart3 input.blank-input');
  part3Inputs.forEach(inp => {
    answers[inp.name] = inp.value.trim();
  });

  // Part 5
  const part5Inputs = document.querySelectorAll('#sectionPart5 input.blank-input');
  part5Inputs.forEach(inp => {
    answers[inp.name] = inp.value.trim();
  });

  return answers;
}

// ==========================================
// 7. 離線 LocalStorage 自動存取恢復
// ==========================================
function saveExamState() {
  if (!ExamState.currentStudent || !ExamState.isExamStarted) return;

  const stateData = {
    student: ExamState.currentStudent,
    phase: ExamState.phase,
    timeLeft: ExamState.timeLeft,
    isLocked: ExamState.isLocked,
    pendingSubmission: !!ExamState.pendingSubmission,
    answers: collectAllInputAnswers(),
    questionPhotos: ExamState.questionPhotos || {},
    uploadedPhotoUrls: ExamState.uploadedPhotoUrls || {},
    capturedImage: ExamState.currentCompressedBase64,
    uploadedFileUrl: ExamState.uploadedFileUrl,
    timestamp: Date.now()
  };

  try {
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(stateData));
    updateAutosaveBadge(new Date());
  } catch (err) {
    console.warn('LocalStorage 存檔失敗：', err);
  }
}

function restoreExamState() {
  try {
    const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (!data || !data.student) return false;

    ExamState.currentStudent = data.student;
    ExamState.isAuthenticated = true;
    ExamState.phase = data.phase || 1;
    ExamState.timeLeft = (typeof data.timeLeft === 'number') ? data.timeLeft : CONFIG.TOTAL_SECONDS;
    ExamState.isLocked = !!data.isLocked;
    ExamState.pendingSubmission = !!data.pendingSubmission;
    ExamState.questionPhotos = data.questionPhotos || {};
    ExamState.uploadedPhotoUrls = data.uploadedPhotoUrls || {};
    ExamState.currentCompressedBase64 = data.capturedImage || '';
    ExamState.uploadedFileUrl = data.uploadedFileUrl || '';

    proceedToPreExamConfirm(data.student);

    if (data.answers) {
      Object.keys(data.answers).forEach(k => {
        const val = data.answers[k];
        if (k.startsWith('q') && parseInt(k.substring(1), 10) <= 11) {
          const radio = document.querySelector('input[name="' + k + '"][value="' + val + '"]');
          if (radio) radio.checked = true;
        } else {
          const inp = document.querySelector('input[name="' + k + '"]') || document.getElementById(k);
          if (inp) inp.value = val;
        }
      });
    }

    // 恢復照片預覽
    if (ExamState.questionPhotos) {
      Object.keys(ExamState.questionPhotos).forEach(qid => {
        const photoUrl = ExamState.questionPhotos[qid];
        const preview = document.getElementById('imgPreview_' + qid);
        const previewBox = document.getElementById('camPreviewBox_' + qid);
        const btnStart = document.getElementById('btnStartCam_' + qid);
        const btnRetake = document.getElementById('btnRetake_' + qid);
        const statusBadge = document.getElementById('camStatus_' + qid);

        if (preview) preview.src = photoUrl;
        if (previewBox) previewBox.style.display = 'block';
        if (btnStart) btnStart.style.display = 'none';
        if (btnRetake) btnRetake.style.display = 'inline-flex';
        if (statusBadge) statusBadge.textContent = '✅ 已拍照就緒';
      });
    }

    if (ExamState.isLocked) {
      lockObjectiveQuestions();
    }

    return true;
  } catch (err) {
    console.warn('LocalStorage 讀檔恢復失敗：', err);
    return false;
  }
}

function clearExamState() {
  try {
    localStorage.removeItem(CONFIG.STORAGE_KEY);
  } catch (e) {}
}

function updateAutosaveBadge(date) {
  const badge = document.getElementById('autosaveBadge');
  if (!badge) return;
  const timeStr = String(date.getHours()).padStart(2, '0') + ':' +
                  String(date.getMinutes()).padStart(2, '0') + ':' +
                  String(date.getSeconds()).padStart(2, '0');
  badge.textContent = '💾 離線自動存檔於 ' + timeStr;
}

// ==========================================
// 8. 網絡心跳探測與斷網重試
// ==========================================
var networkRetryInterval = null;
var networkRetryCountdown = 60;
function getNetworkRetryCountdown() { return networkRetryCountdown; }
function setNetworkRetryCountdown(v) { networkRetryCountdown = v; }
function getNetworkRetryInterval() { return networkRetryInterval; }
function setNetworkRetryInterval(v) { networkRetryInterval = v; }

function initNetworkHeartbeat() {
  updateNetworkStatus(navigator.onLine);
  window.addEventListener('online', () => { 
    onNetworkRestored();
  });
  window.addEventListener('offline', () => { 
    updateNetworkStatus(false); 
    showNetworkRetryBanner(); 
  });

  // 定期探測心跳（每 30 秒）
  setInterval(async () => {
    if (!navigator.onLine) {
      updateNetworkStatus(false);
      showNetworkRetryBanner();
      return;
    }
    try {
      const probeUrl = CONFIG.MODE === 'production' ? 'https://www.google.com/generate_204' : CONFIG.GAS_URL;
      const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const tid = ctrl ? setTimeout(() => ctrl.abort(), 5000) : null;
      await fetch(probeUrl, {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-store',
        signal: ctrl ? ctrl.signal : undefined
      });
      if (tid) clearTimeout(tid);

      updateNetworkStatus(true);
      hideNetworkRetryBanner();
      if (ExamState.pendingSubmission) {
        onNetworkRestored();
      }
    } catch (e) {
      updateNetworkStatus(false);
      showNetworkRetryBanner();
    }
  }, 30000);
}

function updateNetworkStatus(isOnline) {
  const statusEl = document.getElementById('heartbeatStatus');
  if (!statusEl) return;
  if (isOnline) {
    statusEl.className = 'heartbeat-status online';
    statusEl.innerHTML = '<span class="heartbeat-dot"></span> 🟢 網絡連通正常';
  } else {
    statusEl.className = 'heartbeat-status offline';
    statusEl.innerHTML = '<span class="heartbeat-dot"></span> 🔴 網絡已斷開，已進入離線保護模式';
  }
}

function showNetworkRetryBanner() {
  const banner = document.getElementById('networkRetryBanner');
  if (!banner) return;
  banner.classList.add('visible');
  // 核心修復：若已有 60s 重試定時器在跑，切勿被 30s 心跳探測反覆重置秒數，防止死循環
  if (!networkRetryInterval) {
    startNetworkRetryCountdown();
  }
}

function hideNetworkRetryBanner() {
  const banner = document.getElementById('networkRetryBanner');
  if (banner) banner.classList.remove('visible');
  if (networkRetryInterval) {
    clearInterval(networkRetryInterval);
    networkRetryInterval = null;
  }
}

function startNetworkRetryCountdown() {
  if (networkRetryInterval) clearInterval(networkRetryInterval);
  networkRetryCountdown = 60;
  updateNetworkBannerCountdownUI();

  networkRetryInterval = setInterval(async () => {
    networkRetryCountdown--;
    updateNetworkBannerCountdownUI();
    if (networkRetryCountdown <= 0) {
      clearInterval(networkRetryInterval);
      networkRetryInterval = null;
      // 1 分鐘倒數結束，自動排程重新探測連線
      await retryNetworkConnectionNow();
    }
  }, 1000);
}

function updateNetworkBannerCountdownUI() {
  const banner = document.getElementById('networkRetryBanner');
  if (!banner) return;
  const btn = document.getElementById('btnRetrySubmit');
  const span = (banner && typeof banner.querySelector === 'function') ? banner.querySelector('span') : null;
  if (span) {
    span.innerHTML = `作答數據已保存在本機。系統已安排 <strong>1 分鐘</strong> 後自動重新連線（倒數 <strong>${networkRetryCountdown}</strong> 秒）`;
  }
  if (btn) {
    btn.innerHTML = `🔄 立即重試連線 (${networkRetryCountdown}s)`;
  }
}

function handleNetworkRetryClick() {
  if (ExamState.pendingSubmission) {
    submitExam(true);
  } else {
    retryNetworkConnectionNow();
  }
}

async function retryNetworkConnectionNow() {
  const btn = document.getElementById('btnRetrySubmit');
  if (btn) btn.textContent = '🔄 探測連線中...';

  if (navigator.onLine) {
    try {
      const probeUrl = CONFIG.MODE === 'production' ? 'https://www.google.com/generate_204' : CONFIG.GAS_URL;
      const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const tid = ctrl ? setTimeout(() => ctrl.abort(), 5000) : null;
      await fetch(probeUrl, {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-store',
        signal: ctrl ? ctrl.signal : undefined
      });
      if (tid) clearTimeout(tid);

      onNetworkRestored();
      return;
    } catch (e) {}
  }
  startNetworkRetryCountdown();
}

function onNetworkRestored() {
  updateNetworkStatus(true);
  hideNetworkRetryBanner();

  // 斷網重連動態同步：若斷線期間有未完成之交卷請求，自動重試提交
  if (ExamState.pendingSubmission) {
    showStatus('🌐 網絡已恢復連線！系統正在為您自動補交試卷...', 'info');
    submitExam(true);
  }
}

// ==========================================
// 9. 雲端提交管道 (GAS 圖床 -> Google Form 表單)
// ==========================================
async function submitExam(isAuto) {
  if (ExamState.isSubmitting) return;

  const statusBox = document.getElementById('statusBox');
  const submitBtn = document.getElementById('submitBtn');

  if (!isAuto) {
    const confirmed = confirm('確定要正式提交大測試卷嗎？提交後將無法修改！');
    if (!confirmed) return;
  }

  ExamState.isSubmitting = true;
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ 正在提交試卷中...';
  }

  showStatus('正在核算客觀題分數並準備上傳解答...', 'info');

  const gradeResult = gradeObjectiveQuestions();
  const allAnswers = collectAllInputAnswers();
  const student = ExamState.currentStudent || { classID: '4C', studentID: 1, name: '未登記' };

  try {
    // -------------------------------------------------------------
    // 步驟 1：逐題上傳解答相片至 Google Drive (GAS Webhook)
    // -------------------------------------------------------------
    const qids = ['q20', 'q21', 'q22', 'q23'];
    const photoUrls = [];

    for (const qid of qids) {
      const photoData = ExamState.questionPhotos ? ExamState.questionPhotos[qid] : null;
      if (photoData) {
        showStatus('正在上傳第 ' + qid.toUpperCase() + ' 題手寫解答相片至 Google Drive...', 'info');

        const gasPayload = {
          studentId: student.classID + String(student.studentID).padStart(2, '0'),
          studentName: student.name,
          classId: student.classID,
          questionId: qid.toUpperCase(),
          fillInAnswer: JSON.stringify(allAnswers),
          imageBase64: photoData
        };

        const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
        const tid = ctrl ? setTimeout(() => ctrl.abort(), 15000) : null;
        const gasRes = await fetch(CONFIG.GAS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(gasPayload),
          signal: ctrl ? ctrl.signal : undefined
        });
        if (tid) clearTimeout(tid);

        if (gasRes.ok) {
          const gasData = await gasRes.json();
          const uploadedUrl = gasData.fileUrl || gasData.url || (gasData.data && gasData.data.fileUrl);
          if (uploadedUrl) {
            if (!ExamState.uploadedPhotoUrls) ExamState.uploadedPhotoUrls = {};
            ExamState.uploadedPhotoUrls[qid] = uploadedUrl;
            photoUrls.push(qid.toUpperCase() + ': ' + uploadedUrl);
          }
        }
      }
    }

    const aggregatedPhotoUrl = photoUrls.length > 0 
      ? photoUrls.join(' ; ') 
      : (ExamState.uploadedFileUrl || '無照片上傳');
    ExamState.uploadedFileUrl = aggregatedPhotoUrl;

    // -------------------------------------------------------------
    // 步驟 2：送交 Google 表單與遠端存檔
    // -------------------------------------------------------------
    showStatus('正在將測驗記錄與客觀題分數提交至後台 (步驟 2/2)...', 'info');

    const formParams = new URLSearchParams();
    formParams.append(CONFIG.FORM_ENTRIES.classId, student.classID);
    formParams.append(CONFIG.FORM_ENTRIES.studentId, String(student.studentID));
    
    const examSummary = {
      test: 'ADVANCE_TEST_OCT10',
      objScore: gradeResult.score,
      maxScore: 22,
      answers: allAnswers,
      photos: ExamState.uploadedPhotoUrls || {},
      aggregatedPhotoUrl: aggregatedPhotoUrl
    };
    formParams.append(CONFIG.FORM_ENTRIES.dateID, 'ADVANCE_EXAM::' + JSON.stringify(examSummary));
    formParams.append(CONFIG.FORM_ENTRIES.score, String(gradeResult.score));

    const ctrlForm = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const tidForm = ctrlForm ? setTimeout(() => ctrlForm.abort(), 10000) : null;
    await fetch(CONFIG.FORM_URL, {
      method: 'POST',
      mode: CONFIG.MODE === 'production' ? 'no-cors' : 'cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formParams.toString(),
      signal: ctrlForm ? ctrlForm.signal : undefined
    });
    if (tidForm) clearTimeout(tidForm);

    // 統一規範化手寫照片與雲端硬碟 URL (雙向注入大寫 Q20 與小寫 q20 鍵值)
    const normalizedPhotos = {};
    if (ExamState.questionPhotos) {
      Object.keys(ExamState.questionPhotos).forEach(k => {
        normalizedPhotos[k.toLowerCase()] = ExamState.questionPhotos[k];
        normalizedPhotos[k.toUpperCase()] = ExamState.questionPhotos[k];
      });
    }
    const normalizedDriveUrls = {};
    if (ExamState.uploadedPhotoUrls) {
      Object.keys(ExamState.uploadedPhotoUrls).forEach(k => {
        normalizedDriveUrls[k.toLowerCase()] = ExamState.uploadedPhotoUrls[k];
        normalizedDriveUrls[k.toUpperCase()] = ExamState.uploadedPhotoUrls[k];
      });
    }

    // 歸檔完整作答紀錄至本地 LocalStorage (供教師批改端即時調閱與持久儲存)
    const submissionRecord = {
      testTitle: '【2026年10月10日 Advance 數學大測 (一)】',
      testCategory: '2026-2027學年上學期 高一（理）數學大測卷(一)',
      dateID: 'ADVANCE_EXAM::' + student.classID + '_' + student.studentID + '_' + Date.now(),
      classID: student.classID,
      studentID: student.studentID,
      studentName: student.name,
      timestamp: Date.now(),
      objectiveScore: gradeResult.score,
      maxObjectiveScore: 22,
      objectiveDetails: gradeResult.details,
      answers: allAnswers,
      questionPhotos: normalizedPhotos,
      uploadedPhotoUrls: normalizedDriveUrls,
      aggregatedPhotoUrl: aggregatedPhotoUrl,
      status: 'submitted',
      isStudentSubmit: true
    };

    try {
      // 為每次交卷建立獨立唯一的提交記錄識別碼，保留歷史作答不被覆蓋
      submissionRecord.submissionId = 'sub_' + student.classID + '_' + student.studentID + '_' + submissionRecord.timestamp;
      localStorage.setItem('ADVANCE_LAST_SUBMISSION', JSON.stringify(submissionRecord));
      let archive = [];
      try {
        const rawArchive = localStorage.getItem('ADVANCE_SUBMISSION_ARCHIVE');
        if (rawArchive) archive = JSON.parse(rawArchive);
      } catch (e) {}
      if (!Array.isArray(archive)) archive = [];
      // 僅排除完全相同時間戳的重複觸發，完整保留該學生的多次交卷紀錄
      archive = archive.filter(item => String(item.timestamp) !== String(submissionRecord.timestamp));
      archive.unshift(submissionRecord);
      if (archive.length > 100) archive = archive.slice(0, 100);
      localStorage.setItem('ADVANCE_SUBMISSION_ARCHIVE', JSON.stringify(archive));
    } catch (archErr) {
      console.warn('LocalStorage 歸檔試卷失敗：', archErr);
    }

    ExamState.isSubmitting = false;
    ExamState.pendingSubmission = false;
    clearExamState();

    showStatus('🎉 大測交卷成功！客觀題得分：' + gradeResult.score + ' / 22 分。手寫照片與作答紀錄已安全歸檔！', 'success');
    if (submitBtn) {
      submitBtn.textContent = '✅ 已成功交卷';
      submitBtn.disabled = true;
    }

    // 渲染交卷後跳轉導航按鈕
    const sBox = document.getElementById('statusBox');
    if (sBox && !document.getElementById('postSubmitLinks')) {
      const linksContainer = document.createElement('div');
      linksContainer.id = 'postSubmitLinks';
      linksContainer.style.cssText = 'margin-top: 14px; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;';
      linksContainer.innerHTML = '<a href="advance_student_result.html" target="_blank" style="display:inline-flex; align-items:center; gap:6px; padding:10px 18px; background:#0284c7; color:white; border-radius:6px; text-decoration:none; font-weight:700; font-size:14px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">📊 前往學生查閱成績單 ↗</a><a href="advance_grading_dashboard.html" target="_blank" style="display:inline-flex; align-items:center; gap:6px; padding:10px 18px; background:#1e3a8a; color:white; border-radius:6px; text-decoration:none; font-weight:700; font-size:14px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">👩‍🏫 前往教師批改工作台 ↗</a>';
      if (sBox.parentNode) {
        sBox.parentNode.insertBefore(linksContainer, sBox.nextSibling);
      }
    }

    if (ExamState.timerInterval) clearInterval(ExamState.timerInterval);

  } catch (err) {
    console.error('交卷過程中斷：', err);
    ExamState.isSubmitting = false;
    ExamState.pendingSubmission = true;
    saveExamState();
    showStatus('⚠️ 網絡連線中斷或伺服器回應異常，作答進度與照片已完整保存在本機，系統已排程自動重試，您亦可手動重試！', 'error');
    showNetworkRetryBanner();
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = '🔄 重新提交 / 重試交卷';
    }
  }
}

function showStatus(msg, type) {
  const box = document.getElementById('statusBox');
  if (!box) return;
  box.textContent = msg;
  box.className = 'status-box ' + type;
}

function insertSymbol(sym) {
  const activeEl = document.activeElement;
  if (activeEl && activeEl.classList && activeEl.classList.contains('blank-input')) {
    const start = activeEl.selectionStart || activeEl.value.length;
    const end = activeEl.selectionEnd || activeEl.value.length;
    activeEl.value = activeEl.value.substring(0, start) + sym + activeEl.value.substring(end);
    activeEl.selectionStart = activeEl.selectionEnd = start + sym.length;
    activeEl.focus();
    saveExamState();
  }
}

function bindAutoSaveListeners() {
  if (typeof document === 'undefined' || typeof document.addEventListener !== 'function') return;
  document.addEventListener('change', function(e) {
    if (e.target && e.target.matches('input')) {
      saveExamState();
    }
  });
  document.addEventListener('input', function(e) {
    if (e.target && e.target.matches('input.blank-input')) {
      saveExamState();
    }
  });
}

// 頁面啟動初始化
if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
  window.addEventListener('DOMContentLoaded', async function() {
    initNetworkHeartbeat();
    bindAutoSaveListeners();

    // 初始化 FaceApi 深度學習模型 (非同步預載入)
    if (window.FaceAuthModule && window.FaceAuthModule.initFaceApi) {
      window.FaceAuthModule.initFaceApi().catch(err => {
        console.warn('[FaceAuth] 模型非同步預載入提示：', err);
      });
    }

    const restored = restoreExamState();
    if (!restored) {
      const authScreen = document.getElementById('authScreen');
      if (authScreen) authScreen.style.display = 'block';

      // R1: 進入測驗系統時，自動啟動相機進行活體人臉檢測 (除非設定不自動啟動參數)
      const urlParams = (typeof URLSearchParams !== 'undefined' && window.location) 
        ? new URLSearchParams(window.location.search) 
        : null;
      const disableAutoCam = urlParams && urlParams.get('test_disable_autocamera') === '1';

      if (!disableAutoCam) {
        startFaceFirstCamera(true);
      }
    }
  });
}
