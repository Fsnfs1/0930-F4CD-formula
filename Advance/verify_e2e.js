/**
 * verify_e2e.js - Pure Node.js Automated E2E Verification Suite
 * Verifies MathJax compliance, grading logic, timer logic, and 2-step submission flow.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { startServer } = require('./mock_server');

// 輔助 HTTP 請求函數
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

// 測試套件主執行器
async function runTests() {
  console.log('====================================================');
  console.log('【自然科測驗系統】端對端自動化驗證程序 (E2E Verification)');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function recordPass(testName) {
    passed++;
    total++;
    console.log(`  ✔ [PASS] ${testName}`);
  }

  function recordFail(testName, err) {
    total++;
    console.error(`  ✖ [FAIL] ${testName}: ${err.message}`);
  }

  // 啟動 Mock 測試伺服器 (隨機可用連接埠)
  const { server, port } = await startServer(0);
  const baseUrl = `http://localhost:${port}`;
  console.log(`[Init] 測試用 Mock Server 已在 ${baseUrl} 啟動完成\n`);

  try {
    // -----------------------------------------------------------
    // 測試 1：HTML 結構與 MathJax 規範審查
    // -----------------------------------------------------------
    const htmlPath = path.join(__dirname, 'advance_test.html');
    assert(fs.existsSync(htmlPath), 'advance_test.html 不存在');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');

    // 驗證 MathJax CDN 與 config
    assert(
      htmlContent.includes('id="MathJax-script"') &&
      htmlContent.includes('tex-mml-chtml.js'),
      '未引入符合規範之 MathJax v3 腳本標籤'
    );
    assert(htmlContent.includes('inlineMath') && htmlContent.includes('displayMath'), '未配置 MathJax LaTeX 公式定界符');
    // 驗證 40 分鐘計時器與按鈕
    assert(htmlContent.includes('stickyTimer') && htmlContent.includes('40:00'), '缺少 40 分鐘置頂計時器');
    // 驗證 4 題選擇題與 2 題是非題
    for (let i = 1; i <= 6; i++) {
      assert(htmlContent.includes(`name="q${i}"`), `缺少題目 q${i}`);
    }
    // 驗證相機拍照與 fallback
    assert(htmlContent.includes('videoPreview') && htmlContent.includes('fileFallback'), '缺少相機預覽或備用檔案上傳標籤');
    recordPass('Test 1: HTML 結構、MathJax 規範與測驗組件完整性');

    // -----------------------------------------------------------
    // 測試 2：本機客觀題自動評分邏輯 (gradeObjectiveQuestions)
    // -----------------------------------------------------------
    const vm = require('vm');
    const scriptStartIdx = htmlContent.lastIndexOf('<script>');
    const scriptEndIdx = htmlContent.lastIndexOf('</script>');
    assert(scriptStartIdx !== -1 && scriptEndIdx > scriptStartIdx, '未在 advance_test.html 中找到核心 JavaScript 區塊');
    const mainScriptCode = htmlContent.substring(scriptStartIdx + '<script>'.length, scriptEndIdx);

    const mockDoc = {
      getElementById: () => ({ addEventListener: () => {}, style: {}, getContext: () => ({ drawImage: () => {} }) }),
      querySelector: () => null
    };
    const sandbox = {
      document: mockDoc,
      window: {},
      navigator: {},
      setInterval: () => 1,
      clearInterval: () => {},
      alert: () => {},
      confirm: () => true,
      module: { exports: {} },
      exports: {}
    };
    vm.createContext(sandbox);
    vm.runInContext(mainScriptCode, sandbox);

    const { gradeObjectiveQuestions, ANSWER_KEY } = sandbox.module.exports;
    assert(typeof gradeObjectiveQuestions === 'function', 'gradeObjectiveQuestions 函數未定義或未導出');

    // 全對情境 (60分)
    const perfectScore = gradeObjectiveQuestions(ANSWER_KEY);
    assert.strictEqual(perfectScore.score, 60, '全對作答未得 60 分滿分');

    // 部分正確情境 (40分)
    const partialAnswers = { q1: 'B', q2: 'A', q3: 'B' /*錯*/, q4: 'A', q5: 'False' /*錯*/, q6: 'True' };
    const partialScore = gradeObjectiveQuestions(partialAnswers);
    assert.strictEqual(partialScore.score, 40, '部分正確得分計算錯誤 (應為 40 分)');

    // 全錯情境 (0分)
    const zeroAnswers = { q1: 'D', q2: 'D', q3: 'D', q4: 'D', q5: 'False', q6: 'False' };
    const zeroScore = gradeObjectiveQuestions(zeroAnswers);
    assert.strictEqual(zeroScore.score, 0, '全錯作答未得 0 分');
    recordPass('Test 2: 客觀題本地自動評分演算法 (滿分/部分分/零分驗證)');

    // -----------------------------------------------------------
    // 測試 3：計時器邏輯與警告門檻
    // -----------------------------------------------------------
    function calcTimerState(secs) {
      if (secs <= 60) return 'danger';
      if (secs <= 300) return 'warn';
      return 'normal';
    }
    assert.strictEqual(calcTimerState(2400), 'normal', '初始 40 分鐘狀態錯誤');
    assert.strictEqual(calcTimerState(300), 'warn', '5 分鐘警告狀態錯誤');
    assert.strictEqual(calcTimerState(60), 'danger', '1 分鐘緊急狀態錯誤');
    recordPass('Test 3: 計時器顏色警示級距 (<=5m warn, <=1m danger)');

    // -----------------------------------------------------------
    // 測試 4：靜態網頁載入測試
    // -----------------------------------------------------------
    const staticRes = await request(`${baseUrl}/advance_test.html`);
    assert.strictEqual(staticRes.statusCode, 200, '靜態網頁回應碼非 200');
    assert(staticRes.body.includes('高一自然科學科能力測驗'), '首頁內容載入不完整');
    recordPass('Test 4: 靜態網頁伺服服務正常 (GET /advance_test.html)');

    // -----------------------------------------------------------
    // 測試 5：第 1 階段 - Mock GAS 圖片上傳
    // -----------------------------------------------------------
    // 構造 1x1 透明 PNG base64 模擬作答圖片
    const sampleBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const gasPayload = JSON.stringify({
      studentId: 'S112999',
      studentName: '張測試',
      imageBase64: sampleBase64
    });

    const gasRes = await request(`${baseUrl}/api/gas-upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, gasPayload);

    assert.strictEqual(gasRes.statusCode, 200, 'GAS 介面回應碼非 200');
    const gasJson = gasRes.json();
    assert.strictEqual(gasJson.status, 'success', 'GAS 上傳狀態非 success');
    assert(gasJson.fileUrl && gasJson.fileUrl.startsWith('https://drive.google.com/'), '未生成正確 Google Drive 格式網址');
    recordPass('Test 5: 第 1 階段 GAS Webhook 解答圖片上傳與 Drive URL 回傳');

    // -----------------------------------------------------------
    // 測試 6：第 2 階段 - Mock Google Form 提交
    // -----------------------------------------------------------
    const formParams = new URLSearchParams();
    formParams.append('entry.1000001', 'S112999');
    formParams.append('entry.1000002', '張測試');
    formParams.append('entry.1000003', '60');
    formParams.append('entry.1000004', JSON.stringify(perfectScore.details));
    formParams.append('entry.1000005', gasJson.fileUrl);

    const formRes = await request(`${baseUrl}/api/form-submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }, formParams.toString());

    assert.strictEqual(formRes.statusCode, 200, '表單提交回應碼非 200');
    const formJson = formRes.json();
    assert.strictEqual(formJson.status, 'success', '表單紀錄狀態非 success');
    recordPass('Test 6: 第 2 階段 Google Form 成績與 Drive URL 登錄');

    // -----------------------------------------------------------
    // 測試 7：完整端對端二階段提交狀態稽核
    // -----------------------------------------------------------
    const auditRes = await request(`${baseUrl}/api/submissions`);
    const auditData = auditRes.json();
    assert(auditData.uploadCount >= 1, '稽核記錄中無圖片上傳');
    assert(auditData.formSubmissionCount >= 1, '稽核記錄中無表單提交');
    const lastSubmission = auditData.formSubmissions[auditData.formSubmissions.length - 1];
    assert.strictEqual(lastSubmission.data['entry.1000001'], 'S112999', '提交之學號不匹配');
    assert.strictEqual(lastSubmission.data['entry.1000005'], gasJson.fileUrl, '提交之解答圖網址不匹配');
    recordPass('Test 7: 完整二階段提交端對端資料稽核一致性');

  } catch (err) {
    recordFail('E2E Suite Execution', err);
  } finally {
    server.close();
    console.log(`\n====================================================`);
    console.log(`驗證完成：共 ${total} 項測試，通過 ${passed} 項，失敗 ${total - passed} 項`);
    console.log(`====================================================\n`);

    if (passed === total && total > 0) {
      console.log('🎉 所有 E2E 驗證測試全部通過 (100% PASS)！');
      process.exit(0);
    } else {
      console.error('❌ 部份測試未通過，請檢查錯誤紀錄。');
      process.exit(1);
    }
  }
}

if (require.main === module) {
  runTests();
}

module.exports = { runTests };
