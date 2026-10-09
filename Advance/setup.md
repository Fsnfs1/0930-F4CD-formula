# 高一理組自然科測驗系統 (Advance Test) 部署與設定指引

本手冊提供「自然科進階測驗系統」之完整雲端整合步驟，包含 Google 雲端硬碟圖床、Google Apps Script (GAS) Webhook、Google 表單後台資料庫，以及本機 Mock 伺服器之測試流程。

---

## 一、系統架構概覽 (兩階段提交機制)

1. **第 1 階段（圖片上傳）**：
   學生於網頁利用 WebCam 拍照或上傳手寫解答圖片，前端透過 Canvas 進行等比縮放與 **JPEG 0.7 壓縮**，轉成 Base64 字串後，以 AJAX POST 送交 **Google Apps Script (GAS)** Webhook。
   GAS 自動將 Base64 轉為二進位圖檔儲存於指定 **Google 雲端硬碟資料夾**，設定公開檢視權限，並回傳 Drive 檢視連結 (`fileUrl`)。

2. **第 2 階段（表單紀錄與成績核算）**：
   前端調用本機評分函數 `gradeObjectiveQuestions()` 立即核算 6 題客觀題得分（滿分 60 分）。
   隨後將「學號、姓名、客觀題得分、各題作答詳情、雲端硬碟圖檔連結」一併 POST 至 **Google 表單 (formResponse)** 後台存檔。

---

## 二、步驟 1：建立 Google 雲端硬碟資料夾

1. 開啟 [Google 雲端硬碟](https://drive.google.com/)。
2. 建立新資料夾，命名為例如：`2026_高一自然科大測解答圖庫`。
3. 點入該資料夾，查看瀏覽器網址列：
   `https://drive.google.com/drive/folders/1ABCxyz789_FOLDER_ID_HERE`
4. 複製 `folders/` 後方的字串（即為 `FOLDER_ID`），備用於下一步驟。

---

## 三、步驟 2：部署 Google Apps Script (GAS) 圖片接收後端

1. 開啟 [Google Apps Script 控制台](https://script.google.com/)，點選「新增專案」。
2. 將專案命名為「自然科大測圖床服務」。
3. 清空編輯器預設程式碼，開啟並複製本專案的 `gas_backend.gs` 完整內容貼上。
4. 修改程式碼上方的設定常數：
   ```javascript
   const FOLDER_ID = '貼上剛才複製的Google雲端硬碟資料夾ID';
   ```
5. 點擊右上角「**部署**」按鈕 ->「**新增部署作業**」：
   - **選取類型**：點選齒輪圖示，選取「**網頁應用程式 (Web app)**」。
   - **說明**：`自然科大測圖片上傳 Webhook v1`。
   - **執行身分**：選取「**我 (youremail@gmail.com)**」。
   - **誰可以存取 (Who has access)**：⚠️ **務必選取「所有人 (Anyone)」**（確保未登入 Google 帳號的學生設備亦可正常上傳）。
6. 點選「部署」並完成 Google 帳號授權（點選 Advanced -> Go to ... (unsafe) -> Allow）。
7. 部署完成後複製「**網頁應用程式網址 (Web App URL)**」：
   `https://script.google.com/macros/s/AKfycb.../exec`

---

## 四、步驟 3：建立 Google 表單並擷取 Entry ID

1. 開啟 [Google 表單](https://forms.google.com/)，建立新表單「2026 高一自然科大測作答記錄」。
2. 建立下列 5 個題目欄位：
   - 題目 1：`學號`（簡答題，必填）
   - 題目 2：`姓名`（簡答題，必填）
   - 題目 3：`客觀題總分`（簡答題）
   - 題目 4：`作答詳情明細`（段落題）
   - 題目 5：`手寫解答圖片連結`（簡答題）
3. 取得欄位對應的 Entry 代號：
   - 點擊右上角「**⋮**」（更多）選單 ->「**取得預先填寫的連結 (Get pre-filled link)**」。
   - 於每個欄位分別填入範例識別文字（例如 `ID_TEST`、`NAME_TEST`、`SCORE_TEST`、`DETAILS_TEST`、`URL_TEST`）。
   - 點擊底部「**取得連結**」->「**複製連結**」。
   - 將複製出的連結貼至記事本檢視，網址格式如下：
     ```text
     https://docs.google.com/forms/d/e/1FAIpQLSc.../viewform?usp=pp_url&entry.1000001=ID_TEST&entry.1000002=NAME_TEST&entry.1000003=SCORE_TEST&entry.1000004=DETAILS_TEST&entry.1000005=URL_TEST
     ```
   - 提取其中的 Form ID 與各個 `entry.xxxxxx` 代號：
     - 表單提交位址為：`https://docs.google.com/forms/d/e/1FAIpQLSc.../formResponse`
     - 學號：`entry.1000001`
     - 姓名：`entry.1000002`
     - 總分：`entry.1000003`
     - 作答明細：`entry.1000004`
     - 圖片連結：`entry.1000005`

---

## 五、步驟 4：更新前端 `advance_test.html` 配置

開啟 `advance_test.html`，定位至 `<script>` 中的 `CONFIG` 物件：

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
    score: 'entry.1000003',
    details: 'entry.1000004',
    imageUrl: 'entry.1000005'
  },
  get GAS_URL() { return this.MODE === 'production' ? this.PROD_GAS_URL : this.MOCK_GAS_URL; },
  get FORM_URL() { return this.MODE === 'production' ? this.PROD_FORM_URL : this.MOCK_FORM_URL; }
};
```

---

## 六、步驟 5：本機 Mock 離線測試與自動化驗證

本專案內建純 Node.js（零外部 npm 套件依賴）之 Mock 伺服器與自動化驗證腳本：

1. **執行端對端自動化驗證**：
   在終端機切換至本專案目錄並執行：
   ```powershell
   node verify_e2e.js
   ```
   驗證項目包括：
   - MathJax 公式引擎標籤與配置檢驗
   - 客觀題 6 題本機自動核分邏輯測試
   - 40 分鐘倒數計時與逾時交卷邏輯
   - Mock GAS 圖片上傳 (Base64 解碼與檔案儲存)
   - Mock Google 表單接收與欄位映射
   - 完整二階段提交整合流端對端測試

2. **手動瀏覽器測試**：
   在終端機啟動 Mock 伺服器：
   ```powershell
   node mock_server.js
   ```
   瀏覽器開啟 `http://localhost:3000` 即可進行作答、鏡頭拍照、客觀題評分與兩階段提交模擬。
   查詢提交狀態：`http://localhost:3000/api/submissions`。
