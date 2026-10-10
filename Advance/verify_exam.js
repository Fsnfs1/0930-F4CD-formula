/**
 * verify_exam.js
 * Comprehensive automated verification suite for authentic 27-question Advance Mathematics Exam Platform.
 * 
 * Verifies:
 * 1. HTML and embedded JS syntax (0 syntax errors).
 * 2. MathJax 3 configuration and LaTeX formulas presence.
 * 3. Roster directory (88 students without 4C#13, Teacher Tester 99) and password authentication.
 * 4. Objective grading matching docx answer key (q1: X, q2: O, q3: O, q4: X, q5: X, q6: X, q7: D, q8: B, q9: A, q10: B, q11: A) scoring out of 22.
 * 5. Dual-phase timer & strict 40:00 objective lock mechanism.
 * 6. Offline LocalStorage autosave recovery, network heartbeat indicator & network failure retry resilience.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');
const { startServer } = require('./mock_server');

// Helper to make HTTP requests
function request(urlStr, options = {}, postData = null) {
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

async function runVerificationSuite() {
  console.log('================================================================');
  console.log('【高一理組數學大測】自動化完整檢驗套件 (verify_exam.js)');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  function pass(testName, detail = '') {
    passed++;
    total++;
    console.log(`  ✔ [PASS] ${testName} ${detail ? '— ' + detail : ''}`);
  }

  function fail(testName, err) {
    total++;
    console.error(`  ✖ [FAIL] ${testName}: ${err.message}`);
    throw err;
  }

  const htmlPath = path.join(__dirname, 'advance_test.html');
  assert(fs.existsSync(htmlPath), 'advance_test.html 檔案不存在');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');

  // -------------------------------------------------------------
  // 測試 1：HTML 結構完整性與 JavaScript 語法零錯誤檢驗
  // -------------------------------------------------------------
  try {
    assert(htmlContent.length > 25000, `HTML 檔案過小 (${htmlContent.length} bytes)`);

    // 擷取所有 <script> 標籤（排除引用外部 src 者）進行 JavaScript 語法解析
    const scriptRegex = /<script(?![^>]*\bsrc\b)[^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    let scriptBlockCount = 0;

    while ((match = scriptRegex.exec(htmlContent)) !== null) {
      const scriptCode = match[1];
      if (scriptCode && scriptCode.trim().length > 0) {
        scriptBlockCount++;
        // 使用 Node.js vm.Script 檢查語法
        assert.doesNotThrow(() => {
          new vm.Script(scriptCode, { filename: `inline-script-${scriptBlockCount}.js` });
        }, `第 ${scriptBlockCount} 個內嵌腳本區塊存在語法錯誤`);
      }
    }
    assert(scriptBlockCount >= 2, '未檢測到足夠數量的內嵌 JavaScript 區塊');

    // 檢驗關鍵 DOM 容器與元件 ID 存在性
    const requiredIds = [
      'heartbeatStatus', 'autosaveBadge', 'networkRetryBanner', 'btnRetrySubmit',
      'stickyTimer', 'timerPhaseBadge', 'timerCountdownDisplay', 'examStudentBadge',
      'authScreen', 'cardFaceFirstLogin', 'faceFirstVideo', 'btnFaceFirstStart', 'btnFaceFirstCapture', 'linkGoToManualPage',
      'cardFirstTimeSelect', 'selectClass', 'selectStudent', 'inputPassword', 'btnLogin',
      'modalPasswordAuth', 'inputAuthPassword', 'btnSubmitPasswordAuth',
      'screenPreExamConfirm', 'confirmClassDisplay', 'confirmIdDisplay', 'confirmNameDisplay', 'btnStartExamCountdown',
      'examContainer', 'objectiveLockBanner',
      'sectionPart1', 'sectionPart2', 'sectionPart3', 'sectionPart4', 'sectionPart5',
      'submitBtn', 'statusBox'
    ];
    for (const id of requiredIds) {
      assert(htmlContent.includes(`id="${id}"`), `缺少關鍵 DOM 元件 ID: #${id}`);
    }

    // 檢驗全部 27 道真實數學題目標籤存在性
    for (let i = 1; i <= 6; i++) {
      assert(htmlContent.includes(`name="q${i}"`), `缺少判斷題 Q${i}`);
    }
    for (let i = 7; i <= 11; i++) {
      assert(htmlContent.includes(`name="q${i}"`), `缺少選擇題 Q${i}`);
    }
    assert(htmlContent.includes('name="q12_1"') && htmlContent.includes('name="q12_3"'), '缺少填充題 Q12');
    assert(htmlContent.includes('name="q13_1"'), '缺少填充題 Q13');
    assert(htmlContent.includes('name="q14_1"'), '缺少填充題 Q14');
    assert(htmlContent.includes('name="q15_1"') && htmlContent.includes('name="q15_4"'), '缺少填充題 Q15');
    assert(htmlContent.includes('name="q16_1"') && htmlContent.includes('name="q16_6"'), '缺少填充題 Q16');
    assert(htmlContent.includes('name="q17_1"') && htmlContent.includes('name="q17_2"'), '缺少填充題 Q17');
    assert(htmlContent.includes('name="q18_1"'), '缺少填充題 Q18');
    assert(htmlContent.includes('name="q19_1"'), '缺少填充題 Q19');
    
    // 第四部分解答題（Q20~Q23）：每題獨立相機拍照卡片，無文字框，嚴禁檔案上傳
    for (let i = 20; i <= 23; i++) {
      assert(htmlContent.includes(`id="camCard_q${i}"`), `缺少解答題 Q${i} 相機拍照卡片`);
      assert(htmlContent.includes(`id="video_q${i}"`), `缺少解答題 Q${i} 視訊預覽`);
      assert(htmlContent.includes(`id="btnCapture_q${i}"`), `缺少解答題 Q${i} 拍照按鈕`);
      assert(!htmlContent.includes(`id="q${i}_notes"`), `解答題 Q${i} 不應存在文字備註框`);
    }
    assert(!htmlContent.includes('type="file"'), '試卷中嚴格禁止出現任何檔案選擇上傳 (type="file")');

    for (let i = 24; i <= 27; i++) {
      assert(htmlContent.includes(`name="q${i}"`), `缺少附加題 Q${i}`);
    }

    // 檢驗填空題與附加題的自然語言提示詞與選填特性
    assert(htmlContent.includes('placeholder="若難以輸入數學符號時，可以使用自然語言描述答案。"'), '填空題與附加題必須包含自然語言提示 placeholder');
    assert(!htmlContent.includes('class="blank-input" required'), '填空題文字框必須為選填項目，嚴禁 required');

    // 檢驗 R1 與 R6 之關鍵腳本與樣式設定
    assert(htmlContent.includes('../js/roster.js'), '缺少 roster.js 引入');
    assert(htmlContent.includes('../js/admin_snapshot.js'), '缺少 admin_snapshot.js 引入');
    assert(htmlContent.includes('position: sticky'), '缺少 position: sticky 樣式');
    assert(htmlContent.includes('handleNetworkRetryClick'), '重試按鈕必須綁定 handleNetworkRetryClick()');

    pass('Test 1: HTML 結構、DOM 元素與 JavaScript 語法零錯誤審查', `共檢查 ${scriptBlockCount} 個腳本區塊與 27 道題目組件 (含獨立拍照卡與自然語言提示)`);
  } catch (err) {
    fail('Test 1', err);
  }

  // -------------------------------------------------------------
  // 測試 2：MathJax 3 配置規範與 LaTeX 公式無裸露審查
  // -------------------------------------------------------------
  try {
    assert(
      htmlContent.includes('id="MathJax-script"') &&
      htmlContent.includes('tex-mml-chtml.js'),
      '未在 <head> 中正確引入 MathJax 3 腳本標籤'
    );
    assert(htmlContent.includes('inlineMath') && htmlContent.includes('displayMath'), '未配置 MathJax LaTeX 公式定界符');

    // 檢查典型數學公式存在且正確使用定界符
    const mathSignatures = [
      '\\{x \\mid (x-4)(x-8)=0\\}',
      'p \\Rightarrow q',
      '(A \\cap B) \\cup C',
      '\\forall x \\in \\mathbb{R}',
      '\\exists x \\in \\mathbb{R}',
      '\\complement_{\\mathbb{R}}',
      '\\frac{e}{a-c} > \\frac{e}{b-d}',
      '\\sqrt{1521}'
    ];
    for (const sig of mathSignatures) {
      assert(htmlContent.includes(sig), `未找到期望的 LaTeX 數學公式特徵: ${sig}`);
    }

    // 全局規範：嚴禁只輸出原始 $$ 字符而未受 MathJax 支援
    assert(htmlContent.includes('displayMath: [[\'$$\', \'$$\']'), 'MathJax 配置中必須包含 $$ 定界符');

    pass('Test 2: MathJax 3 規範與 LaTeX 公式顯影配置審查', '符合用戶全局公式規範');
  } catch (err) {
    fail('Test 2', err);
  }

  // -------------------------------------------------------------
  // 測試 3：花名冊載入、學生身分核對與密碼驗證 (含 ID 99 教師測試員)
  // -------------------------------------------------------------
  try {
    // 建立 VM 沙盒模擬運行花名冊與驗證邏輯
    const sandbox = {
      window: {
        addEventListener: () => {}
      },
      document: {
        addEventListener: () => {},
        getElementById: () => null,
        querySelector: () => null,
        querySelectorAll: () => []
      },
      navigator: { onLine: true },
      console: console,
      URLSearchParams: URLSearchParams,
      Date: Date,
      Math: Math,
      parseInt: parseInt,
      String: String
    };
    vm.createContext(sandbox);

    // 載入花名冊
    const rosterRegex = /window\.ROSTER_DATA\s*=\s*(\{[\s\S]*?\});/;
    const rosterMatch = htmlContent.match(rosterRegex);
    assert(rosterMatch, '未能從 advance_test.html 提取 ROSTER_DATA');
    vm.runInContext(`window.ROSTER_DATA = ${rosterMatch[1]};`, sandbox);
    const ROSTER = sandbox.window.ROSTER_DATA;

    assert(ROSTER['4C'] && ROSTER['4C'].length === 29, `4C 班應有 29 名學生，實際：${ROSTER['4C']?.length}`);
    assert(ROSTER['4D'] && ROSTER['4D'].length === 31, `4D 班應有 31 名學生，實際：${ROSTER['4D']?.length}`);
    assert(ROSTER['5B'] && ROSTER['5B'].length === 28, `5B 班應有 28 名學生，實際：${ROSTER['5B']?.length}`);

    // 驗證 4C 班無 13 號學生
    const c13 = ROSTER['4C'].find(s => s.id === 13);
    assert(!c13, '4C 班中不應存在 13 號學生！');

    // 載入客戶端邏輯
    const clientScriptMatch = htmlContent.match(/<script>\s*(\/\/ ==========================================[\s\S]*?)<\/script>\s*<\/body>/);
    assert(clientScriptMatch, '未能提取客戶端主腳本');
    vm.runInContext(clientScriptMatch[1], sandbox);

    // 驗證全班級對 99 號教師測試員的支援
    ['4C', '4D', '5B'].forEach(cls => {
      const list = sandbox.getStudentsListForClass(cls);
      const teacher = list.find(s => s.studentID === 99);
      assert(teacher, `${cls} 班未檢索到 99 號教師測試員`);
      assert(teacher.name === '教師測試員', '教師測試員姓名不正確');
      assert(teacher.isTeacher === true, '教師測試員標記未設為 true');

      // 驗證教師測試員預設密碼 1234 登入成功
      assert(sandbox.verifyStudentCredentials(cls, 99, '1234') === true, `${cls} 教師測試員使用 1234 密碼驗證失敗`);
      assert(sandbox.verifyStudentCredentials(cls, 99, '9999') === false, `${cls} 教師測試員錯誤密碼未被攔截`);
    });

    // 驗證正規學生密碼驗證
    assert(sandbox.verifyStudentCredentials('4C', 1, '1234') === true, '學生 4C01 使用 1234 驗證失敗');
    assert(sandbox.verifyStudentCredentials('4C', 1, 'wrong') === false, '學生 4C01 錯誤密碼未被阻擋');
    assert(sandbox.verifyStudentCredentials('4D', 10, '1234') === true, '學生 4D10 使用 1234 驗證失敗');
    assert(sandbox.verifyStudentCredentials('5B', 28, '1234') === true, '學生 5B28 使用 1234 驗證失敗');

    pass('Test 3: 花名冊 88 人名單、缺號校驗與 ID 99 教師測試員雙軌認證', '4C(29人無#13)、4D(31人)、5B(28人)及99測試員密碼1234驗證通過');
  } catch (err) {
    fail('Test 3', err);
  }

  // -------------------------------------------------------------
  // 測試 4：客觀題官方答案鍵核對與 22 分自動評分邏輯
  // -------------------------------------------------------------
  try {
    // 檢查官方答案鍵
    assert(htmlContent.includes("q1: 'X'"), "q1 官方答案應為 X");
    assert(htmlContent.includes("q2: 'O'"), "q2 官方答案應為 O");
    assert(htmlContent.includes("q3: 'O'"), "q3 官方答案應為 O");
    assert(htmlContent.includes("q4: 'X'"), "q4 官方答案應為 X");
    assert(htmlContent.includes("q5: 'X'"), "q5 官方答案應為 X");
    assert(htmlContent.includes("q6: 'X'"), "q6 官方答案應為 X");
    assert(htmlContent.includes("q7: 'D'"), "q7 官方答案應為 D");
    assert(htmlContent.includes("q8: 'B'"), "q8 官方答案應為 B");
    assert(htmlContent.includes("q9: 'A'"), "q9 官方答案應為 A");
    assert(htmlContent.includes("q10: 'B'"), "q10 官方答案應為 B");
    assert(htmlContent.includes("q11: 'A'"), "q11 官方答案應為 A");

    // 模擬評分環境
    const evalSandbox = {
      document: {
        _answers: {},
        querySelector: function(sel) {
          const match = sel.match(/input\[name="([^"]+)"\]:checked/);
          if (match) {
            const key = match[1];
            const val = this._answers[key];
            return val !== undefined ? { value: val } : null;
          }
          return null;
        }
      },
      ANSWER_KEY: {
        q1: 'X', q2: 'O', q3: 'O', q4: 'X', q5: 'X', q6: 'X',
        q7: 'D', q8: 'B', q9: 'A', q10: 'B', q11: 'A'
      }
    };
    vm.createContext(evalSandbox);

    const clientScriptMatch = htmlContent.match(/<script>\s*(\/\/ ==========================================[\s\S]*?)<\/script>\s*<\/body>/);
    vm.runInContext(clientScriptMatch[1], evalSandbox);

    // 情況 A：全部答對 (滿分 22 分)
    evalSandbox.document._answers = {
      q1: 'X', q2: 'O', q3: 'O', q4: 'X', q5: 'X', q6: 'X',
      q7: 'D', q8: 'B', q9: 'A', q10: 'B', q11: 'A'
    };
    const resA = evalSandbox.gradeObjectiveQuestions();
    assert.strictEqual(resA.score, 22, `全對應得 22 分，實際：${resA.score}`);
    assert.strictEqual(resA.maxScore, 22);

    // 情況 B：判斷題全對 (12 分)，選擇題全錯 (0 分) -> 總分 12 分
    evalSandbox.document._answers = {
      q1: 'X', q2: 'O', q3: 'O', q4: 'X', q5: 'X', q6: 'X',
      q7: 'A', q8: 'A', q9: 'B', q10: 'A', q11: 'B'
    };
    const resB = evalSandbox.gradeObjectiveQuestions();
    assert.strictEqual(resB.score, 12, `判斷題全對應得 12 分，實際：${resB.score}`);

    // 情況 C：判斷題全錯 (0 分)，選擇題全對 (10 分) -> 總分 10 分
    evalSandbox.document._answers = {
      q1: 'O', q2: 'X', q3: 'X', q4: 'O', q5: 'O', q6: 'O',
      q7: 'D', q8: 'B', q9: 'A', q10: 'B', q11: 'A'
    };
    const resC = evalSandbox.gradeObjectiveQuestions();
    assert.strictEqual(resC.score, 10, `選擇題全對應得 10 分，實際：${resC.score}`);

    // 情況 D：未作答 (0 分)
    evalSandbox.document._answers = {};
    const resD = evalSandbox.gradeObjectiveQuestions();
    assert.strictEqual(resD.score, 0, `未作答應為 0 分，實際：${resD.score}`);

    pass('Test 4: 客觀題答案鍵與本機 22 分自動批改算法精確性', '全對(22分)、純判斷(12分)、純選擇(10分)、未作答(0分)完全精準');
  } catch (err) {
    fail('Test 4', err);
  }

  // -------------------------------------------------------------
  // 測試 5：雙階段計時與滿 40:00 客觀題強制鎖定機制
  // -------------------------------------------------------------
  try {
    // 檢查配置時間常數
    assert(htmlContent.includes('TOTAL_SECONDS: 3000'), '總時長必須為 3000 秒 (50分鐘)');
    assert(htmlContent.includes('PHASE1_SECONDS: 2400'), '第一階段必須為 2400 秒 (40分鐘)');
    assert(htmlContent.includes('BUFFER_SECONDS: 600'), '緩衝階段必須為 600 秒 (10分鐘)');

    // 模擬 DOM 鎖定行為
    const domSandbox = {
      mockPart1Inputs: [ { disabled: false }, { disabled: false } ],
      mockPart2Inputs: [ { disabled: false }, { disabled: false } ],
      mockPart3Inputs: [ { disabled: false }, { disabled: false } ],
      document: {
        getElementById: function(id) {
          if (id === 'sectionPart1') {
            return {
              classList: { add: function(c) { this._class = c; } },
              querySelectorAll: () => domSandbox.mockPart1Inputs
            };
          }
          if (id === 'sectionPart2') {
            return {
              classList: { add: function(c) { this._class = c; } },
              querySelectorAll: () => domSandbox.mockPart2Inputs
            };
          }
          if (id === 'objectiveLockBanner') {
            return {
              classList: { add: function(c) { this._class = c; } }
            };
          }
          return null;
        }
      },
      alert: function() {}
    };
    vm.createContext(domSandbox);

    const clientScriptMatch = htmlContent.match(/<script>\s*(\/\/ ==========================================[\s\S]*?)<\/script>\s*<\/body>/);
    vm.runInContext(clientScriptMatch[1], domSandbox);

    // 執行鎖定操作
    domSandbox.lockObjectiveQuestions();

    // 驗證 Part 1 & 2 已鎖定，Part 3 未受影響
    assert(domSandbox.mockPart1Inputs.every(inp => inp.disabled === true), '第一部分判斷題 input 未被鎖定！');
    assert(domSandbox.mockPart2Inputs.every(inp => inp.disabled === true), '第二部分選擇題 input 未被鎖定！');
    assert(domSandbox.mockPart3Inputs.every(inp => inp.disabled === false), '第三部分填空題 input 不應被鎖定！');
    assert.strictEqual(domSandbox.ExamState.isLocked, true, 'ExamState.isLocked 未更新為 true');

    pass('Test 5: 雙階段 (40+10分) 計時與客觀題嚴格鎖定機制', '滿 40 分鐘第一/二部分全面鎖定，填充與解答保持開放');
  } catch (err) {
    fail('Test 5', err);
  }

  // -------------------------------------------------------------
  // 測試 6：離線 LocalStorage 自動存取恢復、網絡心跳與斷網重試容錯
  // -------------------------------------------------------------
  try {
    // 6.1 測試 LocalStorage 序列化與無縫恢復
    const memoryStorage = {};
    const storageSandbox = {
      localStorage: {
        getItem: (k) => memoryStorage[k] || null,
        setItem: (k, v) => memoryStorage[k] = String(v),
        removeItem: (k) => delete memoryStorage[k]
      },
      document: {
        querySelector: () => null,
        querySelectorAll: () => [],
        getElementById: () => null
      },
      console: console,
      Date: Date,
      JSON: JSON
    };
    vm.createContext(storageSandbox);

    const clientScriptMatch = htmlContent.match(/<script>\s*(\/\/ ==========================================[\s\S]*?)<\/script>\s*<\/body>/);
    vm.runInContext(clientScriptMatch[1], storageSandbox);

    // 模擬寫入快照
    storageSandbox.ExamState.currentStudent = { classID: '4C', studentID: 15, name: '陳子豪', grade: 10 };
    storageSandbox.ExamState.phase = 2;
    storageSandbox.ExamState.timeLeft = 520;
    storageSandbox.ExamState.isExamStarted = true;
    storageSandbox.ExamState.currentCompressedBase64 = 'data:image/jpeg;base64,/9j/mockImageData';
    storageSandbox.ExamState.uploadedFileUrl = 'https://drive.google.com/open?id=mockDriveFile123';
    storageSandbox.saveExamState();

    assert(memoryStorage['ADVANCE_MATH_EXAM_STATE'], 'LocalStorage 中缺少 ADVANCE_MATH_EXAM_STATE 鍵值');
    const saved = JSON.parse(memoryStorage['ADVANCE_MATH_EXAM_STATE']);
    assert.strictEqual(saved.student.name, '陳子豪');
    assert.strictEqual(saved.phase, 2);
    assert.strictEqual(saved.timeLeft, 520);
    assert.strictEqual(saved.uploadedFileUrl, 'https://drive.google.com/open?id=mockDriveFile123');

    // 6.2 測試心跳指示燈狀態文字
    assert(htmlContent.includes('🟢 網絡連通正常'), '缺少「🟢 網絡連通正常」指示文字');
    assert(htmlContent.includes('🔴 網絡已斷開，已進入離線保護模式'), '缺少「🔴 網絡已斷開，已進入離線保護模式」指示文字');

    // 6.3 測試斷網醒目橫幅與一鍵重試
    assert(htmlContent.includes('網絡連線中斷，請檢查連線'), '缺少「網絡連線中斷，請檢查連線」警告橫幅');
    assert(htmlContent.includes('重新提交 / 重試'), '缺少「重新提交 / 重試」按鈕');

    // 6.4 測試 60s 倒數計時器防死循環機制
    if (typeof storageSandbox.setNetworkRetryCountdown === 'function') {
      storageSandbox.setNetworkRetryCountdown(45);
      storageSandbox.setNetworkRetryInterval(12345);
    } else {
      storageSandbox.networkRetryCountdown = 45;
      storageSandbox.networkRetryInterval = 12345;
    }
    const mockBanner = { classList: { add: () => {} }, querySelector: () => ({ innerHTML: '' }) };
    storageSandbox.document.getElementById = (id) => id === 'networkRetryBanner' ? mockBanner : null;
    storageSandbox.showNetworkRetryBanner();
    const currentCountdown = typeof storageSandbox.getNetworkRetryCountdown === 'function'
      ? storageSandbox.getNetworkRetryCountdown()
      : storageSandbox.networkRetryCountdown;
    assert.strictEqual(currentCountdown, 45, '倒數計時器在運作中時不應被定時心跳重複重置回 60 秒！');

    // 6.5 測試重試按鈕行為隔離
    let submitCalled = false;
    let probeCalled = false;
    storageSandbox.submitExam = () => { submitCalled = true; };
    storageSandbox.retryNetworkConnectionNow = () => { probeCalled = true; };
    storageSandbox.ExamState.pendingSubmission = false;
    storageSandbox.handleNetworkRetryClick();
    assert.strictEqual(submitCalled, false, '非交卷狀態下點擊重試按鈕不應觸發交卷');
    assert.strictEqual(probeCalled, true, '非交卷狀態下點擊重試按鈕應觸發連線探測');

    submitCalled = false;
    probeCalled = false;
    storageSandbox.ExamState.pendingSubmission = true;
    storageSandbox.handleNetworkRetryClick();
    assert.strictEqual(submitCalled, true, '待補交狀態下點擊重試按鈕應觸發交卷重試');

    pass('Test 6: LocalStorage 離線暫存恢復、實時心跳指示燈與斷網重試機制', 'ADVANCE_MATH_EXAM_STATE 完整支援狀態保留、60s防死循環與無損重試');
  } catch (err) {
    fail('Test 6', err);
  }

  // -------------------------------------------------------------
  // 測試 7：本機 Mock 伺服器兩階段提交整合測試 (GAS -> Drive -> Form)
  // -------------------------------------------------------------
  const { server, port } = await startServer(0);
  const baseUrl = `http://localhost:${port}`;
  console.log(`[Init] 測試用 Mock Server 已於 ${baseUrl} 啟動\n`);

  try {
    // 7.1 靜態檔案訪問
    const getRes = await request(`${baseUrl}/advance_test.html`);
    assert.strictEqual(getRes.statusCode, 200, '無法透過 HTTP 取得 advance_test.html');

    // 7.2 步驟 1：POST 壓縮圖片至 Mock GAS 端點 (標準化命名校驗)
    const mockImagePayload = {
      studentId: '4C15',
      studentName: '陳子豪',
      classId: '4C',
      questionId: 'Q20',
      fillInAnswer: JSON.stringify({ q12_1: '確定性', q12_2: '互異性', q12_3: '無序性' }),
      imageBase64: 'data:image/jpeg;base64,' + Buffer.from('Fake JPEG Binary 1200px').toString('base64')
    };

    const gasRes = await request(`${baseUrl}/api/gas-upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }
    }, JSON.stringify(mockImagePayload));

    assert.strictEqual(gasRes.statusCode, 200);
    const gasData = gasRes.json();
    assert.strictEqual(gasData.status, 'success');
    assert(gasData.fileUrl && gasData.fileUrl.includes('drive.google.com'), 'GAS 回傳之 Drive 網址無效');
    assert(gasData.filename && gasData.filename.includes('大測解答_Q20_4C15_陳子豪'), `GAS 上傳檔名不符合標準規範: ${gasData.filename}`);

    // 7.3 步驟 2：POST 22 分客觀題成績與 Drive 圖片網址至 Mock Form 端點
    const formParams = new URLSearchParams({
      'entry.1000001': '4C15',
      'entry.1000002': '陳子豪',
      'entry.1000003': '4C',
      'entry.1000004': '22',
      'entry.1000005': JSON.stringify({ objectiveScore: 22, maxScore: 22 }),
      'entry.1000006': gasData.fileUrl
    });

    const formRes = await request(`${baseUrl}/api/form-submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }, formParams.toString());

    assert.strictEqual(formRes.statusCode, 200);
    const formData = formRes.json();
    assert.strictEqual(formData.status, 'success');

    // 7.4 審計端點確認數據已落盤
    const auditRes = await request(`${baseUrl}/api/submissions`);
    const auditData = auditRes.json();
    assert(auditData.uploadCount >= 1, 'Mock GAS 未記錄到上傳');
    assert(auditData.formSubmissionCount >= 1, 'Mock Form 未記錄到提交');
    const firstUpload = auditData.uploads[auditData.uploads.length - 1];
    assert(firstUpload.filename.includes('大測解答_Q20_4C15_陳子豪'), `儲存檔案檔名規範不符: ${firstUpload.filename}`);

    pass('Test 7: 兩階段雲端提交管道 (GAS 圖片上傳 -> Form 表單提交) 端對端驗證', `成功接收圖片標準檔名 (${gasData.filename}) 與總分 22 分記錄`);
  } catch (err) {
    fail('Test 7', err);
  } finally {
    server.close();
  }

  // -------------------------------------------------------------
  // 測試 8：雙目錄構建同步與檔案同態校驗 (R5 Build Sync & Homomorphism)
  // -------------------------------------------------------------
  try {
    const crypto = require('crypto');
    const twinCandidates = [
      path.resolve(__dirname, '..', 'math_platform', 'Advance'),
      path.resolve(__dirname, '..', '..', 'advance')
    ];
    const twinDir = twinCandidates.find(d => fs.existsSync(d) && path.resolve(d) !== path.resolve(__dirname));
    assert(twinDir && fs.existsSync(twinDir), `鏡像目錄不存在: ${twinCandidates.join(' or ')}`);

    const twinHtml = path.join(twinDir, 'advance_test.html');
    assert(fs.existsSync(twinHtml), `鏡像 advance_test.html 不存在: ${twinHtml}`);

    const h1 = crypto.createHash('md5').update(fs.readFileSync(htmlPath)).digest('hex');
    const h2 = crypto.createHash('md5').update(fs.readFileSync(twinHtml)).digest('hex');
    assert.strictEqual(h1, h2, `兩目錄之 advance_test.html 內容哈希不一致 (${h1} !== ${h2})`);

    pass('Test 8: 雙目錄構建同步與檔案同態校驗 (R5)', `MD5 一致: ${h1}`);
  } catch (err) {
    fail('Test 8', err);
  }

  console.log('\n================================================================');
  console.log(`【驗證結果】全項自動化測試通過！ ${passed} / ${total} PASS (100% SUCCESS)`);
  console.log('================================================================\n');
}

if (require.main === module) {
  runVerificationSuite().catch(err => {
    console.error('驗證失敗：', err);
    process.exit(1);
  });
}

module.exports = { runVerificationSuite };
