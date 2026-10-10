/**
 * =========================================================================
 * 高一理組數學大測(一) - Google Apps Script (GAS) 雲端後端程式
 * 檔案：gas_backend.gs
 * 說明：
 * 接收學生前端網頁上傳的 Base64 壓縮解答圖片，將其轉為二進位檔案儲存至指定的
 * Google 雲端硬碟 (Google Drive) 資料夾，並自動設定檢視權限，回傳該圖片的
 * 雲端硬碟公開檢視 URL 給前端，以供後續步驟寫入 Google 表單。
 * 支援 2026-2027 學年高一理上學期數學大測卷(一) 27題正式考試。
 * =========================================================================
 * 
 * 【部署步驟】
 * 1. 建立雲端資料夾：
 *    在 Google 雲端硬碟建立一個資料夾（例如命名為「進階大測_學生解答圖庫」）。
 *    開啟該資料夾，複製網址中的資料夾 ID（網址 folders/ 後方那一串字串），
 *    貼到下方的 FOLDER_ID 變數中。
 * 
 * 2. 建立 Apps Script 專案：
 *    前往 https://script.google.com/ ，點選「新增專案」。
 *    將程式碼編輯器內的原有內容清空，完整貼上本檔案程式碼。
 * 
 * 3. 部署為網頁應用程式 (Web App)：
 *    點選右上角「部署」按鈕 ->「新增部署作業」。
 *    - 類型：選取「網頁應用程式 (Web app)」。
 *    - 說明：例如「大測圖床服務 v1」。
 *    - 執行身分：選取「我 (youremail@...)」。
 *    - 存取權限：必須選取「所有人 (Anyone)」（確保未登入 Google 的學生亦可上傳）。
 *    點選「部署」並授權存取 Google 雲端硬碟。
 * 
 * 4. 取得 Web App 網址：
 *    複製產生的「網頁應用程式網址 (Web App URL)」，形如：
 *    https://script.google.com/macros/s/AKfycbx.../exec
 *    將該網址貼入 `advance_test.html` 的 CONFIG.GAS_ENDPOINT 中。
 */

// ==========================================
// 設定區：請將此處替換為您的 Google Drive 資料夾 ID
// ==========================================
const FOLDER_ID = 'YOUR_GOOGLE_DRIVE_FOLDER_ID_HERE';

/**
 * 處理 POST 請求 (主要圖片上傳邏輯)
 * 接收來自 advance_test.html 的 Base64 圖片數據
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse({
        status: 'error',
        message: '未收到任何 POST 數據 (Empty payload)'
      });
    }

    let payload;
    const contents = e.postData.contents;

    // 解析 JSON 或 URL 編碼內容
    try {
      payload = JSON.parse(contents);
    } catch (parseError) {
      // 容錯：嘗試解析 URLSearchParams
      payload = parseUrlEncoded(contents);
    }

    const studentId = payload.studentId || payload.student_id || '未填學號';
    const studentName = payload.studentName || payload.student_name || '未填姓名';
    const imageBase64 = payload.imageBase64 || payload.image || payload.data;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return createJsonResponse({
        status: 'error',
        message: '缺少 imageBase64 圖片欄位或數據為空'
      });
    }

    // 取得目標雲端資料夾
    let targetFolder;
    if (FOLDER_ID && FOLDER_ID !== 'YOUR_GOOGLE_DRIVE_FOLDER_ID_HERE') {
      try {
        targetFolder = DriveApp.getFolderById(FOLDER_ID);
      } catch (fErr) {
        // 若找不到指定資料夾，退回使用雲端硬碟根目錄，確保學生作答不遺失
        targetFolder = DriveApp.getRootFolder();
      }
    } else {
      targetFolder = DriveApp.getRootFolder();
    }

    // 解析 Base64 字串並判斷副檔名
    let base64Clean = imageBase64;
    let mimeType = 'image/jpeg';
    let fileExt = 'jpg';

    if (imageBase64.indexOf(';base64,') > -1) {
      const parts = imageBase64.split(';base64,');
      const header = parts[0];
      base64Clean = parts[1];
      if (header.indexOf('image/png') > -1) {
        mimeType = 'image/png';
        fileExt = 'png';
      }
    }

    // 將 Base64 解碼為 Blob 二進位檔案
    const decodedBytes = Utilities.base64Decode(base64Clean);
    const timestampStr = Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyyMMdd_HHmmss');
    const safeStudentName = studentName.toString().replace(/[\/\\:*?"<>|]/g, '_');
    const safeStudentId = studentId.toString().replace(/[\/\\:*?"<>|]/g, '_');
    const qId = (payload.questionId || 'Q20').toString().toUpperCase().replace(/[\/\\:*?"<>|]/g, '_');
    const filename = `大測解答_${qId}_${safeStudentId}_${safeStudentName}.${fileExt}`;

    const blob = Utilities.newBlob(decodedBytes, mimeType, filename);
    const uploadedFile = targetFolder.createFile(blob);

    // 設定公開檢視權限 (知道連結的任何人皆可檢視)
    uploadedFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    const fileId = uploadedFile.getId();
    const fileUrl = uploadedFile.getUrl();

    // 成功回傳 JSON
    return createJsonResponse({
      status: 'success',
      fileId: fileId,
      fileUrl: fileUrl,
      filename: filename,
      message: '學生解答圖片已成功存入 Google 雲端硬碟'
    });

  } catch (error) {
    return createJsonResponse({
      status: 'error',
      message: '後端執行發生例外錯誤：' + error.toString()
    });
  }
}

/**
 * 處理 GET 請求 (健康檢查與部署驗證)
 */
function doGet(e) {
  return createJsonResponse({
    status: 'online',
    service: 'High School Mathematics Exam - GAS Webhook Backend',
    timestamp: new Date().toISOString(),
    message: 'GAS Web App 運作正常。請使用 POST 方法上傳 Base64 解答圖片。'
  });
}

/**
 * 輔助函數：建立符合標準 CORS 的 JSON 輸出物件
 */
function createJsonResponse(dataObject) {
  return ContentService
    .createTextOutput(JSON.stringify(dataObject))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 輔助函數：解析 URL 編碼字串
 */
function parseUrlEncoded(str) {
  const result = {};
  if (!str) return result;
  const pairs = str.split('&');
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('=');
    if (pair.length === 2) {
      const key = decodeURIComponent(pair[0].replace(/\+/g, ' '));
      const val = decodeURIComponent(pair[1].replace(/\+/g, ' '));
      result[key] = val;
    }
  }
  return result;
}
