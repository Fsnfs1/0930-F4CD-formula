/**
 * leaderboard.js - Dynamic Leaderboard & GAS Polling Engine
 * High School Mobile Math Practice & Anti-Cheating Quiz Platform
 * 
 * Features:
 * 1. GAS polling endpoint:
 *    https://script.google.com/macros/s/AKfycbyPw0okf43HwFuX6ur5uWy5GSbQnBtx8G-kfQnT9cCbU44xYuuYHV96Ih994wHouBNu/exec
 * 2. Called upon login completion and recurring every 10 minutes (600 seconds).
 * 3. Handles network/CORS errors with deterministic dynamic mock fallback using roster data.
 * 4. Renders honor roll: Tabs (All, Grade 10, Grade 11), Top 3 podium, Rank 4+ list, and sticky My-Rank bar.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.LeaderboardManager = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const DEFAULT_GAS_ENDPOINT = "https://script.google.com/macros/s/AKfycbyPw0okf43HwFuX6ur5uWy5GSbQnBtx8G-kfQnT9cCbU44xYuuYHV96Ih994wHouBNu/exec";
  const POLL_INTERVAL_SECONDS = 600; // 10 minutes

  // Manager State
  const state = {
    apiEndpoint: DEFAULT_GAS_ENDPOINT,
    currentClass: "",
    currentStudentId: null,
    currentStudentName: "",

    countdownSeconds: POLL_INTERVAL_SECONDS,
    pollTimerId: null,
    countdownTimerId: null,

    activeFilterTab: "ALL", // "ALL", "G10", "G11"
    cachedData: [],
    dataSource: "INIT",
    isFetching: false,
    lastRefreshTime: 0
  };

  /**
   * Format seconds as MM:SS
   */
  function formatMMSS(sec) {
    const s = Math.max(0, Math.floor(sec));
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return String(m).padStart(2, '0') + ':' + String(rem).padStart(2, '0');
  }

  /**
   * Start 10-minute Polling Engine
   * @param {string} classID 
   * @param {number|string} studentID 
   * @param {string} studentName 
   */
  function startPolling(classID, studentID, studentName) {
    state.currentClass = String(classID || "").trim().toUpperCase();
    state.currentStudentId = parseInt(studentID, 10);
    state.currentStudentName = studentName || "";

    state.countdownSeconds = POLL_INTERVAL_SECONDS;

    // Initialize empty cached data until cloud fetch completes
    if (!state.cachedData) {
      state.cachedData = [];
      state.dataSource = "FETCHING";
    }

    // Fetch immediately from cloud in background
    fetchLeaderboard();

    // Start 1-second countdown ticker
    if (state.countdownTimerId) clearInterval(state.countdownTimerId);
    state.countdownTimerId = setInterval(function () {
      state.countdownSeconds--;
      updateCountdownDOM();

      if (state.countdownSeconds <= 0) {
        state.countdownSeconds = POLL_INTERVAL_SECONDS;
        fetchLeaderboard();
      }
    }, 1000);
  }

  /**
   * Fetch leaderboard from GAS endpoint with fallback mock
   */
  async function fetchLeaderboard() {
    if (state.isFetching) return;
    state.isFetching = true;
    updateStatusBadge("FETCHING");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const classParam = encodeURIComponent(state.currentClass || "4D");
    const studentParam = encodeURIComponent(state.currentStudentId || 23);
    const url = `${state.apiEndpoint}?classID=${classParam}&studentID=${studentParam}&dateID=9999`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
      const rawData = await response.json();

      if (Array.isArray(rawData) && rawData.length > 0) {
        state.cachedData = buildProcessedLeaderboard(rawData);
        state.dataSource = "CLOUD";
      } else {
        // Cloud database is empty or has been reset by teacher
        state.cachedData = [];
        state.dataSource = "CLOUD_EMPTY";
      }
    } catch (err) {
      console.warn("[Leaderboard] GAS endpoint unavailable or timed out:", err.message);
      if (!state.cachedData) state.cachedData = [];
      state.dataSource = "OFFLINE_NO_DATA";
    } finally {
      clearTimeout(timeoutId);
      state.isFetching = false;
      state.lastRefreshTime = Date.now();
      updateStatusBadge(state.dataSource);
      renderLeaderboardUI();
    }
  }

  /**
   * Process raw GAS rows into ranked list
   */
  function buildProcessedLeaderboard(rawData) {
    const map = {};
    rawData.forEach(function (row) {
      const key = `${row.classID}_${row.studentID}`;
      if (!map[key]) {
        map[key] = {
          classID: row.classID,
          studentID: row.studentID,
          name: (typeof window !== 'undefined' && window.getStudentName) ?
            window.getStudentName(row.classID, row.studentID) : `學生 ${row.studentID}`,
          count: 0,
          totalScore: 0
        };
      }
      map[key].count++;
      const score = Number(row.score) || 0;
      map[key].totalScore += score;
    });

    const list = Object.values(map).map(function (item) {
      const acc = item.count > 0 ? Math.round((item.totalScore / (item.count * 100)) * 100) : 0;
      const composite = (item.count * 10) + (acc * 2.5);
      const isMe = (item.classID === state.currentClass && item.studentID === state.currentStudentId);
      return {
        classID: item.classID,
        studentID: item.studentID,
        name: isMe && state.studentName ? state.studentName : item.name,
        questionCount: item.count,
        accuracy: acc,
        compositeScore: Math.round(composite),
        isCurrentUser: isMe
      };
    });

    list.sort((a, b) => b.compositeScore - a.compositeScore);
    return list.map((item, idx) => ({ rank: idx + 1, ...item }));
  }

  /**
   * Deterministic Fallback Mock using real roster data from StudentID.txt
   */
  function generateFallbackMock() {
    // Representative subset of real students across 4C, 4D, 5B
    const rosterSample = [
      { classID: '4D', studentID: 23, name: '劉付穎' },
      { classID: '4D', studentID: 1,  name: '洪佳佳' },
      { classID: '4D', studentID: 18, name: '曾浚恩' },
      { classID: '4D', studentID: 10, name: '李臻斌' },
      { classID: '4D', studentID: 28, name: '賴君華' },
      { classID: '4C', studentID: 1,  name: '古永晴' },
      { classID: '4C', studentID: 4,  name: '周子謙' },
      { classID: '4C', studentID: 17, name: '陳芷澄' },
      { classID: '4C', studentID: 22, name: '葉峰' },
      { classID: '4C', studentID: 28, name: '譚志坤' },
      { classID: '5B', studentID: 1,  name: '吳鎂澄' },
      { classID: '5B', studentID: 10, name: '高尚禮' },
      { classID: '5B', studentID: 19, name: '陳國良' },
      { classID: '5B', studentID: 26, name: '葉棨釗' }
    ];

    // Guarantee current student is in list
    const hasMe = rosterSample.some(s => s.classID === state.currentClass && s.studentID === state.currentStudentId);
    if (!hasMe && state.currentClass && state.currentStudentId) {
      rosterSample.push({
        classID: state.currentClass,
        studentID: state.currentStudentId,
        name: state.currentStudentName || '我'
      });
    }

    const items = rosterSample.map(function (s) {
      const isMe = (s.classID === state.currentClass && s.studentID === state.currentStudentId);
      // Deterministic PRNG seed from student ID & class
      const seed = (s.classID.charCodeAt(0) * 17 + s.studentID * 31) % 100;
      const count = isMe ? Math.max(15, 18 + (seed % 15)) : 10 + (seed % 35);
      const acc = isMe ? Math.min(100, Math.max(85, 88 + (seed % 12))) : Math.min(98, Math.max(70, 72 + (seed % 26)));
      const composite = (count * 10) + (acc * 2.5);

      return {
        classID: s.classID,
        studentID: s.studentID,
        name: isMe && state.studentName ? state.studentName : s.name,
        questionCount: count,
        accuracy: acc,
        compositeScore: Math.round(composite),
        isCurrentUser: isMe
      };
    });

    items.sort((a, b) => b.compositeScore - a.compositeScore);
    return items.map((item, idx) => ({ rank: idx + 1, ...item }));
  }

  /**
   * Update countdown in HUD
   */
  function updateCountdownDOM() {
    const el = document.getElementById("leaderboardCountdown");
    if (el) {
      el.textContent = formatMMSS(state.countdownSeconds);
    }
  }

  /**
   * Update status badge
   */
  function updateStatusBadge(statusType) {
    const badge = document.getElementById("leaderboardStatusBadge");
    if (!badge) return;

    if (statusType === "FETCHING") {
      badge.innerHTML = "<span>🔄 正在同步雲端榜單...</span>";
      badge.className = "leaderboard-badge syncing";
    } else if (statusType === "CLOUD") {
      badge.innerHTML = "<span>🟢 雲端 GAS 實時榜單 (已同步)</span>";
      badge.className = "leaderboard-badge synced";
    } else if (statusType === "CLOUD_EMPTY") {
      badge.innerHTML = "<span>🟢 雲端已連線 (尚無作答紀錄)</span>";
      badge.className = "leaderboard-badge synced";
    } else {
      badge.innerHTML = "<span>🟡 離線暫存模式</span>";
      badge.className = "leaderboard-badge fallback";
    }
  }

  /**
   * Render Leaderboard inside Screen 8
   */
  function renderLeaderboardUI() {
    const screen = document.getElementById("screen8-leaderboard");
    if (!screen) return;

    if (!Array.isArray(state.cachedData)) {
      state.cachedData = [];
    }

    // Filter by tab
    let displayList = state.cachedData.slice();
    if (state.activeFilterTab === "G10") {
      displayList = displayList.filter(s => s.classID === "4C" || s.classID === "4D");
    } else if (state.activeFilterTab === "G11") {
      displayList = displayList.filter(s => s.classID === "5B");
    }

    // Re-index ranks for filtered list
    displayList = displayList.map((item, idx) => ({ ...item, tabRank: idx + 1 }));

    // Top 3 Podium
    const top3 = displayList.slice(0, 3);
    const others = displayList.slice(3);

    // Current student entry
    const myEntry = displayList.find(s => s.isCurrentUser) || state.cachedData.find(s => s.isCurrentUser);

    let mainContentHtml = "";

    if (displayList.length === 0) {
      // Clean Empty State when cloud database is reset or empty
      mainContentHtml = `
        <div class="empty-leaderboard-box" style="text-align: center; padding: 40px 16px; background: rgba(255,255,255,0.03); border: 1px dashed rgba(255,255,255,0.18); border-radius: 12px; margin: 18px 0;">
          <div style="font-size: 44px; margin-bottom: 10px;">🏆</div>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 6px; color: var(--text-highlight, #f8fafc);">目前尚無測驗作答排行</h3>
          <p style="font-size: 13px; color: var(--text-muted, #94a3b8); margin-bottom: 0;">雲端數據庫已清空重置。完成測驗交卷後，成績將即時同步登上實時榮譽榜！</p>
        </div>
      `;
    } else {
      let podiumHtml = "";
      const podiumOrder = [1, 0, 2]; // Silver (Rank 2), Gold (Rank 1), Bronze (Rank 3)
      const medalIcons = ["🥇 冠軍", "🥈 亞軍", "🥉 季軍"];
      const podiumClasses = ["podium-gold", "podium-silver", "podium-bronze"];

      podiumOrder.forEach(function (orderIdx) {
        const student = top3[orderIdx];
        if (student) {
          const medal = medalIcons[orderIdx];
          const pClass = podiumClasses[orderIdx];
          podiumHtml += `
            <div class="podium-card ${pClass} ${student.isCurrentUser ? 'is-me' : ''}">
              <div class="podium-crown">${medal}</div>
              <div class="podium-name">${student.name}</div>
              <div class="podium-class">${student.classID} 班 ${student.studentID} 號</div>
              <div class="podium-metric">作答 <strong>${student.questionCount}</strong> 題</div>
              <div class="podium-metric">正確率 <strong>${student.accuracy}%</strong></div>
            </div>
          `;
        }
      });

      let othersHtml = "";
      others.forEach(function (s) {
        othersHtml += `
          <div class="rank-list-item ${s.isCurrentUser ? 'is-me' : ''}">
            <div class="rank-number">${s.tabRank}</div>
            <div class="rank-info">
              <div class="rank-name">${s.name} ${s.isCurrentUser ? '<span class="me-tag">我</span>' : ''}</div>
              <div class="rank-sub">${s.classID} 班 ${s.studentID} 號</div>
            </div>
            <div class="rank-stats">
              <div>${s.questionCount} 題</div>
              <div class="rank-acc">${s.accuracy}%</div>
            </div>
          </div>
        `;
      });

      mainContentHtml = `
        <!-- Top 3 Podium View -->
        <div class="podium-container">
          ${podiumHtml}
        </div>

        <!-- Rank 4+ List View -->
        <div class="rank-list-container">
          ${othersHtml}
        </div>
      `;
    }

    // Sticky My Rank HTML
    let myRankHtml = "";
    if (myEntry) {
      const myRankNumber = myEntry.tabRank || myEntry.rank || "--";
      myRankHtml = `
        <div class="sticky-my-rank">
          <div class="my-rank-left">
            <span class="my-rank-badge">我的名次：第 ${myRankNumber} 名</span>
            <span class="my-rank-name">${myEntry.name} (${myEntry.classID} 班 ${myEntry.studentID} 號)</span>
          </div>
          <div class="my-rank-right">
            <span>作答 ${myEntry.questionCount} 題</span>
            <span class="my-rank-acc">${myEntry.accuracy}%</span>
          </div>
        </div>
      `;
    }

    screen.innerHTML = `
      <div class="card leaderboard-card">
        <div class="leaderboard-header-row">
          <div>
            <h2 class="card-title"><span>🏆</span> 數學實時榮譽榜</h2>
            <div id="leaderboardStatusBadge" class="leaderboard-badge synced">
              <span>⚡ 實時同步 · 下次更新: <strong id="leaderboardCountdown">${formatMMSS(state.countdownSeconds)}</strong></span>
            </div>
          </div>
          <button id="btnManualRefresh" class="btn-icon-refresh" title="手動刷新">
            🔄
          </button>
        </div>

        <!-- Filter Tabs -->
        <div class="leaderboard-tabs">
          <button class="tab-btn ${state.activeFilterTab === 'ALL' ? 'active' : ''}" data-tab="ALL">全校總榜</button>
          <button class="tab-btn ${state.activeFilterTab === 'G10' ? 'active' : ''}" data-tab="G10">高一榜 (4C/4D)</button>
          <button class="tab-btn ${state.activeFilterTab === 'G11' ? 'active' : ''}" data-tab="G11">高二榜 (5B)</button>
        </div>

        ${mainContentHtml}

        ${myRankHtml}

        <div style="margin-top: 14px;">
          <button id="btnBackToDashboard" class="btn btn-secondary">
            <span>← 返回練習首頁</span>
          </button>
        </div>
      </div>
    `;

    // Bind Tabs
    screen.querySelectorAll(".tab-btn").forEach(function (tab) {
      tab.addEventListener("click", function () {
        state.activeFilterTab = this.getAttribute("data-tab");
        renderLeaderboardUI();
      });
    });

    // Bind Manual Refresh with 15s debounce
    const refreshBtn = screen.querySelector("#btnManualRefresh");
    if (refreshBtn) {
      refreshBtn.addEventListener("click", function () {
        const now = Date.now();
        if (now - state.lastRefreshTime < 15000) {
          alert("榜單剛已更新，請稍候 15 秒後再手動刷新。");
          return;
        }
        state.countdownSeconds = POLL_INTERVAL_SECONDS;
        fetchLeaderboard();
      });
    }

    // Bind Back to Dashboard
    const backBtn = screen.querySelector("#btnBackToDashboard");
    if (backBtn) {
      backBtn.addEventListener("click", function () {
        if (typeof window !== 'undefined' && typeof window.showScreen === 'function') {
          window.showScreen("screen4-dashboard");
        }
      });
    }
  }

  // Public API
  return {
    startPolling,
    fetchLeaderboard,
    generateFallbackMock,
    renderLeaderboardUI,
    getLeaderboardData: function () {
      return state.cachedData;
    }
  };
});
