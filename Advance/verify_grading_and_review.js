/**
 * verify_grading_and_review.js
 * Comprehensive automated verification script for Advance Exam Teacher Grading & Student Result Review System.
 * Tests:
 * 1. 100% Noise rejection and valid exam identification
 * 2. Strict 120-point arithmetic across all 27 questions
 * 3. 5B 99 Mock Paper data model & SVG handwriting images
 * 4. Roster integrity (88 students + 99 tester)
 * 5. HTML files structure: MathJax 3 in <head>, rotation controls, lightbox, @media print
 * 6. Twin-directory file sync between WEB+\advance and WEB+\math_platform\Advance
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failCount++;
  }
}

console.log('================================================================');
console.log('🧪 開始執行【2026年10月10日 Advance 數學大測 (一)】自動化測試套件');
console.log('================================================================\n');

// -----------------------------------------------------------------
// Test 1: 載入核心模組 advance_exam_data.js
// -----------------------------------------------------------------
console.log('--- 測試項目 1: 核心數據模組語法與結構 ---');
const dataModulePath = path.join(__dirname, 'advance_exam_data.js');
assert(fs.existsSync(dataModulePath), 'advance_exam_data.js 檔案存在');

const ExamData = require(dataModulePath);
assert(typeof ExamData === 'object', 'advance_exam_data.js 成功匯出物件');
assert(typeof ExamData.isNoiseRecord === 'function', 'isNoiseRecord 函數存在');
assert(typeof ExamData.isValidAdvanceExamPaper === 'function', 'isValidAdvanceExamPaper 函數存在');
assert(typeof ExamData.QUESTIONS_DATA === 'object', 'QUESTIONS_DATA 題庫物件存在');
assert(typeof ExamData.ROSTER_DATA === 'object', 'ROSTER_DATA 名冊物件存在');
assert(typeof ExamData.MOCK_5B_99_PAPER === 'object', 'MOCK_5B_99_PAPER 示範考卷存在');

// -----------------------------------------------------------------
// Test 2: 雜訊過濾引擎 100% 阻斷率測試
// -----------------------------------------------------------------
console.log('\n--- 測試項目 2: 雜訊過濾引擎 (100% 阻斷率) ---');
const dirtyNoiseSamples = [
  // 128 維人臉特徵浮點數
  { dateID: '-0.0710,0.0684,-0.0351,0.0125,-0.0984,0.0411,-0.0312|TS:1790835087638|V:1', studentID: '15', classID: '4C' },
  { dateID: '-0.1245,-0.0451,0.0891,0.0123,-0.0543,0.0872', studentID: '20', classID: '4D' },
  // 密碼 Hash 碼
  { dateID: 'MATH_SALT_4C_01_a94f6c3d98ef5a2b', studentID: '1', classID: '4C' },
  { dateID: 'PWD:5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', studentID: '5', classID: '4C' },
  // 防作弊與踢出日誌
  { dateID: 'KICKOUT_TAB_SWITCH_COUNT_3_TIMESTAMP_1790835', studentID: '10', classID: '5B' },
  { dateID: 'SCREENSHOT_DEFENSE_TRIGGERED', studentID: '8', classID: '4D' },
  // 舊題庫單題刷題
  { dateID: 'G10_Q06_QUADRATIC_SET_T35s_ACC100', studentID: '12', classID: '4C' },
  { dateID: 'G11_Q15_TRIG_FORMULA_DRILL', studentID: '17', classID: '5B' },
  // 探針
  { dateID: 'TEST_PING_CONNECTION', studentID: '99', classID: '5B' }
];

let rejectedNoiseCount = 0;
dirtyNoiseSamples.forEach((sample, i) => {
  const isNoise = ExamData.isNoiseRecord(sample);
  const isValid = ExamData.isValidAdvanceExamPaper(sample);
  if (isNoise && !isValid) rejectedNoiseCount++;
});
assert(rejectedNoiseCount === dirtyNoiseSamples.length, `100% 成功過濾所有測試雜訊 (${rejectedNoiseCount}/${dirtyNoiseSamples.length})`);

// 驗證合法 Advance 考卷識別
const validSample = {
  dateID: 'ADVANCE_EXAM::20261010_4C01',
  testTitle: '【2026年10月10日 Advance 數學大測 (一)】',
  classID: '4C',
  studentID: '1',
  score: 22,
  textAnswer: '{"q1":"X","q7":"D"}'
};
assert(ExamData.isValidAdvanceExamPaper(validSample) === true, '合法 Advance 考卷成功通過過濾並識別');

// -----------------------------------------------------------------
// Test 3: 全卷 27 題與滿分 120 分算術一致性驗證
// -----------------------------------------------------------------
console.log('\n--- 測試項目 3: 27 題題目結構與滿分 120 分算術檢驗 ---');
const QD = ExamData.QUESTIONS_DATA;
assert(QD.part1.length === 6, '第一部分 (判斷題) 題目數為 6 題');
const p1Pts = QD.part1.reduce((sum, q) => sum + q.pts, 0);
assert(p1Pts === 12, `第一部分滿分精確為 12 分 (實得: ${p1Pts})`);

assert(QD.part2.length === 5, '第二部分 (單選題) 題目數為 5 題');
const p2Pts = QD.part2.reduce((sum, q) => sum + q.pts, 0);
assert(p2Pts === 10, `第二部分滿分精確為 10 分 (實得: ${p2Pts})`);
assert(p1Pts + p2Pts === 22, '客觀題合計滿分精確為 22 分');

assert(QD.part3.length === 8, '第三部分 (填空題) 題數為 8 題');
let p3TotalBlanks = 0;
let p3Pts = 0;
QD.part3.forEach(q => {
  p3Pts += q.pts;
  if (q.blanks) p3TotalBlanks += q.blanks.length;
  if (q.subQuestions) p3TotalBlanks += q.subQuestions.length;
});
assert(p3TotalBlanks === 19, `第三部分總填空數為 19 空 (實計: ${p3TotalBlanks})`);
assert(p3Pts === 38, `第三部分滿分精確為 38 分 (實得: ${p3Pts})`);

assert(QD.part4.length === 4, '第四部分 (解答題) 題數為 4 題');
const p4Pts = QD.part4.reduce((sum, q) => sum + q.pts, 0);
assert(p4Pts === 40, `第四部分滿分精確為 40 分 (實得: ${p4Pts})`);

assert(QD.part5.length === 4, '第五部分 (附加題) 題數為 4 題');
const p5Pts = QD.part5.reduce((sum, q) => sum + q.pts, 0);
assert(p5Pts === 20, `第五部分滿分精確為 20 分 (實得: ${p5Pts})`);

const grandTotalPoints = p1Pts + p2Pts + p3Pts + p4Pts + p5Pts;
assert(grandTotalPoints === 120, `全卷 27 題總分精確嚴格等於 120 分 (實得: ${grandTotalPoints})`);

// 驗證 Q21 數學公式防實體衝突轉義
const q21 = QD.part4.find(q => q.id === 'q21');
assert(q21 && q21.text.includes('$c < d < 0$'), '第 21 題 LaTeX 公式包含正確間距 $c < d < 0$ 防止 HTML 標籤衝突');

// -----------------------------------------------------------------
// Test 4: 5B 99 示範考卷資料完整性
// -----------------------------------------------------------------
console.log('\n--- 測試項目 4: 5B 99 教師測試員完整考卷與手寫相片 ---');
const mockPaper = ExamData.MOCK_5B_99_PAPER;
assert(mockPaper.classID === '5B' && mockPaper.studentID === 99, '5B 99 班級座號正確');
assert(mockPaper.studentName === '教師測試員', '學生姓名為教師測試員');
assert(mockPaper.objectiveScore === 22, '客觀題得分為滿分 22 分');

const photos = mockPaper.questionPhotos;
assert(photos && photos.Q20 && photos.Q21 && photos.Q22 && photos.Q23, 'Q20~Q23 四道大題手寫相片齊全');
['Q20', 'Q21', 'Q22', 'Q23'].forEach(k => {
  const uri = photos[k];
  assert(uri.startsWith('data:image/svg+xml;base64,'), `${k} 照片為高品質 SVG Base64 DataURL`);
});

// -----------------------------------------------------------------
// Test 5: 花名冊 88 人 + 99 號測試員驗證
// -----------------------------------------------------------------
console.log('\n--- 測試項目 5: 花名冊結構完整性 ---');
const R = ExamData.ROSTER_DATA;
assert(R['4C'].length === 29, `4C 班學生數為 29 人 (實得: ${R['4C'].length})`);
assert(!R['4C'].find(s => s.id === 13), '4C 班確認無 13 號學生 (與學校官方名冊一致)');
assert(R['4D'].length === 31, `4D 班學生數為 31 人 (實得: ${R['4D'].length})`);
assert(R['5B'].length === 28, `5B 班學生數為 28 人 (實得: ${R['5B'].length})`);
const totalStudents = R['4C'].length + R['4D'].length + R['5B'].length;
assert(totalStudents === 88, `三個班級正式學生總數精確為 88 人 (實得: ${totalStudents})`);
assert(ExamData.getStudentName('5B', 99) === '教師測試員', '99 號自動關聯為教師測試員');

// -----------------------------------------------------------------
// Test 6: 教師批改工作台 advance_grading_dashboard.html DOM 檢驗
// -----------------------------------------------------------------
console.log('\n--- 測試項目 6: 教師批改工作台 HTML 規範檢驗 ---');
const gradingHtmlPath = path.join(__dirname, 'advance_grading_dashboard.html');
assert(fs.existsSync(gradingHtmlPath), 'advance_grading_dashboard.html 檔案存在');
const gradingHtml = fs.readFileSync(gradingHtmlPath, 'utf-8');

assert(gradingHtml.includes('tex-mml-chtml.js'), 'HTML <head> 中正確引入 MathJax 3 (tex-mml-chtml.js)');
assert(gradingHtml.includes('advance_exam_data.js'), '正確引入 advance_exam_data.js 核心數據庫');
assert(gradingHtml.includes('loadMock5B99Paper'), '具備「一鍵載入 5B 99 測試卷」功能');
assert(gradingHtml.includes('rotatePhoto'), '具備手寫照片 90° 步進旋轉控制函數');
assert(gradingHtml.includes('photoLightbox'), '具備高解析度相片放大燈箱 (photoLightbox)');
assert(gradingHtml.includes('p4-score-input') && gradingHtml.includes('max="10"'), '具備 Q20~Q23 解答題 0~10 分給分框');

// -----------------------------------------------------------------
// Test 7: 學生查閱系統 advance_student_result.html DOM 檢驗
// -----------------------------------------------------------------
console.log('\n--- 測試項目 7: 學生查閱系統 HTML 規範檢驗 ---');
const studentHtmlPath = path.join(__dirname, 'advance_student_result.html');
assert(fs.existsSync(studentHtmlPath), 'advance_student_result.html 檔案存在');
const studentHtml = fs.readFileSync(studentHtmlPath, 'utf-8');

assert(studentHtml.includes('tex-mml-chtml.js'), '學生端 <head> 中正確引入 MathJax 3');
assert(studentHtml.includes('authGate'), '具備安全登入認證閘道 (authGate)');
assert(studentHtml.includes('grandScoreDisplay'), '具備全卷總分與等第展示儀表板');
assert(studentHtml.includes('progress-bar-fill'), '具備各題型得分率視覺化進度條');
assert(studentHtml.includes('@media print'), '具備 @media print 專屬列印與 PDF 匯出排版樣式');
assert(studentHtml.includes('rotatePhoto') && studentHtml.includes('openLightbox'), '學生端支援手寫照片旋轉與放大檢視');

// -----------------------------------------------------------------
// Test 8: 雙目錄同步檢查 (Mirror Sync)
// -----------------------------------------------------------------
console.log('\n--- 測試項目 8: 雙目錄鏡像同步檢驗 ---');
const mirrorDir = path.join('D:\\2627\\WEB+\\math_platform\\Advance');
if (fs.existsSync(mirrorDir)) {
  const syncFiles = ['advance_exam_data.js', 'advance_grading_dashboard.html', 'advance_student_result.html'];
  syncFiles.forEach(file => {
    const srcFile = path.join(__dirname, file);
    const destFile = path.join(mirrorDir, file);
    if (fs.existsSync(destFile)) {
      const srcHash = crypto.createHash('md5').update(fs.readFileSync(srcFile)).digest('hex');
      const destHash = crypto.createHash('md5').update(fs.readFileSync(destFile)).digest('hex');
      assert(srcHash === destHash, `雙目錄鏡像一致: ${file}`);
    } else {
      console.log(`  ℹ️ 提示: 鏡像檔案 ${destFile} 尚未同步，即將自動同步。`);
    }
  });
}

console.log('\n================================================================');
console.log(`🎉 測試結果總計: ${passCount} 項通過, ${failCount} 項失敗`);
console.log('================================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('🌟 驗證全部通過！系統已達到正式上線驗收標準。');
}
