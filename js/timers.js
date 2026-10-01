/**
 * timers.js - Anti-Cheating & Eye-Protection Timers
 * High School Mobile Math Practice & Anti-Cheating Quiz Platform
 * 
 * Features:
 * 1. 40-minute continuous practice timer: triggers unclosable 5-minute eye-protection overlay (#screen6-eyecare)
 *    with visible countdown (#eyeCareCountdown). After 5 minutes, automatically unlocks and resumes.
 * 2. 15-minute periodic anti-cheating timer: freezes screen (#screen7-freeze), requires facial re-verification
 *    (similarity >= 0.85) against locked student descriptor. Unlocks upon verification pass.
 * 3. Question timer: per-question latency measurement in seconds. Paused during eye care or face freeze.
 * 4. Dual-timer collision arbitration: Health/eye protection takes priority ('EYECARE_FIRST').
 * 5. Window visibility change: handles tab switching / mobile screen lock gracefully without runaway timers.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.AntiCheatTimers = factory();
    root.timers = root.AntiCheatTimers; // Convenient alias per PROJECT.md interface contract
    root.kickoutToLogin = root.AntiCheatTimers.kickoutToLogin;
    root.triggerScreenshotProtection = root.AntiCheatTimers.triggerScreenshotProtection;
    root.dismissScreenshotProtection = root.AntiCheatTimers.dismissScreenshotProtection;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Constants
  const EYE_PROTECTION_THRESHOLD_SECONDS = 2400; // 40 minutes = 2400 seconds
  const EYE_PROTECTION_REST_SECONDS = 300;       // 5 minutes rest = 300 seconds
  const ANTI_CHEAT_INTERVAL_SECONDS = 900;       // 15 minutes = 900 seconds
  const REAUTH_SIMILARITY_THRESHOLD = 0.85;      // 0.85 similarity required

  // Module State
  const state = {
    practiceElapsedSeconds: 0,
    questionElapsedSeconds: 0,
    totalSessionSeconds: 0,
    lastTickTimestamp: null,

    isRunning: false,
    isQuestionTimerRunning: false,
    isEyeBreakActive: false,
    isReauthActive: false,
    reauthPending: false,

    eyeBreakRemainingSeconds: EYE_PROTECTION_REST_SECONDS,
    tickerId: null,

    // Active student profile reference
    activeProfile: null,

    // Callbacks / Event hooks
    onTick: null,
    onEyeBreakTriggered: null,
    onEyeBreakEnded: null,
    onReauthTriggered: null,
    onReauthResolved: null,
    onQuestionTick: null
  };

  /**
   * Format seconds into MM:SS string
   * @param {number} sec 
   * @returns {string}
   */
  function formatMMSS(sec) {
    const s = Math.max(0, Math.floor(sec));
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return String(m).padStart(2, '0') + ':' + String(rem).padStart(2, '0');
  }

  /**
   * Main 1-second ticker loop
   */
  function tick() {
    const now = Date.now();
    state.lastTickTimestamp = now;

    // Handle Active Eye Protection Rest State
    if (state.isEyeBreakActive) {
      state.eyeBreakRemainingSeconds--;
      updateEyeCareDOM();

      if (state.eyeBreakRemainingSeconds <= 0) {
        endEyeProtection();
      }
      return;
    }

    // Handle Active Re-auth Freeze State
    if (state.isReauthActive) {
      // Practice and question timers paused while frozen
      return;
    }

    // Normal running practice
    if (state.isRunning) {
      state.practiceElapsedSeconds++;
      state.totalSessionSeconds++;

      if (state.isQuestionTimerRunning) {
        state.questionElapsedSeconds++;
        if (typeof state.onQuestionTick === 'function') {
          state.onQuestionTick(state.questionElapsedSeconds, formatMMSS(state.questionElapsedSeconds));
        }
        updateQuestionTimerDOM();
      }

      // Check collision or triggers
      const eyecareDue = state.practiceElapsedSeconds >= EYE_PROTECTION_THRESHOLD_SECONDS;
      const reauthDue = (state.practiceElapsedSeconds > 0) && (state.practiceElapsedSeconds % ANTI_CHEAT_INTERVAL_SECONDS === 0);

      if (eyecareDue && reauthDue) {
        // Dual collision: Eye care takes precedence ('EYECARE_FIRST')
        state.reauthPending = true;
        triggerEyeProtection();
      } else if (eyecareDue) {
        triggerEyeProtection();
      } else if (reauthDue) {
        triggerReauth();
      }

      if (typeof state.onTick === 'function') {
        state.onTick({
          practiceSeconds: state.practiceElapsedSeconds,
          questionSeconds: state.questionElapsedSeconds,
          totalSeconds: state.totalSessionSeconds
        });
      }
    }
  }

  /**
   * Trigger 5-minute Eye Protection modal
   */
  function triggerEyeProtection() {
    state.isEyeBreakActive = true;
    state.eyeBreakRemainingSeconds = EYE_PROTECTION_REST_SECONDS;
    state.isQuestionTimerRunning = false;

    // Show DOM overlay #screen6-eyecare
    const overlay = document.getElementById('screen6-eyecare');
    if (overlay) {
      overlay.classList.add('active');
      overlay.style.display = 'flex';
    }
    updateEyeCareDOM();

    if (typeof state.onEyeBreakTriggered === 'function') {
      state.onEyeBreakTriggered();
    }
  }

  /**
   * Update Eye Care Countdown in DOM
   */
  function updateEyeCareDOM() {
    const el = document.getElementById('eyeCareCountdown');
    if (el) {
      el.textContent = formatMMSS(state.eyeBreakRemainingSeconds);
    }
  }

  /**
   * Conclude Eye Protection Rest
   */
  function endEyeProtection() {
    state.isEyeBreakActive = false;
    state.eyeBreakRemainingSeconds = EYE_PROTECTION_REST_SECONDS;
    state.practiceElapsedSeconds = 0; // Reset 40-min continuous practice counter
    state.isQuestionTimerRunning = true;

    // Hide DOM overlay
    const overlay = document.getElementById('screen6-eyecare');
    if (overlay) {
      overlay.classList.remove('active');
      overlay.style.display = 'none';
    }

    if (typeof state.onEyeBreakEnded === 'function') {
      state.onEyeBreakEnded();
    }

    // Check if postponed re-auth is pending
    if (state.reauthPending) {
      state.reauthPending = false;
      setTimeout(function () {
        triggerReauth();
      }, 300);
    }
  }

  /**
   * Trigger 15-minute Periodic Anti-Cheating Freeze
   */
  function triggerReauth() {
    if (state.isEyeBreakActive) {
      state.reauthPending = true;
      return;
    }

    state.isReauthActive = true;
    state.isQuestionTimerRunning = false;

    // Show DOM freeze overlay #screen7-freeze
    const overlay = document.getElementById('screen7-freeze');
    if (overlay) {
      overlay.classList.add('active');
      overlay.style.display = 'flex';
    }

    if (typeof state.onReauthTriggered === 'function') {
      state.onReauthTriggered();
    }
  }

  /**
   * Resolve Re-auth Verification
   * @param {boolean} isSuccess 
   * @param {number} similarity 
   */
  function resolveReauth(isSuccess, similarity) {
    if (isSuccess) {
      state.isReauthActive = false;
      state.isQuestionTimerRunning = true;

      const overlay = document.getElementById('screen7-freeze');
      if (overlay) {
        overlay.classList.remove('active');
        overlay.style.display = 'none';
      }

      if (typeof state.onReauthResolved === 'function') {
        state.onReauthResolved(true, similarity);
      }
      return true;
    } else {
      if (typeof state.onReauthResolved === 'function') {
        state.onReauthResolved(false, similarity);
      }
      return false;
    }
  }

  /**
   * Update #quizTimerText in DOM
   */
  function updateQuestionTimerDOM() {
    const el = document.getElementById('quizTimerText');
    if (el) {
      el.textContent = '⏱ ' + formatMMSS(state.questionElapsedSeconds);
    }
  }

  /**
   * Public API
   */
  const api = {
    // Threshold Constants
    EYE_PROTECTION_THRESHOLD_SECONDS,
    EYE_PROTECTION_REST_SECONDS,
    ANTI_CHEAT_INTERVAL_SECONDS,
    REAUTH_SIMILARITY_THRESHOLD,

    /**
     * Start session practice timers
     * @param {Object} profile Optional active student profile
     */
    start: function (profile) {
      if (profile) {
        state.activeProfile = profile;
      }
      state.isRunning = true;
      state.isQuestionTimerRunning = true;
      state.lastTickTimestamp = Date.now();

      if (!state.tickerId) {
        state.tickerId = setInterval(tick, 1000);
      }
    },

    /**
     * Pause all timers
     */
    pause: function () {
      state.isRunning = false;
      state.isQuestionTimerRunning = false;
    },

    /**
     * Resume timers (unless in modal rest or freeze)
     */
    resume: function () {
      if (!state.isEyeBreakActive && !state.isReauthActive) {
        state.isRunning = true;
        state.isQuestionTimerRunning = true;
        state.lastTickTimestamp = Date.now();
      }
    },

    /**
     * Reset timers to initial state
     */
    reset: function () {
      state.practiceElapsedSeconds = 0;
      state.questionElapsedSeconds = 0;
      state.totalSessionSeconds = 0;
      state.isEyeBreakActive = false;
      state.isReauthActive = false;
      state.reauthPending = false;
      state.eyeBreakRemainingSeconds = EYE_PROTECTION_REST_SECONDS;
      updateQuestionTimerDOM();
    },

    /**
     * Reset question timer upon question transition
     */
    resetQuestionTimer: function () {
      state.questionElapsedSeconds = 0;
      updateQuestionTimerDOM();
    },

    /**
     * Hook called by quiz engine when a question is answered
     * @param {Object} data { questionId, isCorrect, durationSeconds }
     */
    onQuestionAnswered: function (data) {
      // Interface contract with quiz_engine.js
      this.resetQuestionTimer();
    },

    /**
     * Restore timers state from saved snapshot
     * @param {Object} savedState
     */
    restore: function (savedState) {
      if (!savedState || typeof savedState !== 'object') return;

      if (savedState.practiceElapsedSeconds !== undefined) {
        state.practiceElapsedSeconds = Number(savedState.practiceElapsedSeconds) || 0;
      } else if (savedState.elapsedSeconds !== undefined) {
        state.practiceElapsedSeconds = Number(savedState.elapsedSeconds) || 0;
      }

      if (savedState.questionElapsedSeconds !== undefined) {
        state.questionElapsedSeconds = Number(savedState.questionElapsedSeconds) || 0;
      }

      if (savedState.totalSessionSeconds !== undefined) {
        state.totalSessionSeconds = Number(savedState.totalSessionSeconds) || 0;
      } else if (savedState.sessionElapsedSeconds !== undefined) {
        state.totalSessionSeconds = Number(savedState.sessionElapsedSeconds) || 0;
      }

      if (savedState.eyeBreakRemainingSeconds !== undefined) {
        state.eyeBreakRemainingSeconds = Number(savedState.eyeBreakRemainingSeconds) || EYE_PROTECTION_REST_SECONDS;
      } else if (savedState.eyeCareElapsedSeconds !== undefined) {
        state.eyeBreakRemainingSeconds = Math.max(0, EYE_PROTECTION_REST_SECONDS - (Number(savedState.eyeCareElapsedSeconds) || 0));
      }

      if (savedState.reauthPending !== undefined) {
        state.reauthPending = Boolean(savedState.reauthPending);
      }

      if (savedState.isEyeBreakActive !== undefined) {
        state.isEyeBreakActive = Boolean(savedState.isEyeBreakActive);
        if (state.isEyeBreakActive) {
          state.isQuestionTimerRunning = false;
          const overlay = document.getElementById('screen6-eyecare');
          if (overlay) {
            overlay.classList.add('active');
            overlay.style.display = 'flex';
          }
          updateEyeCareDOM();
        }
      }

      if (savedState.isReauthActive !== undefined) {
        state.isReauthActive = Boolean(savedState.isReauthActive);
        if (state.isReauthActive) {
          state.isQuestionTimerRunning = false;
          const overlay = document.getElementById('screen7-freeze');
          if (overlay) {
            overlay.classList.add('active');
            overlay.style.display = 'flex';
          }
        }
      }

      updateQuestionTimerDOM();
    },

    // Getters
    getPracticeElapsedSeconds: function () {
      return state.practiceElapsedSeconds;
    },

    getQuestionElapsedSeconds: function () {
      return state.questionElapsedSeconds;
    },

    getTotalSessionSeconds: function () {
      return state.totalSessionSeconds;
    },

    isEyeBreakActive: function () {
      return state.isEyeBreakActive;
    },

    isReauthActive: function () {
      return state.isReauthActive;
    },

    getEyeBreakRemainingSeconds: function () {
      return state.eyeBreakRemainingSeconds;
    },

    isReauthPending: function () {
      return state.reauthPending;
    },

    getState: function () {
      return {
        practiceElapsedSeconds: state.practiceElapsedSeconds,
        elapsedSeconds: state.practiceElapsedSeconds,
        questionElapsedSeconds: state.questionElapsedSeconds,
        totalSessionSeconds: state.totalSessionSeconds,
        sessionElapsedSeconds: state.totalSessionSeconds,
        isEyeBreakActive: state.isEyeBreakActive,
        isReauthActive: state.isReauthActive,
        reauthPending: state.reauthPending,
        eyeBreakRemainingSeconds: state.eyeBreakRemainingSeconds,
        eyeCareElapsedSeconds: Math.max(0, EYE_PROTECTION_REST_SECONDS - state.eyeBreakRemainingSeconds),
        isRunning: state.isRunning,
        isQuestionTimerRunning: state.isQuestionTimerRunning
      };
    },

    // Anti-Screenshot & Tab-Switch (R2) API
    triggerScreenshotProtection,
    dismissScreenshotProtection,
    handleTabLeave,
    handleTabReturn,
    kickoutToLogin,
    isQuizActive,
    getTabSwitchStartTime: function () {
      return tabSwitchStartTime;
    },

    // Manual triggers (for testing / arbitration)
    triggerEyeProtection,
    endEyeProtection,
    triggerReauth,
    resolveReauth,

    // Event listener registration
    setCallbacks: function (callbacks) {
      if (callbacks.onTick) state.onTick = callbacks.onTick;
      if (callbacks.onEyeBreakTriggered) state.onEyeBreakTriggered = callbacks.onEyeBreakTriggered;
      if (callbacks.onEyeBreakEnded) state.onEyeBreakEnded = callbacks.onEyeBreakEnded;
      if (callbacks.onReauthTriggered) state.onReauthTriggered = callbacks.onReauthTriggered;
      if (callbacks.onReauthResolved) state.onReauthResolved = callbacks.onReauthResolved;
      if (callbacks.onQuestionTick) state.onQuestionTick = callbacks.onQuestionTick;
    }
  };

  // Anti-Screenshot & Tab-Switch State (R2)
  let tabSwitchTimerId = null;
  let tabSwitchStartTime = null;
  const TAB_SWITCH_TIMEOUT_SECONDS = 5;

  function isQuizActive() {
    if (typeof document === 'undefined') return false;
    const quizScreen = document.getElementById('screen5-quiz');
    if (!quizScreen) return false;
    const isScreenActive = quizScreen.classList.contains('active');
    const isEyeActive = state.isEyeBreakActive;
    const isFreezeActive = state.isReauthActive;
    return isScreenActive && !isEyeActive && !isFreezeActive;
  }

  // --- Anti-Screenshot Logic (R2) ---
  function triggerScreenshotProtection() {
    if (!isQuizActive()) return;

    const container = document.getElementById('quizQuestionContainer');
    const cardWrapper = document.querySelector('.quiz-card-wrapper');
    const overlay = document.getElementById('screenshotWarningOverlay');

    if (container) {
      container.classList.add('screenshot-blur-active');
      container.style.setProperty('filter', 'blur(40px)', 'important');
    }
    if (cardWrapper) {
      cardWrapper.classList.add('screenshot-blur-active');
    }
    if (overlay) {
      overlay.style.display = 'flex';
      overlay.classList.add('active');
    }

    if (typeof window !== 'undefined' && window.submitFormRecord && window.AppState) {
      try {
        window.submitFormRecord({
          classID: window.AppState.currentClass || "",
          studentID: window.AppState.currentStudentId || "",
          dateID: `SCREENSHOT_DEFENSE_${Date.now()}`,
          scoreTag: "ANOMALY_WARN"
        }).catch(function () {});
      } catch (e) {}
    }
  }

  function dismissScreenshotProtection() {
    const container = document.getElementById('quizQuestionContainer');
    const cardWrapper = document.querySelector('.quiz-card-wrapper');
    const overlay = document.getElementById('screenshotWarningOverlay');

    if (container) {
      container.classList.remove('screenshot-blur-active');
      container.style.filter = '';
    }
    if (cardWrapper) {
      cardWrapper.classList.remove('screenshot-blur-active');
    }
    if (overlay) {
      overlay.style.display = 'none';
      overlay.classList.remove('active');
    }
  }

  function isScreenshotKey(e) {
    if (!e) return false;
    if (e.key === 'PrintScreen' || e.code === 'PrintScreen' || e.keyCode === 44) {
      return true;
    }
    const isShift = !!e.shiftKey;
    const isMeta = !!(e.metaKey || e.key === 'Meta');
    const isCtrl = !!e.ctrlKey;
    const key = (e.key || '').toLowerCase();
    const code = (e.code || '').toLowerCase();
    const isS = key === 's' || code === 'keys';
    const isP = key === 'p' || code === 'keyp';

    if (isShift && isMeta && isS) {
      return true;
    }
    if (isShift && isCtrl && isS) {
      return true;
    }
    if ((isCtrl || isMeta) && isP) {
      return true;
    }
    return false;
  }

  // --- 5-Second Tab-Switch Auto-Kick (R2) ---
  function kickoutToLogin(reason) {
    if (tabSwitchTimerId) {
      clearInterval(tabSwitchTimerId);
      tabSwitchTimerId = null;
    }
    tabSwitchStartTime = null;

    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem("MATH_ACTIVE_QUIZ_PROGRESS");
    }

    api.reset();
    api.pause();

    if (typeof window !== 'undefined' && window.QuizEngine && typeof window.QuizEngine.resetQuizState === 'function') {
      window.QuizEngine.resetQuizState();
    }

    if (typeof document !== 'undefined') {
      const modal = document.getElementById('tabSwitchWarningModal');
      if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
      }
      dismissScreenshotProtection();
    }

    if (typeof window !== 'undefined' && window.submitFormRecord && window.AppState) {
      try {
        window.submitFormRecord({
          classID: window.AppState.currentClass || "",
          studentID: window.AppState.currentStudentId || "",
          dateID: `KICKOUT_TAB_SWITCH_${Date.now()}`,
          scoreTag: "KICK_OUT"
        }).catch(function () {});
      } catch (e) {}
    }

    if (typeof window !== 'undefined' && typeof window.showScreen === 'function') {
      window.showScreen("screen1-roster");
    } else if (typeof document !== 'undefined') {
      const screens = document.querySelectorAll(".screen-container");
      screens.forEach(function (s) { s.classList.remove("active"); });
      const s1 = document.getElementById("screen1-roster");
      if (s1) s1.classList.add("active");
    }

    if (typeof alert === 'function') {
      alert("⚠️ 偵測到離開作答頁面超過 5 秒，系統已自動強制退出答題系統！當前作答進度已清空。");
    }
  }

  function handleTabLeave() {
    if (!isQuizActive()) return;
    if (tabSwitchTimerId !== null) return;

    tabSwitchStartTime = Date.now();
    state.isQuestionTimerRunning = false;

    const modal = document.getElementById('tabSwitchWarningModal');
    const countEl = document.getElementById('tabSwitchCountdown');
    const meterEl = document.getElementById('tabSwitchMeterBar');

    if (modal) {
      modal.style.display = 'flex';
      modal.classList.add('active');
    }
    if (countEl) countEl.textContent = '5';
    if (meterEl) meterEl.style.width = '100%';

    let remaining = TAB_SWITCH_TIMEOUT_SECONDS;
    tabSwitchTimerId = setInterval(function () {
      remaining--;
      if (countEl) countEl.textContent = String(Math.max(0, remaining));
      if (meterEl) meterEl.style.width = `${(Math.max(0, remaining) / TAB_SWITCH_TIMEOUT_SECONDS) * 100}%`;

      if (remaining <= 0) {
        clearInterval(tabSwitchTimerId);
        tabSwitchTimerId = null;
        kickoutToLogin("TIMEOUT_EXPIRED");
      }
    }, 1000);
  }

  function handleTabReturn() {
    if (!tabSwitchStartTime) return;
    const elapsed = Date.now() - tabSwitchStartTime;

    if (tabSwitchTimerId) {
      clearInterval(tabSwitchTimerId);
      tabSwitchTimerId = null;
    }

    if (elapsed >= 5000) {
      tabSwitchStartTime = null;
      kickoutToLogin("TIMEOUT_BACKGROUND");
      return;
    }

    tabSwitchStartTime = null;
    const modal = document.getElementById('tabSwitchWarningModal');
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('active');
    }

    if (typeof window !== 'undefined' && window.submitFormRecord && window.AppState) {
      try {
        window.submitFormRecord({
          classID: window.AppState.currentClass || "",
          studentID: window.AppState.currentStudentId || "",
          dateID: `TAB_SWITCH_RETURN_${Math.round(elapsed / 1000)}s_${Date.now()}`,
          scoreTag: "ANOMALY_TAB_SWITCH"
        }).catch(function () {});
      } catch (e) {}
    }

    if (state.isRunning && !state.isEyeBreakActive && !state.isReauthActive) {
      state.isQuestionTimerRunning = true;
      state.lastTickTimestamp = Date.now();
    }
  }

  // Event Listeners (R2 & Timers)
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    window.addEventListener('keydown', function (e) {
      if (isScreenshotKey(e)) {
        e.preventDefault();
        triggerScreenshotProtection();
      }
    }, true);

    window.addEventListener('keyup', function (e) {
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen' || e.keyCode === 44) {
        triggerScreenshotProtection();
      }
    }, true);

    document.addEventListener('copy', function (e) {
      if (!isQuizActive()) return;
      e.preventDefault();
      if (e.clipboardData) {
        e.clipboardData.setData('text/plain', '');
      }
      triggerScreenshotProtection();
    }, true);

    document.addEventListener('cut', function (e) {
      if (!isQuizActive()) return;
      e.preventDefault();
      if (e.clipboardData) {
        e.clipboardData.setData('text/plain', '');
      }
      triggerScreenshotProtection();
    }, true);

    document.addEventListener('contextmenu', function (e) {
      if (isQuizActive()) {
        e.preventDefault();
        return false;
      }
    }, true);

    window.addEventListener('beforeprint', function () {
      triggerScreenshotProtection();
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        handleTabLeave();
      } else {
        handleTabReturn();
      }
    });

    window.addEventListener('blur', function () {
      handleTabLeave();
    });

    window.addEventListener('focus', function () {
      handleTabReturn();
    });
  }

  return api;
});
