/**
 * quiz_engine.js - Interactive Quiz Engine with 8-Choose-5 Step Ordering & MathJax Dynamic Typesetting
 * High School Mobile Math Practice & Anti-Cheating Quiz Platform
 * 
 * Features:
 * 1. Grade auto-routing based on classID (4C, 4D -> Grade 10 QUESTIONS_G10; 5B -> Grade 11 QUESTIONS_G11).
 * 2. Fully randomized question presentation order (Fisher-Yates shuffle).
 * 3. Interactive interfaces for Single-choice, Multiple-choice, and 8-choose-5 Step Ordering (Q12~Q18).
 * 4. Step Ordering UI:
 *    - 8 candidate steps in pool
 *    - 5 target slots (A, B, C, D, E)
 *    - Tap candidate to place in next empty slot; tap [✕] to remove back to pool
 *    - [↑] and [↓] arrows to reorder slots
 *    - Strictly blocks submission if fewer than 5 steps selected
 * 5. USER GLOBAL RULE: Dynamic MathJax.typesetPromise() invocation on every DOM insertion; no raw $$ flashes.
 * 6. Real-time telemetry tracking: latency, score, cumulative accuracy, asynchronously submitted via persistence.js.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.QuizEngine = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Engine State
  const state = {
    classID: "",
    studentID: null,
    studentName: "",
    gradeLevel: 10,
    bankId: "GRADE_10",

    questions: [],
    currentIndex: 0,
    currentQuestion: null,

    // Current question interaction state
    selectedSingleOption: null,
    selectedMultiOptions: new Set(),
    stepSlots: [null, null, null, null, null], // 5 target slots (A, B, C, D, E)
    isSubmitted: false,
    questionStartTime: 0,

    // Session Statistics
    totalAnswered: 0,
    totalCorrect: 0,
    sessionHistory: [], // [{ qid, isCorrect, duration, score }]

    // Container DOM references
    containerEl: null,
    progressEl: null,
    timerEl: null
  };

  /**
   * Fisher-Yates Array Shuffle
   * @param {Array} arr 
   * @returns {Array}
   */
  function shuffleArray(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = copy[i];
      copy[i] = copy[j];
      copy[j] = temp;
    }
    return copy;
  }

  /**
   * Dynamic MathJax typeset helper per USER GLOBAL RULE
   * Guarantees all formulas ($$...$$ or $...$) render cleanly
   * @param {HTMLElement} element 
   */
  function triggerMathJaxTypeset(element) {
    if (typeof window !== 'undefined' && window.MathJax) {
      if (typeof window.MathJax.typesetPromise === 'function') {
        const target = element ? [element] : [];
        window.MathJax.typesetPromise(target).catch(function (err) {
          console.warn("[QuizEngine] MathJax typesetPromise warning:", err);
        });
      } else if (typeof window.MathJax.typeset === 'function') {
        try {
          window.MathJax.typeset();
        } catch (e) {}
      }
    }
  }

  /**
   * Determine question bank and route by classID
   * 4C, 4D -> Grade 10
   * 5B -> Grade 11
   */
  function resolveQuestionBank(classID) {
    const cls = String(classID || "").trim().toUpperCase();
    if (cls === "5B") {
      const g11 = (typeof window !== 'undefined' && window.QUESTIONS_G11) ? window.QUESTIONS_G11 : [];
      return { grade: 11, bankId: "GRADE_11", title: "高二數學 (複數與立體幾何)", bank: g11 };
    } else {
      const g10 = (typeof window !== 'undefined' && window.QUESTIONS_G10) ? window.QUESTIONS_G10 : [];
      return { grade: 10, bankId: "GRADE_10", title: "高一數學 (集合與不等式)", bank: g10 };
    }
  }

  /**
   * Start a new Quiz Session
   * @param {string} classID 
   * @param {number|string} studentID 
   * @param {string} studentName 
   */
  function startQuiz(classID, studentID, studentName) {
    state.classID = String(classID || "").trim().toUpperCase();
    state.studentID = studentID;
    state.studentName = studentName || "";

    const routing = resolveQuestionBank(state.classID);
    state.gradeLevel = routing.grade;
    state.bankId = routing.bankId;

    // Load and shuffle questions
    const rawBank = (routing.bank && routing.bank.questions) ? routing.bank.questions : routing.bank;
    state.questions = shuffleArray(rawBank);
    state.currentIndex = 0;
    state.totalAnswered = 0;
    state.totalCorrect = 0;
    state.sessionHistory = [];

    // Find DOM references
    state.containerEl = document.getElementById("quizQuestionContainer");
    state.progressEl = document.getElementById("quizProgressText");
    state.timerEl = document.getElementById("quizTimerText");

    // Start practice timers
    if (typeof window !== 'undefined' && window.AntiCheatTimers) {
      window.AntiCheatTimers.reset();
      window.AntiCheatTimers.start({
        classID: state.classID,
        studentID: state.studentID,
        name: state.studentName
      });
    }

    renderCurrentQuestion();
  }

  /**
   * Render question at state.currentIndex
   */
  function renderCurrentQuestion() {
    if (!state.containerEl) {
      state.containerEl = document.getElementById("quizQuestionContainer");
    }
    if (!state.containerEl) return;

    if (state.currentIndex >= state.questions.length) {
      renderQuizSummary();
      return;
    }

    state.currentQuestion = state.questions[state.currentIndex];
    state.isSubmitted = false;
    state.selectedSingleOption = null;
    state.selectedMultiOptions = new Set();
    state.stepSlots = [null, null, null, null, null];
    state.questionStartTime = Date.now();

    // Reset question elapsed timer in timers.js
    if (typeof window !== 'undefined' && window.AntiCheatTimers) {
      window.AntiCheatTimers.resetQuestionTimer();
    }

    // Update Progress HUD
    if (state.progressEl) {
      state.progressEl.textContent = `第 ${state.currentIndex + 1} / ${state.questions.length} 題`;
    }

    const q = state.currentQuestion;

    if (q.type === "step_order") {
      renderStepOrderingUI(q);
    } else if (q.type === "multiple_choice") {
      renderMultipleChoiceUI(q);
    } else {
      renderSingleChoiceUI(q);
    }

    // Typeset formulas in rendered container
    triggerMathJaxTypeset(state.containerEl);
  }

  /**
   * Render Single Choice UI
   */
  function renderSingleChoiceUI(q) {
    let optionsHtml = "";
    (q.options || []).forEach(function (opt) {
      optionsHtml += `
        <div class="quiz-option-card touch-target" data-key="${opt.key}">
          <div class="option-indicator radio-indicator"></div>
          <div class="option-key">${opt.key}.</div>
          <div class="option-content math-scroll-wrapper">${opt.text}</div>
        </div>
      `;
    });

    state.containerEl.innerHTML = `
      <div class="question-stem-card">
        <div class="question-type-badge badge-single">單選題 (4選1)</div>
        <div class="question-stem-text math-scroll-wrapper">${q.prompt || q.stem}</div>
      </div>
      <div class="quiz-options-list" id="quizOptionsList">
        ${optionsHtml}
      </div>
      <div id="quizExplanationCard" class="quiz-explanation-card" style="display: none;"></div>
      <div class="quiz-action-bar">
        <button id="btnSubmitAnswer" class="btn btn-primary" disabled>
          <span>確認送出答案</span>
        </button>
      </div>
    `;

    // Bind option click
    const optionCards = state.containerEl.querySelectorAll(".quiz-option-card");
    const submitBtn = state.containerEl.querySelector("#btnSubmitAnswer");

    optionCards.forEach(function (card) {
      card.addEventListener("click", function () {
        if (state.isSubmitted) return;
        optionCards.forEach(c => c.classList.remove("selected"));
        this.classList.add("selected");
        state.selectedSingleOption = this.getAttribute("data-key");
        submitBtn.disabled = false;
      });
    });

    // Bind submit
    submitBtn.addEventListener("click", function () {
      if (state.isSubmitted || !state.selectedSingleOption) return;
      submitSingleChoiceAnswer();
    });
  }

  /**
   * Submit Single Choice Answer
   */
  function submitSingleChoiceAnswer() {
    state.isSubmitted = true;
    const q = state.currentQuestion;
    const isCorrect = (state.selectedSingleOption === q.answer);
    const durationSeconds = Math.max(1, Math.round((Date.now() - state.questionStartTime) / 1000));

    // Update UI option states
    const optionCards = state.containerEl.querySelectorAll(".quiz-option-card");
    optionCards.forEach(function (card) {
      const key = card.getAttribute("data-key");
      if (key === q.answer) {
        card.classList.add("correct");
      }
      if (key === state.selectedSingleOption && !isCorrect) {
        card.classList.add("wrong");
      }
    });

    // Show Explanation
    const explCard = state.containerEl.querySelector("#quizExplanationCard");
    explCard.innerHTML = `
      <div class="expl-verdict ${isCorrect ? 'verdict-correct' : 'verdict-wrong'}">
        ${isCorrect ? '🎉 恭喜回答正確！' : '❌ 很遺憾回答錯誤，正確答案為 ' + q.answer}
      </div>
      <div class="expl-content math-scroll-wrapper">
        ${q.explanation || ''}
      </div>
    `;
    explCard.style.display = "block";
    triggerMathJaxTypeset(explCard);

    // Transform submit button into next question button
    const submitBtn = state.containerEl.querySelector("#btnSubmitAnswer");
    submitBtn.className = "btn btn-success";
    submitBtn.innerHTML = "<span>下一題 ➔</span>";
    submitBtn.onclick = function () {
      state.currentIndex++;
      renderCurrentQuestion();
    };

    recordAnswerTelemetry(q.id, isCorrect, durationSeconds, state.selectedSingleOption);
  }

  /**
   * Render Multiple Choice UI
   */
  function renderMultipleChoiceUI(q) {
    let optionsHtml = "";
    (q.options || []).forEach(function (opt) {
      optionsHtml += `
        <div class="quiz-option-card touch-target" data-key="${opt.key}">
          <div class="option-indicator checkbox-indicator"></div>
          <div class="option-key">${opt.key}.</div>
          <div class="option-content math-scroll-wrapper">${opt.text}</div>
        </div>
      `;
    });

    state.containerEl.innerHTML = `
      <div class="question-stem-card">
        <div class="question-type-badge badge-multi">多選題 (不定項選擇)</div>
        <div class="question-stem-text math-scroll-wrapper">${q.prompt || q.stem}</div>
      </div>
      <div class="quiz-options-list" id="quizOptionsList">
        ${optionsHtml}
      </div>
      <div id="quizExplanationCard" class="quiz-explanation-card" style="display: none;"></div>
      <div class="quiz-action-bar">
        <button id="btnSubmitAnswer" class="btn btn-primary" disabled>
          <span>確認送出答案</span>
        </button>
      </div>
    `;

    const optionCards = state.containerEl.querySelectorAll(".quiz-option-card");
    const submitBtn = state.containerEl.querySelector("#btnSubmitAnswer");

    optionCards.forEach(function (card) {
      card.addEventListener("click", function () {
        if (state.isSubmitted) return;
        const key = this.getAttribute("data-key");
        if (state.selectedMultiOptions.has(key)) {
          state.selectedMultiOptions.delete(key);
          this.classList.remove("selected");
        } else {
          state.selectedMultiOptions.add(key);
          this.classList.add("selected");
        }
        submitBtn.disabled = (state.selectedMultiOptions.size === 0);
      });
    });

    submitBtn.addEventListener("click", function () {
      if (state.isSubmitted || state.selectedMultiOptions.size === 0) return;
      submitMultipleChoiceAnswer();
    });
  }

  /**
   * Submit Multiple Choice Answer
   */
  function submitMultipleChoiceAnswer() {
    state.isSubmitted = true;
    const q = state.currentQuestion;
    const correctArr = Array.isArray(q.answer) ? q.answer : [q.answer];
    const userArr = Array.from(state.selectedMultiOptions).sort();
    const correctSorted = correctArr.slice().sort();

    const isCorrect = (userArr.length === correctSorted.length) && userArr.every((v, i) => v === correctSorted[i]);
    const durationSeconds = Math.max(1, Math.round((Date.now() - state.questionStartTime) / 1000));

    // Update UI option states
    const optionCards = state.containerEl.querySelectorAll(".quiz-option-card");
    optionCards.forEach(function (card) {
      const key = card.getAttribute("data-key");
      const isExpected = correctSorted.includes(key);
      const isSelected = state.selectedMultiOptions.has(key);

      if (isExpected) {
        card.classList.add("correct");
      }
      if (isSelected && !isExpected) {
        card.classList.add("wrong");
      }
    });

    // Show Explanation
    const explCard = state.containerEl.querySelector("#quizExplanationCard");
    explCard.innerHTML = `
      <div class="expl-verdict ${isCorrect ? 'verdict-correct' : 'verdict-wrong'}">
        ${isCorrect ? '🎉 恭喜全部選對！' : '❌ 回答有誤，正確選項為：' + correctSorted.join(', ')}
      </div>
      <div class="expl-content math-scroll-wrapper">
        ${q.explanation || ''}
      </div>
    `;
    explCard.style.display = "block";
    triggerMathJaxTypeset(explCard);

    const submitBtn = state.containerEl.querySelector("#btnSubmitAnswer");
    submitBtn.className = "btn btn-success";
    submitBtn.innerHTML = "<span>下一題 ➔</span>";
    submitBtn.onclick = function () {
      state.currentIndex++;
      renderCurrentQuestion();
    };

    recordAnswerTelemetry(q.id, isCorrect, durationSeconds, userArr.join('+'));
  }

  /**
   * Render 8-choose-5 Step Ordering UI (Q12~Q18)
   */
  function renderStepOrderingUI(q) {
    const candidateSteps = shuffleArray(q.steps || []);

    state.containerEl.innerHTML = `
      <div class="question-stem-card">
        <div class="question-type-badge badge-step">8選5 思維解題步驟排序</div>
        <div class="question-stem-text math-scroll-wrapper">${q.prompt || q.stem}</div>
      </div>

      <!-- Target 5 Ordered Sequence Slots (A, B, C, D, E) -->
      <div class="step-slots-container">
        <div class="step-slots-header">
          <span>🎯 解題思維目標槽位 (5 步按順序完成)</span>
          <span id="slotsCountBadge" class="slots-count-badge">已填裝 0 / 5 步</span>
        </div>
        <div id="targetSlotsList" class="target-slots-list">
          <!-- Dynamically populated slots -->
        </div>
      </div>

      <!-- Candidate Steps Pool (8 items) -->
      <div class="candidate-pool-container">
        <div class="candidate-pool-header">
          <span>📦 候選步驟池 (8選5 · 點擊填入槽位)</span>
          <button id="btnResetSteps" class="btn-text-action" style="font-size: 12px; color: var(--text-highlight);">
            🔄 重置所有槽位
          </button>
        </div>
        <div id="candidatePoolList" class="candidate-pool-list">
          <!-- Dynamically populated candidate step cards -->
        </div>
      </div>

      <div id="quizExplanationCard" class="quiz-explanation-card" style="display: none;"></div>

      <div class="quiz-action-bar">
        <button id="btnSubmitSteps" class="btn btn-primary" disabled>
          <span>確認提交步驟順序 (需選滿 5 步)</span>
        </button>
      </div>
    `;

    renderStepSlots();
    renderCandidatePool(candidateSteps);

    // Bind reset
    const btnReset = state.containerEl.querySelector("#btnResetSteps");
    btnReset.addEventListener("click", function () {
      if (state.isSubmitted) return;
      state.stepSlots = [null, null, null, null, null];
      renderStepSlots();
      renderCandidatePool(candidateSteps);
    });

    // Bind submit
    const btnSubmit = state.containerEl.querySelector("#btnSubmitSteps");
    btnSubmit.addEventListener("click", function () {
      if (state.isSubmitted) return;
      const filledCount = state.stepSlots.filter(Boolean).length;
      if (filledCount < 5) {
        alert("請在 5 個槽位中全部填入步驟後再提交！");
        return;
      }
      submitStepOrderingAnswer();
    });
  }

  /**
   * Render Target Slots A..E
   */
  function renderStepSlots() {
    const list = document.getElementById("targetSlotsList");
    const badge = document.getElementById("slotsCountBadge");
    const submitBtn = document.getElementById("btnSubmitSteps");
    if (!list) return;

    const slotLabels = ["步驟 A (第一步)", "步驟 B (第二步)", "步驟 C (第三步)", "步驟 D (第四步)", "步驟 E (最終步)"];
    let html = "";
    let filledCount = 0;

    state.stepSlots.forEach(function (step, idx) {
      if (step) {
        filledCount++;
        html += `
          <div class="target-slot-item filled" data-index="${idx}">
            <div class="slot-badge">${slotLabels[idx]}</div>
            <div class="slot-body math-scroll-wrapper">
              <span class="slot-step-tag">[${step.id}]</span> ${step.text}
            </div>
            <div class="slot-controls">
              <button class="btn-slot-move move-up" data-idx="${idx}" ${idx === 0 || state.isSubmitted ? 'disabled' : ''} title="上移">↑</button>
              <button class="btn-slot-move move-down" data-idx="${idx}" ${idx === 4 || state.isSubmitted ? 'disabled' : ''} title="下移">↓</button>
              <button class="btn-slot-remove" data-idx="${idx}" ${state.isSubmitted ? 'disabled' : ''} title="移除">✕</button>
            </div>
          </div>
        `;
      } else {
        html += `
          <div class="target-slot-item empty" data-index="${idx}">
            <div class="slot-badge">${slotLabels[idx]}</div>
            <div class="slot-empty-prompt">待填入：請點擊下方步驟填入此槽位</div>
          </div>
        `;
      }
    });

    list.innerHTML = html;
    if (badge) {
      badge.textContent = `已填裝 ${filledCount} / 5 步`;
      badge.className = filledCount === 5 ? "slots-count-badge complete" : "slots-count-badge";
    }
    if (submitBtn && !state.isSubmitted) {
      submitBtn.disabled = (filledCount < 5);
      submitBtn.innerHTML = filledCount === 5 ? "<span>🔒 確認提交步驟順序</span>" : "<span>確認提交步驟順序 (需選滿 5 步)</span>";
    }

    // Bind slot controls
    list.querySelectorAll(".btn-slot-remove").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        const idx = parseInt(this.getAttribute("data-idx"), 10);
        state.stepSlots[idx] = null;
        renderStepSlots();
        updateCandidatePoolStates();
      });
    });

    list.querySelectorAll(".btn-slot-move.move-up").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        const idx = parseInt(this.getAttribute("data-idx"), 10);
        if (idx > 0) {
          const temp = state.stepSlots[idx - 1];
          state.stepSlots[idx - 1] = state.stepSlots[idx];
          state.stepSlots[idx] = temp;
          renderStepSlots();
        }
      });
    });

    list.querySelectorAll(".btn-slot-move.move-down").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        const idx = parseInt(this.getAttribute("data-idx"), 10);
        if (idx < 4) {
          const temp = state.stepSlots[idx + 1];
          state.stepSlots[idx + 1] = state.stepSlots[idx];
          state.stepSlots[idx] = temp;
          renderStepSlots();
        }
      });
    });

    triggerMathJaxTypeset(list);
  }

  /**
   * Render Candidate Pool (8 steps)
   */
  function renderCandidatePool(candidateSteps) {
    const poolEl = document.getElementById("candidatePoolList");
    if (!poolEl) return;

    let html = "";
    candidateSteps.forEach(function (step) {
      html += `
        <div class="candidate-step-card touch-target" data-id="${step.id}" id="candidate_${step.id}">
          <div class="candidate-header">
            <span class="candidate-tag">步驟 ${step.id}</span>
            <span class="candidate-status-tag" style="display: none;">已就緒</span>
          </div>
          <div class="candidate-text math-scroll-wrapper">${step.text}</div>
        </div>
      `;
    });

    poolEl.innerHTML = html;

    // Store candidate map
    state.candidateMap = {};
    candidateSteps.forEach(s => { state.candidateMap[s.id] = s; });

    poolEl.querySelectorAll(".candidate-step-card").forEach(function (card) {
      card.addEventListener("click", function () {
        if (state.isSubmitted) return;
        const stepId = this.getAttribute("data-id");
        const stepObj = state.candidateMap[stepId];

        // Check if already in slots
        const alreadyInIdx = state.stepSlots.findIndex(s => s && s.id === stepId);
        if (alreadyInIdx !== -1) {
          // Click to remove
          state.stepSlots[alreadyInIdx] = null;
          renderStepSlots();
          updateCandidatePoolStates();
          return;
        }

        // Find first empty slot
        const emptyIdx = state.stepSlots.findIndex(s => s === null);
        if (emptyIdx === -1) {
          alert("5 個槽位已滿！請先移除部分步驟或點擊上/下箭頭調整順序。");
          return;
        }

        state.stepSlots[emptyIdx] = stepObj;
        renderStepSlots();
        updateCandidatePoolStates();
      });
    });

    updateCandidatePoolStates();
    triggerMathJaxTypeset(poolEl);
  }

  /**
   * Update visual placed/available badges in candidate pool
   */
  function updateCandidatePoolStates() {
    const poolEl = document.getElementById("candidatePoolList");
    if (!poolEl) return;

    const placedIds = new Set(state.stepSlots.filter(Boolean).map(s => s.id));
    poolEl.querySelectorAll(".candidate-step-card").forEach(function (card) {
      const stepId = card.getAttribute("data-id");
      const statusTag = card.querySelector(".candidate-status-tag");

      if (placedIds.has(stepId)) {
        card.classList.add("placed");
        if (statusTag) {
          // Find which slot (A..E)
          const slotIdx = state.stepSlots.findIndex(s => s && s.id === stepId);
          const slotChar = ["A", "B", "C", "D", "E"][slotIdx] || "";
          statusTag.textContent = `已填入槽位 ${slotChar}`;
          statusTag.style.display = "inline-block";
        }
      } else {
        card.classList.remove("placed");
        if (statusTag) statusTag.style.display = "none";
      }
    });
  }

  /**
   * Submit Step Ordering Answer
   */
  function submitStepOrderingAnswer() {
    state.isSubmitted = true;
    const q = state.currentQuestion;
    const submittedStepIds = state.stepSlots.map(s => s ? s.id : "");
    const correctStepIds = Array.isArray(q.answer) ? q.answer : ["S1", "S2", "S3", "S4", "S5"];

    const isCorrect = (submittedStepIds.length === correctStepIds.length) &&
      submittedStepIds.every((id, idx) => id === correctStepIds[idx]);

    const durationSeconds = Math.max(1, Math.round((Date.now() - state.questionStartTime) / 1000));

    // Check if any distractors were chosen
    const distractorsChosen = state.stepSlots.filter(s => s && s.isDistractor);
    let distractorFeedback = "";
    if (distractorsChosen.length > 0) {
      distractorFeedback = `<div class="distractor-feedback-box"><strong>⚠️ 偵測到思維誤區干擾項：</strong><ul>`;
      distractorsChosen.forEach(function (d) {
        distractorFeedback += `<li><strong>[${d.id}]</strong> ${d.distractorReason || '未符合該題邏輯鏈'}</li>`;
      });
      distractorFeedback += `</ul></div>`;
    }

    // Highlight slots in UI
    const slotElements = state.containerEl.querySelectorAll(".target-slot-item.filled");
    slotElements.forEach(function (el, idx) {
      const stepObj = state.stepSlots[idx];
      if (stepObj) {
        if (stepObj.id === correctStepIds[idx]) {
          el.classList.add("slot-correct");
        } else {
          el.classList.add("slot-wrong");
        }
      }
    });

    // Render Explanation
    const explCard = state.containerEl.querySelector("#quizExplanationCard");
    explCard.innerHTML = `
      <div class="expl-verdict ${isCorrect ? 'verdict-correct' : 'verdict-wrong'}">
        ${isCorrect ? '🎉 恭喜！步驟推理邏輯嚴密，排序完全正確！' : '❌ 步驟排序存在偏差，正確順序應為：' + correctStepIds.join(' ➔ ')}
      </div>
      ${distractorFeedback}
      <div class="expl-content math-scroll-wrapper">
        ${q.explanation || ''}
      </div>
    `;
    explCard.style.display = "block";
    triggerMathJaxTypeset(explCard);

    // Transform button
    const submitBtn = state.containerEl.querySelector("#btnSubmitSteps");
    submitBtn.className = "btn btn-success";
    submitBtn.innerHTML = "<span>下一題 ➔</span>";
    submitBtn.onclick = function () {
      state.currentIndex++;
      renderCurrentQuestion();
    };

    recordAnswerTelemetry(q.id, isCorrect, durationSeconds, submittedStepIds.join('->'));
  }

  /**
   * Record telemetry & asynchronously persist to Google Form
   */
  function recordAnswerTelemetry(questionId, isCorrect, durationSeconds, userPayload) {
    state.totalAnswered++;
    if (isCorrect) state.totalCorrect++;

    const accuracy = Math.round((state.totalCorrect / state.totalAnswered) * 100);
    const scoreVal = isCorrect ? "100" : "0";

    state.sessionHistory.push({
      questionId,
      isCorrect,
      durationSeconds,
      accuracy,
      timestamp: Date.now()
    });

    // Notify timers.js
    if (typeof window !== 'undefined' && window.AntiCheatTimers) {
      window.AntiCheatTimers.onQuestionAnswered({
        questionId,
        isCorrect,
        durationSeconds
      });
    }

    // Submit telemetry to Google Form asynchronously via persistence.js
    if (typeof window !== 'undefined' && window.submitFormRecord) {
      const telemetryDateID = `${questionId}_T${durationSeconds}s_ACC${accuracy}`;
      window.submitFormRecord({
        classID: state.classID,
        studentID: state.studentID,
        dateID: telemetryDateID,
        scoreTag: scoreVal
      }).catch(function (err) {
        console.warn("[QuizEngine] Async telemetry submission caught:", err);
      });
    }
  }

  /**
   * Render Quiz Completion Summary
   */
  function renderQuizSummary() {
    const accuracy = state.totalAnswered > 0 ? Math.round((state.totalCorrect / state.totalAnswered) * 100) : 0;
    const totalPracticeSec = (typeof window !== 'undefined' && window.AntiCheatTimers) ?
      window.AntiCheatTimers.getTotalSessionSeconds() : 0;

    const m = Math.floor(totalPracticeSec / 60);
    const s = totalPracticeSec % 60;
    const timeFormatted = `${m} 分 ${s} 秒`;

    state.containerEl.innerHTML = `
      <div class="quiz-summary-card">
        <div style="font-size: 48px; margin-bottom: 8px;">🎓</div>
        <h2 style="font-size: 20px; font-weight: 700; color: var(--text-highlight); margin-bottom: 6px;">
          本次數學練習測驗完成！
        </h2>
        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">
          表現優異！所有作答數據已即時同步至雲端數據庫。
        </p>

        <div class="summary-stats-grid">
          <div class="stat-box">
            <span class="stat-number">${state.totalAnswered}</span>
            <span class="stat-label">完成題數</span>
          </div>
          <div class="stat-box">
            <span class="stat-number" style="color: var(--success-color);">${state.totalCorrect}</span>
            <span class="stat-label">正確題數</span>
          </div>
          <div class="stat-box">
            <span class="stat-number" style="color: var(--text-highlight);">${accuracy}%</span>
            <span class="stat-label">綜合正確率</span>
          </div>
          <div class="stat-box">
            <span class="stat-number">${timeFormatted}</span>
            <span class="stat-label">專注總時長</span>
          </div>
        </div>

        <div class="btn-group" style="flex-direction: column; gap: 10px; margin-top: 18px;">
          <button id="btnSummaryLeaderboard" class="btn btn-primary">
            <span>🏆 查看全校榮譽榜</span>
          </button>
          <button id="btnSummaryRestart" class="btn btn-secondary">
            <span>🔄 重新隨機抽題練習</span>
          </button>
          <button id="btnSummaryDashboard" class="btn btn-secondary">
            <span>← 返回練習首頁</span>
          </button>
        </div>
      </div>
    `;

    document.getElementById("btnSummaryLeaderboard").addEventListener("click", function () {
      if (typeof window !== 'undefined' && typeof window.showScreen === 'function') {
        window.showScreen("screen8-leaderboard");
      }
    });

    document.getElementById("btnSummaryRestart").addEventListener("click", function () {
      startQuiz(state.classID, state.studentID, state.studentName);
    });

    document.getElementById("btnSummaryDashboard").addEventListener("click", function () {
      if (typeof window !== 'undefined' && typeof window.showScreen === 'function') {
        window.showScreen("screen4-dashboard");
      }
    });
  }

  // Public API
  return {
    startQuiz,
    renderCurrentQuestion,
    submitSingleChoiceAnswer,
    submitMultipleChoiceAnswer,
    submitStepOrderingAnswer,
    triggerMathJaxTypeset,
    getStats: function () {
      return {
        classID: state.classID,
        studentID: state.studentID,
        totalAnswered: state.totalAnswered,
        totalCorrect: state.totalCorrect,
        accuracy: state.totalAnswered > 0 ? Math.round((state.totalCorrect / state.totalAnswered) * 100) : 0,
        currentIndex: state.currentIndex,
        totalQuestions: state.questions.length
      };
    }
  };
});
