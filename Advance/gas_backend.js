// 高一理組進階大測 - Google Apps Script (GAS) 後端程式碼
// 部署步驟：
// 1. 在您的 Google 雲端硬碟建立一個新的「Google 試算表 (Google Sheets)」，命名為 "Advance_Test_DB"。
//    表頭 (第一列) 必須依序設定為：[時間戳記, 學號, 姓名, 填空題答案, 解答題圖片URL, 分數, 狀態]
// 2. 點選試算表上方的「擴充功能」->「Apps Script」。
// 3. 將本檔案所有的程式碼貼上並覆蓋原來的程式碼。
// 4. 在您的 Google Drive 中建立一個資料夾，命名為 "Advance_Test_Uploads"，並將該資料夾的 ID 貼到下方的 FOLDER_ID 變數中。
// 5. 點選右上角的「部署」->「新增部署作業」。
// 6. 選取類型為「網頁應用程式 (Web app)」。
// 7. 「執行身分」設定為「我 (您自己)」，「存取權限」設定為「所有人 (Anyone)」。
// 8. 部署完成後，複製「網頁應用程式網址 (Web App URL)」，將其貼到 `advance_test.html` 與 `advance_grading_dashboard.html` 中。

const SHEET_NAME = '工作表1'; // 如果您的工作表名稱不同，請修改這裡
const FOLDER_ID = '在此貼上您的 Google Drive 資料夾 ID'; // 例如：'1A2B3C4D5E6F7G8H9I0J'

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    // 1. 處理學生提交考卷
    if (action === 'submit_exam') {
      const studentId = data.studentId;
      const studentName = data.studentName;
      const textAnswer = data.textAnswer;
      const base64Data = data.imageBase64;
      const timestamp = new Date();

      let imageUrl = "無圖片";

      // 處理 Base64 圖片上傳至 Google Drive
      if (base64Data && base64Data !== "") {
        const folder = DriveApp.getFolderById(FOLDER_ID);
        // Base64 通常帶有 data:image/png;base64, 前綴，需要將其移除
        const base64String = base64Data.split(',')[1]; 
        const blob = Utilities.newBlob(Utilities.base64Decode(base64String), 'image/jpeg', `大測解答_${studentId}_${studentName}.jpg`);
        const file = folder.createFile(blob);
        // 設定圖片權限為知道連結的人皆可檢視，方便教師後台讀取
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        imageUrl = file.getUrl();
      }

      // 將資料寫入 Google Sheets
      sheet.appendRow([timestamp, studentId, studentName, textAnswer, imageUrl, "", "Unmarked"]);

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "考卷已成功提交！"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // 2. 處理教師批改更新分數
    if (action === 'update_score') {
      const rowIndex = data.rowIndex; // 在 Sheet 中的行號 (從 2 開始)
      const score = data.score;
      
      // 更新分數 (第 6 欄) 與狀態 (第 7 欄)
      sheet.getRange(rowIndex, 6).setValue(score);
      sheet.getRange(rowIndex, 7).setValue("Marked");
      
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "分數更新成功！"
      })).setMimeType(ContentService.MimeType.JSON);
    }

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // 處理教師後台拉取未批改的考卷清單
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    let unmarkedSubmissions = [];
    
    // 從第二行開始讀取 (略過表頭)
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const status = row[6]; // 狀態在第 7 欄 (索引 6)
      
      if (status === "Unmarked") {
        unmarkedSubmissions.push({
          rowIndex: i + 1, // 實際的 Sheet 行號
          timestamp: row[0],
          studentId: row[1],
          studentName: row[2],
          textAnswer: row[3],
          imageUrl: row[4]
        });
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      data: unmarkedSubmissions
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
