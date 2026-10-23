/**
 * quiz_engine_1023.js - 4CD 1023 Adaptive Practice Platform Quiz Engine
 * Multi-Select 8-Option (A-H), Adaptive Anti-Guessing Dosage (25..60 Questions),
 * MathJax Dynamic Typesetting, 15-Minute Re-Scan Freeze, Wrong-Question Review
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.QuizEngine1023 = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const STORAGE_KEY = "MATH_ACTIVE_QUIZ_PROGRESS";
  const BASE_DOSAGE = 25;
  const MAX_DOSAGE = 60;
  const HASTY_THRESHOLD_MS = 3000; // 3.0s threshold for hasty guess

  // Internal Engine State
  const state = {
    classID: "",
    studentID: null,
    studentName: "",
    
    questions: [],
    currentIndex: 0,
    currentQuestion: null,
    currentShuffledOptions: [],
    
    selectedOptions: new Set(),
    isSubmitted: false,
    questionStartTime: 0,
    
    // Dosage & Anti-Guessing Telemetry
    targetDosage: BASE_DOSAGE,
    hastyGuessCount: 0,
    totalAnswered: 0,
    totalCorrect: 0,
    totalScore: 0,
    
    // Session Log
    history: [],
    wrongQuestions: [],
    
    // UI Callbacks
    onDosageChanged: null,
    onQuizCompleted: null
  };

  /**
   * Helper: Fisher-Yates array shuffle
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
   * Trigger MathJax rendering on container
   */
  function renderMath(element) {
    if (typeof window !== 'undefined' && window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise(element ? [element] : []).catch(function (e) {
        console.warn("[QuizEngine1023] MathJax typesetting error:", e);
      });
    }
  }

  /**
   * Persist active quiz progress to LocalStorage
   */
  function persistProgress() {
    if (!state.classID || !state.studentID) return;
    try {
      const payload = {
        classID: state.classID,
        studentID: state.studentID,
        studentName: state.studentName,
        questionIds: state.questions.map(q => q.id),
        currentIndex: state.currentIndex,
        selectedOptions: Array.from(state.selectedOptions),
        isSubmitted: state.isSubmitted,
        targetDosage: state.targetDosage,
        hastyGuessCount: state.hastyGuessCount,
        totalAnswered: state.totalAnswered,
        totalCorrect: state.totalCorrect,
        totalScore: state.totalScore,
        history: state.history,
        wrongQuestions: state.wrongQuestions,
        timerState: (window.AntiCheatTimers && typeof window.AntiCheatTimers.getPracticeElapsedSeconds === 'function') ? {
          practiceElapsedSeconds: window.AntiCheatTimers.getPracticeElapsedSeconds(),
          questionElapsedSeconds: window.AntiCheatTimers.getQuestionElapsedSeconds(),
          totalSessionSeconds: window.AntiCheatTimers.getTotalSessionSeconds()
        } : null,
        timestamp: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn("[QuizEngine1023] Failed to persist quiz progress:", e);
    }
  }

  /**
   * Clear active quiz progress from LocalStorage
   */
  function clearProgress() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  }

  /**
   * Start a new quiz session
   */
  function startQuiz(classID, studentID, studentName, customQuestions) {
    state.classID = String(classID || "").trim().toUpperCase();
    state.studentID = parseInt(studentID, 10);
    state.studentName = String(studentName || "");
    
    const pool = customQuestions || (window.QUESTIONS_4CD1023 || []);
    if (!pool || pool.length === 0) {
      alert("題庫尚未載入，請稍候重試！");
      return;
    }

    state.questions = shuffleArray(pool);
    state.currentIndex = 0;
    state.targetDosage = Math.min(BASE_DOSAGE, state.questions.length);
    state.hastyGuessCount = 0;
    state.totalAnswered = 0;
    state.totalCorrect = 0;
    state.totalScore = 0;
    state.history = [];
    state.wrongQuestions = [];
    state.selectedOptions = new Set();
    state.isSubmitted = false;

    // Start AntiCheat Timers
    if (window.AntiCheatTimers && typeof window.AntiCheatTimers.start === 'function') {
      window.AntiCheatTimers.reset();
      window.AntiCheatTimers.start({
        classID: state.classID,
        studentID: state.studentID,
        name: state.studentName
      });
    }

    persistProgress();
    renderCurrentQuestion();
  }

  /**
   * Resume quiz session from saved progress object
   */
  function resumeQuiz(savedData) {
    if (!savedData || !Array.isArray(savedData.questionIds) || savedData.questionIds.length === 0) return false;
    
    state.classID = savedData.classID;
    state.studentID = savedData.studentID;
    state.studentName = savedData.studentName || "";
    
    const pool = window.QUESTIONS_4CD1023 || [];
    const qMap = {};
    pool.forEach(q => { qMap[q.id] = q; });

    state.questions = savedData.questionIds.map(id => qMap[id]).filter(Boolean);
    if (state.questions.length === 0) return false;

    state.currentIndex = Math.min(savedData.currentIndex || 0, state.questions.length - 1);
    state.targetDosage = savedData.targetDosage || BASE_DOSAGE;
    state.hastyGuessCount = savedData.hastyGuessCount || 0;
    state.totalAnswered = savedData.totalAnswered || 0;
    state.totalCorrect = savedData.totalCorrect || 0;
    state.totalScore = savedData.totalScore || 0;
    state.history = savedData.history || [];
    state.wrongQuestions = savedData.wrongQuestions || [];
    state.selectedOptions = new Set(savedData.selectedOptions || []);
    state.isSubmitted = !!savedData.isSubmitted;

    // Restore AntiCheat Timers
    if (window.AntiCheatTimers) {
      if (typeof window.AntiCheatTimers.start === 'function') {
        window.AntiCheatTimers.start({
          classID: state.classID,
          studentID: state.studentID,
          name: state.studentName
        });
      }
      if (savedData.timerState && typeof window.AntiCheatTimers.restore === 'function') {
        window.AntiCheatTimers.restore(savedData.timerState);
      }
    }

    renderCurrentQuestion();
    return true;
  }

  /**
   * Render the current question in screen5-quiz
   */
  function renderCurrentQuestion() {
    const q = state.questions[state.currentIndex];
    if (!q) {
      finishQuiz();
      return;
    }

    state.currentQuestion = q;
    state.questionStartTime = Date.now();
    state.selectedOptions.clear();
    state.isSubmitted = false;

    // Reset per-question latency timer
    if (window.AntiCheatTimers && typeof window.AntiCheatTimers.resetQuestionTimer === 'function') {
      window.AntiCheatTimers.resetQuestionTimer();
    }

    // Update Progress Indicator
    const progressBadge = document.getElementById("quizProgressBadge");
    if (progressBadge) {
      progressBadge.textContent = `第 ${state.currentIndex + 1} / ${state.targetDosage} 題`;
    }
    const topicBadge = document.getElementById("quizTopicBadge");
    if (topicBadge) {
      topicBadge.textContent = q.topic || "高中數學 · 綜合訓練";
    }

    // Update Dosage Warning Toast if penalised
    const dosageAlert = document.getElementById("quizDosageAlert");
    if (dosageAlert) {
      if (state.targetDosage > BASE_DOSAGE) {
        dosageAlert.style.display = "block";
        dosageAlert.innerHTML = `⚠️ <strong>自適應防瞎猜機制已啟動</strong>：累計檢測到 ${state.hastyGuessCount} 次過快答題，題量自適應擴展至 <strong>${state.targetDosage} 題</strong>（上限 60 題）。請認真運算！`;
      } else {
        dosageAlert.style.display = "none";
      }
    }

    // Render Stem
    const stemEl = document.getElementById("quizQuestionStem");
    if (stemEl) {
      stemEl.innerHTML = q.stem;
    }

    // Render Diagram if present
    const diagBox = document.getElementById("quizDiagramBox");
    const diagImg = document.getElementById("quizDiagramImg");
    const diagCap = document.getElementById("quizDiagramCaption");
    if (diagBox && diagImg) {
      if (q.diagram_filename) {
        diagBox.style.display = "block";
        diagImg.src = `diagrams/${q.diagram_filename}`;
        diagImg.alt = q.diagram_spec || "數學視覺圖象";
        if (diagCap) {
          diagCap.textContent = q.diagram_spec || "";
        }
      } else {
        diagBox.style.display = "none";
      }
    }

    // Shuffle options for display while retaining canonical key references
    state.currentShuffledOptions = shuffleArray(q.options || []);
    renderOptionsList();

    // Reset Buttons and Feedback Panel
    const btnSubmit = document.getElementById("btnSubmitQuizAnswer");
    const btnNext = document.getElementById("btnNextQuizQuestion");
    const feedbackBox = document.getElementById("quizFeedbackPanel");

    if (btnSubmit) {
      btnSubmit.style.display = "inline-flex";
      btnSubmit.disabled = true; // disabled until an option is picked
    }
    if (btnNext) {
      btnNext.style.display = "none";
    }
    if (feedbackBox) {
      feedbackBox.style.display = "none";
      feedbackBox.innerHTML = "";
    }

    persistProgress();

    // Typeset LaTeX math
    const quizCard = document.getElementById("quizMainCard");
    renderMath(quizCard || document.getElementById("screen5-quiz"));
  }

  /**
   * Render the 8 options list (A-H)
   */
  function renderOptionsList() {
    const container = document.getElementById("quizOptionsContainer");
    if (!container) return;
    container.innerHTML = "";

    state.currentShuffledOptions.forEach(function (opt, idx) {
      const card = document.createElement("div");
      card.className = "option-card multi-select-option";
      card.dataset.key = opt.key;
      card.style.cssText = "display: flex; align-items: flex-start; gap: 12px; padding: 12px 14px; margin-bottom: 8px; border-radius: 8px; background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(148, 163, 184, 0.2); cursor: pointer; transition: all 0.2s ease;";

      const isChecked = state.selectedOptions.has(opt.key);
      if (isChecked) {
        card.style.background = "rgba(56, 189, 248, 0.12)";
        card.style.borderColor = "#38bdf8";
      }

      card.innerHTML = `
        <div class="checkbox-indicator" style="width: 22px; height: 22px; border-radius: 4px; border: 2px solid ${isChecked ? '#38bdf8' : '#64748b'}; background: ${isChecked ? '#38bdf8' : 'transparent'}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #0f172a; font-weight: bold; font-size: 14px;">
          ${isChecked ? '✓' : ''}
        </div>
        <div style="flex: 1; font-size: 14.5px; line-height: 1.5; color: #f1f5f9;">
          <strong style="color: #38bdf8; margin-right: 6px;">${opt.key}.</strong> ${opt.text}
        </div>
      `;

      card.onclick = function () {
        if (state.isSubmitted) return;
        toggleOption(opt.key);
      };

      container.appendChild(card);
    });
  }

  /**
   * Toggle selection state of an option key
   */
  function toggleOption(key) {
    if (state.selectedOptions.has(key)) {
      state.selectedOptions.delete(key);
    } else {
      state.selectedOptions.add(key);
    }
    renderOptionsList();

    const btnSubmit = document.getElementById("btnSubmitQuizAnswer");
    if (btnSubmit) {
      btnSubmit.disabled = (state.selectedOptions.size === 0);
    }
    persistProgress();
  }

  /**
   * Submit student's answers for current question
   */
  function submitAnswer() {
    if (state.isSubmitted || state.selectedOptions.size === 0) return;
    state.isSubmitted = true;

    const durationMs = Date.now() - state.questionStartTime;
    const durationSec = Math.round(durationMs / 1000);
    const q = state.currentQuestion;

    const chosen = Array.from(state.selectedOptions).sort();
    const correct = (q.correctKeys || q.answer || []).slice().sort();

    // Verification: exact set equality
    const isCorrect = (chosen.length === correct.length) && chosen.every((v, i) => v === correct[i]);
    const scoreAwarded = isCorrect ? 4 : 0;

    state.totalAnswered++;
    if (isCorrect) {
      state.totalCorrect++;
      state.totalScore += scoreAwarded;
    } else {
      state.wrongQuestions.push({
        question: q,
        chosen: chosen,
        correct: correct,
        durationSec: durationSec
      });
    }

    // Adaptive Anti-Guessing Engine evaluation
    let isHastyGuess = false;
    if (durationMs < HASTY_THRESHOLD_MS || (durationSec < 5 && !isCorrect)) {
      isHastyGuess = true;
      state.hastyGuessCount++;
      // Penalize: increase dosage by 3 questions up to MAX_DOSAGE (60)
      if (state.hastyGuessCount >= 2 && state.targetDosage < MAX_DOSAGE) {
        state.targetDosage = Math.min(MAX_DOSAGE, Math.min(state.questions.length, state.targetDosage + 3));
      }
    }

    state.history.push({
      qid: q.id,
      topic: q.topic,
      isCorrect: isCorrect,
      chosen: chosen,
      correct: correct,
      durationSec: durationSec,
      isHastyGuess: isHastyGuess
    });

    // Submit telemetry record to Sheet
    if (window.submitFormRecord) {
      window.submitFormRecord({
        classID: state.classID,
        studentID: state.studentID,
        dateID: `${q.id}_T${durationSec}s_ACC${Math.round(state.totalCorrect / state.totalAnswered * 100)}`,
        score: scoreAwarded
      }).catch(function (e) {
        console.warn("[QuizEngine1023] Form telemetry error:", e);
      });
    }

    // Render Answer Feedback Panel
    const feedbackBox = document.getElementById("quizFeedbackPanel");
    if (feedbackBox) {
      feedbackBox.style.display = "block";
      feedbackBox.className = isCorrect ? "alert-box alert-success" : "alert-box alert-danger";
      feedbackBox.innerHTML = `
        <div style="font-size: 16px; font-weight: 700; margin-bottom: 6px;">
          ${isCorrect ? '✅ 恭喜！本題完全正確 (+4分)' : '❌ 本題答案有誤 (0分)'}
        </div>
        <div style="font-size: 14px; margin-bottom: 8px;">
          <strong>您的選擇：</strong> ${chosen.join(", ") || "未作答"}<br>
          <strong>正確答案：</strong> <span style="color: #38bdf8; font-weight: 700;">${correct.join(", ")}</span>
          ${isHastyGuess ? '<span class="badge bg-warning text-dark ms-2">⚠️ 答題時間過短（疑似瞎猜）</span>' : ''}
        </div>
        <div style="font-size: 13.5px; background: rgba(15, 23, 42, 0.6); padding: 10px 12px; border-radius: 6px; border-left: 3px solid #38bdf8;">
          <strong>【題目解析】：</strong><br>
          ${q.explanation || '暫無解析'}
        </div>
      `;
      renderMath(feedbackBox);
    }

    // Swap buttons: hide Submit, show Next
    const btnSubmit = document.getElementById("btnSubmitQuizAnswer");
    const btnNext = document.getElementById("btnNextQuizQuestion");
    if (btnSubmit) btnSubmit.style.display = "none";
    if (btnNext) {
      btnNext.style.display = "inline-flex";
      const isLast = (state.currentIndex + 1 >= state.targetDosage) || (state.currentIndex + 1 >= state.questions.length);
      btnNext.innerHTML = isLast ? "<span>🏁 查看測試總結與錯題回顧</span>" : "<span>下一題 →</span>";
    }

    persistProgress();
  }

  /**
   * Advance to next question or complete quiz
   */
  function nextQuestion() {
    if (state.currentIndex + 1 >= state.targetDosage || state.currentIndex + 1 >= state.questions.length) {
      finishQuiz();
    } else {
      state.currentIndex++;
      renderCurrentQuestion();
    }
  }

  /**
   * Finish quiz, display score report & wrong review
   */
  function finishQuiz() {
    clearProgress();
    if (window.AntiCheatTimers && typeof window.AntiCheatTimers.stop === 'function') {
      window.AntiCheatTimers.stop();
    }

    const accuracy = state.totalAnswered > 0 ? Math.round((state.totalCorrect / state.totalAnswered) * 100) : 0;
    const finalScore = state.totalCorrect * 4;

    // Submit aggregate score tag
    if (window.submitFormRecord) {
      window.submitFormRecord({
        classID: state.classID,
        studentID: state.studentID,
        dateID: `FINAL_SCORE_${finalScore}_TOTAL_${state.totalAnswered}_ACC_${accuracy}`,
        score: finalScore
      }).catch(function (e) {});
    }

    renderWrongReviewScreen(finalScore, accuracy);

    // Switch screen
    if (typeof window.showScreen === 'function') {
      window.showScreen("screen9-wrong-review");
    }
  }

  /**
   * Render Screen 9 Wrong Review
   */
  function renderWrongReviewScreen(score, accuracy) {
    const summaryCard = document.getElementById("wrongReviewSummary");
    if (summaryCard) {
      summaryCard.innerHTML = `
        <div style="text-align: center; margin-bottom: 12px;">
          <h2 style="color: #38bdf8; margin-bottom: 4px; font-weight: 700;">🎯 答題成績報告</h2>
          <div style="font-size: 14px; color: #94a3b8;">${state.classID} 班 ${state.studentID} 號 ${state.studentName} 同學</div>
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 16px; text-align: center;">
          <div style="background: rgba(30, 41, 59, 0.8); padding: 12px 8px; border-radius: 8px; border: 1px solid rgba(148, 163, 184, 0.2);">
            <div style="font-size: 22px; font-weight: 700; color: #22c55e;">${score !== undefined ? score : state.totalScore}</div>
            <div style="font-size: 12px; color: #94a3b8;">最終得分 (滿分 ${state.targetDosage * 4})</div>
          </div>
          <div style="background: rgba(30, 41, 59, 0.8); padding: 12px 8px; border-radius: 8px; border: 1px solid rgba(148, 163, 184, 0.2);">
            <div style="font-size: 22px; font-weight: 700; color: #38bdf8;">${accuracy !== undefined ? accuracy : Math.round((state.totalCorrect / Math.max(1, state.totalAnswered)) * 100)}%</div>
            <div style="font-size: 12px; color: #94a3b8;">綜合正確率</div>
          </div>
          <div style="background: rgba(30, 41, 59, 0.8); padding: 12px 8px; border-radius: 8px; border: 1px solid rgba(148, 163, 184, 0.2);">
            <div style="font-size: 22px; font-weight: 700; color: #f59e0b;">${state.wrongQuestions.length}</div>
            <div style="font-size: 12px; color: #94a3b8;">錯題總數</div>
          </div>
        </div>
      `;
    }

    const listContainer = document.getElementById("wrongReviewList");
    if (!listContainer) return;
    listContainer.innerHTML = "";

    if (state.wrongQuestions.length === 0) {
      listContainer.innerHTML = `
        <div class="alert-box alert-success" style="text-align: center; padding: 24px;">
          <div style="font-size: 40px; margin-bottom: 8px;">🎉</div>
          <h4>完美通關！本次練習無任何錯題！</h4>
          <p style="color: #94a3b8; font-size: 14px;">您已完全掌握高一一元二次不等式、函數定義域、值域與單調性核心知識點。</p>
        </div>
      `;
      return;
    }

    state.wrongQuestions.forEach(function (w, index) {
      const q = w.question;
      const card = document.createElement("div");
      card.className = "card";
      card.style.cssText = "margin-bottom: 16px; padding: 16px; border-radius: 10px; background: rgba(30, 41, 59, 0.9); border: 1px solid rgba(239, 68, 68, 0.3);";

      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <span class="badge bg-danger">錯題 #${index + 1}</span>
          <span style="font-size: 13px; color: #94a3b8;">${q.topic || ''}</span>
        </div>
        <div style="font-size: 15px; margin-bottom: 12px; color: #f8fafc; line-height: 1.6;">
          ${q.stem}
        </div>
        ${q.diagram_filename ? `
          <div style="text-align: center; margin: 10px 0;">
            <img src="diagrams/${q.diagram_filename}" style="max-width: 90%; max-height: 180px; border-radius: 6px; border: 1px solid #334155;">
          </div>
        ` : ''}
        <div style="background: rgba(15, 23, 42, 0.7); padding: 10px 12px; border-radius: 6px; font-size: 13.5px; margin-bottom: 10px;">
          <div style="color: #f87171; margin-bottom: 4px;">❌ <strong>您的作答：</strong> ${w.chosen.join(', ') || '未作答'}</div>
          <div style="color: #4ade80;">✅ <strong>正確答案：</strong> ${w.correct.join(', ')}</div>
        </div>
        <div style="background: rgba(15, 23, 42, 0.5); padding: 10px 12px; border-radius: 6px; font-size: 13px; border-left: 3px solid #38bdf8; color: #cbd5e1;">
          <strong style="color: #38bdf8;">【詳盡解析】：</strong><br>
          ${q.explanation || '無'}
        </div>
      `;

      listContainer.appendChild(card);
    });

    renderMath(listContainer);
  }

  /**
   * Start retest of missed wrong questions
   */
  function retestWrongQuestions() {
    if (state.wrongQuestions.length === 0) {
      alert("目前沒有錯題需要重測！");
      return;
    }
    const missedPool = state.wrongQuestions.map(w => w.question);
    startQuiz(state.classID, state.studentID, state.studentName, missedPool);
    if (typeof window.showScreen === 'function') {
      window.showScreen("screen5-quiz");
    }
  }

  return {
    startQuiz: startQuiz,
    resumeQuiz: resumeQuiz,
    toggleOption: toggleOption,
    submitAnswer: submitAnswer,
    nextQuestion: nextQuestion,
    retestWrongQuestions: retestWrongQuestions,
    renderWrongReviewScreen: renderWrongReviewScreen,
    getState: function () { return Object.assign({}, state); }
  };
});
