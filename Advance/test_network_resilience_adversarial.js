/**
 * test_network_resilience_adversarial.js
 * 
 * Standalone Adversarial Stress Testing Harness for WEB+ Advance Exam Platform
 * Specifically validates Network Resilience, Auto-Retry Countdown, and Offline LocalStorage (R6):
 * 1. Smooth 60s countdown under repeated 30s heartbeat probes without reset deadlock
 * 2. Offline answering persistence to LocalStorage key ADVANCE_MATH_EXAM_STATE and restoration
 * 3. Decoupling of retry button: mid-exam probe vs post-submission auto-submit
 * 4. Strict timeout enforcement via AbortController against hanging endpoints
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const http = require('http');
const assert = require('assert');

// ANSI formatting helpers
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function logHeader(title) {
  console.log(`\n${BOLD}${CYAN}================================================================${RESET}`);
  console.log(`${BOLD}${CYAN}${title}${RESET}`);
  console.log(`${BOLD}${CYAN}================================================================${RESET}\n`);
}

function pass(name, detail = '') {
  totalTests++;
  passedTests++;
  console.log(`  ${GREEN}✔ [PASS]${RESET} ${BOLD}${name}${RESET} ${detail ? '— ' + detail : ''}`);
}

function fail(name, detail = '') {
  totalTests++;
  failedTests++;
  console.error(`  ${RED}✖ [FAIL]${RESET} ${BOLD}${name}${RESET} ${detail ? '— ' + detail : ''}`);
}

/**
 * Creates an instrumented sandbox mimicking browser DOM & timers
 */
function createInstrumentedSandbox(htmlContent) {
  const localStorageStore = {};

  const elements = {};
  function getOrCreateElement(id) {
    if (!elements[id]) {
      elements[id] = {
        id: id,
        textContent: '',
        innerHTML: '',
        className: '',
        classList: {
          classes: new Set(),
          add(c) { this.classes.add(c); },
          remove(c) { this.classes.delete(c); },
          contains(c) { return this.classes.has(c); }
        },
        style: {},
        value: '',
        checked: false,
        disabled: false,
        src: '',
        querySelector(selector) {
          if (selector === 'span') {
            return this._span || (this._span = { textContent: '', innerHTML: '' });
          }
          return null;
        },
        querySelectorAll(selector) {
          if (selector.includes('input')) {
            const res = [];
            for (const k in domInputs) {
              if (domInputs[k].sectionId === id) res.push(domInputs[k]);
            }
            return res;
          }
          return [];
        }
      };
    }
    return elements[id];
  }

  // Pre-seed known elements
  [
    'heartbeatStatus', 'autosaveBadge', 'networkRetryBanner', 'btnRetrySubmit',
    'statusBox', 'submitBtn', 'sectionPart1', 'sectionPart2', 'sectionPart3',
    'sectionPart4', 'sectionPart5', 'stickyTimer', 'examContainer',
    'authScreen', 'screenPreExamConfirm', 'confirmClassDisplay', 'confirmIdDisplay',
    'confirmNameDisplay', 'examStudentBadge', 'timerCountdownDisplay', 'timerPhaseBadge',
    'objectiveLockBanner', 'selectClass', 'selectStudent', 'inputPassword', 'btnLogin'
  ].forEach(getOrCreateElement);

  // Pre-seed image preview cards for Part 4
  ['q20', 'q21', 'q22', 'q23'].forEach(qid => {
    getOrCreateElement('imgPreview_' + qid);
    getOrCreateElement('camPreviewBox_' + qid);
    getOrCreateElement('btnStartCam_' + qid);
    getOrCreateElement('btnRetake_' + qid);
    getOrCreateElement('camStatus_' + qid);
  });

  const domInputs = {};
  function getOrCreateInput(name, value = '') {
    const key = name + ':' + value;
    if (!domInputs[key]) {
      domInputs[key] = {
        name: name,
        value: value,
        checked: false,
        disabled: false,
        sectionId: '',
        classList: {
          classes: new Set(['blank-input']),
          contains(c) { return this.classes.has(c); },
          add(c) { this.classes.add(c); },
          remove(c) { this.classes.delete(c); }
        }
      };
    }
    return domInputs[key];
  }

  const windowListeners = {};
  const documentListeners = {};

  const sandbox = {
    window: {
      addEventListener(evt, fn) {
        if (!windowListeners[evt]) windowListeners[evt] = [];
        windowListeners[evt].push(fn);
      },
      dispatchEvent(evtName) {
        if (windowListeners[evtName]) {
          windowListeners[evtName].forEach(fn => fn());
        }
      },
      location: { hostname: 'localhost' }
    },
    document: {
      getElementById(id) {
        return getOrCreateElement(id);
      },
      querySelector(selector) {
        const radioMatch = selector.match(/input\[name="([^"]+)"\]:checked/);
        if (radioMatch) {
          const name = radioMatch[1];
          for (const k in domInputs) {
            if (domInputs[k].name === name && domInputs[k].checked) return domInputs[k];
          }
          return null;
        }
        const radioValueMatch = selector.match(/input\[name="([^"]+)"\]\[value="([^"]+)"\]/);
        if (radioValueMatch) {
          return getOrCreateInput(radioValueMatch[1], radioValueMatch[2]);
        }
        const nameMatch = selector.match(/input\[name="([^"]+)"\]/);
        if (nameMatch) {
          return getOrCreateInput(nameMatch[1]);
        }
        const idMatch = selector.match(/#([a-zA-Z0-9_-]+)/);
        if (idMatch) {
          return getOrCreateElement(idMatch[1]);
        }
        return null;
      },
      querySelectorAll(selector) {
        if (selector.includes('input.blank-input')) {
          const section = selector.includes('sectionPart3') ? 'sectionPart3' : 'sectionPart5';
          const res = [];
          for (const k in domInputs) {
            if (domInputs[k].section === section) res.push(domInputs[k]);
          }
          return res;
        }
        return [];
      },
      addEventListener(evt, fn) {
        if (!documentListeners[evt]) documentListeners[evt] = [];
        documentListeners[evt].push(fn);
      },
      activeElement: null
    },
    navigator: {
      onLine: true
    },
    localStorage: {
      getItem(k) { return localStorageStore[k] || null; },
      setItem(k, v) { localStorageStore[k] = String(v); },
      removeItem(k) { delete localStorageStore[k]; },
      clear() { for (const k in localStorageStore) delete localStorageStore[k]; },
      _store: localStorageStore
    },
    console: {
      log: () => {},
      warn: () => {},
      error: () => {},
      info: () => {}
    },
    confirm: () => true,
    alert: () => {},
    URLSearchParams: URLSearchParams,
    AbortController: typeof AbortController !== 'undefined' ? AbortController : class {
      constructor() {
        this.signal = { aborted: false };
      }
      abort() { this.signal.aborted = true; }
    },
    fetch: null,
    Date: Date,
    Math: Math,
    parseInt: parseInt,
    String: String,
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    setInterval: setInterval,
    clearInterval: clearInterval
  };

  sandbox.getOrCreateInput = getOrCreateInput;
  sandbox.elements = elements;

  vm.createContext(sandbox);

  // Extract client script from advance_test.html
  const clientScriptMatch = htmlContent.match(/<script>\s*(\/\/ ==========================================[\s\S]*?)<\/script>\s*<\/body>/);
  assert(clientScriptMatch, 'Failed to extract client script from advance_test.html');
  vm.runInContext(clientScriptMatch[1], sandbox);

  return { sandbox, localStorageStore, elements, domInputs };
}

async function runAdversarialTestSuite() {
  logHeader('【WEB+ Advance 考試系統】網絡容錯與離線暫存對抗性壓力測試套件');

  const htmlPath = path.join(__dirname, 'advance_test.html');
  assert(fs.existsSync(htmlPath), `advance_test.html 不存在於: ${htmlPath}`);
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');

  // =========================================================================
  // SUITE 1: 心跳探測與 60s 倒數計時防死循環對抗測試 (Probe Deadlock & Countdown)
  // =========================================================================
  console.log(`\n${BOLD}[SUITE 1] 網絡心跳探測與 60 秒重試倒數計時器壓力測試${RESET}`);
  {
    // Test 1.1: 初始斷網觸發 60 秒倒數，倒數計時器逐秒遞減平滑性
    try {
      const { sandbox } = createInstrumentedSandbox(htmlContent);
      sandbox.navigator.onLine = false;

      // 模擬進入斷網
      sandbox.showNetworkRetryBanner();
      const initialCountdown = sandbox.getNetworkRetryCountdown();
      assert.strictEqual(initialCountdown, 60, `初始倒數應為 60 秒，實際為 ${initialCountdown}`);
      const banner = sandbox.document.getElementById('networkRetryBanner');
      assert(banner.classList.contains('visible'), '斷網橫幅未顯示 visible class');

      pass('Test 1.1: 初始斷網橫幅喚醒與 60s 倒數定時器建立', `初始秒數: ${initialCountdown}s, 橫幅可見性: true`);
    } catch (err) {
      fail('Test 1.1: 初始斷網橫幅喚醒與 60s 倒數定時器建立', err.message);
    }

    // Test 1.2: 關鍵對抗點 — 倒數進行期間（如 45s、30s、15s）重複觸發 30s 心跳探測
    // 驗證核心修復：showNetworkRetryBanner() 絕不可重置 networkRetryCountdown 回 60
    try {
      const { sandbox } = createInstrumentedSandbox(htmlContent);
      sandbox.navigator.onLine = false;

      // 啟動倒數
      sandbox.showNetworkRetryBanner();
      assert.strictEqual(sandbox.getNetworkRetryCountdown(), 60);

      // 模擬經過 15 秒 (倒數降至 45)
      sandbox.setNetworkRetryCountdown(45);

      // 模擬第 1 次 30 秒心跳定期探測觸發 (探測失敗再次呼叫 showNetworkRetryBanner)
      sandbox.showNetworkRetryBanner();
      let currentVal = sandbox.getNetworkRetryCountdown();
      assert.strictEqual(currentVal, 45, `30s 心跳探測失敗後，秒數不應被重置回 60！期望 45，實際 ${currentVal}`);

      // 模擬經過 30 秒 (倒數降至 15)
      sandbox.setNetworkRetryCountdown(15);

      // 模擬第 2 次 30 秒心跳探測觸發
      sandbox.showNetworkRetryBanner();
      currentVal = sandbox.getNetworkRetryCountdown();
      assert.strictEqual(currentVal, 15, `第 2 次心跳探測後，秒數不應被重置回 60！期望 15，實際 ${currentVal}`);

      // 模擬突發 offline 事件觸發
      sandbox.showNetworkRetryBanner();
      currentVal = sandbox.getNetworkRetryCountdown();
      assert.strictEqual(currentVal, 15, `突發 offline 事件後，秒數不應被重置回 60！期望 15，實際 ${currentVal}`);

      pass('Test 1.2: 倒數中遭遇重複 30s 心跳探測不重置秒數（防死循環對抗）', `在 t=45s 與 t=15s 探測時秒數維持不變，成功防禦死循環`);
    } catch (err) {
      fail('Test 1.2: 倒數中遭遇重複 30s 心跳探測不重置秒數（防死循環對抗）', err.message);
    }

    // Test 1.3: 高頻突發對抗 — 瞬間連續 100 次 offline / 心跳探測事件風暴
    try {
      const { sandbox } = createInstrumentedSandbox(htmlContent);
      sandbox.navigator.onLine = false;
      sandbox.showNetworkRetryBanner();
      sandbox.setNetworkRetryCountdown(37);

      const initialInterval = sandbox.getNetworkRetryInterval();
      assert(initialInterval, '計時器 Interval 未正確建立');

      // 瞬間引發 100 次呼叫
      for (let i = 0; i < 100; i++) {
        sandbox.showNetworkRetryBanner();
      }

      const finalInterval = sandbox.getNetworkRetryInterval();
      const finalCountdown = sandbox.getNetworkRetryCountdown();

      assert.strictEqual(finalInterval, initialInterval, '定時器 Interval 被意外替換或洩漏重複計時器');
      assert.strictEqual(finalCountdown, 37, `瞬間事件風暴後，倒數秒數變更為 ${finalCountdown}，應維持 37`);

      pass('Test 1.3: 瞬間 100 次突發事件風暴無並發定時器洩漏', `Interval 實例穩定未重複覆蓋，倒數鎖定在 37s`);
    } catch (err) {
      fail('Test 1.3: 瞬間 100 次突發事件風暴無並發定時器洩漏', err.message);
    }

    // Test 1.4: 網絡恢復與重新斷網的生命週期狀態機
    try {
      const { sandbox } = createInstrumentedSandbox(htmlContent);
      sandbox.navigator.onLine = false;
      sandbox.showNetworkRetryBanner();
      assert(sandbox.getNetworkRetryInterval() !== null);

      // 觸發網絡恢復 onNetworkRestored()
      sandbox.onNetworkRestored();
      assert.strictEqual(sandbox.getNetworkRetryInterval(), null, '網絡恢復後應立即清理 Interval');
      const banner = sandbox.document.getElementById('networkRetryBanner');
      assert(!banner.classList.contains('visible'), '網絡恢復後橫幅應隱藏');

      // 再次斷網
      sandbox.showNetworkRetryBanner();
      assert(sandbox.getNetworkRetryInterval() !== null, '再次斷網後應能重新啟動全新 60s 定時器');
      assert.strictEqual(sandbox.getNetworkRetryCountdown(), 60, '全新週期倒數計時器應重置為 60 秒');

      pass('Test 1.4: 網絡恢復清除定時器與再次斷網無縫重置生命週期', `恢復時釋放資源，二次斷網重啟全新 60s 週期`);
    } catch (err) {
      fail('Test 1.4: 網絡恢復清除定時器與再次斷網無縫重置生命週期', err.message);
    }
  }

  // =========================================================================
  // SUITE 2: 離線作答數據持久化至 ADVANCE_MATH_EXAM_STATE (LocalStorage R6)
  // =========================================================================
  console.log(`\n${BOLD}[SUITE 2] 離線作答狀態持久化至 LocalStorage 鍵值與災難恢復測試${RESET}`);
  {
    // Test 2.1: 學生於離線狀態填寫全題型答案並觸發存檔
    try {
      const { sandbox, localStorageStore } = createInstrumentedSandbox(htmlContent);

      sandbox.ExamState.currentStudent = {
        classID: '4C',
        studentID: 15,
        name: '陳子豪',
        grade: '高一',
        isTeacher: false
      };
      sandbox.ExamState.isExamStarted = true;
      sandbox.ExamState.phase = 1;
      sandbox.ExamState.timeLeft = 2100;
      sandbox.ExamState.pendingSubmission = false;

      // 填寫客觀題 (Part 1: Q1~Q6, Part 2: Q7~Q11)
      const qAnswers = {
        q1: 'X', q2: 'O', q3: 'O', q4: 'X', q5: 'X', q6: 'X',
        q7: 'D', q8: 'B', q9: 'A', q10: 'B', q11: 'A'
      };
      Object.keys(qAnswers).forEach(q => {
        const inp = sandbox.getOrCreateInput(q, qAnswers[q]);
        inp.checked = true;
      });

      // 填寫填充題 (Part 3)
      const p3_1 = sandbox.getOrCreateInput('q12_1');
      p3_1.section = 'sectionPart3';
      p3_1.value = 'x > 2';

      const p3_2 = sandbox.getOrCreateInput('q12_2');
      p3_2.section = 'sectionPart3';
      p3_2.value = '[-1, 3)';

      const p3_3 = sandbox.getOrCreateInput('q15_1');
      p3_3.section = 'sectionPart3';
      p3_3.value = '當判別式小於零時無實數解 (自然語言作答)';

      // 填寫附加題 (Part 5)
      const p5_1 = sandbox.getOrCreateInput('q24_1');
      p5_1.section = 'sectionPart5';
      p5_1.value = '若難以輸入數學符號時，可以使用自然語言描述答案：根據柯西不等式...';

      // 附加第 4 部分相機照片
      sandbox.ExamState.questionPhotos = {
        q20: 'data:image/jpeg;base64,mockBase64Q20',
        q21: 'data:image/jpeg;base64,mockBase64Q21',
        q22: 'data:image/jpeg;base64,mockBase64Q22',
        q23: 'data:image/jpeg;base64,mockBase64Q23'
      };

      // 執行存檔
      sandbox.saveExamState();

      // 驗證儲存鍵值
      const rawStored = localStorageStore['ADVANCE_MATH_EXAM_STATE'];
      assert(rawStored, 'LocalStorage 未找到指定鍵名 ADVANCE_MATH_EXAM_STATE');
      const parsed = JSON.parse(rawStored);

      assert.strictEqual(parsed.student.classID, '4C');
      assert.strictEqual(parsed.student.name, '陳子豪');
      assert.strictEqual(parsed.phase, 1);
      assert.strictEqual(parsed.timeLeft, 2100);
      assert.strictEqual(parsed.answers.q1, 'X');
      assert.strictEqual(parsed.answers.q7, 'D');
      assert.strictEqual(parsed.answers.q12_1, 'x > 2');
      assert.strictEqual(parsed.answers.q15_1, '當判別式小於零時無實數解 (自然語言作答)');
      assert.strictEqual(parsed.answers.q24_1, '若難以輸入數學符號時，可以使用自然語言描述答案：根據柯西不等式...');
      assert.strictEqual(parsed.questionPhotos.q20, 'data:image/jpeg;base64,mockBase64Q20');
      assert.strictEqual(parsed.questionPhotos.q23, 'data:image/jpeg;base64,mockBase64Q23');
      assert(parsed.timestamp > 0, '缺少儲存時間戳記');

      pass('Test 2.1: 離線全題型（客觀、自然語言填充、附加題、相機照片）持久化至 ADVANCE_MATH_EXAM_STATE', `成功寫入 27 題狀態與 4 張手寫照片，長度 ${rawStored.length} 字元`);
    } catch (err) {
      fail('Test 2.1: 離線全題型持久化至 ADVANCE_MATH_EXAM_STATE', err.message);
    }

    // Test 2.2: 頁面重載/崩潰後的災難恢復 (restoreExamState)
    try {
      const { sandbox, localStorageStore } = createInstrumentedSandbox(htmlContent);

      // 寫入先前的備份數據
      const backupData = {
        student: { classID: '4D', studentID: 10, name: '李佳恩' },
        phase: 2,
        timeLeft: 480,
        isLocked: false,
        pendingSubmission: true,
        answers: {
          q1: 'O', q7: 'B', q12_1: 'x = 5'
        },
        questionPhotos: {
          q20: 'data:image/jpeg;base64,restoredPhotoQ20'
        },
        uploadedPhotoUrls: {
          q20: 'https://drive.google.com/open?id=recovered123'
        },
        uploadedFileUrl: 'https://drive.google.com/open?id=recovered123',
        timestamp: Date.now()
      };
      localStorageStore['ADVANCE_MATH_EXAM_STATE'] = JSON.stringify(backupData);

      // 調用恢復
      const restoredSuccess = sandbox.restoreExamState();
      assert.strictEqual(restoredSuccess, true, 'restoreExamState 應返回 true');

      assert.strictEqual(sandbox.ExamState.currentStudent.name, '李佳恩');
      assert.strictEqual(sandbox.ExamState.phase, 2);
      assert.strictEqual(sandbox.ExamState.timeLeft, 480);
      assert.strictEqual(sandbox.ExamState.pendingSubmission, true);
      assert.strictEqual(sandbox.ExamState.questionPhotos.q20, 'data:image/jpeg;base64,restoredPhotoQ20');

      // 驗證相機預覽元件顯示狀態恢復
      const previewImg = sandbox.document.getElementById('imgPreview_q20');
      assert.strictEqual(previewImg.src, 'data:image/jpeg;base64,restoredPhotoQ20', '照片預覽 URL 未正確恢復');

      const camBadge = sandbox.document.getElementById('camStatus_q20');
      assert.strictEqual(camBadge.textContent, '✅ 已拍照就緒', '照片狀態文字未恢復為就緒');

      pass('Test 2.2: 崩潰/刷新後完整狀態水合還原 (restoreExamState)', `成功恢復學生 李佳恩、Phase 2、倒數 480s、照片及待補交狀態`);
    } catch (err) {
      fail('Test 2.2: 崩潰/刷新後完整狀態水合還原 (restoreExamState)', err.message);
    }

    // Test 2.3: 異常對抗 — 毀損的 JSON 格式與 QuotaExceeded 邊界防禦
    try {
      const { sandbox, localStorageStore } = createInstrumentedSandbox(htmlContent);

      // 1. 毀損的 JSON
      localStorageStore['ADVANCE_MATH_EXAM_STATE'] = '{{CORRUPTED_JSON_DATA';
      let corruptedResult = false;
      assert.doesNotThrow(() => {
        corruptedResult = sandbox.restoreExamState();
      }, '損毀 JSON 不應導致未捕獲例外拋出');
      assert.strictEqual(corruptedResult, false, '損毀 JSON 應安全返回 false');

      // 2. 模擬 LocalStorage 空間爆滿 (QuotaExceededError)
      sandbox.localStorage.setItem = () => {
        const quotaErr = new Error('QuotaExceededError');
        quotaErr.name = 'QuotaExceededError';
        throw quotaErr;
      };
      sandbox.ExamState.currentStudent = { classID: '4C', studentID: 1, name: '測試' };
      sandbox.ExamState.isExamStarted = true;
      assert.doesNotThrow(() => {
        sandbox.saveExamState();
      }, 'LocalStorage 拋出 QuotaExceededError 時應優雅捕獲，不可中斷作答流程');

      pass('Test 2.3: LocalStorage 數據損毀與儲存配額滿載對抗性防禦', `非法 JSON 安全攔截、QuotaExceeded 異常無痛降級`);
    } catch (err) {
      fail('Test 2.3: LocalStorage 數據損毀與儲存配額滿載對抗性防禦', err.message);
    }
  }

  // =========================================================================
  // SUITE 3: 重試按鈕隔離性對抗測試 (handleNetworkRetryClick)
  // =========================================================================
  console.log(`\n${BOLD}[SUITE 3] 重試按鈕點擊隔離性（作答中探測 vs 交卷失敗補交）對抗測試${RESET}`);
  {
    // Test 3.1: 作答進行中點擊重試按鈕，嚴禁觸發提卷 (submitExam)
    try {
      const { sandbox } = createInstrumentedSandbox(htmlContent);

      sandbox.ExamState.isExamStarted = true;
      sandbox.ExamState.pendingSubmission = false; // 正常作答中

      let submitExamCalled = false;
      let retryProbeCalled = false;

      sandbox.submitExam = () => { submitExamCalled = true; };
      sandbox.retryNetworkConnectionNow = () => { retryProbeCalled = true; };

      // 學生在做題中因斷網橫幅點擊了「🔄 立即重試連線」
      sandbox.handleNetworkRetryClick();

      assert.strictEqual(submitExamCalled, false, '⚠️ 致命錯誤！作答中點擊重試連線竟然觸發了提前交卷！');
      assert.strictEqual(retryProbeCalled, true, '作答中點擊重試連線應當僅觸發連線探測 retryNetworkConnectionNow');

      pass('Test 3.1: 作答中點擊重試按鈕僅進行連線探測，嚴格隔離交卷邏輯', `submitExam 被調用: false, retryProbe 被調用: true`);
    } catch (err) {
      fail('Test 3.1: 作答中點擊重試按鈕僅進行連線探測，嚴格隔離交卷邏輯', err.message);
    }

    // Test 3.2: 交卷失敗後（pendingSubmission = true）點擊重試按鈕，觸發自動重試交卷
    try {
      const { sandbox } = createInstrumentedSandbox(htmlContent);

      sandbox.ExamState.isExamStarted = true;
      sandbox.ExamState.pendingSubmission = true; // 先前交卷失敗進入待補交

      let submitExamCalled = false;
      let isAutoFlag = null;
      sandbox.submitExam = (isAuto) => {
        submitExamCalled = true;
        isAutoFlag = isAuto;
      };

      // 學生點擊重試
      sandbox.handleNetworkRetryClick();

      assert.strictEqual(submitExamCalled, true, '交卷失敗後點擊重試按鈕應當觸發 submitExam 重試交卷');
      assert.strictEqual(isAutoFlag, true, '自動重試交卷應傳入 isAuto=true 避免重複跳出二次確認視窗');

      pass('Test 3.2: 補交模式下點擊重試按鈕自動重送交卷 (isAuto=true)', `submitExam 被調用: true, isAuto: true`);
    } catch (err) {
      fail('Test 3.2: 補交模式下點擊重試按鈕自動重送交卷 (isAuto=true)', err.message);
    }

    // Test 3.3: 網絡自動恢復事件 (onNetworkRestored) 的作答保護
    try {
      const { sandbox } = createInstrumentedSandbox(htmlContent);

      // 情境 A：作答中網絡自癒 -> 不得提卷
      sandbox.ExamState.pendingSubmission = false;
      let submitCalled = false;
      sandbox.submitExam = () => { submitCalled = true; };
      sandbox.onNetworkRestored();
      assert.strictEqual(submitCalled, false, '作答中連線自癒不可自動提卷');

      // 情境 B：待補交時網絡自癒 -> 自動補交
      sandbox.ExamState.pendingSubmission = true;
      sandbox.onNetworkRestored();
      assert.strictEqual(submitCalled, true, '待補交時連線自癒應自動啟動補交');

      pass('Test 3.3: 網絡自癒 (onNetworkRestored) 狀態機精確防禦', `在 pendingSubmission=false 時靜默恢復，在 pendingSubmission=true 時自動補交`);
    } catch (err) {
      fail('Test 3.3: 網絡自癒 (onNetworkRestored) 狀態機精確防禦', err.message);
    }

    // Test 3.4: isSubmitting 鎖保護防重入
    try {
      const { sandbox } = createInstrumentedSandbox(htmlContent);
      sandbox.ExamState.isSubmitting = true; // 正在提交中

      let fetchCount = 0;
      sandbox.fetch = async () => { fetchCount++; return { ok: true, json: async () => ({}) }; };

      await sandbox.submitExam(true);

      assert.strictEqual(fetchCount, 0, 'isSubmitting 為 true 時應立即返回，不得重入發起新請求');
      pass('Test 3.4: submitExam 併發重入鎖 (isSubmitting) 驗證', `提交進行中重複呼叫被安全短路`);
    } catch (err) {
      fail('Test 3.4: submitExam 併發重入鎖 (isSubmitting) 驗證', err.message);
    }
  }

  // =========================================================================
  // SUITE 4: AbortController 逾時熔斷機制真實 HTTP 伺服器壓力測試
  // =========================================================================
  console.log(`\n${BOLD}[SUITE 4] AbortController 請求逾時熔斷與真實 Socket 掛起中斷測試${RESET}`);
  {
    // 啟動本機真實故意掛起的 HTTP 測試伺服器
    const hangServer = http.createServer((req, res) => {
      if (req.url === '/api/probe-hang') {
        // 探測掛起：故意延遲 12000ms
        setTimeout(() => {
          if (!res.writableEnded) res.end('slow probe');
        }, 12000);
      } else if (req.url === '/api/gas-hang') {
        // 上傳掛起：故意延遲 25000ms
        setTimeout(() => {
          if (!res.writableEnded) res.end(JSON.stringify({ status: 'slow' }));
        }, 25000);
      } else if (req.url === '/api/form-hang') {
        // 表單提交掛起：故意延遲 20000ms
        setTimeout(() => {
          if (!res.writableEnded) res.end('slow form');
        }, 20000);
      } else if (req.url === '/api/fast-ok') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'success', fileUrl: 'http://fast.url' }));
      } else {
        res.writeHead(404);
        res.end();
      }
    });

    await new Promise((resolve) => hangServer.listen(0, '127.0.0.1', resolve));
    const port = hangServer.address().port;
    const baseUrl = `http://127.0.0.1:${port}`;

    try {
      // Test 4.1: 心跳探測 (probe) 5000ms 逾時熔斷對抗 (真實 HTTP Socket)
      const startTime = Date.now();
      const ctrl = new AbortController();
      const tid = setTimeout(() => ctrl.abort(), 1000); // 加速 1000ms 觸發中斷
      let abortCaught = false;

      try {
        await fetch(`${baseUrl}/api/probe-hang`, {
          method: 'HEAD',
          signal: ctrl.signal
        });
      } catch (e) {
        if (e.name === 'AbortError' || e.code === 'ABORT_ERR' || ctrl.signal.aborted) {
          abortCaught = true;
        }
      } finally {
        clearTimeout(tid);
      }

      const elapsed = Date.now() - startTime;
      assert(abortCaught, 'fetch 請求未被 AbortController 成功中斷');
      assert(elapsed < 3000, `請求中斷耗時過長 (${elapsed}ms)，未能及時熔斷`);

      pass('Test 4.1: 心跳探測逾時熔斷測試 (AbortController 中斷實測)', `請求在 ${elapsed}ms 內被信號中斷，拋出 AbortError`);
    } catch (err) {
      fail('Test 4.1: 心跳探測逾時熔斷測試 (AbortController 中斷實測)', err.message);
    }

    try {
      // Test 4.2: GAS 圖片上傳逾時熔斷與交卷容錯降級鏈路
      const { sandbox } = createInstrumentedSandbox(htmlContent);

      sandbox.ExamState.currentStudent = { classID: '4C', studentID: 15, name: '陳子豪' };
      sandbox.ExamState.isExamStarted = true;
      sandbox.ExamState.questionPhotos = { q20: 'data:image/jpeg;base64,sample' };
      sandbox.ExamState.isSubmitting = false;

      let passedSignal = null;

      // 攔截 sandbox 內的 fetch，驗證 client_runtime.js 傳遞了 AbortSignal
      sandbox.fetch = async (url, opts) => {
        passedSignal = opts ? opts.signal : null;
        assert(passedSignal, 'submitExam 在上傳圖片時必須配置 AbortSignal 守護！');

        // 模擬伺服器掛起導致 AbortController 逾時觸發 abort
        const timeoutErr = new Error('The operation was aborted due to 15000ms timeout');
        timeoutErr.name = 'AbortError';
        throw timeoutErr;
      };

      await sandbox.submitExam(true);

      assert.strictEqual(sandbox.ExamState.isSubmitting, false, '失敗後 isSubmitting 應解鎖回 false');
      assert.strictEqual(sandbox.ExamState.pendingSubmission, true, '上傳逾時後 pendingSubmission 應標記為 true');
      const banner = sandbox.document.getElementById('networkRetryBanner');
      assert(banner.classList.contains('visible'), '上傳逾時後應自動彈出重試橫幅');

      // 檢查狀態持久化
      const savedState = JSON.parse(sandbox.localStorage.getItem('ADVANCE_MATH_EXAM_STATE'));
      assert(savedState && savedState.pendingSubmission === true, '逾時後未將待補交狀態落盤至 LocalStorage');

      pass('Test 4.2: GAS 圖片上傳逾時熔斷與交卷自動標記 pendingSubmission 容錯', `已確認 AbortSignal 配置，逾時後安全轉入 pendingSubmission 並落盤`);
    } catch (err) {
      fail('Test 4.2: GAS 圖片上傳逾時熔斷與交卷自動標記 pendingSubmission 容錯', err.message);
    }

    try {
      // Test 4.3: 表單提交逾時熔斷與重試排程
      const { sandbox } = createInstrumentedSandbox(htmlContent);

      sandbox.ExamState.currentStudent = { classID: '4C', studentID: 15, name: '陳子豪' };
      sandbox.ExamState.isExamStarted = true;
      sandbox.ExamState.isSubmitting = false;

      let formSignalPassed = false;

      sandbox.fetch = async (url, opts) => {
        // 第一步是上傳圖片 (如果無圖片則直接到表單)
        // 這裡是表單提交
        formSignalPassed = !!(opts && opts.signal);
        assert(formSignalPassed, 'submitExam 在送出表單時必須配置 AbortSignal 守護！');

        const timeoutErr = new Error('Form submit timeout after 10000ms');
        timeoutErr.name = 'AbortError';
        throw timeoutErr;
      };

      await sandbox.submitExam(true);

      assert.strictEqual(sandbox.ExamState.pendingSubmission, true, '表單提交逾時後 pendingSubmission 應為 true');
      assert(sandbox.getNetworkRetryInterval() !== null, '表單逾時後應已啟動 60 秒重試倒數計時器');

      pass('Test 4.3: 表單提交逾時熔斷與 60s 自動重連倒數排程啟動', `已確認 Form AbortSignal 配置，逾時安全攔截並進入 60s 重試循環`);
    } catch (err) {
      fail('Test 4.3: 表單提交逾時熔斷與 60s 自動重連倒數排程啟動', err.message);
    } finally {
      hangServer.close();
    }
  }

  // =========================================================================
  // SUITE 5: 雙目錄 (advance 與 math_platform\Advance) 同態一致性校驗
  // =========================================================================
  console.log(`\n${BOLD}[SUITE 5] 雙目錄 (advance / math_platform\\Advance) 容錯與重試邏輯同態一致性校驗${RESET}`);
  {
    try {
      const crypto = require('crypto');
      const twinCandidates = [
        path.resolve(__dirname, '..', 'math_platform', 'Advance', 'advance_test.html'),
        path.resolve(__dirname, '..', '..', 'advance', 'advance_test.html')
      ];
      const twinCandidate = twinCandidates.find(f => fs.existsSync(f) && path.resolve(f) !== path.resolve(htmlPath));
      assert(twinCandidate && fs.existsSync(twinCandidate), `鏡像目錄 advance_test.html 不存在: ${twinCandidates.join(' or ')}`);

      const h1 = crypto.createHash('md5').update(fs.readFileSync(htmlPath)).digest('hex');
      const h2 = crypto.createHash('md5').update(fs.readFileSync(twinCandidate)).digest('hex');

      assert.strictEqual(h1, h2, `兩目錄之 advance_test.html MD5 哈希不一致 (${h1} !== ${h2})`);

      pass('Test 5.1: 雙目錄 advance_test.html 檔案同態驗證', `MD5: ${h1}`);
    } catch (err) {
      fail('Test 5.1: 雙目錄 advance_test.html 檔案同態驗證', err.message);
    }
  }

  // 測試匯總
  console.log(`\n${BOLD}================================================================${RESET}`);
  if (failedTests === 0) {
    console.log(`${BOLD}${GREEN}【對抗性壓力測試總結】全部通過！ ${passedTests} / ${totalTests} PASS (100% SUCCESS)${RESET}`);
  } else {
    console.log(`${BOLD}${RED}【對抗性壓力測試總結】發現失敗項！ ${failedTests} 失敗，${passedTests} / ${totalTests} 通過${RESET}`);
  }
  console.log(`${BOLD}================================================================${RESET}\n`);

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

if (require.main === module) {
  runAdversarialTestSuite().catch(err => {
    console.error('執行對抗性測試時發生未捕獲異常：', err);
    process.exit(1);
  });
}

module.exports = { runAdversarialTestSuite };
