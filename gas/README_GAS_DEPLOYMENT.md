# Google Apps Script (GAS) Drive 照片歸檔服務部署指南

本文件提供高中數學練習與防作弊測驗平臺之 Google Drive 照片歸檔服務（`gas_drive_uploader.js`）的完整雲端部署步驟。

---

## 1. 服務架構概覽

- **目標功能**：接收前端行動端壓縮後的 JPEG 照片（Base64 字串），解碼後自動存入指定的 Google Drive 目錄，檔名格式規範化。
- **目標 Google Drive 資料夾 ID**：
  `1oY52JyAqLLQQiETq8A-hre9jZ_goLHiY`（路徑：`My Drive > WEB+`）
- **儲存檔名規則**：
  `{班別}_{學號}_{姓名}_{西元年月日時分秒}_{標籤}.jpg`  
  範例：`4D_23_劉付穎_20260930_113000_REGISTRATION.jpg`

---

## 2. 部署操作步驟

### 步驟 1：建立 Google Apps Script 專案
1. 使用具備上述 Google Drive 目錄存取權限的 Google 帳戶登入 [script.google.com](https://script.google.com/)。
2. 點擊左上角「**新增專案** (New Project)」。
3. 將專案重新命名為：`MathPlatform_DriveUploader`。

### 步驟 2：貼上服務端代碼
1. 刪除編輯器內原有的 `function myFunction() { ... }` 範例代碼。
2. 將本專案中的 `gas_drive_uploader.js` 代碼全文複製並貼入編輯器中。
3. 檢查確認頂部的資料夾 ID：
   ```javascript
   var TARGET_FOLDER_ID = "1oY52JyAqLLQQiETq8A-hre9jZ_goLHiY";
   ```
4. 點擊頂部工具列的「**儲存專案** (Save)」圖標（或快捷鍵 `Ctrl + S`）。

### 步驟 3：建立網頁應用程式部署 (Deploy Web App)
1. 點擊編輯器右上角的「**部署** (Deploy)」按鈕，選擇「**新增部署作業** (New deployment)」。
2. 在左側齒輪「選取類型」中，選擇「**網頁應用程式** (Web app)」。
3. 填寫部署設定參數（**極其重要，請務必按照以下設定**）：
   - **說明 (Description)**：`v1.0 Drive Photo Uploader`
   - **執行身分 (Execute as)**：**我 (Me - 您的 Google 帳戶)**
     * 注意：確保以此身分執行，才能使用您的權限直接寫入 Drive 資料夾。
   - **誰有存取權 (Who has access)**：**任何人 (Anyone)**
     * 注意：必須設為「任何人」，如此一來學生在手機前端無須登入特定 Google 帳號，靜態網頁才能順利上傳照片。
4. 點擊「**部署** (Deploy)」按鈕。

### 步驟 4：授權應用程式存取 Google Drive
1. 首次部署時，系統會彈出「**需要授權** (Authorization Required)」視窗。
2. 點擊「**審查權限** (Review permissions)」，選擇您的 Google 帳戶。
3. 若出現「Google 尚未驗證此應用程式 (Google hasn't verified this app)」的警告提示：
   - 點擊左下角「**進階** (Advanced)」。
   - 點擊「**前往「MathPlatform_DriveUploader」（不安全）** (Go to MathPlatform_DriveUploader (unsafe))」。
4. 點擊「**允許** (Allow)」授予應用程式建立與管理 Drive 檔案的權限。

### 步驟 5：取得 Web App 部署網址 (Web App URL)
1. 授權完成後，部署視窗會顯示生成的網頁應用程式網址：
   `https://script.google.com/macros/s/AKfycb.../exec`
2. 複製此完整的 URL。

---

## 3. 前端客戶端整合配置

在前端 `js/persistence.js` 中配置您的 GAS Web App URL：

```javascript
// js/persistence.js
const CONFIG = {
  // 將部署取得之 URL 填入此處
  gasDriveUploaderUrl: "https://script.google.com/macros/s/YOUR_ACTUAL_DEPLOYED_ID/exec"
};
```

若前端頁面尚未設定真實 GAS 網址，系統會自動在控制台輸出提示，並使用本地優雅回顯模式，不影響整體測驗流程。

---

## 4. 服務端測試驗證

### (1) GET 服務健康檢查
在終端機中執行：
```bash
curl -L "https://script.google.com/macros/s/YOUR_ACTUAL_DEPLOYED_ID/exec"
```
預期回覆：
```json
{
  "status": "online",
  "service": "High School Math Platform - Drive Photo Uploader",
  "targetFolderId": "1oY52JyAqLLQQiETq8A-hre9jZ_goLHiY",
  "version": "1.0.0"
}
```

### (2) POST 照片上傳測試
使用 PowerShell 或 cURL 測試上傳：
```bash
curl -L -X POST "https://script.google.com/macros/s/YOUR_ACTUAL_DEPLOYED_ID/exec" \
  -H "Content-Type: text/plain;charset=utf-8" \
  -d '{"classID":"4D","studentID":"23","studentName":"劉付穎","imageBase64":"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD...","tag":"REGISTRATION"}'
```
預期回覆：
```json
{
  "success": true,
  "fileId": "1a2b3c4d5e...",
  "fileName": "4D_23_劉付穎_20260930_113000_REGISTRATION.jpg",
  "fileUrl": "https://drive.google.com/file/d/...",
  "createdTime": "20260930_113000"
}
```

---

## 5. 常見問題與排除 (Troubleshooting)

1. **上傳回報 CORS 錯誤**：
   - 原因：若前端使用 `fetch` 並指定 `Content-Type: application/json`，瀏覽器會發送 `OPTIONS` 預檢請求，而 GAS 預設不處理 OPTIONS 預檢。
   - 解決方案：前端必須使用 `Content-Type: text/plain;charset=utf-8`，瀏覽器會將其視為 Simple Request，直接發送 POST，GAS 代碼內透過 `JSON.parse(e.postData.contents)` 解析內容。
2. **上傳回報找不到資料夾 (Folder Not Found)**：
   - 請檢查部署帳號是否對 `1oY52JyAqLLQQiETq8A-hre9jZ_goLHiY` 資料夾擁有「編輯者」或「擁有者」權限。
3. **學生上傳提示需登入 Google**：
   - 請重新檢查步驟 3 中的「**誰有存取權**」，必須為「**任何人 (Anyone)**」；若誤選為「僅限我自己」或「機構內的使用者」，匿名存取將會失敗。
