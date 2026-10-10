/**
 * generate_html.js
 * Assembles advance_test.html from questions, css, client js, and roster data.
 */

const fs = require('fs');
const path = require('path');
const { ROSTER_DATA, QUESTIONS_DATA } = require('./build_exam_page');
const { EXAM_CSS } = require('./template_css');
const { CLIENT_JS } = require('./template_client_js');

function renderPart1(questions) {
  return questions.map(q => `
    <div class="question-item">
      <div class="question-stem"><span class="question-meta">${q.num}.</span>${q.text}</div>
      <div class="options-row">
        <label class="option-btn-label">
          <input type="radio" name="${q.id}" value="O"> 正確 (O)
        </label>
        <label class="option-btn-label">
          <input type="radio" name="${q.id}" value="X"> 錯誤 (X)
        </label>
      </div>
    </div>
  `).join('\n');
}

function renderPart2(questions) {
  return questions.map(q => `
    <div class="question-item">
      <div class="question-stem"><span class="question-meta">${q.num}.</span>${q.text}</div>
      <div class="options-group">
        ${q.options.map(opt => `
          <label class="option-btn-label">
            <input type="radio" name="${q.id}" value="${opt.key}">
            <strong>${opt.key}.</strong>&nbsp;${opt.text}
          </label>
        `).join('\n')}
      </div>
    </div>
  `).join('\n');
}

function renderPart3(questions) {
  return questions.map(q => {
    let blanksHtml = '';
    if (q.blanks) {
      blanksHtml = `
        <div class="blank-container">
          ${q.blanks.map(b => `
            <div class="blank-wrapper">
              <span class="blank-label">${b.label}：</span>
              <input type="text" class="blank-input" name="${b.id}" id="${b.id}" placeholder="若難以輸入數學符號時，可以使用自然語言描述答案。" autocomplete="off">
            </div>
          `).join('\n')}
        </div>
      `;
    } else if (q.subQuestions) {
      blanksHtml = `
        <div class="blank-container">
          ${q.subQuestions.map(sq => `
            <div class="blank-wrapper" style="margin-right: 16px;">
              <strong>${sq.label}</strong>&nbsp;${sq.expr}&nbsp;
              <input type="text" class="blank-input" name="${sq.id}" id="${sq.id}" style="width: 140px; text-align: center;" placeholder="若難以輸入數學符號時，可以使用自然語言描述答案。" autocomplete="off">&nbsp;${sq.exprAfter}
            </div>
          `).join('\n')}
        </div>
      `;
    }
    return `
      <div class="question-item">
        <div class="question-stem"><span class="question-meta">${q.num}.</span>${q.text}</div>
        ${blanksHtml}
      </div>
    `;
  }).join('\n');
}

function renderPart4(questions) {
  return questions.map(q => `
    <div class="question-item">
      <div class="question-stem"><span class="question-meta">${q.num}.</span>【${q.title}】(10分)<br>${q.text}</div>
      <div class="q-cam-card" id="camCard_${q.id}">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 6px;">
          <span style="font-size: 0.95rem; font-weight: 700; color: #1e40af;">
            📷 第 ${q.num} 題手寫推導過程拍照（僅限相機拍攝）
          </span>
          <span id="camStatus_${q.id}" style="font-size: 0.85rem; color: #64748b; font-weight: 600;">
            尚未拍照
          </span>
        </div>
        <div id="camVideoBox_${q.id}" class="q-cam-video-box" style="display: none;">
          <video id="video_${q.id}" playsinline autoplay muted></video>
        </div>
        <div id="camPreviewBox_${q.id}" class="q-cam-preview-box" style="display: none;">
          <img id="imgPreview_${q.id}" alt="第 ${q.num} 題手寫解答照片">
          <div class="q-cam-success-tip">
            ✅ 第 ${q.num} 題解答照片已成功採集 (1200px 壓縮)
          </div>
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button type="button" id="btnStartCam_${q.id}" class="btn-cam" onclick="startQuestionCamera('${q.id}')">
            📹 開啟相機拍照
          </button>
          <button type="button" id="btnCapture_${q.id}" class="btn-cam btn-cam-capture" style="display: none;" onclick="captureQuestionPhoto('${q.id}')">
            📸 立即拍照並壓縮
          </button>
          <button type="button" id="btnRetake_${q.id}" class="btn-cam btn-cam-retake" style="display: none;" onclick="retakeQuestionPhoto('${q.id}')">
            🔄 重新拍照
          </button>
        </div>
      </div>
    </div>
  `).join('\n');
}

function renderPart5(questions) {
  return questions.map(q => `
    <div class="question-item">
      <div class="question-stem"><span class="question-meta">${q.num}.</span>${q.text}</div>
      <div class="blank-container">
        <div class="blank-wrapper">
          <span class="blank-label">${q.label}：</span>
          <input type="text" class="blank-input" name="${q.id}" id="${q.id}" placeholder="若難以輸入數學符號時，可以使用自然語言描述答案。" autocomplete="off">
        </div>
      </div>
    </div>
  `).join('\n');
}

function generateHtml() {
  const html = `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>2026-2027 學年高一理上學期數學大測卷(一)</title>

  <!-- MathJax 3 LaTeX 公式顯影規範 (符合全局規範) -->
  <script>
    window.MathJax = {
      tex: {
        inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
        displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
        processEscapes: true
      },
      options: {
        skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
      }
    };
  </script>
  <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>

  <!-- @vladmandic/face-api 與 FaceAuth 人臉識別活體檢測庫 -->
  <script src="https://cdn.jsdelivr.net/npm/@vladmandic/face-api/dist/face-api.min.js"></script>
  <script src="../js/roster.js"></script>
  <script src="../js/admin_snapshot.js"></script>
  <script src="../js/face_auth.js"></script>
  <script src="../js/persistence.js"></script>

  <style>
${EXAM_CSS}
  </style>
</head>
<body>

  <!-- 頂部網絡心跳探測與離線保護指示條 -->
  <div class="heartbeat-bar">
    <div id="heartbeatStatus" class="heartbeat-status online">
      <span class="heartbeat-dot"></span> 🟢 網絡連通正常
    </div>
    <div id="autosaveBadge" class="autosave-badge">
      💾 離線自動保護已啟用
    </div>
  </div>

  <!-- 網絡連線中斷醒目重試橫幅 -->
  <div id="networkRetryBanner" class="network-retry-banner">
    <div>
      <strong>⚠️ 網絡連線中斷，請檢查連線</strong>
      <span style="font-size: 0.9rem; margin-left: 8px;">作答進度與照片已完整保存在本機，無需慌張！</span>
    </div>
    <button type="button" id="btnRetrySubmit" class="btn-retry" onclick="handleNetworkRetryClick()">
      🔄 重新提交 / 重試
    </button>
  </div>

  <!-- 置頂計時器導覽列 -->
  <div id="stickyTimer" class="sticky-timer-bar">
    <div class="timer-content">
      <div style="display: flex; align-items: center; gap: 10px;">
        <span id="timerPhaseBadge" class="timer-phase-badge phase1">【第一階段：客觀題作答】剩餘：</span>
        <span id="timerCountdownDisplay" class="timer-countdown">40:00</span>
      </div>
      <div id="examStudentBadge" style="font-weight: 700; color: #1e40af; font-size: 0.95rem;">
        --
      </div>
    </div>
  </div>

  <div class="container">

    <!-- 階段 1：身分登入核驗視圖 (Authentic Face-First Login) -->
    <div id="authScreen" class="auth-container" style="display: block;">
      
      <!-- 視圖 1A：智能刷臉首頁 -->
      <div class="auth-card" id="cardFaceFirstLogin">
        <h2 style="text-align: center; color: #1e3a8a; margin-bottom: 6px;">📷 智能刷臉秒速登入</h2>
        <p style="text-align: center; color: #64748b; font-size: 0.9rem; margin-bottom: 18px;">
          正對鏡頭並眨眨眼，系統將自動比對人臉特徵庫並直接登入。
        </p>

        <!-- Live Camera Viewport with Oval Guide -->
        <div id="faceFirstCameraWrapper" class="camera-wrapper">
          <video id="faceFirstVideo" class="camera-video" playsinline autoplay muted></video>
          <div class="camera-oval-guide"></div>
          <div id="faceFirstOverlay" class="camera-status-overlay">📷 點擊下方按鈕啟動刷臉辨識</div>
        </div>

        <!-- Realtime Status Alert -->
        <div id="faceFirstAlert" class="alert-box" style="display: none;"></div>

        <!-- Action Buttons -->
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button type="button" id="btnFaceFirstStart" class="btn btn-primary" style="flex: 1; padding: 12px;" onclick="startFaceFirstCamera()">
            <span>📷 啟動相機識別</span>
          </button>
          <button type="button" id="btnFaceFirstCapture" class="btn btn-success" style="flex: 1; display: none; padding: 12px;" onclick="captureFaceFirstAndVerify()">
            <span>🔍 拍照識別身分</span>
          </button>
        </div>

        <div style="text-align: center; margin-top: 16px;">
          <a href="javascript:void(0)" id="linkGoToManualPage" onclick="showManualSelectView()" style="font-size: 13px; color: var(--primary); text-decoration: underline;">
            首次登入或無法刷臉？前往身分選擇 ➜
          </a>
        </div>
      </div>

      <!-- 視圖 1B：手動身分選擇 (新生/候補/測試模式) -->
      <div class="auth-card" id="cardFirstTimeSelect" style="display: none; margin-top: 14px;">
        <h2 style="text-align: center; color: #1e3a8a; margin-bottom: 6px;">👤 學生身分選擇與登記</h2>
        <p style="text-align: center; color: #64748b; font-size: 0.9rem; margin-bottom: 18px;">
          請在下方選擇您的班別與學號，確認姓名無誤後登記並開始測驗。
        </p>

        <div id="authErrorMessage" class="status-box error" style="margin-top: 0; margin-bottom: 16px; display: none;"></div>

        <div class="form-group">
          <label class="form-label" for="selectClass">班別 (Class)</label>
          <select id="selectClass" class="form-control" onchange="onClassChange(this.value)">
            <option value="" disabled selected>-- 請選擇班別 --</option>
            <option value="4C">4C 班 (高一 · 29人)</option>
            <option value="4D">4D 班 (高一 · 31人)</option>
            <option value="5B">5B 班 (高二 · 28人)</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label" for="selectStudent">學號 (Student ID)</label>
          <select id="selectStudent" class="form-control" disabled onchange="onStudentChange(this.value)">
            <option value="" disabled selected>-- 請先選擇班別 --</option>
          </select>
        </div>

        <div class="identity-badge" style="margin-bottom: 16px;">
          <div style="font-size: 0.85rem; color: #64748b;">確認學生姓名：</div>
          <div id="loginStudentNamePreview" class="identity-name">請選擇班別與學號</div>
        </div>

        <div class="form-group">
          <label class="form-label" for="inputPassword">身分密碼 (預設 1234)</label>
          <input type="password" id="inputPassword" class="form-control" value="1234" placeholder="請輸入密碼">
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          <button type="button" id="btnLogin" class="btn btn-primary btn-block" style="padding: 12px;" disabled onclick="handlePasswordLogin()">
            <span>🔑 密碼登入身分驗證</span>
          </button>
          <button type="button" id="btnFaceLogin" class="btn btn-success btn-block" style="padding: 12px;" onclick="showFaceFirstView()">
            <span>📷 相機人臉辨識快速核驗</span>
          </button>
          <button type="button" id="btnBackToFaceFirst" class="btn btn-secondary btn-block" style="padding: 12px; margin-top: 4px;" onclick="showFaceFirstView()">
            <span>← 返回第一頁刷臉拍照</span>
          </button>
        </div>
      </div>

    </div>

    <!-- 彈窗：密碼二次身分驗證 (modalPasswordAuth) -->
    <div id="modalPasswordAuth" class="auth-modal-overlay" style="display: none;">
      <div class="auth-modal-card">
        <div style="font-size: 40px; text-align: center; margin-bottom: 8px;">🔐</div>
        <h3 id="authModalTitle" style="text-align: center; margin-bottom: 6px; font-size: 18px; font-weight: 700; color: #f8fafc;">
          密碼二次身分驗證
        </h3>
        <p id="authModalSubtitle" style="text-align: center; font-size: 13px; color: #fcd34d; margin-bottom: 14px;">
          ⚠️ 偵測到多位相似特徵（無法唯一確認本人），為維護帳號安全，請選擇您的姓名並輸入個人密碼完成二次驗證！
        </p>

        <!-- 相似候選人列表 -->
        <div id="authCandidateSection" style="margin-bottom: 14px; text-align: left; display: none;">
          <label class="form-label" style="font-size: 13px; color: #cbd5e1; margin-bottom: 6px; display: block; font-weight: 600;">
            偵測到多位相似特徵，請選擇最可能的本人身分：
          </label>
          <div id="authCandidateList" style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 8px;">
            <!-- 動態生成候選人按鈕 -->
          </div>
          <div style="text-align: right; margin-bottom: 6px;">
            <a href="javascript:void(0)" id="linkAuthManualSelect" onclick="toggleAuthManualSelect()" style="font-size: 12px; color: #60a5fa; text-decoration: underline;">
              非以上候選人？手動選擇其他學生 ▾
            </a>
          </div>
          <div id="authManualSelectFields" style="display: none; padding: 10px; background: rgba(15, 23, 42, 0.6); border-radius: 8px; border: 1px solid #334155;">
            <div style="display: flex; gap: 8px;">
              <select id="authClassSelect" class="form-select" onchange="onAuthClassSelectChange(this.value)" style="flex: 1; padding: 8px; font-size: 13px; background: #0f172a; color: #f8fafc; border: 1px solid #334155; border-radius: 6px;">
                <option value="" disabled selected>-- 選擇班別 --</option>
                <option value="4C">4C 班</option>
                <option value="4D">4D 班</option>
                <option value="5B">5B 班</option>
              </select>
              <select id="authStudentSelect" class="form-select" disabled onchange="onAuthStudentSelectChange(this.value)" style="flex: 1.5; padding: 8px; font-size: 13px; background: #0f172a; color: #f8fafc; border: 1px solid #334155; border-radius: 6px;">
                <option value="" disabled selected>-- 選擇學號 --</option>
              </select>
            </div>
          </div>
        </div>

        <div id="authStudentInfo" style="background: rgba(99, 102, 241, 0.12); border: 1px solid rgba(99, 102, 241, 0.3); padding: 10px 14px; border-radius: 8px; margin-bottom: 14px; font-size: 14px; text-align: center; font-weight: 600; color: #a5b4fc;">
          --
        </div>

        <div id="alertPasswordAuthError" class="alert-box alert-danger" style="display: none; margin-bottom: 12px; font-size: 13px;"></div>

        <div class="form-group" style="margin-bottom: 12px; text-align: left;">
          <label class="form-label" for="inputAuthPassword" style="font-size: 13px; margin-bottom: 4px; display: block; color: #cbd5e1;">個人密碼</label>
          <input type="password" id="inputAuthPassword" placeholder="請輸入個人密碼（預設 1234）" inputmode="numeric" maxlength="20" autocomplete="off" style="width: 100%; box-sizing: border-box; background: #0f172a; color: #f8fafc; border: 1px solid #334155; padding: 10px 12px; border-radius: 8px;">
        </div>

        <div style="margin-bottom: 14px; text-align: left; font-size: 13px; color: #cbd5e1;">
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <input type="checkbox" id="chkAuthChangePassword" onchange="toggleAuthChangePassword(this.checked)" style="width: 16px; height: 16px; accent-color: var(--primary);">
            <span>同時修改新密碼</span>
          </label>
        </div>

        <div id="authChangePasswordFields" style="display: none; border-top: 1px dashed #334155; padding-top: 12px; margin-bottom: 14px; text-align: left;">
          <div class="form-group" style="margin-bottom: 10px;">
            <label class="form-label" for="inputAuthNewPassword" style="font-size: 13px; margin-bottom: 4px; display: block; color: #cbd5e1;">設定新密碼（至少 4 位純數字）</label>
            <input type="password" id="inputAuthNewPassword" placeholder="至少 4 位純數字，不得為 1234" inputmode="numeric" maxlength="20" autocomplete="off" style="width: 100%; box-sizing: border-box; background: #0f172a; color: #f8fafc; border: 1px solid #334155; padding: 10px 12px; border-radius: 8px;">
          </div>
          <div class="form-group">
            <label class="form-label" for="inputAuthConfirmPassword" style="font-size: 13px; margin-bottom: 4px; display: block; color: #cbd5e1;">確認新密碼</label>
            <input type="password" id="inputAuthConfirmPassword" placeholder="再次輸入新密碼" inputmode="numeric" maxlength="20" autocomplete="off" style="width: 100%; box-sizing: border-box; background: #0f172a; color: #f8fafc; border: 1px solid #334155; padding: 10px 12px; border-radius: 8px;">
          </div>
        </div>

        <div style="display: flex; gap: 10px;">
          <button type="button" id="btnCancelPasswordAuth" class="btn btn-secondary" style="flex: 1; padding: 12px;" onclick="hidePasswordAuthModal()">
            <span>取消</span>
          </button>
          <button type="button" id="btnSubmitPasswordAuth" class="btn btn-primary" style="flex: 2; padding: 12px; font-weight: 600;" onclick="submitPasswordAuth()">
            <span>🔒 驗證並進入</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 階段 2：考前確認畫面 (Pre-Exam Confirmation Screen) -->
    <div id="screenPreExamConfirm" class="confirm-container" style="display: none;">
      <div class="auth-card">
        <div class="identity-badge">
          <h3 style="color: #1e40af; font-size: 1.1rem; margin-bottom: 6px;">🎓 考生身分核對</h3>
          <div class="identity-name">
            <span id="confirmClassDisplay">--</span> 班 
            <span id="confirmIdDisplay">--</span> 號 ➜ 
            <span id="confirmNameDisplay" style="color: #2563eb;">--</span> 同學
          </div>
          <div style="font-size: 0.85rem; color: #64748b; margin-top: 6px;">
            如身分有誤，請點擊此處 <a href="#" onclick="returnToLogin(); return false;" style="color: #2563eb; font-weight: 600;">重新驗證登入</a>
          </div>
        </div>

        <h3 style="color: #dc2626; font-size: 1.15rem; margin-bottom: 12px;">⚠️ 測驗注意事項與規則</h3>
        <ul style="line-height: 1.8; color: #334155; font-size: 0.95rem; padding-left: 20px; margin-bottom: 24px;">
          <li><strong>閉卷考試</strong>：嚴禁查閱任何書籍、筆記、計算機或利用網絡設備搜尋。</li>
          <li><strong>作答時間結構 (40 + 10 分鐘，共 50 分鐘)</strong>：
            <ul style="margin-top: 4px; margin-bottom: 4px;">
              <li><span style="color: #2563eb; font-weight: 700;">前 40 分鐘</span>：正式作答時間（全卷五個部分均可作答）。</li>
              <li><span style="color: #dc2626; font-weight: 700;">滿 40 分鐘瞬間</span>：<strong>第一部分判斷題（1~6題）與第二部分單選題（7~11題）立即強制鎖定！</strong></li>
              <li><span style="color: #16a34a; font-weight: 700;">額外 10 分鐘緩衝</span>：專供修訂填充題文字輸入，以及解答題手寫過程拍照壓縮上傳。</li>
            </ul>
          </li>
          <li><strong>手寫拍照規範</strong>：解答題（20~23題）為手寫題目，每題設有專屬獨立拍照按鈕，請逐題拍攝並等比壓縮上傳。</li>
          <li><strong>離線保護機制</strong>：作答進度每秒自動暫存至本地存儲，網絡異常不丟失答案，可安心作答。</li>
        </ul>

        <button type="button" id="btnStartExamCountdown" class="btn btn-primary btn-block" onclick="startExamCountdown()">
          🚀 我已核對身分並清楚理解規則，開始測驗
        </button>
      </div>
    </div>

    <!-- 階段 3：正式大測試卷 (Exam Container) -->
    <div id="examContainer" style="display: none;">

      <!-- 試卷標題區 -->
      <div class="card" style="text-align: center; margin-top: 10px;">
        <h1 style="font-size: 1.5rem; color: #1e3a8a; margin-bottom: 6px;">新 華 學 校（中學部）</h1>
        <h2 style="font-size: 1.25rem; color: #0f172a; margin-bottom: 10px;">2026-2027學年上學期數學科（理科）大測卷(一)</h2>
        <div style="font-size: 0.9rem; color: #64748b;">
          滿分：120 分（含客觀題 22 分、填充題 38 分、解答題 40 分、附加題 20 分）｜ 總限時：50 分鐘（40+10 雙階段機制）
        </div>
      </div>

      <!-- 客觀題 40 分鐘鎖定警告橫幅 -->
      <div id="objectiveLockBanner" class="objective-lock-banner">
        🔒 40 分鐘客觀題作答時間已結束！第一部分（判斷題）與第二部分（單選題）已全面強制鎖定，請於剩餘 10 分鐘內完成填空題與解答題拍照上傳。
      </div>

      <!-- 第一部分：判斷題 (Q1~Q6, 12分) -->
      <div id="sectionPart1" class="card">
        <div class="section-header">
          <div class="section-title">第一部分：判斷題</div>
          <div class="section-pts">第 1~6 題，每題 2 分，共 12 分</div>
        </div>
        <div style="font-size: 0.9rem; color: #64748b; margin-bottom: 16px;">
          說明：對的選 “O”，錯的選 “X”。（40 分鐘後自動鎖定）
        </div>
${renderPart1(QUESTIONS_DATA.part1)}
      </div>

      <!-- 第二部分：單項選擇題 (Q7~Q11, 10分) -->
      <div id="sectionPart2" class="card">
        <div class="section-header">
          <div class="section-title">第二部分：單項選擇題</div>
          <div class="section-pts">第 7~11 題，每題 2 分，共 10 分</div>
        </div>
        <div style="font-size: 0.9rem; color: #64748b; margin-bottom: 16px;">
          說明：每小題選出唯一正確答案。（40 分鐘後自動鎖定）
        </div>
${renderPart2(QUESTIONS_DATA.part2)}
      </div>

      <!-- 第三部分：填充題 (Q12~Q19, 38分) -->
      <div id="sectionPart3" class="card">
        <div class="section-header">
          <div class="section-title">第三部分：填充題</div>
          <div class="section-pts">第 12~19 題，共 19 空，每空 2 分，共 38 分</div>
        </div>
        <div class="alert-box alert-success" style="margin-bottom: 12px; background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; padding: 10px 14px; border-radius: 8px; font-size: 0.9rem;">
          💡 <strong>作答提示</strong>：填空題文本框為<strong>選填項目</strong>（不強制要求填寫）。若難以輸入數學符號時，<strong>可以使用自然語言描述答案</strong>。
        </div>

        <!-- 符號快速插入工具列 -->
        <div class="symbol-bar">
          <span class="symbol-bar-title">數學符號快捷點擊插入：</span>
          <button type="button" class="btn-symbol" onclick="insertSymbol('∈')">∈</button>
          <button type="button" class="btn-symbol" onclick="insertSymbol('∉')">∉</button>
          <button type="button" class="btn-symbol" onclick="insertSymbol('⫋')">⫋</button>
          <button type="button" class="btn-symbol" onclick="insertSymbol('⊇')">⊇</button>
          <button type="button" class="btn-symbol" onclick="insertSymbol('≥')">≥</button>
          <button type="button" class="btn-symbol" onclick="insertSymbol('≤')">≤</button>
          <button type="button" class="btn-symbol" onclick="insertSymbol('∅')">∅</button>
          <button type="button" class="btn-symbol" onclick="insertSymbol('∀')">∀</button>
          <button type="button" class="btn-symbol" onclick="insertSymbol('∃')">∃</button>
          <button type="button" class="btn-symbol" onclick="insertSymbol('¬')">¬</button>
          <button type="button" class="btn-symbol" onclick="insertSymbol('R')">R</button>
          <button type="button" class="btn-symbol" onclick="insertSymbol('Q')">Q</button>
        </div>
${renderPart3(QUESTIONS_DATA.part3)}
      </div>

      <!-- 第四部分：解答題 (Q20~Q23, 40分) -->
      <div id="sectionPart4" class="card">
        <div class="section-header">
          <div class="section-title">第四部分：解答題（主觀手寫題）</div>
          <div class="section-pts">第 20~23 題，每題 10 分，共 40 分</div>
        </div>
        <div style="font-size: 0.9rem; color: #64748b; margin-bottom: 16px;">
          說明：請在草稿紙/答題紙上完成完整推導與證明步驟，並透過每小題下方的相機按鈕拍照上傳。
        </div>

${renderPart4(QUESTIONS_DATA.part4)}
      </div>

      <!-- 第五部分：附加題 (Q24~Q27, 20分) -->
      <div id="sectionPart5" class="card">
        <div class="section-header">
          <div class="section-title">第五部分：附加題（進階挑戰題）</div>
          <div class="section-pts">第 24~27 題，每題 5 分，共 20 分</div>
        </div>
        <div class="alert-box alert-success" style="margin-bottom: 12px; background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; padding: 10px 14px; border-radius: 8px; font-size: 0.9rem;">
          💡 <strong>作答提示</strong>：附加題為選填項目。若難以輸入數學符號時，<strong>可以使用自然語言描述答案</strong>。
        </div>
${renderPart5(QUESTIONS_DATA.part5)}
      </div>

      <!-- 交卷與狀態區 -->
      <div class="card" style="text-align: center; padding: 32px 20px;">
        <button type="button" id="submitBtn" class="btn-block" style="max-width: 420px; margin: 0 auto; background: #16a34a; font-size: 1.25rem;" onclick="submitExam(false)">
          📤 正式交卷 (提交大測試卷)
        </button>

        <div id="statusBox" class="status-box"></div>
      </div>

    </div>

  </div>

  <!-- 內嵌花名冊數據以保障 100% 離線與全平台獨立運行 -->
  <script>
    window.ROSTER_DATA = ${JSON.stringify(ROSTER_DATA, null, 2)};
  </script>

  <!-- 核心測驗客戶端邏輯腳本 -->
  <script>
${CLIENT_JS}
  </script>
</body>
</html>
`;

  return html;
}

const finalHtml = generateHtml();
const targetPath = path.join(__dirname, 'advance_test.html');
fs.writeFileSync(targetPath, finalHtml, 'utf8');
console.log('✅ advance_test.html generated successfully! File size: ' + fs.statSync(targetPath).size + ' bytes');

// Dual directory compilation (R5)
const twinPaths = [
  path.resolve(__dirname, '..', 'math_platform', 'Advance'),
  path.resolve(__dirname, '..', '..', 'advance')
];
for (const twinDir of twinPaths) {
  if (fs.existsSync(twinDir)) {
    const twinTarget = path.join(twinDir, 'advance_test.html');
    if (path.resolve(twinTarget) !== path.resolve(targetPath)) {
      fs.writeFileSync(twinTarget, finalHtml, 'utf8');
      console.log('✅ Synchronized twin advance_test.html: ' + twinTarget);
    }
  }
}

module.exports = { generateHtml };
