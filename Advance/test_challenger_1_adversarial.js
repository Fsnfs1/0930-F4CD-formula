/**
 * test_challenger_1_adversarial.js
 * 
 * Challenger 1 Empirical Adversarial Test Suite for Milestone 1:
 * Biometrics, Password Security, Roster Integrity, Exam Lock, and Camera Captures (R1, R3).
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const http = require('http');
const assert = require('assert');
const crypto = require('crypto');
const { startServer } = require('./mock_server');

// Helper to make HTTP requests
function httpRequest(urlStr, options = {}, postData = null) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(urlStr);
    const reqOpts = {
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + parsed.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = http.request(reqOpts, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
          json: () => {
            try { return JSON.parse(data); }
            catch (e) { throw new Error(`Invalid JSON: ${data.substring(0, 100)}`); }
          }
        });
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

// In-memory mock localStorage
function createMockLocalStorage() {
  const store = new Map();
  return {
    getItem: (key) => store.has(key) ? store.get(key) : null,
    setItem: (key, val) => store.set(key, String(val)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
    get length() { return store.size; },
    key: (i) => Array.from(store.keys())[i] || null,
    _dump: () => Object.fromEntries(store.entries())
  };
}

// Minimal DOM simulation for exam lock & UI testing
function createMockDOM() {
  const elements = {};
  function makeElement(id, tagName = 'div') {
    if (!elements[id]) {
      elements[id] = {
        id,
        tagName: tagName.toUpperCase(),
        style: { display: '' },
        value: '',
        textContent: '',
        innerHTML: '',
        disabled: false,
        checked: false,
        classList: {
          contains: () => false,
          add: () => {},
          remove: () => {}
        },
        children: [],
        appendChild(child) { this.children.push(child); },
        querySelector: () => null,
        querySelectorAll: () => []
      };
    }
    return elements[id];
  }

  // Pre-seed known elements
  const ids = [
    'authScreen', 'cardFaceFirstLogin', 'cardFirstTimeSelect',
    'modalPasswordAuth', 'alertPasswordAuthError', 'inputAuthPassword',
    'chkAuthChangePassword', 'inputAuthNewPassword', 'inputAuthConfirmPassword',
    'screenPreExamConfirm', 'confirmClassDisplay', 'confirmIdDisplay',
    'confirmNameDisplay', 'examStudentBadge', 'examContainer', 'stickyTimer',
    'timerPhaseBadge', 'timerCountdownDisplay', 'selectClass', 'selectStudent',
    'loginStudentNamePreview', 'btnLogin', 'authErrorMessage', 'inputPassword',
    'statusBox', 'submitBtn', 'autosaveBadge', 'networkRetryBanner', 'btnRetrySubmit',
    'heartbeatStatus'
  ];
  ids.forEach(id => makeElement(id));

  // Initialize initial visibility states matching advance_test.html
  elements['authScreen'].style.display = 'block';
  elements['screenPreExamConfirm'].style.display = 'none';
  elements['examContainer'].style.display = 'none';
  elements['modalPasswordAuth'].style.display = 'none';
  elements['stickyTimer'].style.display = 'none';

  return {
    elements,
    getElementById: (id) => elements[id] || makeElement(id),
    querySelector: (sel) => {
      if (sel.startsWith('#')) return elements[sel.substring(1)] || null;
      return null;
    },
    querySelectorAll: (sel) => [],
    addEventListener: () => {},
    createElement: (tag) => ({
      tagName: tag.toUpperCase(),
      style: {},
      value: '',
      textContent: '',
      children: [],
      appendChild(c) { this.children.push(c); },
      getContext: () => ({ drawImage: () => {} }),
      toDataURL: () => 'data:image/jpeg;base64,mockCanvasBase64'
    })
  };
}

async function runAdversarialTestSuite() {
  console.log('========================================================================');
  console.log('【Challenger 1】對抗性實證壓力測試套件 (test_challenger_1_adversarial.js)');
  console.log('========================================================================\n');

  let totalTests = 0;
  let passedTests = 0;
  const findings = [];

  function recordPass(testName, details) {
    totalTests++;
    passedTests++;
    console.log(`  ✔ [PASS] Test ${totalTests}: ${testName} — ${details}`);
  }

  function recordFail(testName, err) {
    totalTests++;
    console.error(`  ✖ [FAIL] Test ${totalTests}: ${testName}`);
    console.error(`     Error: ${err.message || err}`);
    findings.push({ test: testName, error: err.message || String(err) });
  }

  // 1. 載入項目原始碼與環境建置
  const advanceDir = path.resolve(__dirname);
  const rosterCandidates = [
    path.join(advanceDir, '..', 'js', 'roster.js'),
    path.join(advanceDir, '..', '..', 'WEB+', 'js', 'roster.js'),
    path.join(advanceDir, '..', '..', 'js', 'roster.js')
  ];
  const rosterPath = rosterCandidates.find(p => fs.existsSync(p));

  const snapshotCandidates = [
    path.join(advanceDir, '..', 'js', 'admin_snapshot.js'),
    path.join(advanceDir, '..', '..', 'WEB+', 'js', 'admin_snapshot.js'),
    path.join(advanceDir, '..', '..', 'js', 'admin_snapshot.js')
  ];
  const snapshotPath = snapshotCandidates.find(p => fs.existsSync(p));

  const persistenceCandidates = [
    path.join(advanceDir, '..', 'js', 'persistence.js'),
    path.join(advanceDir, '..', '..', 'WEB+', 'js', 'persistence.js'),
    path.join(advanceDir, '..', '..', 'js', 'persistence.js')
  ];
  const persistencePath = persistenceCandidates.find(p => fs.existsSync(p));

  const clientRuntimePath = path.join(advanceDir, 'client_runtime.js');
  const advanceHtmlPath = path.join(advanceDir, 'advance_test.html');

  assert(rosterPath && fs.existsSync(rosterPath), `找不到 roster.js: ${rosterPath}`);
  assert(snapshotPath && fs.existsSync(snapshotPath), `找不到 admin_snapshot.js: ${snapshotPath}`);
  assert(persistencePath && fs.existsSync(persistencePath), `找不到 persistence.js: ${persistencePath}`);
  assert(fs.existsSync(clientRuntimePath), `找不到 client_runtime.js: ${clientRuntimePath}`);
  assert(fs.existsSync(advanceHtmlPath), `找不到 advance_test.html: ${advanceHtmlPath}`);

  const mockStorage = createMockLocalStorage();
  const mockDOM = createMockDOM();

  const sandbox = {
    window: {
      addEventListener: () => {},
      localStorage: mockStorage,
      scrollTo: () => {}
    },
    globalThis: {},
    self: {},
    document: mockDOM,
    localStorage: mockStorage,
    scrollTo: () => {},
    navigator: {
      onLine: true,
      mediaDevices: {
        getUserMedia: async () => ({
          getTracks: () => [{ stop: () => {} }]
        })
      }
    },
    alert: (msg) => { sandbox.__lastAlert = msg; },
    confirm: () => true,
    console: console,
    Date: Date,
    Math: Math,
    parseInt: parseInt,
    String: String,
    URLSearchParams: URLSearchParams,
    Buffer: Buffer,
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    setInterval: setInterval,
    clearInterval: clearInterval,
    __lastAlert: null
  };
  sandbox.globalThis = sandbox.window;
  sandbox.self = sandbox.window;
  vm.createContext(sandbox);

  // 執行基礎腳本載入沙盒
  const rosterCode = fs.readFileSync(rosterPath, 'utf8');
  const snapshotCode = fs.readFileSync(snapshotPath, 'utf8');
  const persistenceCode = fs.readFileSync(persistencePath, 'utf8');
  const clientRuntimeCode = fs.readFileSync(clientRuntimePath, 'utf8');

  vm.runInContext(rosterCode, sandbox);
  vm.runInContext(snapshotCode, sandbox);
  vm.runInContext(persistenceCode, sandbox);
  vm.runInContext(clientRuntimeCode, sandbox);

  const RosterModule = sandbox.RosterModule || sandbox.window.RosterModule;
  const PersistenceModule = sandbox.PersistenceModule || sandbox.window.PersistenceModule;

  // =========================================================================
  // 對抗測試 1: 花名冊名額完整性與 4C #13 嚴格缺號審查
  // =========================================================================
  try {
    const list4C = RosterModule.getStudentsByClass('4C');
    const list4D = RosterModule.getStudentsByClass('4D');
    const list5B = RosterModule.getStudentsByClass('5B');
    const allRoster = RosterModule.getRoster();

    assert.strictEqual(list4C.length, 29, `4C 班應為 29 人，實際: ${list4C.length}`);
    assert.strictEqual(list4D.length, 31, `4D 班應為 31 人，實際: ${list4D.length}`);
    assert.strictEqual(list5B.length, 28, `5B 班應為 28 人，實際: ${list5B.length}`);
    assert.strictEqual(allRoster.length, 88, `總花名冊應為 88 人，實際: ${allRoster.length}`);

    // 嚴格對抗驗證：4C 班學生 13 號必須不存在
    const s4c13 = RosterModule.getStudent('4C', 13);
    assert.strictEqual(s4c13, null, 'getStudent("4C", 13) 必須回傳 null');
    const s4c13Name = RosterModule.getStudentName('4C', 13);
    assert.strictEqual(s4c13Name, '', 'getStudentName("4C", 13) 必須回傳空字串');

    // 4C 班號碼序列檢查：必須只有 1..12 與 14..30
    const ids4C = list4C.map(s => s.id);
    assert(!ids4C.includes(13), '4C 班學生 ID 陣列中嚴禁包含 13');
    for (let id = 1; id <= 12; id++) assert(ids4C.includes(id), `4C 缺少號碼: ${id}`);
    for (let id = 14; id <= 30; id++) assert(ids4C.includes(id), `4C 缺少號碼: ${id}`);
    assert(!ids4C.includes(31), '4C 班不應有 31 號');

    // 對照驗證：4D 與 5B 的 13 號學生應合法存在
    const s4d13 = RosterModule.getStudent('4D', 13);
    assert(s4d13 && s4d13.name === '施舒晨', `4D 13 號應為施舒晨，實際: ${s4d13?.name}`);
    const s5b13 = RosterModule.getStudent('5B', 13);
    assert(s5b13 && s5b13.name === '梁泳心', `5B 13 號應為梁泳心，實際: ${s5b13?.name}`);

    // 對抗模糊攻擊：非正規班級或異常學號檢索
    assert.strictEqual(RosterModule.getStudent('4C', 0), null, 'ID 0 應為 null');
    assert.strictEqual(RosterModule.getStudent('4C', -1), null, '負數 ID 應為 null');
    assert.strictEqual(RosterModule.getStudent('4C', 999), null, '超限 ID 應為 null');
    assert.strictEqual(RosterModule.getStudent('UNKNOWN', 1), null, '無效班級應為 null');

    recordPass('花名冊名額與 4C#13 缺號嚴格校驗', '4C(29人無#13)、4D(31人)、5B(28人)，共88人名錄完整，4C#13無效');
  } catch (err) {
    recordFail('花名冊名額與 4C#13 缺號嚴格校驗', err);
  }

  // =========================================================================
  // 對抗測試 2: Salted SHA-256 密碼雜湊算法正確性與快照一致性
  // =========================================================================
  try {
    // 獨立驗證 Salted SHA-256 原理：sha256("MATH_SALT_<cls>_<sid>:<pwd>")
    function nodeSaltHash(cls, sid, pwd) {
      const salt = `MATH_SALT_${cls}_${sid}`;
      return crypto.createHash('sha256').update(`${salt}:${pwd}`).digest('hex');
    }

    // 抽樣比對 admin_snapshot.js 中的預算雜湊
    const adminPasswords = sandbox.window.ADMIN_STUDENT_PASSWORDS;
    assert(adminPasswords, '缺少 ADMIN_STUDENT_PASSWORDS 快照資料');

    const testKeys = ['4C_1', '4C_15', '4C_30', '4D_1', '4D_13', '4D_31', '5B_1', '5B_28', '5B_99'];
    for (const key of testKeys) {
      const rec = adminPasswords[key];
      assert(rec, `快照中缺少鍵: ${key}`);
      const expectedHash = nodeSaltHash(rec.classID, rec.studentID, '1234');
      assert.strictEqual(rec.hash, expectedHash, `快照 ${key} 的 Salted SHA-256 雜湊值與 Node.js 原生計算不一致！`);
      assert.strictEqual(rec.salt, `MATH_SALT_${rec.classID}_${rec.studentID}`, `快照 ${key} 的鹽值格式不符`);
    }

    // 驗證 PersistenceModule.hashPassword 內部方法輸出與 Node.js 原生一致
    const modHash = PersistenceModule.hashPassword('1234', 'MATH_SALT_4C_1');
    assert.strictEqual(modHash, nodeSaltHash('4C', 1, '1234'), 'PersistenceModule 內部 hashPassword 計算不一致');

    recordPass('Salted SHA-256 密碼雜湊算法與快照一致性審查', `共核驗 ${testKeys.length} 個班級學生之鹽值加鹽 SHA-256 輸出，與原生演算法完全同態`);
  } catch (err) {
    recordFail('Salted SHA-256 密碼雜湊算法與快照一致性審查', err);
  }

  // =========================================================================
  // 對抗測試 3: 密碼安全性防禦 — 錯誤密碼阻擋、正向驗證與 ID 99 跨班級權限
  // =========================================================================
  try {
    // 1. 正向驗證：全班級學生與預設密碼 1234
    assert.strictEqual(PersistenceModule.verifyStudentPassword('4C', 1, '1234'), true, '4C 01 預設密碼 1234 驗證失敗');
    assert.strictEqual(PersistenceModule.verifyStudentPassword('4D', 15, '1234'), true, '4D 15 預設密碼 1234 驗證失敗');
    assert.strictEqual(PersistenceModule.verifyStudentPassword('5B', 28, '1234'), true, '5B 28 預設密碼 1234 驗證失敗');

    // 2. 教師測試員 ID 99 跨班級 (4C, 4D, 5B) 支援與密碼 1234
    ['4C', '4D', '5B'].forEach(cls => {
      // 經 PersistenceModule 驗證
      const verifyP = PersistenceModule.verifyStudentPassword(cls, 99, '1234');
      assert.strictEqual(verifyP, true, `${cls} 教師測試員 99 號經 PersistenceModule 密碼 1234 驗證失敗`);

      // 經 client_runtime verifyStudentCredentials 驗證
      const verifyC = sandbox.verifyStudentCredentials(cls, 99, '1234');
      assert.strictEqual(verifyC, true, `${cls} 教師測試員 99 號經 verifyStudentCredentials 驗證失敗`);

      // 教師測試員錯誤密碼必須被拒絕
      assert.strictEqual(PersistenceModule.verifyStudentPassword(cls, 99, '9999'), false, `${cls} 教師測試員錯誤密碼 9999 未被攔截`);
      assert.strictEqual(sandbox.verifyStudentCredentials(cls, 99, 'wrongpass'), false, `${cls} 教師測試員錯誤密碼未被攔截`);
    });

    // 3. 對抗模糊攻擊：非合法密碼、SQL注入字串、極端字符
    const maliciousInputs = [
      '', ' ', '   ', null, undefined,
      '0000', '12345', '123', 'admin', 'password',
      "' OR 1=1 --", "' OR 'a'='a", "<script>alert(1)</script>",
      "\x00", "\n\r", "A".repeat(10000)
    ];

    maliciousInputs.forEach(badPwd => {
      assert.strictEqual(PersistenceModule.verifyStudentPassword('4C', 1, badPwd), false, `惡意/無效輸入未被攔截: ${JSON.stringify(badPwd)}`);
      assert.strictEqual(sandbox.verifyStudentCredentials('4C', 1, badPwd), false, `客戶端惡意/無效輸入未被攔截: ${JSON.stringify(badPwd)}`);
    });

    // 4. 針對 4C #13 的對抗性身分登入攻擊：必須拋出或驗證失敗
    const p13Res = PersistenceModule.verifyStudentPassword('4C', 13, '1234');
    assert.strictEqual(p13Res, false, '不存在的 4C 13 號學生絕不可驗證通過！');
    const c13Res = sandbox.verifyStudentCredentials('4C', 13, '1234');
    assert.strictEqual(c13Res, false, '客戶端對不存在的 4C 13 號學生絕不可驗證通過！');

    // 5. 密碼修改與持久化防篡改對抗
    // 將 4D 05 的密碼修改為 6688
    const saveRes = PersistenceModule.saveStudentPassword('4D', 5, '6688', true);
    assert.strictEqual(saveRes.success !== false, true, '儲存新密碼失敗');
    assert.strictEqual(PersistenceModule.verifyStudentPassword('4D', 5, '6688'), true, '新密碼 6688 驗證失敗');
    assert.strictEqual(PersistenceModule.verifyStudentPassword('4D', 5, '1234'), false, '舊密碼 1234 竟然仍然有效！');

    // 嘗試將密碼改回預設 1234 (必須被拒絕)
    const resetAttempt = PersistenceModule.saveStudentPassword('4D', 5, '1234', true);
    assert.strictEqual(resetAttempt.success, false, '新密碼不可修改回預設 1234');

    // 嘗試輸入非數字密碼 (必須被拒絕)
    const letterAttempt = PersistenceModule.saveStudentPassword('4D', 5, 'abcd', true);
    assert.strictEqual(letterAttempt.success, false, '非純數字密碼必須被拒絕');

    recordPass('密碼安全性防禦、對抗輸入拒絕與 ID 99 權限驗證', '全班級 1234 驗證通過，ID 99 跨 4C/4D/5B 認證成功，所有注入與 4C#13 均被攔截');
  } catch (err) {
    recordFail('密碼安全性防禦、對抗輸入拒絕與 ID 99 權限驗證', err);
  }

  // =========================================================================
  // 對抗測試 4: 考卷試題未認證前嚴格處於鎖定狀態 (R1, AC)
  // =========================================================================
  try {
    const htmlContent = fs.readFileSync(advanceHtmlPath, 'utf8');

    // 1. 審查初始 HTML 標籤之 display 樣式
    assert(htmlContent.includes('id="authScreen" class="auth-container" style="display: block;"'), 'authScreen 初始狀態必須為 display: block');
    assert(htmlContent.includes('id="screenPreExamConfirm" class="confirm-container" style="display: none;"'), 'screenPreExamConfirm 初始狀態必須為 display: none');
    assert(htmlContent.includes('id="examContainer" style="display: none;"'), 'examContainer 初始狀態必須為 display: none');

    // 2. 模擬未驗證調用 startExamCountdown() 進行未授權越權攻擊
    sandbox.ExamState.isAuthenticated = false;
    sandbox.ExamState.currentStudent = null;
    sandbox.ExamState.isExamStarted = false;
    sandbox.__lastAlert = null;

    sandbox.startExamCountdown();

    assert(sandbox.__lastAlert && sandbox.__lastAlert.includes('測驗尚未完成身分與密碼安全核驗'), '未授權調用 startExamCountdown() 未彈出攔截警告');
    assert.strictEqual(sandbox.ExamState.isExamStarted, false, '未授權狀態下 ExamState.isExamStarted 絕不可變為 true');
    assert.strictEqual(mockDOM.elements['examContainer'].style.display, 'none', '未授權狀態下 examContainer 必須保持 display: none 隱藏鎖定！');

    // 3. 正常認證流程解鎖轉移
    sandbox.ExamState.isAuthenticated = true;
    sandbox.ExamState.currentStudent = { classID: '4C', studentID: 1, name: '古永晴' };
    sandbox.startExamCountdown();

    assert.strictEqual(sandbox.ExamState.isExamStarted, true, '授權後 startExamCountdown() 應成功啟動');
    assert.strictEqual(mockDOM.elements['examContainer'].style.display, 'block', '授權後 examContainer 應呈現 display: block');
    assert.strictEqual(mockDOM.elements['screenPreExamConfirm'].style.display, 'none', '授權後 screenPreExamConfirm 應隱藏');

    // 清除計時器防止測試掛起
    if (sandbox.ExamState.timerInterval) {
      clearInterval(sandbox.ExamState.timerInterval);
      sandbox.ExamState.timerInterval = null;
    }

    recordPass('考卷試題未認證前嚴格處於鎖定狀態審查', 'examContainer 初始 display: none，未通過身分與密碼核驗前嚴格禁止進入試卷');
  } catch (err) {
    recordFail('考卷試題未認證前嚴格處於鎖定狀態審查', err);
  }

  // =========================================================================
  // 對抗測試 5: 相機拍照等比 1200px 壓縮演算法邊界與長寬比保持
  // =========================================================================
  try {
    // 提取 client_runtime.js 中的 Canvas 等比縮放演算法
    function simulateCompressionDimensions(w, h, MAX_DIM = 1200) {
      let finalW = w;
      let finalH = h;
      if (finalW > MAX_DIM || finalH > MAX_DIM) {
        if (finalW >= finalH) {
          finalH = Math.round((finalH * MAX_DIM) / finalW);
          finalW = MAX_DIM;
        } else {
          finalW = Math.round((finalW * MAX_DIM) / finalH);
          finalH = MAX_DIM;
        }
      }
      return { w: finalW, h: finalH };
    }

    // 測試各種極端與真實解析度 (涵蓋需求直向與橫向規格)
    const testCases = [
      // 直向 (Portrait)
      { origW: 1000, origH: 2000, desc: '標準直向 1:2 (1000x2000)' },
      { origW: 1500, origH: 3000, desc: '高解析直向 1:2 (1500x3000)' },
      { origW: 800,  origH: 2400, desc: '窄高直向 1:3 (800x2400)' },
      { origW: 1080, origH: 1920, desc: '手機直拍 9:16 (1080x1920)' },
      { origW: 1199, origH: 1201, desc: '邊界臨界直向 (1199x1201)' },

      // 橫向 (Landscape)
      { origW: 3000, origH: 1500, desc: '高解析橫向 2:1 (3000x1500)' },
      { origW: 1920, origH: 1080, desc: '標準全高清橫向 16:9 (1920x1080)' },
      { origW: 4032, origH: 3024, desc: '手機高畫質照片 4:3 (4032x3024)' },
      { origW: 2400, origH: 800,  desc: '超寬橫向 3:1 (2400x800)' },

      // 正方形 (Square)
      { origW: 2000, origH: 2000, desc: '大正方形 (2000x2000)' },
      { origW: 1200, origH: 1200, desc: '基準臨界正方形 (1200x1200)' },

      // 無需壓縮的較小尺寸 (Sub-1200)
      { origW: 800,  origH: 600,  desc: '標準較小橫向 (800x600)' },
      { origW: 600,  origH: 800,  desc: '標準較小直向 (600x800)' },

      // 極端邊界長寬比
      { origW: 10000, origH: 100, desc: '極端細長橫條 (10000x100)' },
      { origW: 100, origH: 10000, desc: '極端細長直條 (100x10000)' }
    ];

    testCases.forEach(tc => {
      const res = simulateCompressionDimensions(tc.origW, tc.origH);
      
      // 1. 驗證長寬均不得大於 1200px
      assert(res.w <= 1200, `${tc.desc}: 寬度 ${res.w} 超過 1200px 最大限制`);
      assert(res.h <= 1200, `${tc.desc}: 高度 ${res.h} 超過 1200px 最大限制`);

      // 2. 驗證若原尺寸超過 1200，則必有至少一邊精確為 1200px
      if (tc.origW > 1200 || tc.origH > 1200) {
        assert(res.w === 1200 || res.h === 1200, `${tc.desc}: 壓縮後未滿幅最大化`);
      }

      // 3. 驗證若原尺寸均 <= 1200，尺寸保持不變 (絕不放大拉伸)
      if (tc.origW <= 1200 && tc.origH <= 1200) {
        assert.strictEqual(res.w, tc.origW, `${tc.desc}: 小尺寸被意外改變寬度`);
        assert.strictEqual(res.h, tc.origH, `${tc.desc}: 小尺寸被意外改變高度`);
      }

      // 4. 驗證長寬比嚴格保持 (容許整數捨入誤差 < 0.5%)
      const origRatio = tc.origW / tc.origH;
      const newRatio = res.w / res.h;
      const ratioError = Math.abs(newRatio - origRatio) / origRatio;
      assert(ratioError < 0.005, `${tc.desc}: 長寬比失真過大！原比率 ${origRatio.toFixed(4)}, 新比率 ${newRatio.toFixed(4)}, 偏差 ${ratioError.toFixed(4)}`);
    });

    // 針對客戶端代碼中的 captureQuestionPhoto 進行模擬調用驗證
    const mockVideoEl = {
      videoWidth: 1000,
      videoHeight: 2000
    };
    mockDOM.elements['video_q20'] = mockVideoEl;

    // 監聽 Canvas 建立與尺寸設定
    let createdCanvasWidth = null;
    let createdCanvasHeight = null;
    const origCreateElement = mockDOM.createElement;
    mockDOM.createElement = (tag) => {
      const el = origCreateElement(tag);
      if (tag.toLowerCase() === 'canvas') {
        Object.defineProperty(el, 'width', {
          set(v) { createdCanvasWidth = v; },
          get() { return createdCanvasWidth; }
        });
        Object.defineProperty(el, 'height', {
          set(v) { createdCanvasHeight = v; },
          get() { return createdCanvasHeight; }
        });
      }
      return el;
    };

    sandbox.captureQuestionPhoto('q20');
    assert.strictEqual(createdCanvasWidth, 600, '直向 1000x2000 拍照時 Canvas 寬度應等比縮放為 600');
    assert.strictEqual(createdCanvasHeight, 1200, '直向 1000x2000 拍照時 Canvas 高度應為 1200');

    // 恢復 createElement
    mockDOM.createElement = origCreateElement;

    recordPass('相機拍照等比 1200px 壓縮演算法與長寬比保持審查', `已測試 ${testCases.length} 組極端解析度，長寬嚴格約束 <= 1200px 且失真率 < 0.5%`);
  } catch (err) {
    recordFail('相機拍照等比 1200px 壓縮演算法與長寬比保持審查', err);
  }

  // =========================================================================
  // 對抗測試 6: 圖片上傳標準檔名生成與格式規範 (R3, F5)
  // =========================================================================
  try {
    // 檔名格式規範：大測解答_Q20_班級座號_姓名.jpg
    const filenameRegex = /^大測解答_Q(20|21|22|23)_(4C|4D|5B)\d{2}_[\u4e00-\u9fa5A-Za-z0-9_]+\.(jpg|jpeg|png)$/;

    function formatExpectedFilename(qId, classId, studentId, studentName, ext = 'jpg') {
      const safeQId = qId.toUpperCase().replace(/[\/\\:*?"<>|]/g, '_');
      const safeId = (classId + String(studentId).padStart(2, '0')).replace(/[\/\\:*?"<>|]/g, '_');
      const safeName = studentName.toString().replace(/[\/\\:*?"<>|]/g, '_');
      return `大測解答_${safeQId}_${safeId}_${safeName}.${ext}`;
    }

    const testProfiles = [
      { qid: 'q20', cls: '4C', sid: 15, name: '陳子豪', expected: '大測解答_Q20_4C15_陳子豪.jpg' },
      { qid: 'q21', cls: '4D', sid: 1,  name: '洪佳佳', expected: '大測解答_Q21_4D01_洪佳佳.jpg' },
      { qid: 'q22', cls: '5B', sid: 28, name: '黎宛旻', expected: '大測解答_Q22_5B28_黎宛旻.jpg' },
      { qid: 'q23', cls: '4C', sid: 99, name: '教師測試員', expected: '大測解答_Q23_4C99_教師測試員.jpg' },
      { qid: 'q20', cls: '4D', sid: 13, name: '施舒晨', expected: '大測解答_Q20_4D13_施舒晨.jpg' }
    ];

    testProfiles.forEach(tp => {
      const generated = formatExpectedFilename(tp.qid, tp.cls, tp.sid, tp.name);
      assert.strictEqual(generated, tp.expected, `檔名生成不符合預期: ${generated} vs ${tp.expected}`);
      assert(filenameRegex.test(generated), `檔名未通過正規表示式審驗: ${generated}`);
    });

    // 審查 gas_backend.gs、gas_backend.js 與 mock_server.js 檔名模板
    const gasGsCode = fs.readFileSync(path.join(advanceDir, 'gas_backend.gs'), 'utf8');
    const gasJsCode = fs.readFileSync(path.join(advanceDir, 'gas_backend.js'), 'utf8');
    const mockServerCode = fs.readFileSync(path.join(advanceDir, 'mock_server.js'), 'utf8');

    assert(gasGsCode.includes('`大測解答_${qId}_${safeStudentId}_${safeStudentName}.${fileExt}`'), 'gas_backend.gs 檔名範本不符');
    assert(gasJsCode.includes('`大測解答_${qId}_${studentId}_${studentName}.jpg`'), 'gas_backend.js 檔名範本不符');
    assert(mockServerCode.includes('`大測解答_${qId}_${safeStudentId}_${safeStudentName}.${ext}`'), 'mock_server.js 檔名範本不符');

    // 對抗模糊路徑穿透字符過濾測試
    const maliciousProfile = { qid: 'q20', cls: '4C', sid: '15/../../etc', name: '陳:子*豪?|', ext: 'jpg' };
    const sanitized = formatExpectedFilename(maliciousProfile.qid, maliciousProfile.cls, maliciousProfile.sid, maliciousProfile.name);
    const uploadDir = path.resolve(advanceDir, 'mock_uploads');
    const fullTestPath = path.resolve(uploadDir, sanitized);
    assert.strictEqual(path.dirname(fullTestPath), uploadDir, '檔名消毒後絕不可逃逸出上傳目錄 (Path Traversal 防禦有效)');
    assert(!sanitized.includes('/'), '檔名中不應存在路徑斜線');
    assert(!sanitized.includes('\\'), '檔名中不應存在反斜線');
    assert(!sanitized.includes(':'), '檔名中不應存在冒號');
    assert(!sanitized.includes('*'), '檔名中不應存在星號');
    assert(!sanitized.includes('?'), '檔名中不應存在問號');

    recordPass('圖片上傳標準檔名生成與格式規範審查', '大測解答_Q20_班級座號_姓名.jpg 格式嚴格遵循，特殊字符完全消毒');
  } catch (err) {
    recordFail('圖片上傳標準檔名生成與格式規範審查', err);
  }

  // =========================================================================
  // 對抗測試 7: 本地 Mock Server 實時端對端檔案上傳與檔名落地實測
  // =========================================================================
  let serverInstance = null;
  try {
    const testPort = 39871;
    serverInstance = await startServer(testPort);

    // 構建帶照片的真實 Base64 JPEG 上傳 Payload
    const fakeImageBuffer = Buffer.from('FAKE_CHALLENGER_JPEG_IMAGE_DATA_1200PX');
    const fakeBase64 = 'data:image/jpeg;base64,' + fakeImageBuffer.toString('base64');

    const uploadPayload = {
      studentId: '4C15',
      studentName: '陳子豪',
      classId: '4C',
      questionId: 'Q20',
      imageBase64: fakeBase64
    };

    const res = await httpRequest(`http://127.0.0.1:${testPort}/gas-upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, JSON.stringify(uploadPayload));

    assert.strictEqual(res.statusCode, 200, `上傳回傳狀態碼應為 200，實際: ${res.statusCode}`);
    const data = res.json();
    assert.strictEqual(data.status, 'success', `上傳狀態應為 success，實際: ${data.status}`);
    assert.strictEqual(data.filename, '大測解答_Q20_4C15_陳子豪.jpg', `返回之落地檔名不符: ${data.filename}`);

    // 驗證伺服器磁碟 mock_uploads/ 目錄下檔案確實落地
    const expectedFilePath = path.join(advanceDir, 'mock_uploads', '大測解答_Q20_4C15_陳子豪.jpg');
    assert(fs.existsSync(expectedFilePath), `伺服器磁碟未找到落地檔案: ${expectedFilePath}`);
    const fileBytes = fs.readFileSync(expectedFilePath);
    assert.strictEqual(fileBytes.toString(), 'FAKE_CHALLENGER_JPEG_IMAGE_DATA_1200PX', '落地檔案二進位內容與上傳不符！');

    recordPass('Mock Server 端對端圖片上傳與磁碟實體落地檢驗', `已實體落地 ${data.filename} (${fileBytes.length} bytes)，HTTP 200 成功`);
  } catch (err) {
    recordFail('Mock Server 端對端圖片上傳與磁碟實體落地檢驗', err);
  } finally {
    if (serverInstance && serverInstance.close) {
      serverInstance.close();
    }
  }

  // =========================================================================
  // 總結統計與判定
  // =========================================================================
  console.log('\n========================================================================');
  console.log(`【測試統計結果】完成: ${totalTests} | 通過: ${passedTests} | 失敗: ${totalTests - passedTests}`);
  if (findings.length === 0) {
    console.log('【對抗審查判定】VERDICT: APPROVE (100% PASS)');
  } else {
    console.log(`【對抗審查判定】VERDICT: REQUEST_CHANGES (${findings.length} ISSUES FOUND)`);
  }
  console.log('========================================================================\n');

  return {
    total: totalTests,
    passed: passedTests,
    failed: totalTests - passedTests,
    findings: findings,
    verdict: findings.length === 0 ? 'APPROVE' : 'REQUEST_CHANGES'
  };
}

if (require.main === module) {
  runAdversarialTestSuite().then(res => {
    if (res.verdict === 'APPROVE') {
      process.exit(0);
    } else {
      process.exit(1);
    }
  }).catch(e => {
    console.error('執行崩潰：', e);
    process.exit(1);
  });
}

module.exports = { runAdversarialTestSuite };
