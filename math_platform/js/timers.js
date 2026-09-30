/**
 * timers.js - Anti-Cheating & Eye-Protection Timers
 * High School Mobile Math Practice & Anti-Cheating Quiz Platform
 * 
 * Features:
 * 1. 40-minute continuous practice timer: triggers unclosable 5-minute eye-protection overlay (#screen6-eyecare)
 *    with visible countdown (#eyeCareCountdown). After 5 minutes, automatically unlocks and resumes.
 * 2. 15-minute periodic anti-cheating timer: freezes screen (#screen7-freeze), requires facial re-verification
 *    (cosine similarity >= 85%) against locked student descriptor. Unlocks upon verification pass.
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
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Constants
  const EYE_PROTECTION_THRESHOLD_SECONDS = 2400; // 40 minutes = 2400 seconds
  const EYE_PROTECTION_REST_SECONDS = 300;       // 5 minutes rest = 300 seconds
  const ANTI_CHEAT_INTERVAL_SECONDS = 900;       // 15 minutes = 900 seconds
  const REAUTH_SIMILARITY_THRESHOLD = 0.85;      // 85% cosine similarity required

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

  // Window Visibility Change Listener
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        // Tab switched / minimized: pause question timer to avoid counting idle background time
        state.isQuestionTimerRunning = false;
      } else {
        // Tab restored: resume question timer if not in modal
        if (state.isRunning && !state.isEyeBreakActive && !state.isReauthActive) {
          state.isQuestionTimerRunning = true;
          state.lastTickTimestamp = Date.now();
        }
      }
    });
  }

  return api;
});
