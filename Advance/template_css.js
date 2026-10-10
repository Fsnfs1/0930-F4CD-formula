/**
 * template_css.js
 * Comprehensive responsive stylesheet for Advance Math Exam Platform
 */

const EXAM_CSS = `
:root {
  --primary: #2563eb;
  --primary-hover: #1d4ed8;
  --primary-light: #eff6ff;
  --text-main: #0f172a;
  --text-muted: #64748b;
  --bg-page: #f8fafc;
  --card-bg: #ffffff;
  --border-color: #e2e8f0;
  --success: #16a34a;
  --danger: #dc2626;
  --warning: #d97706;
  --warn-bg: #fffbeb;
  --lock-bg: #fef2f2;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Microsoft JhengHei", sans-serif;
  background-color: var(--bg-page);
  color: var(--text-main);
  line-height: 1.6;
  padding-bottom: 80px;
}

.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 16px;
}

/* 頂部網絡心跳與離線保護指示條 */
.heartbeat-bar {
  position: sticky;
  top: 0;
  z-index: 1001;
  background: #1e293b;
  color: #f8fafc;
  padding: 8px 16px;
  font-size: 0.85rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.heartbeat-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
}

.heartbeat-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.heartbeat-status.online .heartbeat-dot {
  background: #22c55e;
  box-shadow: 0 0 8px #22c55e;
}

.heartbeat-status.offline .heartbeat-dot {
  background: #ef4444;
  box-shadow: 0 0 8px #ef4444;
  animation: pulse-red 1s infinite alternate;
}

@keyframes pulse-red {
  from { opacity: 0.6; }
  to { opacity: 1; }
}

.autosave-badge {
  color: #94a3b8;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 網絡斷線重試醒目標題 */
.network-retry-banner {
  display: none;
  background: #fee2e2;
  border: 2px solid #ef4444;
  color: #991b1b;
  padding: 12px 20px;
  border-radius: 8px;
  margin: 16px auto;
  max-width: 960px;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  animation: shake 0.5s ease-in-out;
}

.network-retry-banner.visible {
  display: flex;
}

.btn-retry {
  background: #dc2626;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-retry:hover {
  background: #b91c1c;
}

/* 置頂計時器導覽列 */
.sticky-timer-bar {
  position: sticky;
  top: 38px;
  z-index: 1000;
  background: #ffffff;
  border-bottom: 2px solid var(--border-color);
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  padding: 12px 20px;
  display: none;
}

.timer-content {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.timer-phase-badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 700;
}

.timer-phase-badge.phase1 {
  background: #dbeafe;
  color: #1d4ed8;
}

.timer-phase-badge.phase2 {
  background: #fef3c7;
  color: #b45309;
}

.timer-countdown {
  font-size: 1.5rem;
  font-weight: 800;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  color: #1e293b;
  letter-spacing: 1px;
}

.timer-countdown.warn {
  color: var(--warning);
}

.timer-countdown.danger {
  color: var(--danger);
  animation: timer-pulse 1s infinite alternate;
}

@keyframes timer-pulse {
  from { opacity: 0.7; }
  to { opacity: 1; }
}

/* 卡片與佈局 */
.card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
  margin-top: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.section-header {
  border-bottom: 2px solid #f1f5f9;
  padding-bottom: 12px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
}

.section-pts {
  background: #f1f5f9;
  color: #475569;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 12px;
}

/* 客觀題鎖定狀態 */
.objective-locked {
  opacity: 0.65;
  pointer-events: none;
  filter: grayscale(30%);
  user-select: none;
  position: relative;
}

.objective-lock-banner {
  display: none;
  background: var(--lock-bg);
  border: 2px solid var(--danger);
  color: #991b1b;
  padding: 16px 20px;
  border-radius: 10px;
  margin-bottom: 24px;
  font-size: 1rem;
  font-weight: 700;
  text-align: center;
  line-height: 1.6;
}

.objective-lock-banner.visible {
  display: block;
}

/* 題目樣式 */
.question-item {
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f1f5f9;
}

.question-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
  margin-bottom: 0;
}

.question-stem {
  font-size: 1.05rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 12px;
}

.question-meta {
  font-size: 0.85rem;
  color: var(--primary);
  font-weight: 700;
  margin-right: 6px;
}

/* 單選與判斷題選項 */
.options-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.options-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.option-btn-label {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background: #ffffff;
  border: 1.5px solid #cbd5e1;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.option-btn-label:hover {
  border-color: var(--primary);
  background: var(--primary-light);
}

.option-btn-label input[type="radio"] {
  margin-right: 10px;
  accent-color: var(--primary);
  width: 18px;
  height: 18px;
}

/* 填空題輸入框 */
.blank-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
}

.blank-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
}

.blank-label {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 600;
}

.blank-input {
  border: 1.5px solid #cbd5e1;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.95rem;
  color: #0f172a;
  background: #fff;
  transition: border-color 0.2s, box-shadow 0.2s;
  min-width: 120px;
}

.blank-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

/* 符號快捷鍵面板 */
.symbol-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  background: #f1f5f9;
  padding: 8px 12px;
  border-radius: 6px;
  margin-top: 10px;
}

.symbol-bar-title {
  font-size: 0.8rem;
  color: #475569;
  font-weight: 600;
  margin-right: 4px;
}

.btn-symbol {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 0.9rem;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s, border-color 0.15s;
}

.btn-symbol:hover {
  background: var(--primary-light);
  border-color: var(--primary);
  color: var(--primary);
}

/* 解答題手寫拍照區 */
.camera-box {
  background: #f8fafc;
  border: 2px dashed #cbd5e1;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  margin-top: 14px;
}

.video-container {
  position: relative;
  max-width: 480px;
  margin: 12px auto;
  border-radius: 8px;
  overflow: hidden;
  background: #000;
  display: none;
}

.video-container video {
  width: 100%;
  height: auto;
  display: block;
}

.preview-container {
  max-width: 480px;
  margin: 12px auto;
  display: none;
}

.preview-container img {
  width: 100%;
  border-radius: 8px;
  border: 1.5px solid var(--border-color);
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
}

.camera-controls {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
}

.btn-camera {
  padding: 10px 18px;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: background 0.2s;
}

.btn-cam-primary {
  background: var(--primary);
  color: #fff;
}
.btn-cam-primary:hover {
  background: var(--primary-hover);
}

.btn-cam-capture {
  background: #16a34a;
  color: #fff;
  display: none;
}
.btn-cam-capture:hover {
  background: #15803d;
}

.btn-cam-retake {
  background: #e2e8f0;
  color: #334155;
  display: none;
}
.btn-cam-retake:hover {
  background: #cbd5e1;
}

/* 認證與考前確認畫面 */
.auth-container, .confirm-container {
  max-width: 580px;
  margin: 40px auto;
}

.auth-card {
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 32px 28px;
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #334155;
}

.form-control {
  width: 100%;
  padding: 12px 14px;
  border: 1.5px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
  color: #0f172a;
  background: #fff;
  transition: border-color 0.2s;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.btn-block {
  width: 100%;
  padding: 14px;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  background: var(--primary);
  color: #fff;
  transition: background 0.2s, transform 0.1s;
}

.btn-block:hover {
  background: var(--primary-hover);
}

.btn-block:active {
  transform: translateY(1px);
}

/* 身分標記 */
.identity-badge {
  background: #eff6ff;
  border: 1.5px solid #bfdbfe;
  border-radius: 10px;
  padding: 16px;
  text-align: center;
  margin-bottom: 20px;
}

.identity-name {
  font-size: 1.35rem;
  font-weight: 800;
  color: #1e3a8a;
  margin-top: 4px;
}

/* 狀態訊息盒 */
.status-box {
  margin-top: 20px;
  padding: 16px;
  border-radius: 8px;
  display: none;
  font-weight: 600;
  text-align: center;
}

.status-box.info {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1e40af;
  display: block;
}

.status-box.success {
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  color: #065f46;
  display: block;
}

.status-box.error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  display: block;
}

/* ==========================================================================
   刷臉辨識與人臉檢測視圖樣式 (Authentic Face Auth Styles)
   ========================================================================== */
.camera-wrapper {
  position: relative;
  width: 100%;
  max-width: 320px;
  height: 240px;
  margin: 0 auto 16px auto;
  border-radius: 12px;
  overflow: hidden;
  background-color: #000000;
  border: 2px solid #cbd5e1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.camera-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scaleX(-1); /* 自拍鏡像 */
}

.camera-oval-guide {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150px;
  height: 190px;
  border: 2px dashed rgba(56, 189, 248, 0.8);
  border-radius: 50%;
  pointer-events: none;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.35);
}

.camera-status-overlay {
  position: absolute;
  bottom: 8px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 12px;
  color: #ffffff;
  background: rgba(15, 23, 42, 0.75);
  padding: 4px 8px;
}

.alert-box {
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 12px;
}

.alert-box.alert-warning {
  background: #fffbeb;
  border: 1px solid #fde68a;
  color: #92400e;
}

.alert-box.alert-danger {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
}

.alert-box.alert-success {
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  color: #065f46;
}

/* ==========================================================================
   密碼二次身分驗證彈窗 (Modal Password Authentication)
   ========================================================================== */
.auth-modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(15, 23, 42, 0.88);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 16px;
}

.auth-modal-card {
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 16px;
  max-width: 440px;
  width: 100%;
  padding: 24px 20px;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.6);
  color: #f8fafc;
  box-sizing: border-box;
}

.auth-candidate-btn {
  width: 100%;
  text-align: left;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1.5px solid #334155;
  background: #0f172a;
  color: #f8fafc;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s;
}

.auth-candidate-btn:hover {
  border-color: #38bdf8;
  background: #1e293b;
}

.auth-candidate-btn.active {
  border-color: #38bdf8;
  background: rgba(56, 189, 248, 0.15);
}

/* 按鈕風格 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  border-radius: 8px;
  padding: 10px 16px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.btn-primary {
  background: #2563eb;
  color: #fff;
}
.btn-primary:hover {
  background: #1d4ed8;
}

.btn-success {
  background: #16a34a;
  color: #fff;
}
.btn-success:hover {
  background: #15803d;
}

.btn-secondary {
  background: #475569;
  color: #f8fafc;
}
.btn-secondary:hover {
  background: #334155;
}

.btn-outline {
  background: transparent;
  border: 1.5px solid #2563eb;
  color: #2563eb;
}
.btn-outline:hover {
  background: #eff6ff;
}

/* ==========================================================================
   第四部分：單題獨立相機拍照卡片樣式 (Q20~Q23 Per-Question Camera)
   ========================================================================== */
.q-cam-card {
  margin-top: 14px;
  padding: 16px;
  background: #f8fafc;
  border: 1.5px dashed #cbd5e1;
  border-radius: 10px;
  transition: border-color 0.2s;
}

.q-cam-card:hover {
  border-color: #94a3b8;
}

.q-cam-video-box {
  position: relative;
  margin-bottom: 12px;
  border-radius: 8px;
  overflow: hidden;
  background: #000;
}

.q-cam-video-box video {
  width: 100%;
  max-height: 320px;
  object-fit: cover;
  display: block;
}

.q-cam-preview-box {
  margin-bottom: 12px;
  text-align: center;
}

.q-cam-preview-box img {
  max-width: 100%;
  max-height: 260px;
  border-radius: 8px;
  border: 2px solid #10b981;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
  display: block;
  margin: 0 auto;
}

.q-cam-success-tip {
  font-size: 0.85rem;
  color: #16a34a;
  font-weight: 600;
  margin-top: 6px;
}

.btn-cam {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background: #2563eb;
  color: #ffffff;
  transition: all 0.2s;
}

.btn-cam:hover {
  background: #1d4ed8;
}

.btn-cam-capture {
  background: #16a34a;
}
.btn-cam-capture:hover {
  background: #15803d;
}

.btn-cam-retake {
  background: #d97706;
}
.btn-cam-retake:hover {
  background: #b45309;
}

.blank-input::placeholder {
  color: #94a3b8;
  font-size: 0.85rem;
  font-style: italic;
}

@media (max-width: 640px) {
  .card { padding: 18px 14px; }
  .auth-card { padding: 24px 16px; }
  .timer-countdown { font-size: 1.25rem; }
  .blank-input { min-width: 100%; }
}
`;

module.exports = {
  EXAM_CSS
};
