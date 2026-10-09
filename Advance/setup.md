# 高一理組數學大測(一) 考試平臺 (Advance Math Exam) 部署與設定指引

本手冊提供「2026-2027 學年高一理上學期數學大測卷(一)」線上考試平臺之完整雲端整合與部署步驟，涵蓋 Google 雲端硬碟圖床、Google Apps Script (GAS) Webhook、Google 表單後台資料庫、花名冊身分認證、雙階段計時鎖定、離線保護與本機自動化驗證流程。

---

## 一、系統架構概覽 (雙階段考試與兩階段提交機制)

1. **試卷規格與題型配置 (共 27 題，滿分 120 分)**：
   - **第一部分：判斷題 (第 1~6 題，共 12 分)**：每題 2 分，答案鍵 `q1: X, q2: O, q3: O, q4: X, q5: X, q6: X`，前端本機自動批改。
   - **第二部分：單項選擇題 (第 7~11 題，共 10 分)**：每題 2 分，答案鍵 `q7: D, q8: B, q9: A, q10: B, q11: A`，前端本機自動批改。
   - **客觀題小計**：滿分 22 分（第 1~11 題），於交卷時自動結算上傳。
   - **第三部分：填充題 (第 12~19 題，共 19 空，共 38 分)**：每空 2 分，結構化文字/數值輸入，提供 LaTeX 數學符號快捷按鈕。
   - **第四部分：解答題 (第 20~23 題，共 40 分)**：每題 10 分，主觀計算證明題，支援手寫紙張 WebCam 拍照或檔案上傳，Canvas 自動等比縮放壓縮至最大邊長 $\le 1200\text{px}$ (JPEG 質量 0.7)。
   - **第五部分：附加題 (第 24~27 題，共 20 分)**：每題 5 分，進階挑戰題。

2. **考前確認與雙階段防作弊計時器 (40 + 10 分鐘，總限時 50 分鐘)**：
   - **考前身分確認畫面**：學生登入後（支援 4C/4D/5B 全體 88 名學生與全班級 99 號教師測試員，預設密碼 `1234`），醒目呈現班別、學號、姓名及閉卷規則，點擊「開始測驗」方才啟動計時器。
   - **第一階段 (前 40:00)**：全卷開放作答。
   - **嚴格 40:00 客觀題強制鎖定**：滿 40 分鐘時立即觸發 `lockObjectiveQuestions()`，第一部分與第二部分全部 input 禁用 (`disabled = true`)，顯示紅色鎖定橫幅並彈出警告。
   - **第二階段 (後 10:00 緩衝)**：專供修訂填充題文字與解答題手寫拍照壓縮上傳。
   - **硬性超時交卷 (50:00)**：緩衝結束自動強制交卷。

3. **離線容錯、心跳指示與網絡斷線重試**：
   - **頂部實時心跳指示燈**：每 30 秒探測一次，顯示 `🟢 網絡連通正常` 或 `🔴 網絡已斷開，已進入離線保護模式`。
   - **LocalStorage 即時自動暫存**：鍵值 `ADVANCE_MATH_EXAM_STATE`，即時儲存學生身分、作答狀態、剩餘秒數與照片 Base64，刷新頁面無縫自動恢復。
   - **斷網容錯保護**：網絡中斷時絕不清空已拍照片或答案，頂部彈出 `「網絡連線中斷，請檢查連線」` 橫幅並提供一鍵 `【重新提交/重試】` 按鈕。

4. **兩階段雲端提交管道**：
   - **第 1 階段（圖片上傳）**：前端將壓縮後的 Base64 照片以 AJAX POST 送交 **Google Apps Script (GAS)** Webhook。GAS 解碼並存入指定 Google 雲端硬碟資料夾，設定公開檢視並回傳 Drive 檢視連結 (`fileUrl`)。
   - **第 2 階段（表單紀錄與成績歸檔）**：將學號、姓名、班級、客觀題總分 (滿分 22 分)、作答詳情明細 JSON 及 Drive 圖片連結一併 POST 至 **Google 表單 (formResponse)** 後台存檔。

---

## 二、步驟 1：建立 Google 雲端硬碟資料夾

1. 開啟 [Google 雲端硬碟](https://drive.google.com/)。
2. 建立新資料夾，命名為：`2026_高一理組數學大測解答圖庫`。
3. 進入該資料夾，複製網址列中 `folders/` 後方的字串（即為 `FOLDER_ID`）。

---

## 三、步驟 2：部署 Google Apps Script (GAS) 圖片接收後端

1. 前往 [Google Apps Script 控制台](https://script.google.com/)，點選「新增專案」。
2. 專案命名為「數學大測圖床服務」。
3. 清空編輯器預設程式碼，貼上本專案之 `gas_backend.gs` 完整內容。
4. 修改上方常數：
   ```javascript
   const FOLDER_ID = '貼上剛才複製的Google雲端硬碟資料夾ID';
   ```
5. 點擊右上角「**部署**」->「**新增部署作業**」：
   - **類型**：選取「**網頁應用程式 (Web app)**」。
   - **說明**：`數學大測圖片上傳 Webhook v1`。
   - **執行身分**：選取「**我 (youremail@gmail.com)**」。
   - **誰可以存取 (Who has access)**：⚠️ **務必選取「所有人 (Anyone)」**。
6. 完成 Google 授權並複製產生的「網頁應用程式網址 (Web App URL)」：
   `https://script.google.com/macros/s/AKfycb.../exec`

---

## 四、步驟 3：建立 Google 表單並擷取 Entry ID

1. 開啟 [Google 表單](https://forms.google.com/)，建立「2026-2027 高一理組數學大測(一) 作答記錄」。
2. 建立 6 個題目欄位：
   - 題目 1：`學號`（簡答題，必填）
   - 題目 2：`姓名`（簡答題，必填）
   - 題目 3：`班級`（簡答題，必填）
   - 題目 4：`客觀題總分`（簡答題，滿分 22 分）
   - 題目 5：`作答詳情明細`（段落題，包含客觀與填空詳細作答）
   - 題目 6：`手寫解答圖片連結`（簡答題）
3. 取得 Entry ID：
   - 點擊「**⋮**」選單 ->「**取得預先填寫的連結**」。
   - 填入測試字元並點擊「取得連結」。
   - 解析各欄位之 `entry.xxxxxx` 代號，填入前端 `CONFIG.FORM_ENTRIES`。

---

## 五、步驟 4：更新前端 `advance_test.html` 配置

在 `advance_test.html` 的 `CONFIG` 物件中設定端點：

```javascript
const CONFIG = {
  // 正式考試上線時將 MODE 改為 'production'；本機測試時維持 'mock'
  MODE: 'production',

  // 本機開發測試端點 (配合 node mock_server.js)
  MOCK_GAS_URL: 'http://localhost:3000/api/gas-upload',
  MOCK_FORM_URL: 'http://localhost:3000/api/form-submit',

  // 正式雲端環境端點
  PROD_GAS_URL: 'https://script.google.com/macros/s/AKfycb.../exec',
  PROD_FORM_URL: 'https://docs.google.com/forms/d/e/1FAIpQLSc.../formResponse',

  // Google 表單欄位對應代碼
  FORM_ENTRIES: {
    studentId: 'entry.1000001',
    studentName: 'entry.1000002',
    classId: 'entry.1000003',
    score: 'entry.1000004',
    details: 'entry.1000005',
    imageUrl: 'entry.1000006'
  }
};
```

---

## 六、步驟 5：本機 Mock 測試與自動化驗證

本專案提供純 Node.js（零外部 npm 依賴）之完整自動化驗證套件：

1. **執行全功能自動化驗證**：
   ```powershell
   node verify_exam.js
   ```
   測試套件將自動驗證：
   - ① HTML 與 JavaScript 語法零錯誤
   - ② MathJax 3 LaTeX 公式渲染配置與無裸露 `$$` 審查
   - ③ 花名冊載入、學生與教師測試員 (ID 99) 密碼登入
   - ④ 客觀題答案鍵與本機 22 分自動核分驗證
   - ⑤ 40:00 第二階段客觀題鎖定機制
   - ⑥ LocalStorage 離線暫存自動恢復、網絡心跳指示燈與斷網重試機制

2. **啟動本機 Mock 伺服器進行手動瀏覽器測試**：
   ```powershell
   node mock_server.js
   ```
   瀏覽器開啟 `http://localhost:3000` 即可進行作答體驗。
