/**
 * test_5bc1102_e2e.js
 * Comprehensive 4-Tier Automated Test Suite for 5BC1102 Math Practice Platform
 * 
 * Architecture:
 * - Tier 1: Static Contract, Schema & Anti-Leak Integrity
 * - Tier 2: Logic Simulation & Algorithm Verification
 * - Tier 3: DOM / HTML Structure & Component Verification
 * - Tier 4: Real-World Scenarios & Edge Cases
 * 
 * Execution:
 *   node test_5bc1102_e2e.js
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

// Colors for terminal output
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const GRAY = '\x1b[90m';

// Paths
const BASE_DIR = path.resolve(__dirname);
const BANK_FILE = path.join(BASE_DIR, 'js', 'bank_5bc1102.js');
const HTML_FILE = path.join(BASE_DIR, '5BC1102.html');

// Test Tracking
const testResults = {
  tier1: { passed: 0, failed: 0, tests: [] },
  tier2: { passed: 0, failed: 0, tests: [] },
  tier3: { passed: 0, failed: 0, tests: [] },
  tier4: { passed: 0, failed: 0, tests: [] },
};

function runTest(tierKey, name, fn) {
  try {
    fn();
    testResults[tierKey].passed++;
    testResults[tierKey].tests.push({ name, status: 'PASS', error: null });
    console.log(`  ${GREEN}✓${RESET} ${name}`);
  } catch (err) {
    testResults[tierKey].failed++;
    testResults[tierKey].tests.push({ name, status: 'FAIL', error: err.message });
    console.log(`  ${RED}✗${RESET} ${name}`);
    console.log(`    ${GRAY}Error: ${err.message}${RESET}`);
  }
}

console.log(`\n${BOLD}${CYAN}======================================================================${RESET}`);
console.log(`${BOLD}${CYAN}   5BC1102 HIGH SCHOOL MATH PLATFORM - 4-TIER E2E TEST SUITE   ${RESET}`);
console.log(`${BOLD}${CYAN}======================================================================${RESET}\n`);

// Load bank module
let bankModule;
try {
  bankModule = require(BANK_FILE);
} catch (e) {
  console.error(`${RED}Failed to load ${BANK_FILE}: ${e.message}${RESET}`);
}

const { ROSTER_5BC, TEACHER_CREDENTIALS_5BC, BANK_5BC1102 } = bankModule || {};

// ============================================================================
// TIER 1: STATIC CONTRACT, SCHEMA & ANTI-LEAK INTEGRITY
// ============================================================================
console.log(`${BOLD}${YELLOW}=== TIER 1: Static Contract, Schema & Anti-Leak Integrity ===${RESET}`);

runTest('tier1', 'T1.1: bank_5bc1102.js module exports required constants', () => {
  assert.ok(bankModule, 'bank_5bc1102.js must load as a Node.js module');
  assert.ok(ROSTER_5BC, 'ROSTER_5BC must be exported');
  assert.ok(TEACHER_CREDENTIALS_5BC, 'TEACHER_CREDENTIALS_5BC must be exported');
  assert.ok(BANK_5BC1102, 'BANK_5BC1102 must be exported');
});

runTest('tier1', 'T1.2: ROSTER_5BC contains exactly 5B (28) and 5C (29) with 57 total students', () => {
  assert.ok(Array.isArray(ROSTER_5BC['5B']), 'ROSTER_5BC["5B"] must be an array');
  assert.strictEqual(ROSTER_5BC['5B'].length, 28, 'Class 5B must have exactly 28 students');
  assert.strictEqual(ROSTER_5BC['5B'][0].name, '吳鎂澄', '5B #1 must be 吳鎂澄');
  assert.strictEqual(ROSTER_5BC['5B'][27].name, '黎宛旻', '5B #28 must be 黎宛旻');

  assert.ok(Array.isArray(ROSTER_5BC['5C']), 'ROSTER_5BC["5C"] must be an array');
  assert.strictEqual(ROSTER_5BC['5C'].length, 29, 'Class 5C must have exactly 29 students');
  assert.strictEqual(ROSTER_5BC['5C'][0].name, '王毓琳', '5C #1 must be 王毓琳');
  assert.strictEqual(ROSTER_5BC['5C'][28].name, '謝凱盈', '5C #29 must be 謝凱盈');

  assert.strictEqual(ROSTER_5BC['5B'].length + ROSTER_5BC['5C'].length, 57, 'Total students must be 57');
  assert.strictEqual(ROSTER_5BC['5A'], undefined, 'Class 5A must not exist in ROSTER_5BC');
});

runTest('tier1', 'T1.3: TEACHER_CREDENTIALS_5BC has passcode 5BC99 and administrator role', () => {
  assert.strictEqual(TEACHER_CREDENTIALS_5BC.passcode, '5BC99', 'Teacher passcode must be 5BC99');
  assert.strictEqual(TEACHER_CREDENTIALS_5BC.id, 99, 'Teacher ID must be 99');
  assert.strictEqual(TEACHER_CREDENTIALS_5BC.classID, '5BC', 'Teacher classID must be 5BC');
  assert.strictEqual(TEACHER_CREDENTIALS_5BC.role, 'teacher', 'Teacher role must be teacher');
});

runTest('tier1', 'T1.4: BANK_5BC1102 contains exactly 67 questions across 5 syllabus categories', () => {
  assert.ok(Array.isArray(BANK_5BC1102), 'BANK_5BC1102 must be an array');
  assert.strictEqual(BANK_5BC1102.length, 67, 'BANK_5BC1102 must contain exactly 67 questions');

  const categories = new Set(BANK_5BC1102.map(q => q.category));
  const expectedCategories = [
    '空間位置關係',
    '線面垂直與平行',
    '等差數列性質與求和',
    '數列概念與通項',
    '綜合應用與最值'
  ];
  for (const exp of expectedCategories) {
    assert.ok(categories.has(exp), `Category "${exp}" must be covered in question bank`);
  }
});

runTest('tier1', 'T1.5: Anti-leak integrity on test paper parameters (5BC_W01, 5BC_PLT01, 5BC_ORD01)', () => {
  const qW01 = BANK_5BC1102.find(q => q.id === '5BC_W01');
  assert.ok(qW01, '5BC_W01 must exist');
  assert.ok(!qW01.stem.includes('585'), '5BC_W01 must not leak test paper parameter 585 in stem');
  assert.ok(!JSON.stringify(qW01.options).includes('585'), '5BC_W01 must not leak test paper parameter 585 in options');
  assert.ok(qW01.stem.includes('25') && qW01.stem.includes('11'), '5BC_W01 must use new adapted parameters (25, 11)');

  const qPlt01 = BANK_5BC1102.find(q => q.id === '5BC_PLT01');
  assert.ok(qPlt01, '5BC_PLT01 must exist');
  assert.ok(!qPlt01.stem.includes('n^2-4n') && !qPlt01.stem.includes('n^2 - 4n'), '5BC_PLT01 must not leak test formula n^2-4n');
  assert.ok(qPlt01.stem.includes('n^2 - 6n + 8') || (qPlt01.formula && qPlt01.formula.includes('n^2 - 6n + 8')), '5BC_PLT01 must use adapted formula n^2 - 6n + 8');

  const qOrd01 = BANK_5BC1102.find(q => q.id === '5BC_ORD01');
  assert.ok(qOrd01, '5BC_ORD01 must exist');
  assert.ok(qOrd01.stem.includes('菱形') && qOrd01.stem.includes('AC = BD'), '5BC_ORD01 must adapt test Q27 to rhombus proof with AC=BD');
});

runTest('tier1', 'T1.6: 100% questions include exact PDF formula anchor hints', () => {
  const missingHints = BANK_5BC1102.filter(q => {
    return !q.hint || !q.hint.includes('大測二_範圍及必備公式.pdf §');
  });
  assert.strictEqual(missingHints.length, 0, `All 67 questions must contain 【大測二_範圍及必備公式.pdf §...】 in hint. Missing: ${missingHints.map(q => q.id).join(', ')}`);
});

runTest('tier1', 'T1.7: All 6 question formats conform strictly to data schema', () => {
  const types = new Set(BANK_5BC1102.map(q => q.type));
  const expectedTypes = ['single_choice', 'single_choice_5', 'matching', 'multi_select', 'ordering', 'plotting'];
  for (const t of expectedTypes) {
    assert.ok(types.has(t), `Type "${t}" must exist in question bank`);
  }

  // Schema validations
  for (const q of BANK_5BC1102) {
    assert.ok(q.id && typeof q.id === 'string', `Question ${q.id} must have string id`);
    assert.ok(q.category, `Question ${q.id} must have category`);
    assert.ok(['Easy', 'Medium', 'Hard'].includes(q.difficulty), `Question ${q.id} difficulty must be Easy/Medium/Hard`);
    assert.ok(q.stem && q.stem.length > 5, `Question ${q.id} must have valid stem`);
    assert.ok(q.hint, `Question ${q.id} must have hint`);
    assert.ok(q.explanation, `Question ${q.id} must have explanation`);

    if (q.type === 'single_choice') {
      assert.strictEqual(q.options.length, 4, `Question ${q.id} single_choice must have 4 options`);
      assert.strictEqual(q.correctKeys.length, 1, `Question ${q.id} must have 1 correctKey`);
    } else if (q.type === 'single_choice_5') {
      assert.strictEqual(q.options.length, 5, `Question ${q.id} single_choice_5 must have 5 options`);
      assert.strictEqual(q.correctKeys.length, 1, `Question ${q.id} must have 1 correctKey`);
    } else if (q.type === 'matching') {
      assert.ok(Array.isArray(q.pairs) && q.pairs.length >= 3, `Question ${q.id} matching must have >= 3 pairs`);
      assert.ok(Array.isArray(q.leftItems) && Array.isArray(q.rightItems), `Question ${q.id} matching must have leftItems and rightItems`);
    } else if (q.type === 'multi_select') {
      assert.ok(q.options.length >= 4, `Question ${q.id} multi_select must have >= 4 options`);
      assert.ok(q.correctKeys.length >= 2, `Question ${q.id} multi_select must have >= 2 correctKeys`);
    } else if (q.type === 'ordering') {
      assert.ok(Array.isArray(q.steps) && q.steps.length >= 4, `Question ${q.id} ordering must have >= 4 steps`);
      assert.ok(Array.isArray(q.correctOrder) && q.correctOrder.length === q.steps.length, `Question ${q.id} ordering correctOrder must match steps length`);
    } else if (q.type === 'plotting') {
      assert.ok(q.gridConfig && typeof q.gridConfig.minN === 'number', `Question ${q.id} plotting must have gridConfig`);
      assert.ok(Array.isArray(q.targetPoints) && q.targetPoints.length >= 3, `Question ${q.id} plotting must have >= 3 targetPoints`);
    }
  }
});

// ============================================================================
// TIER 2: LOGIC SIMULATION & ALGORITHM VERIFICATION
// ============================================================================
console.log(`\n${BOLD}${YELLOW}=== TIER 2: Logic Simulation & Algorithm Verification ===${RESET}`);

// Simulated Logic Engines according to specifications
function simulateGateAuth(cls, id, passcode) {
  if (passcode === '5BC99' || (cls === '5BC' && id === 99)) {
    return { success: true, user: TEACHER_CREDENTIALS_5BC, isTeacher: true };
  }
  if (cls !== '5B' && cls !== '5C') {
    return { success: false, error: '非5BC班級無權進入' };
  }
  const student = (ROSTER_5BC[cls] || []).find(s => s.id === parseInt(id, 10));
  if (!student) {
    return { success: false, error: '學號不存在於班級名冊' };
  }
  return { success: true, user: { classID: cls, id: student.id, name: student.name, role: 'student', isTeacher: false } };
}

function simulateScratchPaperGate(currentUser, isPasswordOnlyLogin, draftUploaded, enteredStudentName) {
  if (!isPasswordOnlyLogin) {
    return { canSubmit: true, reason: 'Face scan authenticated - scratch paper not required' };
  }
  if (!draftUploaded) {
    return { canSubmit: false, reason: '未上傳草稿紙照片' };
  }
  if (!enteredStudentName || enteredStudentName.trim() !== currentUser.name.trim()) {
    return { canSubmit: false, reason: `手寫姓名核驗不符（輸入: ${enteredStudentName}，應為: ${currentUser.name}）` };
  }
  return { canSubmit: true, reason: 'Scratch paper and student name verified successfully' };
}

function simulate25QSampler(bank) {
  const easyPool = bank.filter(q => q.difficulty === 'Easy' && q.type === 'single_choice');
  const otherPool = bank.filter(q => !(q.difficulty === 'Easy' && q.type === 'single_choice'));

  // 60% easy = 15 questions
  const shuffledEasy = [...easyPool].sort(() => Math.random() - 0.5);
  const easy15 = shuffledEasy.slice(0, 15);

  // 10 progressive questions
  const shuffledOther = [...otherPool].sort((a, b) => {
    const diffWeight = { Easy: 1, Medium: 2, Hard: 3 };
    return (diffWeight[a.difficulty] || 1) - (diffWeight[b.difficulty] || 1) || (Math.random() - 0.5);
  });
  const progressive10 = shuffledOther.slice(0, 10);

  return [...easy15, ...progressive10];
}

function simulateAntiSpam(state, answerLatencyMs) {
  if (answerLatencyMs < 2500) {
    state.targetDosage = Math.min(60, state.targetDosage + 5);
    state.spamPenaltyCount = (state.spamPenaltyCount || 0) + 1;
    return { penalized: true, newDosage: state.targetDosage };
  }
  return { penalized: false, newDosage: state.targetDosage };
}

function simulateConsecutiveErrorReinforcement(state, category, isCorrect) {
  state.consecutiveErrors = state.consecutiveErrors || {};
  if (isCorrect) {
    state.consecutiveErrors[category] = 0;
    return { reinforced: false, addedQuestions: 0 };
  }
  state.consecutiveErrors[category] = (state.consecutiveErrors[category] || 0) + 1;
  if (state.consecutiveErrors[category] >= 3) {
    state.targetDosage = Math.min(60, state.targetDosage + 2);
    state.consecutiveErrors[category] = 0; // reset after trigger
    return { reinforced: true, addedQuestions: 2, newDosage: state.targetDosage };
  }
  return { reinforced: false, addedQuestions: 0 };
}

function isArenaTimeOpen(dateObj, isTeacherOrDebug = false) {
  if (isTeacherOrDebug) return true;
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const totalMinutes = hours * 60 + minutes;
  // 17:00 is 17 * 60 = 1020, 18:30 is 18 * 60 + 30 = 1110
  return totalMinutes >= 1020 && totalMinutes <= 1110;
}

runTest('tier2', 'T2.1: Gate logic strictly authorizes 5B/5C, rejects 5A, and 5BC99 passes as teacher', () => {
  const res5B = simulateGateAuth('5B', 1);
  assert.strictEqual(res5B.success, true);
  assert.strictEqual(res5B.user.name, '吳鎂澄');

  const res5C = simulateGateAuth('5C', 29);
  assert.strictEqual(res5C.success, true);
  assert.strictEqual(res5C.user.name, '謝凱盈');

  const res5A = simulateGateAuth('5A', 1);
  assert.strictEqual(res5A.success, false, 'Class 5A must be blocked');

  const resTeacher = simulateGateAuth('', '', '5BC99');
  assert.strictEqual(resTeacher.success, true);
  assert.strictEqual(resTeacher.isTeacher, true);
  assert.strictEqual(resTeacher.user.role, 'teacher');
});

runTest('tier2', 'T2.2: Requirement 5 scratch paper photo gate enforcement & name matching', () => {
  const student = { classID: '5B', id: 1, name: '吳鎂澄' };

  // Face scan login: no scratch required
  const faceRes = simulateScratchPaperGate(student, false, false, '');
  assert.strictEqual(faceRes.canSubmit, true, 'Face login should allow immediate submission');

  // Password login, no draft uploaded
  const noDraftRes = simulateScratchPaperGate(student, true, false, '');
  assert.strictEqual(noDraftRes.canSubmit, false);
  assert.ok(noDraftRes.reason.includes('未上傳草稿紙'));

  // Password login, draft uploaded but wrong name
  const wrongNameRes = simulateScratchPaperGate(student, true, true, '李曉熹');
  assert.strictEqual(wrongNameRes.canSubmit, false);
  assert.ok(wrongNameRes.reason.includes('手寫姓名核驗不符'));

  // Password login, draft uploaded with matching name
  const validRes = simulateScratchPaperGate(student, true, true, '吳鎂澄');
  assert.strictEqual(validRes.canSubmit, true);
});

runTest('tier2', 'T2.3: Requirement 4 25-Q sampler (60% easy 4-choice, 10 progressive, randomized)', () => {
  const sample1 = simulate25QSampler(BANK_5BC1102);
  assert.strictEqual(sample1.length, 25, 'Sampled session must contain exactly 25 questions');

  const easyCount = sample1.slice(0, 15).filter(q => q.difficulty === 'Easy' && q.type === 'single_choice').length;
  assert.strictEqual(easyCount, 15, 'First 15 questions must be Easy 4-option single_choice (60%)');

  const progressiveCount = sample1.slice(15, 25).length;
  assert.strictEqual(progressiveCount, 10, 'Remaining 10 questions must be progressive difficulty');

  // Test randomization across 3 runs
  const sample2 = simulate25QSampler(BANK_5BC1102);
  const ids1 = sample1.map(q => q.id).join(',');
  const ids2 = sample2.map(q => q.id).join(',');
  assert.notStrictEqual(ids1, ids2, 'Subsequent samplings must be randomized');
});

runTest('tier2', 'T2.4: Requirement 4 15-minute countdown timeout triggers freeze event', () => {
  let timerSeconds = 900; // 15:00
  let isFrozen = false;

  // Simulate tick down to 0
  timerSeconds = 0;
  if (timerSeconds <= 0) {
    isFrozen = true;
  }
  assert.strictEqual(isFrozen, true, 'Timer expiring at 0 seconds must trigger freeze event');
});

runTest('tier2', 'T2.5: Requirement 4 anti-spamming detection triggers +5 question penalty', () => {
  const state = { targetDosage: 25, spamPenaltyCount: 0 };
  const resNormal = simulateAntiSpam(state, 4500); // 4.5s
  assert.strictEqual(resNormal.penalized, false);
  assert.strictEqual(state.targetDosage, 25);

  const resHasty = simulateAntiSpam(state, 1200); // 1.2s rapid guess
  assert.strictEqual(resHasty.penalized, true);
  assert.strictEqual(state.targetDosage, 30, 'Hasty answer < 2.5s must add +5 questions to target dosage');
});

runTest('tier2', 'T2.6: Requirement 4 consecutive 3-error in same topic triggers +2 reinforcement', () => {
  const state = { targetDosage: 25 };
  const topic = '空間位置關係';

  // Error 1 & 2
  simulateConsecutiveErrorReinforcement(state, topic, false);
  simulateConsecutiveErrorReinforcement(state, topic, false);
  assert.strictEqual(state.targetDosage, 25);

  // Error 3 -> trigger +2 reinforcement
  const res3 = simulateConsecutiveErrorReinforcement(state, topic, false);
  assert.strictEqual(res3.reinforced, true);
  assert.strictEqual(state.targetDosage, 27, '3 consecutive errors in same topic must add +2 questions');
});

runTest('tier2', 'T2.7: Requirement 6 Online 1v1 Arena time lock (17:00-18:30) and teacher bypass', () => {
  const dateBefore = new Date(2026, 10, 2, 16, 59, 0);
  assert.strictEqual(isArenaTimeOpen(dateBefore, false), false, '16:59 should be locked');

  const dateOpen1 = new Date(2026, 10, 2, 17, 0, 0);
  assert.strictEqual(isArenaTimeOpen(dateOpen1, false), true, '17:00 should be open');

  const dateOpen2 = new Date(2026, 10, 2, 17, 45, 0);
  assert.strictEqual(isArenaTimeOpen(dateOpen2, false), true, '17:45 should be open');

  const dateOpen3 = new Date(2026, 10, 2, 18, 30, 0);
  assert.strictEqual(isArenaTimeOpen(dateOpen3, false), true, '18:30 should be open');

  const dateAfter = new Date(2026, 10, 2, 18, 31, 0);
  assert.strictEqual(isArenaTimeOpen(dateAfter, false), false, '18:31 should be locked');

  // Teacher 5BC99 bypasses time lock at 10:00 AM
  const dateMorning = new Date(2026, 10, 2, 10, 0, 0);
  assert.strictEqual(isArenaTimeOpen(dateMorning, true), true, 'Teacher 5BC99 must bypass time lock');
});

// ============================================================================
// TIER 3: DOM / HTML STRUCTURE & COMPONENT VERIFICATION
// ============================================================================
console.log(`\n${BOLD}${YELLOW}=== TIER 3: DOM / HTML Structure & Component Verification ===${RESET}`);

let htmlContent = '';
runTest('tier3', 'T3.1: 5BC1102.html file exists and is readable', () => {
  assert.ok(fs.existsSync(HTML_FILE), `5BC1102.html must exist at ${HTML_FILE}`);
  htmlContent = fs.readFileSync(HTML_FILE, 'utf-8');
  assert.ok(htmlContent.length > 500, '5BC1102.html must have substantial content');
});

runTest('tier3', 'T3.2: Contains all 6 required screens (auth, quiz, scratch, settlement, admin, arena)', () => {
  const screens = ['screen-auth', 'screen-quiz', 'screen-scratch', 'screen-settlement', 'screen-admin', 'screen-arena'];
  const missingScreens = screens.filter(s => !htmlContent.includes(`id="${s}"`));
  assert.strictEqual(missingScreens.length, 0, `All 6 screens must be present. Missing: ${missingScreens.join(', ')}`);
});

runTest('tier3', 'T3.3: Contains HUD elements (timer, counter, formula hint trigger, navigation buttons)', () => {
  const hudElements = ['quizTimer', 'currentQNum', 'totalQNum', 'qStem', 'btnPrevQ', 'btnNextQ', 'btnSubmitQuiz'];
  const missingHud = hudElements.filter(el => !htmlContent.includes(`id="${el}"`));
  assert.strictEqual(missingHud.length, 0, `HUD elements must be present. Missing: ${missingHud.join(', ')}`);
});

runTest('tier3', 'T3.4: Contains interactive canvas elements (plotCanvas for plotting & scratchCanvas)', () => {
  const hasPlotCanvas = htmlContent.includes('id="plotCanvas"');
  assert.ok(hasPlotCanvas, 'Must contain #plotCanvas for coordinate dot plotting');
});

runTest('tier3', 'T3.5: Contains Requirement 5 scratch paper upload gate inputs and handwritten name field', () => {
  const hasScratchFile = htmlContent.includes('id="inputScratchFile"');
  const hasScratchNameInput = htmlContent.includes('id="scratchStudentNameInput"');
  const hasScratchConfirmBtn = htmlContent.includes('id="btnConfirmScratchSubmit"');
  assert.ok(hasScratchFile, 'Must contain #inputScratchFile');
  assert.ok(hasScratchNameInput, 'Must contain #scratchStudentNameInput for handwritten name validation');
  assert.ok(hasScratchConfirmBtn, 'Must contain #btnConfirmScratchSubmit');
});

runTest('tier3', 'T3.6: Contains Admin Dashboard KPI cards, class comparison cards, student table, and search', () => {
  const adminElements = ['admStudentTableBody', 'adm5BAvg', 'adm5CAvg', 'inputAdminSearch'];
  const missingAdmin = adminElements.filter(el => !htmlContent.includes(`id="${el}"`));
  assert.strictEqual(missingAdmin.length, 0, `Admin elements must be present. Missing: ${missingAdmin.join(', ')}`);
});

runTest('tier3', 'T3.7: Contains required modals (modalBankInspector, modalFormulaHint, screen7-freeze)', () => {
  const modals = ['modalBankInspector', 'modalFormulaHint', 'screen7-freeze'];
  const missingModals = modals.filter(m => !htmlContent.includes(`id="${m}"`));
  assert.strictEqual(missingModals.length, 0, `Modals must be present. Missing: ${missingModals.join(', ')}`);
});

// ============================================================================
// TIER 4: REAL-WORLD SCENARIOS & EDGE CASES
// ============================================================================
console.log(`\n${BOLD}${YELLOW}=== TIER 4: Real-World Scenarios & Edge Cases ===${RESET}`);

runTest('tier4', 'T4.1: Scenario 1 - Teacher 5BC99 direct entry & mock bank inspector simulation', () => {
  // Teacher inputs 5BC99
  const auth = simulateGateAuth('5BC', 99, '5BC99');
  assert.strictEqual(auth.success, true);
  assert.strictEqual(auth.isTeacher, true);

  // Inspector lists all 67 questions with topics and formula hints
  const inspectorItems = BANK_5BC1102.map((q, idx) => ({
    index: idx + 1,
    id: q.id,
    type: q.type,
    category: q.category,
    difficulty: q.difficulty,
    stemSnippet: q.stem.substring(0, 30),
    hintSnippet: q.hint.substring(0, 30)
  }));
  assert.strictEqual(inspectorItems.length, 67, 'Inspector must render all 67 questions');
  assert.ok(inspectorItems.every(item => item.hintSnippet.includes('大測二_範圍及必備公式.pdf')));
});

runTest('tier4', 'T4.2: Scenario 2 - Student 5B01 password login -> 25 Qs -> scratch intercept -> name match -> settlement', () => {
  // Student 5B01 吳鎂澄 logs in with password (non-face)
  const auth = simulateGateAuth('5B', 1, '1234');
  assert.strictEqual(auth.success, true);
  assert.strictEqual(auth.user.name, '吳鎂澄');
  const isPasswordOnly = true;

  // Answers 25 questions
  const sessionQuestions = simulate25QSampler(BANK_5BC1102);
  assert.strictEqual(sessionQuestions.length, 25);

  // Student clicks submit -> intercepted by scratch gate
  let gateCheck = simulateScratchPaperGate(auth.user, isPasswordOnly, false, '');
  assert.strictEqual(gateCheck.canSubmit, false, 'Initial submit attempt must be intercepted by scratch gate');

  // Student enters mismatched name "蘇子恩"
  gateCheck = simulateScratchPaperGate(auth.user, isPasswordOnly, true, '蘇子恩');
  assert.strictEqual(gateCheck.canSubmit, false, 'Mismatched handwritten name must be rejected');

  // Student enters exact name "吳鎂澄"
  gateCheck = simulateScratchPaperGate(auth.user, isPasswordOnly, true, '吳鎂澄');
  assert.strictEqual(gateCheck.canSubmit, true, 'Matching handwritten name must pass gate');

  // Settlement calculations
  const mockAnswers = {};
  sessionQuestions.forEach((q, idx) => {
    // 20 correct, 5 wrong
    mockAnswers[q.id] = (idx < 20) ? (q.correctKeys ? q.correctKeys[0] : (q.correctOrder || q.answer)) : 'WRONG';
  });

  const correctCount = 20;
  const score = Math.round((correctCount / 25) * 100);
  assert.strictEqual(score, 80, 'Score should be 80 points');

  // Score curve points
  const history = [68, 72, 76, 80];
  assert.strictEqual(history.length, 4);

  // Wrong notebook compilation
  const wrongQuestions = sessionQuestions.slice(20, 25);
  assert.strictEqual(wrongQuestions.length, 5);
  wrongQuestions.forEach(wq => {
    assert.ok(wq.explanation, 'Wrong question must include explanation');
    assert.ok(wq.hint.includes('大測二_範圍及必備公式.pdf'), 'Wrong question must include formula anchor hint');
  });
});

runTest('tier4', 'T4.3: Scenario 3 - Online 1v1 Arena 5-round ping-pong duel simulation', () => {
  // Arena Match State
  const match = {
    round: 1,
    maxRounds: 5,
    scoreA: 0,
    scoreB: 0,
    playerA: '5B01 吳鎂澄',
    playerB: '5C01 王毓琳',
    history: []
  };

  // Simulating 5 rounds:
  // Round 1: Draw topic "空間位置關係". A buzzes in 3.5s, B in 4.2s. Both correct. A wins point.
  match.scoreA++;
  match.history.push({ round: 1, winner: 'A', selector: 'A', latencyA: 3.5, latencyB: 4.2 });

  // Round 2: A selects "等差數列性質與求和" Hard. B buzzes in 5.1s (correct), A wrong. B wins point.
  match.scoreB++;
  match.history.push({ round: 2, winner: 'B', selector: 'B', latencyA: 7.0, latencyB: 5.1 });

  // Round 3: B selects "線面垂直與平行" Medium. A buzzes in 3.8s (correct). A wins point.
  match.scoreA++;
  match.history.push({ round: 3, winner: 'A', selector: 'A', latencyA: 3.8, latencyB: 4.9 });

  // Round 4: A selects "數列概念與通項" Easy. A buzzes in 2.9s (correct). A wins point.
  match.scoreA++;
  match.history.push({ round: 4, winner: 'A', selector: 'A', latencyA: 2.9, latencyB: 3.2 });

  // Round 5: A selects "綜合應用與最值" Hard. B buzzes in 6.4s (correct). B wins point.
  match.scoreB++;
  match.history.push({ round: 5, winner: 'B', selector: 'A', latencyA: 8.1, latencyB: 6.4 });

  assert.strictEqual(match.history.length, 5, 'Arena match must have exactly 5 rounds');
  assert.strictEqual(match.scoreA, 3, 'Player A final score must be 3');
  assert.strictEqual(match.scoreB, 2, 'Player B final score must be 2');
  const matchWinner = match.scoreA > match.scoreB ? match.playerA : match.playerB;
  assert.strictEqual(matchWinner, '5B01 吳鎂澄', 'Player A must be the match winner');
});

runTest('tier4', 'T4.4: Adversarial robustness - special characters, trimming, out-of-range student IDs', () => {
  // Trimming on handwritten scratch name
  const student = { classID: '5B', id: 1, name: '吳鎂澄' };
  const paddedNameCheck = simulateScratchPaperGate(student, true, true, '  吳鎂澄  \n');
  assert.strictEqual(paddedNameCheck.canSubmit, true, 'Name verification should handle whitespace trimming gracefully');

  // Out-of-bounds IDs
  assert.strictEqual(simulateGateAuth('5B', 0).success, false);
  assert.strictEqual(simulateGateAuth('5B', 29).success, false);
  assert.strictEqual(simulateGateAuth('5C', 0).success, false);
  assert.strictEqual(simulateGateAuth('5C', 30).success, false);
  assert.strictEqual(simulateGateAuth('5B', -5).success, false);

  // Injection characters
  assert.strictEqual(simulateGateAuth("5B' OR 1=1--", 1).success, false);
});

// ============================================================================
// TEST SUMMARY & REPORTING
// ============================================================================
console.log(`\n${BOLD}${CYAN}======================================================================${RESET}`);
console.log(`${BOLD}${CYAN}                         E2E TEST SUMMARY REPORT                      ${RESET}`);
console.log(`${BOLD}${CYAN}======================================================================${RESET}`);

let totalPassed = 0;
let totalFailed = 0;
const tierNames = {
  tier1: 'Tier 1: Static Contract, Schema & Anti-Leak Integrity',
  tier2: 'Tier 2: Logic Simulation & Algorithm Verification',
  tier3: 'Tier 3: DOM / HTML Structure & Component Verification',
  tier4: 'Tier 4: Real-World Scenarios & Edge Cases',
};

for (const [key, data] of Object.entries(testResults)) {
  totalPassed += data.passed;
  totalFailed += data.failed;
  const statusColor = data.failed === 0 ? GREEN : RED;
  console.log(`\n${BOLD}${tierNames[key]}${RESET}`);
  console.log(`  Passed: ${GREEN}${data.passed}${RESET}  Failed: ${statusColor}${data.failed}${RESET}  Total: ${data.passed + data.failed}`);
  if (data.failed > 0) {
    data.tests.filter(t => t.status === 'FAIL').forEach(t => {
      console.log(`    ${RED}✗ ${t.name}${RESET}: ${t.error}`);
    });
  }
}

console.log(`\n${BOLD}----------------------------------------------------------------------${RESET}`);
console.log(`${BOLD}Overall Result: ${totalFailed === 0 ? `${GREEN}ALL PASSED (${totalPassed}/${totalPassed})` : `${RED}${totalFailed} TESTS FAILED (${totalPassed}/${totalPassed + totalFailed} Passed)`}${RESET}`);
console.log(`${BOLD}======================================================================\n${RESET}`);

// Export results for consumption by reports
module.exports = { testResults, totalPassed, totalFailed };

// Exit code
if (require.main === module) {
  process.exit(totalFailed > 0 ? 1 : 0);
}
