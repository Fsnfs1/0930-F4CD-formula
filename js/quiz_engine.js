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
    isRetestMode: false,
    currentWrongReviewFilter: "all",

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

  // =========================================================================
  // LocalStorage Persistence Schema: MATH_WRONG_QUESTIONS (R4)
  // =========================================================================
  const WRONG_STORAGE_KEY = "MATH_WRONG_QUESTIONS";

  function getStudentWrongKey(classID, studentID) {
    const cls = classID || state.classID;
    const sid = studentID || state.studentID;
    if (cls && sid) {
      return `math_last_round_wrong_${cls}_${sid}`;
    }
    return null;
  }

  function getStoredWrongQuestions(classID, studentID) {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    try {
      const cls = classID || state.classID;
      const sid = studentID || state.studentID;
      const studentKey = getStudentWrongKey(cls, sid);

      const raw = window.localStorage.getItem(WRONG_STORAGE_KEY);
      let list = raw ? JSON.parse(raw) : null;

      if (!Array.isArray(list) || list.length === 0) {
        if (studentKey) {
          const studentRaw = window.localStorage.getItem(studentKey);
          if (studentRaw) {
            const studentList = JSON.parse(studentRaw);
            if (Array.isArray(studentList) && studentList.length > 0) {
              list = studentList;
              window.localStorage.setItem(WRONG_STORAGE_KEY, JSON.stringify(list));
            }
          }
        }
      }

      if (!Array.isArray(list)) list = [];
      return list;
    } catch (err) {
      console.warn("[QuizEngine] Error reading wrong questions from storage:", err);
      return [];
    }
  }

  function saveStoredWrongQuestions(list, classID, studentID) {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      const jsonStr = JSON.stringify(list || []);
      window.localStorage.setItem(WRONG_STORAGE_KEY, jsonStr);
      const cls = classID || state.classID;
      const sid = studentID || state.studentID;
      const studentKey = getStudentWrongKey(cls, sid);
      if (studentKey) {
        window.localStorage.setItem(studentKey, jsonStr);
      }
    } catch (err) {
      console.warn("[QuizEngine] Error saving wrong questions to storage:", err);
    }
  }

  function recordWrongQuestion(wrongRecord) {
    if (!wrongRecord || !wrongRecord.id) return;
    const cls = wrongRecord.classID || state.classID;
    const sid = wrongRecord.studentID || state.studentID;

    const list = getStoredWrongQuestions(cls, sid);
    const existingIdx = list.findIndex(function (item) {
      return item.id === wrongRecord.id;
    });

    if (existingIdx >= 0) {
      // Deduplicate: overwrite with latest attempt
      list[existingIdx] = Object.assign({}, list[existingIdx], wrongRecord, {
        retested: false,
        retestCorrect: null,
        timestamp: Date.now()
      });
    } else {
      list.unshift(wrongRecord);
    }

    saveStoredWrongQuestions(list, cls, sid);
    updateDashboardBadge(cls, sid);
  }

  function updateRetestOutcome(questionId, isCorrect, userAnswer, distractorsChosen) {
    const list = getStoredWrongQuestions(state.classID, state.studentID);
    const idx = list.findIndex(function (item) {
      return item.id === questionId;
    });

    if (idx !== -1) {
      list[idx].retested = true;
      list[idx].retestCorrect = isCorrect;
      list[idx].retestTimestamp = Date.now();
      if (userAnswer !== undefined) list[idx].userAnswer = userAnswer;
      if (distractorsChosen !== undefined) list[idx].distractorsChosen = distractorsChosen;
      const cls = state.classID || list[idx].classID;
      const sid = state.studentID || list[idx].studentID;
      saveStoredWrongQuestions(list, cls, sid);
      updateDashboardBadge(cls, sid);
    }
  }

  function updateDashboardBadge(classID, studentID) {
    if (typeof document === 'undefined') return;
    const badge = document.getElementById("badgeWrongCount");
    if (!badge) return;
    const list = getStoredWrongQuestions(classID || state.classID, studentID || state.studentID);
    if (list && list.length > 0) {
      badge.textContent = String(list.length);
      badge.style.display = "inline-block";
    } else {
      badge.textContent = "0";
      badge.style.display = "none";
    }
  }

  function clearMasteredWrongQuestions() {
    let list = getStoredWrongQuestions(state.classID, state.studentID);
    const beforeCount = list.length;
    const targetItem = list.find(item => item && item.classID && item.studentID);
    const cls = state.classID || (targetItem && targetItem.classID);
    const sid = state.studentID || (targetItem && targetItem.studentID);
    list = list.filter(function (item) {
      return !(item.retested === true && item.retestCorrect === true);
    });
    const cleared = beforeCount - list.length;
    saveStoredWrongQuestions(list, cls, sid);
    renderWrongReviewScreen(state.currentWrongReviewFilter);
    updateDashboardBadge(cls, sid);
    if (typeof alert === 'function') {
      alert(cleared > 0 ? `已清除 ${cleared} 道重測已掌握的錯題！` : "目前沒有已掌握（重測正確）的錯題可清除。");
    }
  }

  /**
   * Start Re-test Session for Wrong Questions (R4)
   * Loads wrong questions as active quiz session
   */
  function startRetest() {
    const wrongList = getStoredWrongQuestions(state.classID, state.studentID);
    if (!wrongList || wrongList.length === 0) {
      if (typeof alert === 'function') {
        alert("目前沒有錯題記錄，無需重測！");
      }
      return false;
    }

    state.isRetestMode = true;
    state.questions = wrongList.slice();
    state.currentIndex = 0;
    state.totalAnswered = 0;
    state.totalCorrect = 0;
    state.sessionHistory = [];
    state.isCompleted = false;

    state.containerEl = document.getElementById("quizQuestionContainer");
    state.progressEl = document.getElementById("quizProgressText");
    state.timerEl = document.getElementById("quizTimerText");

    if (typeof window !== 'undefined' && window.AntiCheatTimers) {
      window.AntiCheatTimers.resetQuestionTimer();
    }

    // Switch to quiz screen
    if (typeof window !== 'undefined' && typeof window.showScreen === 'function') {
      window.showScreen("screen5-quiz");
    }

    renderCurrentQuestion();
    return true;
  }

  /**
   * Render Wrong Questions Review Screen (#screen9-wrong-review)
   * @param {string} [filterType="all"] "all" | "single_choice" | "multiple_choice" | "step_order"
   */
  function renderWrongReviewScreen(filterType) {
    if (typeof document === 'undefined') return;

    filterType = filterType || state.currentWrongReviewFilter || "all";
    state.currentWrongReviewFilter = filterType;

    const wrongList = getStoredWrongQuestions(state.classID, state.studentID);
    const totalCount = wrongList.length;
    const singleCount = wrongList.filter(q => q.type === "single_choice").length;
    const multiCount = wrongList.filter(q => q.type === "multiple_choice").length;
    const stepCount = wrongList.filter(q => q.type === "step_order").length;

    // Update Summary HUD
    const summaryTotalEl = document.getElementById("summaryTotalWrong");
    const statTotalEl = document.getElementById("statTotalWrong");
    const statSingleEl = document.getElementById("statSingleWrong");
    const statMultiEl = document.getElementById("statMultiWrong");
    const statStepEl = document.getElementById("statStepWrong");
    const countAllEl = document.getElementById("countFilterAll");
    const countSingleEl = document.getElementById("countFilterSingle");
    const countMultiEl = document.getElementById("countFilterMulti");
    const countStepEl = document.getElementById("countFilterStep");

    if (summaryTotalEl) summaryTotalEl.textContent = String(totalCount);
    if (statTotalEl) statTotalEl.textContent = String(totalCount);
    if (statSingleEl) statSingleEl.textContent = String(singleCount);
    if (statMultiEl) statMultiEl.textContent = String(multiCount);
    if (statStepEl) statStepEl.textContent = String(stepCount);

    if (countAllEl) countAllEl.textContent = String(totalCount);
    if (countSingleEl) countSingleEl.textContent = String(singleCount);
    if (countMultiEl) countMultiEl.textContent = String(multiCount);
    if (countStepEl) countStepEl.textContent = String(stepCount);

    // Update Filter Pills active state and bind clicks
    const filterPills = document.querySelectorAll(".review-filter-bar .filter-pill");
    filterPills.forEach(function (pill) {
      const pFilter = pill.getAttribute("data-filter");
      if (pFilter === filterType) {
        pill.classList.add("active");
      } else {
        pill.classList.remove("active");
      }
      pill.onclick = function () {
        renderWrongReviewScreen(this.getAttribute("data-filter") || "all");
      };
    });

    const emptyStateEl = document.getElementById("wrongEmptyState");
    const listContainerEl = document.getElementById("wrongQuestionsListContainer");
    const actionsToolbarEl = document.getElementById("wrongActionsToolbar");
    const listEl = document.getElementById("wrongQuestionsList");

    if (totalCount === 0) {
      if (emptyStateEl) emptyStateEl.style.display = "block";
      if (listContainerEl) listContainerEl.style.display = "none";
      if (actionsToolbarEl) actionsToolbarEl.style.display = "none";
      if (listEl) listEl.innerHTML = "";
      return;
    }

    if (emptyStateEl) emptyStateEl.style.display = "none";
    if (listContainerEl) listContainerEl.style.display = "block";
    if (actionsToolbarEl) actionsToolbarEl.style.display = "flex";

    // Filter questions
    let filteredQuestions = wrongList;
    if (filterType !== "all") {
      filteredQuestions = wrongList.filter(q => q.type === filterType);
    }

    if (!listEl) return;

    if (filteredQuestions.length === 0) {
      listEl.innerHTML = `
        <div class="placeholder-banner" style="padding: 24px 16px;">
          <p class="placeholder-text">此分類下暫無錯題記錄</p>
        </div>
      `;
      return;
    }

    let cardsHtml = "";
    filteredQuestions.forEach(function (q, index) {
      cardsHtml += renderWrongQuestionCardHtml(q, index + 1);
    });

    listEl.innerHTML = cardsHtml;

    // USER GLOBAL RULE & MathJax Compliance:
    // Invoke MathJax.typesetPromise([cardElement]) for every rendered card
    const cardElements = listEl.querySelectorAll(".wrong-question-card");
    if (cardElements.length > 0) {
      cardElements.forEach(function (card) {
        triggerMathJaxTypeset(card);
      });
    } else {
      triggerMathJaxTypeset(listEl);
    }
  }

  function renderWrongQuestionCardHtml(q, number) {
    const typeBadgeMap = {
      single_choice: { label: "單選題", class: "badge-single" },
      multiple_choice: { label: "多選題", class: "badge-multi" },
      step_order: { label: "思維步驟排序題 (8選5)", class: "badge-step" }
    };
    const badgeInfo = typeBadgeMap[q.type] || { label: "題目", class: "badge-single" };

    let retestBadge = "";
    if (q.retested) {
      if (q.retestCorrect) {
        retestBadge = `<span class="badge-retest-correct">✓ 重測已掌握</span>`;
      } else {
        retestBadge = `<span class="badge-retest-wrong">✕ 重測仍有誤</span>`;
      }
    } else {
      retestBadge = `<span style="font-size: 11px; background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 9999px; padding: 2px 8px;">待重測</span>`;
    }

    let detailsHtml = "";

    if (q.type === "single_choice") {
      detailsHtml = renderSingleChoiceReviewDetails(q);
    } else if (q.type === "multiple_choice") {
      detailsHtml = renderMultipleChoiceReviewDetails(q);
    } else if (q.type === "step_order") {
      detailsHtml = renderStepOrderReviewDetails(q);
    }

    return `
      <div class="wrong-question-card" id="wrong_card_${q.id}" data-id="${q.id}">
        <div class="wrong-card-header">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="question-type-badge ${badgeInfo.class}">${badgeInfo.label}</span>
            <span style="font-size: 13px; font-weight: 700; color: var(--text-highlight);">#${number}</span>
          </div>
          <div>${retestBadge}</div>
        </div>

        <div class="question-stem-card" style="margin-bottom: 10px; background: rgba(15, 23, 42, 0.4);">
          <div class="question-stem-text math-scroll-wrapper" style="font-size: 14px; line-height: 1.6;">
            ${q.prompt || q.stem || ''}
          </div>
        </div>

        ${detailsHtml}

        <div class="quiz-explanation-card" style="display: block; margin-top: 12px; background: rgba(15, 23, 42, 0.6);">
          <div style="font-size: 13px; font-weight: 700; color: var(--text-highlight); margin-bottom: 6px;">
            💡 解析與思維步驟：
          </div>
          <div class="expl-content math-scroll-wrapper" style="font-size: 13px; white-space: pre-line;">
            ${q.explanation || '暫無解析'}
          </div>
        </div>
      </div>
    `;
  }

  function renderSingleChoiceReviewDetails(q) {
    const stdAns = q.answer || q.standardAnswer || "";
    const userAns = q.userAnswer || "";

    let optionsListHtml = "";
    if (Array.isArray(q.options)) {
      optionsListHtml = `<div class="quiz-options-list" style="margin-bottom: 10px;">`;
      q.options.forEach(function (opt) {
        let optClass = "quiz-option-card";
        let markTag = "";
        if (opt.key === userAns && opt.key !== stdAns) {
          optClass += " wrong";
          markTag = `<span class="ans-tag ans-tag-wrong" style="margin-left: 8px; font-size: 11px;">❌ 您的選擇</span>`;
        } else if (opt.key === stdAns) {
          optClass += " correct";
          markTag = `<span class="ans-tag ans-tag-correct" style="margin-left: 8px; font-size: 11px;">✅ 正確答案</span>`;
        }
        optionsListHtml += `
          <div class="${optClass}" style="cursor: default;">
            <div class="option-key">${opt.key}.</div>
            <div class="option-content math-scroll-wrapper">${opt.text}</div>
            ${markTag}
          </div>
        `;
      });
      optionsListHtml += `</div>`;
    }

    return `
      ${optionsListHtml}
      <div class="answer-comparison-box">
        <div class="user-ans-line">
          ❌ 您的作答：<span class="ans-tag ans-tag-wrong">${userAns ? `[${userAns}]` : '未作答'}</span>
        </div>
        <div class="correct-ans-line">
          ✅ 標準答案：<span class="ans-tag ans-tag-correct">[${stdAns}]</span>
        </div>
      </div>
    `;
  }

  function renderMultipleChoiceReviewDetails(q) {
    const correctArr = Array.isArray(q.answer) ? q.answer : (Array.isArray(q.standardAnswer) ? q.standardAnswer : [q.answer]);
    const userArr = Array.isArray(q.userAnswer) ? q.userAnswer : (typeof q.userAnswer === 'string' ? q.userAnswer.split('+') : []);
    const correctSorted = (correctArr || []).slice().sort();
    const userSorted = (userArr || []).slice().sort();

    let optionsListHtml = "";
    if (Array.isArray(q.options)) {
      optionsListHtml = `<div class="quiz-options-list" style="margin-bottom: 10px;">`;
      q.options.forEach(function (opt) {
        let optClass = "quiz-option-card";
        let markTag = "";
        const isUserSelected = userSorted.includes(opt.key);
        const isStandard = correctSorted.includes(opt.key);

        if (isUserSelected && isStandard) {
          optClass += " correct";
          markTag = `<span class="ans-tag ans-tag-correct" style="margin-left: 8px; font-size: 11px;">✅ 正確選中</span>`;
        } else if (isUserSelected && !isStandard) {
          optClass += " wrong";
          markTag = `<span class="ans-tag ans-tag-wrong" style="margin-left: 8px; font-size: 11px;">❌ 錯誤多選</span>`;
        } else if (!isUserSelected && isStandard) {
          optClass += " option-missing";
          markTag = `<span class="ans-tag" style="margin-left: 8px; font-size: 11px; background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3);">⚠️ 漏選正確項</span>`;
        }

        optionsListHtml += `
          <div class="${optClass}" style="cursor: default;">
            <div class="option-key">${opt.key}.</div>
            <div class="option-content math-scroll-wrapper">${opt.text}</div>
            ${markTag}
          </div>
        `;
      });
      optionsListHtml += `</div>`;
    }

    return `
      ${optionsListHtml}
      <div class="answer-comparison-box">
        <div class="user-ans-line">
          ❌ 您的作答：<span class="ans-tag ans-tag-wrong">${userSorted.length > 0 ? `[${userSorted.join(', ')}]` : '未作答'}</span>
        </div>
        <div class="correct-ans-line">
          ✅ 標準答案：<span class="ans-tag ans-tag-correct">[${correctSorted.join(', ')}]</span>
        </div>
      </div>
    `;
  }

  function renderStepOrderReviewDetails(q) {
    const correctStepIds = Array.isArray(q.answer) ? q.answer : (Array.isArray(q.standardAnswer) ? q.standardAnswer : ["S1", "S2", "S3", "S4", "S5"]);
    const userStepIds = Array.isArray(q.userAnswer) ? q.userAnswer : (typeof q.userAnswer === 'string' ? q.userAnswer.split('->') : []);

    const stepsMap = {};
    if (Array.isArray(q.steps)) {
      q.steps.forEach(function (s) {
        stepsMap[s.id] = s;
      });
    }

    const slotLabels = ["步驟 A (第1步)", "步驟 B (第2步)", "步驟 C (第3步)", "步驟 D (第4步)", "步驟 E (第5步)"];

    // 1. User submitted steps
    let userSlotsHtml = `<div class="comparison-section"><div style="font-weight: 700; color: #ef4444; font-size: 13px; margin-bottom: 6px;">❌ 您的解題排序：</div>`;
    for (let i = 0; i < 5; i++) {
      const uId = userStepIds[i];
      const expectedId = correctStepIds[i];
      const isMatch = (uId && uId === expectedId);
      const stepObj = uId ? (stepsMap[uId] || { id: uId, text: uId, isDistractor: false }) : null;

      if (stepObj) {
        const distractorTag = stepObj.isDistractor ? `<span style="margin-left: 6px; font-size: 11px; color: #ef4444; font-weight: 700;">[⚠️干擾項]</span>` : "";
        userSlotsHtml += `
          <div class="review-step-item">
            <span class="review-step-badge ${isMatch ? 'badge-match' : 'badge-mismatch'}">
              ${isMatch ? '✓ 正確' : '✕ 順序有誤'}
            </span>
            <div class="math-scroll-wrapper" style="flex: 1;">
              <strong>${slotLabels[i]}</strong>: <span class="slot-step-tag">[${stepObj.id}]</span> ${stepObj.text} ${distractorTag}
            </div>
          </div>
        `;
      } else {
        userSlotsHtml += `
          <div class="review-step-item">
            <span class="review-step-badge badge-mismatch">✕ 未填</span>
            <div><strong>${slotLabels[i]}</strong>: (空槽位)</div>
          </div>
        `;
      }
    }
    userSlotsHtml += `</div>`;

    // 2. Standard steps
    let stdSlotsHtml = `<div class="comparison-section"><div style="font-weight: 700; color: #10b981; font-size: 13px; margin-bottom: 6px;">✅ 標準解題邏輯鏈：</div>`;
    for (let i = 0; i < 5; i++) {
      const cId = correctStepIds[i];
      const cObj = stepsMap[cId] || { id: cId, text: cId };
      stdSlotsHtml += `
        <div class="review-step-item">
          <span class="review-step-badge badge-match">✓ 標準步驟</span>
          <div class="math-scroll-wrapper" style="flex: 1;">
            <strong>${slotLabels[i]}</strong>: <span class="slot-step-tag" style="background: rgba(16, 185, 129, 0.2); color: #10b981;">[${cObj.id}]</span> ${cObj.text}
          </div>
        </div>
      `;
    }
    stdSlotsHtml += `</div>`;

    // 3. Distractor Misconception Warning Box
    let distractors = [];
    if (Array.isArray(q.distractorsChosen) && q.distractorsChosen.length > 0) {
      distractors = q.distractorsChosen;
    } else if (Array.isArray(q.steps)) {
      userStepIds.forEach(function (sid) {
        const found = q.steps.find(s => s && s.id === sid && s.isDistractor);
        if (found) {
          distractors.push({ id: found.id, reason: found.distractorReason || '思維邏輯偏差干擾項' });
        }
      });
    }

    let distractorWarningHtml = "";
    if (distractors.length > 0) {
      distractorWarningHtml = `
        <div class="distractor-feedback-box">
          <strong>⚠️ 偵測到思維誤區干擾項：</strong>
          <ul>
            ${distractors.map(d => `<li><strong>[${d.id}]</strong>: ${d.reason}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    return `
      <div class="step-review-comparison">
        ${userSlotsHtml}
        ${stdSlotsHtml}
      </div>
      ${distractorWarningHtml}
    `;
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
    state.isCompleted = false;

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
   * Resume Quiz from saved snapshot (R3 progress recovery)
   * @param {Object} savedData Saved progress object from LocalStorage
   */
  function resumeQuiz(savedData) {
    if (!savedData) return;
    state.classID = String(savedData.classID || "").trim().toUpperCase();
    state.studentID = savedData.studentID;
    state.studentName = savedData.studentName || "";

    const routing = resolveQuestionBank(state.classID);
    state.gradeLevel = routing.grade;
    state.bankId = routing.bankId;

    // Build question lookup map from G10 and G11
    const rawBank = (routing.bank && routing.bank.questions) ? routing.bank.questions : routing.bank;
    const bankMap = new Map();
    (rawBank || []).forEach(function (q) { bankMap.set(q.id, q); });

    if (typeof window !== 'undefined') {
      const g10 = window.QUESTIONS_G10 ? (window.QUESTIONS_G10.questions || window.QUESTIONS_G10) : [];
      const g11 = window.QUESTIONS_G11 ? (window.QUESTIONS_G11.questions || window.QUESTIONS_G11) : [];
      (Array.isArray(g10) ? g10 : []).forEach(function (q) { if (!bankMap.has(q.id)) bankMap.set(q.id, q); });
      (Array.isArray(g11) ? g11 : []).forEach(function (q) { if (!bankMap.has(q.id)) bankMap.set(q.id, q); });

      if (savedData.isRetest) {
        const storedWrongs = getStoredWrongQuestions(state.classID, state.studentID);
        (Array.isArray(storedWrongs) ? storedWrongs : []).forEach(function (q) {
          if (!bankMap.has(q.id)) bankMap.set(q.id, q);
        });
      }
    }

    if (Array.isArray(savedData.questionIds) && savedData.questionIds.length > 0) {
      state.questions = savedData.questionIds.map(function (id) { return bankMap.get(id); }).filter(Boolean);
    }
    if (!state.questions || state.questions.length === 0) {
      state.questions = shuffleArray(rawBank || []);
    }

    state.totalAnswered = savedData.totalAnswered || 0;
    state.totalCorrect = savedData.totalCorrect || 0;
    state.sessionHistory = Array.isArray(savedData.sessionHistory) ? savedData.sessionHistory : [];
    state.isRetestMode = !!savedData.isRetest;

    // DOM references
    state.containerEl = document.getElementById("quizQuestionContainer");
    state.progressEl = document.getElementById("quizProgressText");
    state.timerEl = document.getElementById("quizTimerText");

    if (savedData.currentIndex >= state.questions.length) {
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          window.localStorage.removeItem("MATH_ACTIVE_QUIZ_PROGRESS");
        } catch (e) {}
      }
      renderQuizSummary();
      return;
    }

    state.currentIndex = Math.min(Math.max(0, savedData.currentIndex || 0), Math.max(0, state.questions.length - 1));
    state.isCompleted = false;

    // Restore practice timers
    if (typeof window !== 'undefined' && window.AntiCheatTimers) {
      if (typeof window.AntiCheatTimers.restore === 'function') {
        window.AntiCheatTimers.restore(savedData.timerState);
      }
      if (typeof window.AntiCheatTimers.start === 'function') {
        window.AntiCheatTimers.start({
          classID: state.classID,
          studentID: state.studentID,
          name: state.studentName
        });
      }
    }

    renderCurrentQuestion(true);
  }

  /**
   * Render question at state.currentIndex
   * @param {boolean} [isResume=false] Whether this call is resuming an in-progress question
   */
  function renderCurrentQuestion(isResume) {
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

    if (isResume) {
      const restoredQSec = (typeof window !== 'undefined' && window.AntiCheatTimers && typeof window.AntiCheatTimers.getQuestionElapsedSeconds === 'function')
        ? window.AntiCheatTimers.getQuestionElapsedSeconds()
        : 0;
      state.questionStartTime = Date.now() - (restoredQSec * 1000);
      // Retain restored question timer in timers.js (do not reset)
    } else {
      state.questionStartTime = Date.now();
      // Reset question elapsed timer in timers.js
      if (typeof window !== 'undefined' && window.AntiCheatTimers) {
        window.AntiCheatTimers.resetQuestionTimer();
      }
    }

    // Update Progress HUD
    if (state.progressEl) {
      if (state.isRetestMode) {
        state.progressEl.textContent = `🎯 錯題專項 第 ${state.currentIndex + 1} / ${state.questions.length} 題`;
      } else {
        state.progressEl.textContent = `第 ${state.currentIndex + 1} / ${state.questions.length} 題`;
      }
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

    if (state.isRetestMode) {
      updateRetestOutcome(q.id, isCorrect, state.selectedSingleOption, []);
    } else if (!isCorrect) {
      recordWrongQuestion({
        id: q.id,
        classID: state.classID,
        studentID: state.studentID,
        studentName: state.studentName,
        type: q.type || "single_choice",
        difficulty: q.difficulty || "",
        tags: q.tags || [],
        prompt: q.prompt || q.stem,
        stem: q.stem || q.prompt,
        options: q.options || [],
        steps: null,
        answer: q.answer,
        standardAnswer: q.answer,
        userAnswer: state.selectedSingleOption,
        isCorrect: false,
        explanation: q.explanation || "",
        distractorsChosen: [],
        timestamp: Date.now(),
        retested: false,
        retestCorrect: null,
        retestTimestamp: null
      });
    }
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

    if (state.isRetestMode) {
      updateRetestOutcome(q.id, isCorrect, userArr, []);
    } else if (!isCorrect) {
      recordWrongQuestion({
        id: q.id,
        classID: state.classID,
        studentID: state.studentID,
        studentName: state.studentName,
        type: q.type || "multiple_choice",
        difficulty: q.difficulty || "",
        tags: q.tags || [],
        prompt: q.prompt || q.stem,
        stem: q.stem || q.prompt,
        options: q.options || [],
        steps: null,
        answer: q.answer,
        standardAnswer: q.answer,
        userAnswer: userArr,
        isCorrect: false,
        explanation: q.explanation || "",
        distractorsChosen: [],
        timestamp: Date.now(),
        retested: false,
        retestCorrect: null,
        retestTimestamp: null
      });
    }
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

    const distractorsChosenList = distractorsChosen.map(function (d) {
      return { id: d.id, reason: d.distractorReason || '未符合該題邏輯鏈' };
    });

    if (state.isRetestMode) {
      updateRetestOutcome(q.id, isCorrect, submittedStepIds, distractorsChosenList);
    } else if (!isCorrect) {
      recordWrongQuestion({
        id: q.id,
        classID: state.classID,
        studentID: state.studentID,
        studentName: state.studentName,
        type: q.type || "step_order",
        difficulty: q.difficulty || "",
        tags: q.tags || [],
        prompt: q.prompt || q.stem,
        stem: q.stem || q.prompt,
        options: null,
        steps: q.steps || [],
        answer: q.answer,
        standardAnswer: q.answer,
        userAnswer: submittedStepIds,
        isCorrect: false,
        explanation: q.explanation || "",
        distractorsChosen: distractorsChosenList,
        timestamp: Date.now(),
        retested: false,
        retestCorrect: null,
        retestTimestamp: null
      });
    }
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
    state.isCompleted = true;
    if (!state.containerEl) {
      state.containerEl = document.getElementById("quizQuestionContainer");
    }
    if (!state.containerEl) return;

    // Clean active quiz progress snapshot upon completion
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.removeItem("MATH_ACTIVE_QUIZ_PROGRESS");
      } catch (e) {}
    }

    const isRetest = !!state.isRetestMode;
    const accuracy = state.totalAnswered > 0 ? Math.round((state.totalCorrect / state.totalAnswered) * 100) : 0;
    const totalPracticeSec = (typeof window !== 'undefined' && window.AntiCheatTimers) ?
      window.AntiCheatTimers.getTotalSessionSeconds() : 0;

    const m = Math.floor(totalPracticeSec / 60);
    const s = totalPracticeSec % 60;
    const timeFormatted = `${m} 分 ${s} 秒`;

    const titleText = isRetest ? "🎯 錯題專項重測完成！" : "本次數學練習測驗完成！";
    const subtitleText = isRetest
      ? "重測作答數據已即時更新至錯題庫與統計分析。"
      : "表現優異！所有作答數據已即時同步至雲端數據庫。";

    const wrongList = getStoredWrongQuestions(state.classID, state.studentID);
    const wrongCount = wrongList ? wrongList.length : 0;
    const reviewWrongBtnHtml = wrongCount > 0 ? `
      <button id="btnSummaryReviewWrong" class="btn btn-warning" style="background: #f59e0b; border-color: #d97706; color: #ffffff;">
        <span>📖 ${isRetest ? '查看錯題掌握情況' : `立即溫習本次錯題 (${wrongCount} 題)`}</span>
      </button>
    ` : '';

    state.containerEl.innerHTML = `
      <div class="quiz-summary-card">
        <div style="font-size: 48px; margin-bottom: 8px;">🎓</div>
        <h2 style="font-size: 20px; font-weight: 700; color: var(--text-highlight); margin-bottom: 6px;">
          ${titleText}
        </h2>
        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">
          ${subtitleText}
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
          ${reviewWrongBtnHtml}
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

    const btnSummaryReviewWrong = document.getElementById("btnSummaryReviewWrong");
    if (btnSummaryReviewWrong) {
      btnSummaryReviewWrong.addEventListener("click", function () {
        if (typeof window !== 'undefined' && typeof window.showScreen === 'function') {
          window.showScreen("screen9-wrong-review");
          renderWrongReviewScreen();
        }
      });
    }

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

    updateDashboardBadge(state.classID, state.studentID);
  }

  // Public API
  return {
    startQuiz,
    resumeQuiz,
    startRetest,
    startWrongQuestionsRetest: startRetest,
    renderWrongReviewScreen,
    updateDashboardBadge,
    clearMasteredWrongQuestions,
    getStoredWrongQuestions,
    saveStoredWrongQuestions,
    recordWrongQuestion,
    updateRetestOutcome,
    getState: function () {
      return {
        classID: state.classID,
        studentID: state.studentID,
        studentName: state.studentName,
        gradeLevel: state.gradeLevel,
        bankId: state.bankId,
        questions: state.questions,
        currentQuestion: state.currentQuestion || (state.questions && state.questions[state.currentIndex]) || null,
        currentIndex: state.currentIndex,
        totalAnswered: state.totalAnswered,
        totalCorrect: state.totalCorrect,
        sessionHistory: state.sessionHistory,
        isRetestMode: !!state.isRetestMode,
        isCompleted: !!state.isCompleted
      };
    },
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
        totalQuestions: state.questions.length,
        isRetestMode: !!state.isRetestMode
      };
    }
  };
});
