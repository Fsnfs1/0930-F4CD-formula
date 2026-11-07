/**
 * core/engine.js
 * Unified Practice (A2), Online Adaptive Drill (A3), Exam (A4), and Review (A5) Engine
 * Includes:
 * - Shared Adaptive Escalation Engine (D4, D8: hasty <3s +5, wrongStreak 3 -> +3 same-topic/adaptive pool,
 *   malicious all-8x3 / hasty>=5 / samePatternx4 -> 60, prevWrong priority, 4/6/8-option tier ordering)
 * - Progressive Hint System (D9: works in Practice, Drill, and Exam; logs hint_use)
 * - Teacher-configurable Feedback Timing (D9: 'immediate' | 'after_submit' | 'after_publish')
 * - Exam Security Guards (A4: 15-min countdown timer, tab-switch/blur detection, 2-choose-1 photo check-in:
 *   Face photo OR Signed+Dated scratch paper photo, breakpoint save & resume)
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(
      require('./config.js'),
      require('./content.js'),
      require('./storage.js'),
      require('./sync.js'),
      require('./api.js')
    );
  } else {
    root.MathCoreEngine = factory(
      root.MathCoreConfig,
      root.MathCoreContent,
      root.MathCoreStorage,
      root.MathCoreSync,
      root.MathCoreApi
    );
  }
})(typeof globalThis !== 'undefined' ? globalThis : window, function (
  CONFIG,
  CONTENT,
  STORAGE,
  SYNC,
  API
) {
  'use strict';

  const ADAPTIVE_DEFAULTS = (CONFIG && CONFIG.adaptiveDefaults) || {
    baseQuota: 25,
    maxQuota: 60,
    hastyThresholdMs: 3000,
    hastyAddCount: 5,
    wrongStreakTrigger: 3,
    wrongStreakAddCount: 3,
    maliciousAllSelectedStreak: 3,
    maliciousHastyCount: 5,
    maliciousSamePatternStreak: 4,
    maliciousTargetQuota: 60,
    prioritizePrevRoundWrong: true,
    tierOrder: [
      [4, 0.5],
      [6, 0.2],
      [8, 0.3],
    ],
  };

  /**
   * Normalize raw question bank item without mutating original bank arrays (D11).
   */
  function normalizeQuestion(raw, idx) {
    if (!raw) return null;
    const q = Object.assign({}, raw);
    q.id = String(q.id || q.qid || 'Q_' + (idx + 1));
    q.topic = String(q.topic || q.category || '綜合數學').split(' · ')[0].trim();
    q.stem = q.stem || q.question || q.title || '';
    q.options = Array.isArray(q.options) ? q.options.slice() : [];
    if (Array.isArray(q.hints) && q.hints.length > 0) {
      q.hints = q.hints.slice();
    } else if (q.hint) {
      q.hints = [String(q.hint)];
    } else if (q.explanation) {
      const exp = String(q.explanation);
      const firstSentence = exp.split(/[。；;！!]/)[0];
      q.hints = [
        '提示 1（審題方向）：請留意題目中的關鍵條件（' + q.topic + '）。',
        '提示 2（關鍵思路）：' + (firstSentence || exp.slice(0, 40)),
      ];
    } else {
      q.hints = ['提示：請結合【' + q.topic + '】的定義與基本性質逐步推導。'];
    }
    // AI difficulty level 1..3 heuristic if not present (D4)
    if (!q.difficulty) {
      const optLen = q.options.length;
      const stemLen = q.stem.length;
      q.difficulty = optLen >= 8 || stemLen > 120 ? 3 : optLen >= 6 || stemLen > 70 ? 2 : 1;
    }
    return q;
  }

  /**
   * Build initial ordered question queue respecting 4-opt/6-opt/8-opt tier ratios and previous wrong questions.
   */
  function selectInitialQuestions(mainPool, adaptivePool, quota, prevWrongIds, randomize, useTiers) {
    const normalizedMain = (mainPool || []).map(normalizeQuestion).filter(Boolean);
    const normalizedAdaptive = (adaptivePool || []).map(normalizeQuestion).filter(Boolean);
    const initialSource = normalizedMain.length > 0 ? normalizedMain : normalizedAdaptive;
    const allPool = normalizedMain.concat(normalizedAdaptive);
    if (allPool.length === 0) return { selected: [], fullPool: [] };

    const wrongSet = new Set((prevWrongIds || []).map(String));
    const sortFn = function (a, b) {
      const aWrong = wrongSet.has(String(a.id)) ? 0 : 1;
      const bWrong = wrongSet.has(String(b.id)) ? 0 : 1;
      if (aWrong !== bWrong) return aWrong - bWrong;
      return randomize !== false ? Math.random() - 0.5 : 0;
    };

    const targetQuota = Math.min(quota || ADAPTIVE_DEFAULTS.baseQuota, initialSource.length);
    if (!useTiers) {
      const ordered = initialSource.slice().sort(sortFn);
      return { selected: ordered.slice(0, targetQuota), fullPool: allPool };
    }

    const tier4 = initialSource.filter(q => (q.options || []).length <= 5).sort(sortFn);
    const tier6 = initialSource.filter(q => (q.options || []).length === 6).sort(sortFn);
    const tier8 = initialSource.filter(q => (q.options || []).length >= 7).sort(sortFn);

    if (tier6.length === 0 && tier8.length === 0) {
      const ordered = initialSource.slice().sort(sortFn);
      return { selected: ordered.slice(0, targetQuota), fullPool: allPool };
    }

    const q4Count = Math.round(targetQuota * 0.5);
    const q6Count = Math.round(targetQuota * 0.2);
    const q8Count = Math.max(0, targetQuota - q4Count - q6Count);

    const picked = []
      .concat(tier4.slice(0, q4Count))
      .concat(tier6.slice(0, q6Count))
      .concat(tier8.slice(0, q8Count));

    const usedIds = new Set(picked.map(q => q.id));
    if (picked.length < targetQuota) {
      const rest = initialSource.filter(q => !usedIds.has(q.id)).sort(sortFn);
      picked.push(...rest.slice(0, targetQuota - picked.length));
    }

    return { selected: picked, fullPool: allPool };
  }

  /**
   * Create a unified session for Practice ('practice'), Drill ('drill'), Exam ('exam'), or Review ('review').
   */
  function createSession(options) {
    const opts = options || {};
    const mode = opts.mode || 'drill'; // 'practice' | 'drill' | 'exam' | 'review'
    const student = opts.student || { classID: '4C', studentID: '1', name: '同學' };
    const sid = student.classID + '_' + student.studentID;
    const examId = opts.examId || mode + '_' + Date.now();
    const adaptiveCfg = Object.assign({}, ADAPTIVE_DEFAULTS, opts.adaptiveConfig || {});
    const isAdaptive = opts.adaptive !== undefined ? !!opts.adaptive : mode === 'drill';
    const feedbackMode =
      opts.feedbackMode || (mode === 'exam' ? 'after_submit' : 'immediate'); // D9: immediate | after_submit | after_publish

    const prevWrongItems =
      STORAGE && typeof STORAGE.getWrongQuestions === 'function'
        ? STORAGE.getWrongQuestions(sid)
        : [];
    const prevWrongIds = prevWrongItems.map(item => item.qid || item.id);

    const baseQuota = opts.baseQuota || (isAdaptive ? adaptiveCfg.baseQuota : 20);
    const maxQuota = opts.maxQuota || adaptiveCfg.maxQuota || 60;

    const poolSetup = selectInitialQuestions(
      opts.questions || [],
      opts.adaptiveQuestions || [],
      baseQuota,
      adaptiveCfg.prioritizePrevRoundWrong ? prevWrongIds : [],
      opts.randomize !== false,
      isAdaptive
    );

    const now = Date.now();
    const timeLimitMs = (opts.timeLimitMin || (mode === 'exam' ? 15 : 0)) * 60 * 1000;
    const serverStartTs = opts.serverStartTs || now;

    const state = {
      sessionId: 'SES_' + now + '_' + Math.random().toString(36).slice(2, 7),
      examId: examId,
      title: opts.title || '數學練習',
      mode: mode,
      student: student,
      sid: sid,
      isAdaptive: isAdaptive,
      feedbackMode: feedbackMode,
      questions: poolSetup.selected,
      fullPool: poolSetup.fullPool,
      adaptivePool: (opts.adaptiveQuestions || []).map(normalizeQuestion).filter(Boolean),
      currentIndex: 0,
      targetQuota: poolSetup.selected.length,
      maxQuota: Math.min(maxQuota, poolSetup.fullPool.length || maxQuota),
      answers: {},
      evaluations: {},
      hintsUsed: {},
      questionStartTime: now,
      startedAt: serverStartTs,
      timeLimitMs: timeLimitMs,
      deadlineTs: timeLimitMs > 0 ? serverStartTs + timeLimitMs : 0,
      completed: false,
      submittedAt: null,
      // Adaptive tracking state
      consecutiveErrors: 0,
      consecutiveErrorsByTopic: {},
      blindGuessCount: 0,
      allEightConsecutive: 0,
      patternHistory: [],
      maliciousPenaltyActive: false,
      adaptiveAdditions: [],
      // Security & Check-in tracking (A4)
      tabSwitchCount: 0,
      maxTabSwitches: opts.maxTabSwitches || 3,
      checkins: [], // { stage: 'start'|'mid'|'submit', method: 'face'|'scratch_paper', fileId, ts }
      requireCheckin: opts.requireCheckin !== undefined ? !!opts.requireCheckin : mode === 'exam',
      overtimeAnswers: [],
    };

    logEvent(state, 'session_start', {
      mode: mode,
      targetQuota: state.targetQuota,
      timeLimitMs: timeLimitMs,
    });

    persistSessionState(state);

    return {
      state: state,
      getCurrentQuestion: function () {
        return state.questions[state.currentIndex] || null;
      },
      goToQuestion: function (idx) {
        if (idx < 0 || idx >= state.questions.length) return null;
        state.currentIndex = idx;
        state.questionStartTime = Date.now();
        logEvent(state, 'nav_question', { index: idx, qid: state.questions[idx].id });
        persistSessionState(state);
        return state.questions[idx];
      },
      requestHint: function () {
        const q = state.questions[state.currentIndex];
        if (!q) return null;
        const used = state.hintsUsed[q.id] || 0;
        const hints = q.hints || [];
        const nextIdx = Math.min(used, hints.length - 1);
        const hintText = hints[nextIdx] || '請仔細審題並檢查公式條件。';
        state.hintsUsed[q.id] = used + 1;
        logEvent(state, 'hint_click', {
          qid: q.id,
          hintLevel: state.hintsUsed[q.id],
          hintText: hintText,
        });
        persistSessionState(state);
        return {
          qid: q.id,
          level: state.hintsUsed[q.id],
          totalLevels: hints.length,
          text: hintText,
        };
      },
      submitAnswer: function (userAnswer, explicitDurationMs) {
        return handleAnswerSubmission(state, adaptiveCfg, userAnswer, explicitDurationMs);
      },
      recordCheckin: function (checkinData) {
        return handlePhotoCheckin(state, checkinData);
      },
      recordTabSwitch: function () {
        state.tabSwitchCount++;
        logEvent(state, 'guard_tab_switch', { count: state.tabSwitchCount });
        persistSessionState(state);
        const shouldAutoSubmit =
          state.mode === 'exam' && state.tabSwitchCount >= state.maxTabSwitches;
        return {
          tabSwitchCount: state.tabSwitchCount,
          maxTabSwitches: state.maxTabSwitches,
          shouldAutoSubmit: shouldAutoSubmit,
        };
      },
      getRemainingTimeMs: function () {
        if (!state.deadlineTs) return null;
        return Math.max(0, state.deadlineTs - Date.now());
      },
      saveAndExit: function () {
        logEvent(state, 'session_save_exit', { currentIndex: state.currentIndex });
        persistSessionState(state);
        return state;
      },
      finishSession: function (reason) {
        return finalizeSession(state, reason || 'user_submit');
      },
    };
  }

  function handleAnswerSubmission(state, adaptiveCfg, userAnswer, explicitDurationMs) {
    const q = state.questions[state.currentIndex];
    if (!q || state.completed) return null;

    const now = Date.now();
    const durationMs =
      typeof explicitDurationMs === 'number'
        ? explicitDurationMs
        : Math.max(0, now - (state.questionStartTime || now));

    // Check if answered after exam deadline while offline (Section 五之二)
    const isOvertime = state.deadlineTs > 0 && now > state.deadlineTs;
    if (isOvertime) {
      state.overtimeAnswers.push({ qid: q.id, clientTs: now, deadlineTs: state.deadlineTs });
    }

    state.answers[q.id] = userAnswer;
    const gradeResult = CONTENT
      ? CONTENT.QuestionTypes.grade(q, userAnswer)
      : { isCorrect: String(userAnswer) === String(q.answer), score: 1 };

    // Optional hint deduction in exam mode if configured
    const hintCount = state.hintsUsed[q.id] || 0;
    state.evaluations[q.id] = Object.assign({}, gradeResult, {
      qid: q.id,
      topic: q.topic,
      durationMs: durationMs,
      hintsUsed: hintCount,
      isOvertime: isOvertime,
      clientTs: now,
    });

    const addedQuestions = [];

    // === Shared Adaptive Escalation Engine (D8) ===
    if (state.isAdaptive) {
      // 1. Hasty answer check (< 3.0s)
      const isHasty = durationMs < (adaptiveCfg.hastyThresholdMs || 3000);
      if (isHasty) {
        state.blindGuessCount++;
        const addHasty = expandQuotaRandom(state, adaptiveCfg.hastyAddCount || 5, 'hasty_answer');
        addedQuestions.push(...addHasty);
      }

      // 2. All-8 options selected check
      const selectedArr = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
      if (selectedArr.length >= 8) {
        state.allEightConsecutive++;
      } else {
        state.allEightConsecutive = 0;
      }

      // 3. Fixed answer pattern check (4 identical submissions in a row)
      const patternStr = selectedArr.slice().sort().join('');
      state.patternHistory.push(patternStr);
      let fixedPattern = false;
      if (
        patternStr.length > 0 &&
        state.patternHistory.length >= (adaptiveCfg.maliciousSamePatternStreak || 4)
      ) {
        const tail = state.patternHistory.slice(-(adaptiveCfg.maliciousSamePatternStreak || 4));
        fixedPattern = tail.every(p => p === patternStr);
      }

      // 4. Malicious penalty escalation -> 60 questions
      if (
        state.allEightConsecutive >= (adaptiveCfg.maliciousAllSelectedStreak || 3) ||
        state.blindGuessCount >= (adaptiveCfg.maliciousHastyCount || 5) ||
        fixedPattern
      ) {
        state.maliciousPenaltyActive = true;
        const needed = Math.max(0, state.maxQuota - state.targetQuota);
        if (needed > 0) {
          const addMal = expandQuotaRandom(state, needed, 'malicious_pattern');
          addedQuestions.push(...addMal);
        }
      }

      // 5. Consecutive wrong streak -> inject remedial questions matching topic
      if (!gradeResult.isCorrect) {
        state.consecutiveErrors++;
        state.consecutiveErrorsByTopic[q.topic] =
          (state.consecutiveErrorsByTopic[q.topic] || 0) + 1;

        if (
          (state.consecutiveErrors >= (adaptiveCfg.wrongStreakTrigger || 3) ||
            state.consecutiveErrorsByTopic[q.topic] >= (adaptiveCfg.wrongStreakTrigger || 3)) &&
          !state.maliciousPenaltyActive
        ) {
          const injected = injectTopicRemedial(
            state,
            q.topic,
            adaptiveCfg.wrongStreakAddCount || 3
          );
          addedQuestions.push(...injected);
          state.consecutiveErrors = 0;
          state.consecutiveErrorsByTopic[q.topic] = 0;
        }
      } else {
        state.consecutiveErrors = 0;
        state.consecutiveErrorsByTopic[q.topic] = 0;
      }
    }

    // Record wrong question to persistent Review notebook (A5)
    if (gradeResult.isCorrect === false && STORAGE && typeof STORAGE.saveWrongQuestion === 'function') {
      STORAGE.saveWrongQuestion(state.sid, {
        qid: q.id,
        examId: state.examId,
        topic: q.topic,
        stem: q.stem,
        options: q.options,
        userAnswer: userAnswer,
        correctAnswer: q.answer || q.correctKeys,
        explanation: q.explanation || '',
        hints: q.hints || [],
        timestamp: now,
      });
    }

    logEvent(state, 'answer_submit', {
      qid: q.id,
      topic: q.topic,
      userAnswer: userAnswer,
      isCorrect: gradeResult.isCorrect,
      durationMs: durationMs,
      hintsUsed: hintCount,
      adaptiveAddedCount: addedQuestions.length,
      targetQuota: state.targetQuota,
    });

    persistSessionState(state);

    // Determine whether to reveal correctness now based on teacher's feedbackMode (D9)
    const showFeedbackNow = state.feedbackMode === 'immediate';

    return {
      qid: q.id,
      isCorrect: showFeedbackNow ? gradeResult.isCorrect : null,
      explanation: showFeedbackNow ? q.explanation || '' : null,
      correctAnswer: showFeedbackNow ? gradeResult.correct : null,
      feedbackMode: state.feedbackMode,
      durationMs: durationMs,
      adaptiveAdded: addedQuestions,
      targetQuota: state.targetQuota,
      maliciousPenaltyActive: state.maliciousPenaltyActive,
    };
  }

  function expandQuotaRandom(state, addCount, reason) {
    const existingIds = new Set(state.questions.map(q => q.id));
    const candidates = state.fullPool
      .filter(q => !existingIds.has(q.id))
      .sort(() => Math.random() - 0.5);
    const maxAdd = Math.max(0, state.maxQuota - state.questions.length);
    const picked = candidates.slice(0, Math.min(addCount, maxAdd));
    if (picked.length > 0) {
      state.questions.push(...picked);
      state.targetQuota = state.questions.length;
      const record = {
        reason: reason,
        addedIds: picked.map(q => q.id),
        newQuota: state.targetQuota,
        ts: Date.now(),
      };
      state.adaptiveAdditions.push(record);
      logEvent(state, 'adaptive_add', record);
    }
    return picked;
  }

  function injectTopicRemedial(state, topic, addCount) {
    const existingIds = new Set(state.questions.map(q => q.id));
    const pool =
      state.adaptivePool && state.adaptivePool.length > 0
        ? state.adaptivePool.concat(state.fullPool)
        : state.fullPool;
    const uniqueCandidates = [];
    const seen = new Set();
    for (const item of pool) {
      if (!existingIds.has(item.id) && !seen.has(item.id)) {
        seen.add(item.id);
        uniqueCandidates.push(item);
      }
    }
    const matched = uniqueCandidates.filter(
      item => (item.topic || '').includes(topic) || topic.includes(item.topic || '')
    );
    const other = uniqueCandidates
      .filter(item => !matched.includes(item))
      .sort(() => Math.random() - 0.5);

    const maxAdd = Math.max(0, state.maxQuota - state.questions.length);
    const combined = matched.concat(other).slice(0, Math.min(addCount, maxAdd));
    if (combined.length > 0) {
      state.questions.splice(state.currentIndex + 1, 0, ...combined);
      state.targetQuota = state.questions.length;
      const record = {
        reason: 'wrong_streak_topic',
        topic: topic,
        addedIds: combined.map(q => q.id),
        newQuota: state.targetQuota,
        ts: Date.now(),
      };
      state.adaptiveAdditions.push(record);
      logEvent(state, 'adaptive_add', record);
    }
    return combined;
  }

  /**
   * Exam Photo Check-in: 2-choose-1 (① Face photo OR ② Signed+Dated scratch paper photo)
   */
  async function handlePhotoCheckin(state, checkinData) {
    const data = checkinData || {};
    const method = data.method === 'scratch_paper' ? 'scratch_paper' : 'face';
    const stage = data.stage || 'start'; // 'start' | 'mid' | 'submit'
    const entry = {
      stage: stage,
      method: method,
      signatureConfirmed: method === 'scratch_paper' ? !!data.signatureConfirmed : true,
      dateStr: data.dateStr || new Date().toISOString().slice(0, 10),
      ts: Date.now(),
      uploaded: false,
    };

    if (data.imageBase64 && API && typeof API.uploadDrivePhoto === 'function') {
      try {
        const res = await API.uploadDrivePhoto({
          classID: state.student.classID,
          studentID: state.student.studentID,
          studentName: state.student.name,
          imageBase64: data.imageBase64,
          tag: 'CHECKIN_' + stage.toUpperCase() + '_' + method.toUpperCase(),
        });
        entry.uploaded = !!(res && res.success);
        entry.fileName = res && res.fileName;
      } catch (e) {
        entry.error = e.message;
      }
    }

    state.checkins.push(entry);
    logEvent(state, 'exam_checkin', entry);
    persistSessionState(state);
    return entry;
  }

  function finalizeSession(state, reason) {
    if (state.completed) return state.summary;
    state.completed = true;
    state.submittedAt = Date.now();

    let correctCount = 0;
    const total = state.questions.length || 1;
    state.questions.forEach(q => {
      const ev = state.evaluations[q.id];
      if (ev && ev.isCorrect) correctCount++;
    });

    const percentageScore = Math.round((correctCount / total) * 100);
    const revealAfterSubmit =
      state.feedbackMode === 'immediate' || state.feedbackMode === 'after_submit';

    state.summary = {
      sessionId: state.sessionId,
      examId: state.examId,
      mode: state.mode,
      sid: state.sid,
      correctCount: correctCount,
      totalQuestions: total,
      score: percentageScore,
      reason: reason,
      submittedAt: state.submittedAt,
      adaptiveAdditionsCount: state.adaptiveAdditions.length,
      tabSwitchCount: state.tabSwitchCount,
      overtimeCount: state.overtimeAnswers.length,
      checkinsCount: state.checkins.length,
      revealDetails: revealAfterSubmit,
    };

    logEvent(state, 'session_submit', state.summary);

    // Clear active breakpoint and trigger appropriate sync policy (D1)
    if (STORAGE && typeof STORAGE.clearActiveQuizState === 'function') {
      STORAGE.clearActiveQuizState();
    }
    if (SYNC) {
      if (state.mode === 'practice' && typeof SYNC.flushPracticeIfDue === 'function') {
        SYNC.flushPracticeIfDue(false);
      } else if (typeof SYNC.flushOnlineBatch === 'function') {
        SYNC.flushOnlineBatch({ immediate: true, reason: 'session_submit' });
      }
    }

    return state.summary;
  }

  function logEvent(state, action, payload) {
    if (SYNC && typeof SYNC.recordAction === 'function') {
      SYNC.recordAction(action, payload, {
        sid: state.sid,
        classID: state.student.classID,
        studentID: state.student.studentID,
        examId: state.examId,
        mode: state.mode,
      });
    }
  }

  function persistSessionState(state) {
    if (STORAGE && typeof STORAGE.saveActiveQuizState === 'function' && !state.completed) {
      STORAGE.saveActiveQuizState({
        sessionId: state.sessionId,
        examId: state.examId,
        mode: state.mode,
        sid: state.sid,
        currentIndex: state.currentIndex,
        targetQuota: state.targetQuota,
        answers: state.answers,
        evaluations: state.evaluations,
        hintsUsed: state.hintsUsed,
        startedAt: state.startedAt,
        deadlineTs: state.deadlineTs,
        consecutiveErrors: state.consecutiveErrors,
        blindGuessCount: state.blindGuessCount,
        tabSwitchCount: state.tabSwitchCount,
        updatedAt: Date.now(),
      });
    }
  }

  return {
    createSession: createSession,
    normalizeQuestion: normalizeQuestion,
    selectInitialQuestions: selectInitialQuestions,
  };
});
