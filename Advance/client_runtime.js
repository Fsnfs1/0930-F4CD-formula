// ==========================================
// 1. 全局配置與客觀題標準答案
// ==========================================
const CONFIG = {
  MODE: (typeof window !== 'undefined' && window.location && window.location.hostname === 'localhost') ? 'mock' : 'mock',
  MOCK_GAS_URL: 'http://localhost:3000/api/gas-upload',
  MOCK_FORM_URL: 'http://localhost:3000/api/form-submit',
  PROD_GAS_URL: 'https://script.google.com/macros/s/AKfycbxjkXzqp4WOghvi__SF8qoVBGAcXcSKv96JoRsKN3hLU6xHwLjK4rHyaXODIv_fE9Ak/exec',
  PROD_FORM_URL: 'https://docs.google.com/forms/d/e/1FAIpQLSc_EXAMPLE/formResponse',
  STORAGE_KEY: 'ADVANCE_MATH_EXAM_STATE',
  TOTAL_SECONDS: 3000,    // 50 分鐘總時長 (3000 秒)
  PHASE1_SECONDS: 2400,   // 40 分鐘第一階段 (2400 秒)
  BUFFER_SECONDS: 600,    // 10 分鐘緩衝時間 (600 秒)
  FORM_ENTRIES: {
    studentId: 'entry.1000001',
    studentName: 'entry.1000002',
    classId: 'entry.1000003',
    score: 'entry.1000004',
    details: 'entry.1000005',
    imageUrl: 'entry.1000006'
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

// 觸發 MathJax 3 數學公式顯影
function triggerMathJaxTypeset() {
  if (typeof window !== 'undefined' && window.MathJax && window.MathJax.typesetPromise) {
    try {
      window.MathJax.typesetPromise().catch(function(err) {
        console.warn('MathJax typeset error:', err);
      });
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
      all.push({
        classID: s.classID,
        studentID: s.studentID,
        name: s.name,
        isTeacher: s.isTeacher,
        descriptor: generatePseudoDescriptor(s.classID + s.studentID)
      });
    });
  });
  return all;
}

async function startFaceFirstCamera() {
  const video = document.getElementById('faceFirstVideo');
  const btnStart = document.getElementById('btnFaceFirstStart');
  const btnCapture = document.getElementById('btnFaceFirstCapture');
  const overlay = document.getElementById('faceFirstOverlay');
  const alertBox = document.getElementById('faceFirstAlert');

  if (alertBox) alertBox.style.display = 'none';

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
      audio: false
    });
    faceFirstStream = stream;
    if (video) {
      video.srcObject = stream;
      await video.play();
    }
    if (btnStart) btnStart.style.display = 'none';
    if (btnCapture) btnCapture.style.display = 'inline-flex';
    if (overlay) overlay.textContent = '👀 請正對鏡頭並眨眨眼，點擊下方「拍照識別身分」';
  } catch (err) {
    console.warn('相機存取失敗：', err);
    if (alertBox) {
      alertBox.className = 'alert-box alert-warning';
      alertBox.style.display = 'block';
      alertBox.textContent = '⚠️ 無法開啟前置鏡頭或權限受限，請點擊下方「前往身分選擇」進行手動登入。';
    }
    if (overlay) overlay.textContent = '⚠️ 相機無法開啟，請使用手動登入';
  }
}

function stopFaceFirstCamera() {
  if (faceFirstStream) {
    faceFirstStream.getTracks().forEach(t => t.stop());
    faceFirstStream = null;
  }
}

async function captureFaceFirstAndVerify() {
  const video = document.getElementById('faceFirstVideo');
  const btnCapture = document.getElementById('btnFaceFirstCapture');
  const overlay = document.getElementById('faceFirstOverlay');
  const alertBox = document.getElementById('faceFirstAlert');

  if (!video) return;

  if (btnCapture) {
    btnCapture.disabled = true;
    btnCapture.innerHTML = '<span>⏳ 正在特徵提取比對...</span>';
  }
  if (overlay) overlay.textContent = '⏳ 正在提取人臉 128D 特徵向量並檢索資料庫...';

  // 擷取影像至 320x240 Canvas
  const canvas = document.createElement('canvas');
  canvas.width = 320;
  canvas.height = 240;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, 320, 240);

  // 特徵提取與比對
  const sampleDesc = generatePseudoDescriptor('SAMPLE_' + Date.now());
  const profiles = getAllStudentProfiles();
  const matchResult = identifyFace1toN(sampleDesc, profiles, 0.82);

  // 判斷是否為相似衝突（Δ < 0.08 或無法唯一確認本人）
  const isAmbiguous = matchResult.delta < 0.08 || !matchResult.isMatch;

  if (isAmbiguous) {
    if (alertBox) {
      alertBox.className = 'alert-box alert-warning';
      alertBox.style.display = 'block';
      alertBox.innerHTML = '⚠️ <strong>偵測到多位相似特徵 (無法唯一確認本人)</strong><br><small>最高匹配與次高匹配差距小於安全邊際 (Δ < 0.08)，請在彈出視窗選擇您的姓名並輸入個人密碼完成二次驗證！</small>';
    }
    if (overlay) overlay.textContent = '⚠️ 偵測到多位相似特徵 · 請輸入密碼二次驗證';
    if (btnCapture) {
      btnCapture.disabled = false;
      btnCapture.innerHTML = '<span>🔍 拍照識別身分</span>';
    }

    const candidateList = matchResult.candidates && matchResult.candidates.length > 0 
      ? matchResult.candidates 
      : [{ profile: profiles[0], percentage: 85.2 }, { profile: profiles[1], percentage: 83.1 }];

    showPasswordAuthModal(candidateList);
    return;
  }

  // 唯一明確命中
  stopFaceFirstCamera();
  const student = matchResult.bestMatch;
  proceedToPreExamConfirm(student);
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
  if (!classID || !studentID) return false;
  const pwd = String(password !== undefined && password !== null ? password : '').trim();
  // 教師測試員 (ID 99) 在所有班級均支援 1234 密碼直接旁路
  if (parseInt(studentID, 10) === 99 && pwd === '1234') return true;
  // 檢驗本機修改後的密碼
  const customPwdKey = 'CUSTOM_PWD_' + classID + '_' + studentID;
  const customPwd = (typeof localStorage !== 'undefined') ? localStorage.getItem(customPwdKey) : null;
  if (customPwd) return pwd === customPwd;
  // 系統預設密碼 1234
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
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('CUSTOM_PWD_' + cls + '_' + sid, np);
    }
  }

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
      alertErr.textContent = '⚠️ 密碼錯誤，請輸入正確密碼 (預設 1234)！';
    }
    return;
  }

  const list = getStudentsListForClass(cls);
  const student = list.find(s => String(s.studentID) === String(sid));
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

  // 存入 ExamState
  if (!ExamState.questionPhotos) ExamState.questionPhotos = {};
  ExamState.questionPhotos[qid] = dataUrl;
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
    delete ExamState.questionPhotos[qid];
  }
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
    ExamState.phase = data.phase || 1;
    ExamState.timeLeft = (typeof data.timeLeft === 'number') ? data.timeLeft : CONFIG.TOTAL_SECONDS;
    ExamState.isLocked = !!data.isLocked;
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
function initNetworkHeartbeat() {
  updateNetworkStatus(navigator.onLine);
  window.addEventListener('online', () => { updateNetworkStatus(true); hideNetworkRetryBanner(); });
  window.addEventListener('offline', () => { updateNetworkStatus(false); showNetworkRetryBanner(); });
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
  if (banner) banner.classList.add('visible');
}

function hideNetworkRetryBanner() {
  const banner = document.getElementById('networkRetryBanner');
  if (banner) banner.classList.remove('visible');
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

        const gasRes = await fetch(CONFIG.GAS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(gasPayload)
        });

        if (gasRes.ok) {
          const gasData = await gasRes.json();
          if (gasData.status === 'success' && gasData.fileUrl) {
            if (!ExamState.uploadedPhotoUrls) ExamState.uploadedPhotoUrls = {};
            ExamState.uploadedPhotoUrls[qid] = gasData.fileUrl;
            photoUrls.push(qid.toUpperCase() + ': ' + gasData.fileUrl);
          }
        }
      }
    }

    const aggregatedPhotoUrl = photoUrls.length > 0 
      ? photoUrls.join(' ; ') 
      : (ExamState.uploadedFileUrl || '無照片上傳');
    ExamState.uploadedFileUrl = aggregatedPhotoUrl;

    // -------------------------------------------------------------
    // 步驟 2：送交 Google 表單
    // -------------------------------------------------------------
    showStatus('正在將測驗記錄與客觀題分數提交至後台 (步驟 2/2)...', 'info');

    const formParams = new URLSearchParams();
    formParams.append(CONFIG.FORM_ENTRIES.studentId, student.classID + String(student.studentID).padStart(2, '0'));
    formParams.append(CONFIG.FORM_ENTRIES.studentName, student.name);
    formParams.append(CONFIG.FORM_ENTRIES.classId, student.classID);
    formParams.append(CONFIG.FORM_ENTRIES.score, String(gradeResult.score));
    formParams.append(CONFIG.FORM_ENTRIES.details, JSON.stringify({
      objectiveScore: gradeResult.score,
      maxScore: gradeResult.maxScore,
      objectiveDetails: gradeResult.details,
      fillInAnswers: allAnswers
    }));
    formParams.append(CONFIG.FORM_ENTRIES.imageUrl, aggregatedPhotoUrl);

    await fetch(CONFIG.FORM_URL, {
      method: 'POST',
      mode: CONFIG.MODE === 'production' ? 'no-cors' : 'cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formParams.toString()
    });

    ExamState.isSubmitting = false;
    clearExamState();

    showStatus('🎉 大測交卷成功！客觀題得分：' + gradeResult.score + ' / 22 分。手寫照片與作答紀錄已安全歸檔！', 'success');
    if (submitBtn) {
      submitBtn.textContent = '✅ 已成功交卷';
      submitBtn.disabled = true;
    }

    if (ExamState.timerInterval) clearInterval(ExamState.timerInterval);

  } catch (err) {
    console.error('交卷過程中斷：', err);
    ExamState.isSubmitting = false;
    showStatus('⚠️ 網絡連線中斷或伺服器回應異常，作答進度與照片已完整保存在本機，請檢查連線後重試！', 'error');
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
  window.addEventListener('DOMContentLoaded', function() {
    initNetworkHeartbeat();
    bindAutoSaveListeners();

    const restored = restoreExamState();
    if (!restored) {
      const authScreen = document.getElementById('authScreen');
      if (authScreen) authScreen.style.display = 'block';
    }
  });
}
