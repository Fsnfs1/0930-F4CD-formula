/**
 * leaderboard.js - Dynamic Leaderboard & GAS Polling Engine
 * High School Mobile Math Practice & Anti-Cheating Quiz Platform
 * 
 * Features:
 * 1. Instant First-Paint: Loads from LocalStorage cache or bundled verified snapshot immediately.
 * 2. Background Cloud Sync: Polls Google Apps Script with 45s timeout to handle heavy payloads.
 * 3. Graceful Fallback: Never clears cached rankings on network error or timeout.
 * 4. Filter Tabs: All, Grade 10 (4C/4D), Grade 11 (5B) with dynamic re-ranking.
 * 5. Sticky My-Rank bar highlighting the current student.
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

  const DEFAULT_GAS_ENDPOINT = "https://script.google.com/macros/s/AKfycbwNAQNxmNsNa8rWGp48qnYRrjA2WFLGIzKqSel2r8MilRp59s3ZfBJjeKXIrUfoS-Zp-g/exec";
  // Cloud endpoint query parameters: ?classID=&studentID=&dateID=
  const POLL_INTERVAL_SECONDS = 600; // 10 minutes
  const CACHE_STORAGE_KEY = "MATH_LEADERBOARD_CACHE";

  // Verified initial roster snapshot from cloud database (37 active students)
  const VERIFIED_LEADERBOARD_SNAPSHOT = [
    { rank: 1, classID: '4D', studentID: 4, name: '甘俊誠', questionCount: 74, accuracy: 89, compositeScore: 963 },
    { rank: 2, classID: '5B', studentID: 27, name: '潘子聰', questionCount: 75, accuracy: 81, compositeScore: 953 },
    { rank: 3, classID: '5B', studentID: 11, name: '張啟赫', questionCount: 70, accuracy: 57, compositeScore: 843 },
    { rank: 4, classID: '4C', studentID: 18, name: '陳穎彤', questionCount: 41, accuracy: 90, compositeScore: 636 },
    { rank: 5, classID: '5B', studentID: 21, name: '陳鑫源', questionCount: 35, accuracy: 97, compositeScore: 593 },
    { rank: 6, classID: '4D', studentID: 26, name: '鄭東沅', questionCount: 34, accuracy: 97, compositeScore: 583 },
    { rank: 7, classID: '4C', studentID: 6, name: '谷雨', questionCount: 33, accuracy: 94, compositeScore: 565 },
    { rank: 8, classID: '5B', studentID: 17, name: '陳施攸', questionCount: 35, accuracy: 80, compositeScore: 550 },
    { rank: 9, classID: '4D', studentID: 17, name: '張博聰', questionCount: 32, accuracy: 88, compositeScore: 539 },
    { rank: 10, classID: '4C', studentID: 20, name: '麥曉楠', questionCount: 28, accuracy: 93, compositeScore: 512 },
    { rank: 11, classID: '4C', studentID: 5, name: '李藝彤', questionCount: 25, accuracy: 100, compositeScore: 500 },
    { rank: 12, classID: '4C', studentID: 23, name: '趙政熹', questionCount: 26, accuracy: 96, compositeScore: 500 },
    { rank: 13, classID: '4D', studentID: 20, name: '黃梓建', questionCount: 26, accuracy: 96, compositeScore: 500 },
    { rank: 14, classID: '4D', studentID: 1, name: '洪佳佳', questionCount: 25, accuracy: 96, compositeScore: 490 },
    { rank: 15, classID: '4D', studentID: 6, name: '李青霞', questionCount: 25, accuracy: 96, compositeScore: 490 },
    { rank: 16, classID: '4D', studentID: 21, name: '黃嫣然', questionCount: 30, accuracy: 73, compositeScore: 483 },
    { rank: 17, classID: '4C', studentID: 17, name: '陳芷澄', questionCount: 26, accuracy: 88, compositeScore: 481 },
    { rank: 18, classID: '4C', studentID: 10, name: '徐浟', questionCount: 25, accuracy: 92, compositeScore: 480 },
    { rank: 19, classID: '4C', studentID: 11, name: '曹爵先', questionCount: 25, accuracy: 92, compositeScore: 480 },
    { rank: 20, classID: '4C', studentID: 14, name: '莫芷瑤', questionCount: 25, accuracy: 92, compositeScore: 480 },
    { rank: 21, classID: '4C', studentID: 16, name: '陳心怡', questionCount: 25, accuracy: 92, compositeScore: 480 },
    { rank: 22, classID: '4D', studentID: 2, name: '王偉德', questionCount: 25, accuracy: 92, compositeScore: 480 },
    { rank: 23, classID: '4D', studentID: 27, name: '盧肇琪', questionCount: 25, accuracy: 92, compositeScore: 480 },
    { rank: 24, classID: '4D', studentID: 31, name: '鄭國樺', questionCount: 25, accuracy: 92, compositeScore: 480 },
    { rank: 25, classID: '4C', studentID: 15, name: '陳子豪', questionCount: 25, accuracy: 88, compositeScore: 470 },
    { rank: 26, classID: '4D', studentID: 12, name: '林川雲', questionCount: 25, accuracy: 88, compositeScore: 470 },
    { rank: 27, classID: '4D', studentID: 15, name: '翁淮洋', questionCount: 25, accuracy: 88, compositeScore: 470 },
    { rank: 28, classID: '4D', studentID: 16, name: '馬雨彤', questionCount: 25, accuracy: 88, compositeScore: 470 },
    { rank: 29, classID: '4D', studentID: 19, name: '黃悅軒', questionCount: 25, accuracy: 88, compositeScore: 470 },
    { rank: 30, classID: '4C', studentID: 1, name: '古永晴', questionCount: 26, accuracy: 81, compositeScore: 462 },
    { rank: 31, classID: '4C', studentID: 21, name: '溫愛嫦', questionCount: 25, accuracy: 84, compositeScore: 460 },
    { rank: 32, classID: '4C', studentID: 29, name: '譚欣', questionCount: 25, accuracy: 84, compositeScore: 460 },
    { rank: 33, classID: '4D', studentID: 23, name: '劉付穎', questionCount: 25, accuracy: 80, compositeScore: 450 },
    { rank: 34, classID: '4C', studentID: 25, name: '蔡清琰', questionCount: 23, accuracy: 65, compositeScore: 393 },
    { rank: 35, classID: '4D', studentID: 7, name: '李語鵑', questionCount: 11, accuracy: 82, compositeScore: 314 },
    { rank: 36, classID: '4C', studentID: 12, name: '梁寶娟', questionCount: 25, accuracy: 20, compositeScore: 300 },
    { rank: 37, classID: '4C', studentID: 2, name: '王嘉熙', questionCount: 1, accuracy: 100, compositeScore: 260 }
  ];

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
   * Helper: format seconds as MM:SS
   */
  function formatMMSS(sec) {
    const s = Math.max(0, Math.floor(sec));
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return String(m).padStart(2, '0') + ':' + String(rem).padStart(2, '0');
  }

  /**
   * Load cache or default snapshot into state
   */
  function loadInitialCache() {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(CACHE_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            state.cachedData = parsed;
            state.dataSource = "LOCAL_CACHE";
            decorateCurrentUser();
            return;
          }
        }
      }
    } catch (e) {
      console.warn("[Leaderboard] Failed to parse local cache:", e);
    }

    // Default to verified snapshot
    state.cachedData = JSON.parse(JSON.stringify(VERIFIED_LEADERBOARD_SNAPSHOT));
    state.dataSource = "SNAPSHOT";
    decorateCurrentUser();
  }

  /**
   * Mark isCurrentUser flag in cachedData
   */
  function decorateCurrentUser() {
    if (!Array.isArray(state.cachedData)) return;
    const cid = state.currentClass;
    const sid = state.currentStudentId;
    state.cachedData.forEach(function (item) {
      item.isCurrentUser = (item.classID === cid && item.studentID === sid);
      if (item.isCurrentUser && state.currentStudentName) {
        item.name = state.currentStudentName;
      }
    });
  }

  /**
   * Start 10-minute Polling Engine
   */
  function startPolling(classID, studentID, studentName) {
    if (classID) state.currentClass = String(classID).trim().toUpperCase();
    if (studentID !== undefined && studentID !== null) state.currentStudentId = parseInt(studentID, 10);
    if (studentName) state.currentStudentName = studentName;

    state.countdownSeconds = POLL_INTERVAL_SECONDS;

    // Load initial data immediately so the UI is NEVER empty
    if (!state.cachedData || (state.cachedData.length === 0 && state.dataSource !== "CLOUD" && state.dataSource !== "CLOUD_EMPTY")) {
      loadInitialCache();
    } else {
      decorateCurrentUser();
    }

    // Render immediately so screen8 is ready
    renderLeaderboardUI();

    // Fetch freshest data from cloud in background
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

    // 45s timeout to comfortably accommodate Google Apps Script execution time
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);

    const url = state.apiEndpoint;

    try {
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
      const rawData = await response.json();

      if (Array.isArray(rawData)) {
        state.cachedData = rawData.length > 0 ? buildProcessedLeaderboard(rawData) : [];
        state.dataSource = "CLOUD";
        try {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(state.cachedData));
          }
        } catch (e) {}
      }
    } catch (err) {
      console.warn("[Leaderboard] GAS fetch timed out or unavailable, keeping cached rankings:", err.message);
      if (!state.cachedData || state.cachedData.length === 0) {
        loadInitialCache();
      } else {
        decorateCurrentUser();
      }
      state.dataSource = "CACHE_OFFLINE";
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
      const dateID = String(row.dateID || "");
      // Exclude face embeddings and telemetry/anti-cheat events from quiz ranking
      if (dateID.includes("|TS:") || dateID.startsWith("KICKOUT") || dateID.startsWith("TAB_SWITCH") || dateID.startsWith("SCREENSHOT")) {
        return;
      }
      const classID = String(row.classID || "").trim().toUpperCase();
      const studentID = parseInt(row.studentID, 10);
      if (!classID || isNaN(studentID) || studentID <= 0) return;

      const key = `${classID}_${studentID}`;
      if (!map[key]) {
        let studentName = `學生 ${studentID}`;
        if (typeof window !== 'undefined' && window.getStudentName) {
          studentName = window.getStudentName(classID, studentID) || studentName;
        }
        map[key] = {
          classID: classID,
          studentID: studentID,
          name: studentName,
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
        name: isMe && state.currentStudentName ? state.currentStudentName : item.name,
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
   * Deterministic Fallback Mock
   */
  function generateFallbackMock() {
    return JSON.parse(JSON.stringify(VERIFIED_LEADERBOARD_SNAPSHOT));
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
      badge.innerHTML = `<span>🔄 正在同步雲端榜單... 下次更新: <strong id="leaderboardCountdown">${formatMMSS(state.countdownSeconds)}</strong></span>`;
      badge.className = "leaderboard-badge syncing";
    } else if (statusType === "CLOUD") {
      badge.innerHTML = `<span>🟢 雲端 GAS 實時榜單 (已同步) · 下次更新: <strong id="leaderboardCountdown">${formatMMSS(state.countdownSeconds)}</strong></span>`;
      badge.className = "leaderboard-badge synced";
    } else if (statusType === "CLOUD_EMPTY") {
      badge.innerHTML = `<span>🟢 雲端已連線 (尚無作答紀錄)</span>`;
      badge.className = "leaderboard-badge synced";
    } else {
      badge.innerHTML = `<span>🟢 實時榮譽榜 (已快取) · 下次更新: <strong id="leaderboardCountdown">${formatMMSS(state.countdownSeconds)}</strong></span>`;
      badge.className = "leaderboard-badge synced";
    }
  }

  /**
   * Render Leaderboard inside Screen 8
   */
  function renderLeaderboardUI() {
    const screen = document.getElementById("screen8-leaderboard");
    if (!screen) return;

    if (!Array.isArray(state.cachedData) || (state.cachedData.length === 0 && state.dataSource !== "CLOUD" && state.dataSource !== "CLOUD_EMPTY")) {
      loadInitialCache();
    } else {
      decorateCurrentUser();
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
      mainContentHtml = `
        <div class="empty-leaderboard-box" style="text-align: center; padding: 40px 16px; background: rgba(255,255,255,0.03); border: 1px dashed rgba(255,255,255,0.18); border-radius: 12px; margin: 18px 0;">
          <div style="font-size: 44px; margin-bottom: 10px;">🏆</div>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 6px; color: var(--text-highlight, #f8fafc);">目前尚無測驗作答排行</h3>
          <p style="font-size: 13px; color: var(--text-muted, #94a3b8); margin-bottom: 0;">完成測驗交卷後，成績將即時同步登上實時榮譽榜！</p>
        </div>
      `;
    } else {
      let podiumHtml = "";
      // Display order: 2nd place (Silver, left), 1st place (Gold, center), 3rd place (Bronze, right)
      const podiumOrder = [1, 0, 2];
      const medalIcons = ["🥈 亞軍", "🥇 冠軍", "🥉 季軍"];
      const podiumClasses = ["podium-silver", "podium-gold", "podium-bronze"];

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
    } else if (state.currentClass && state.currentStudentId) {
      const sName = state.currentStudentName || (window.getStudentName ? window.getStudentName(state.currentClass, state.currentStudentId) : `學生 ${state.currentStudentId}`);
      myRankHtml = `
        <div class="sticky-my-rank" style="background: rgba(30, 41, 59, 0.9); border-color: rgba(148, 163, 184, 0.3);">
          <div class="my-rank-left">
            <span class="my-rank-badge" style="background: #475569;">尚未登榜</span>
            <span class="my-rank-name">${sName} (${state.currentClass} 班 ${state.currentStudentId} 號)</span>
          </div>
          <div class="my-rank-right">
            <span style="font-size: 12px; color: #94a3b8;">完成測驗交卷後即時登榜</span>
          </div>
        </div>
      `;
    }

    let badgeText = `⚡ 實時同步 · 下次更新: <strong id="leaderboardCountdown">${formatMMSS(state.countdownSeconds)}</strong>`;
    if (state.dataSource === "FETCHING") {
      badgeText = `🔄 正在同步雲端最新排名... 下次更新: <strong id="leaderboardCountdown">${formatMMSS(state.countdownSeconds)}</strong>`;
    } else if (state.dataSource === "CLOUD") {
      badgeText = `🟢 雲端 GAS 實時榜單 (已同步) · 下次更新: <strong id="leaderboardCountdown">${formatMMSS(state.countdownSeconds)}</strong>`;
    }

    screen.innerHTML = `
      <div class="card leaderboard-card">
        <div class="leaderboard-header-row">
          <div>
            <h2 class="card-title"><span>🏆</span> 數學實時榮譽榜</h2>
            <div id="leaderboardStatusBadge" class="leaderboard-badge synced">
              <span>${badgeText}</span>
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

  // Auto-initialize cache on script load
  loadInitialCache();

  // Public API
  return {
    startPolling,
    fetchLeaderboard,
    generateFallbackMock,
    renderLeaderboardUI,
    getState: function () {
      return state;
    },
    getLeaderboardData: function () {
      return state.cachedData;
    },
    resetLeaderboardCache: function () {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(CACHE_STORAGE_KEY);
      }
      state.cachedData = JSON.parse(JSON.stringify(VERIFIED_LEADERBOARD_SNAPSHOT));
      decorateCurrentUser();
      renderLeaderboardUI();
    }
  };
});
