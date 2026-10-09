/**
 * gas_drive_uploader.js - Google Apps Script Drive Photo Uploader Service
 * High School Mobile Math Practice & Anti-Cheating Quiz Platform
 * 
 * Target Google Drive Folder: My Drive > WEB+ (Folder ID: 1oY52JyAqLLQQiETq8A-hre9jZ_goLHiY)
 * Web App Access Level: Anyone (anonymous access enabled)
 * Execution Identity: Me (Owner account)
 */

// Target Google Drive Folder ID
var TARGET_FOLDER_ID = "1oY52JyAqLLQQiETq8A-hre9jZ_goLHiY";

/**
 * Handle GET requests for health check and service discovery
 */
function doGet(e) {
  var response = {
    status: "online",
    service: "High School Math Platform - Drive Photo Uploader",
    targetFolderId: TARGET_FOLDER_ID,
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  };

  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle POST requests for uploading student facial verification snapshots
 * Expected Payload (JSON in text/plain body or URL-encoded form):
 * {
 *   "classID": "4D",
 *   "studentID": "23",
 *   "studentName": "劉付穎",
 *   "imageBase64": "data:image/jpeg;base64,...",
 *   "tag": "REGISTRATION" // or "REAUTH_15MIN", "AUDIT"
 * }
 */
function doPost(e) {
  var responseData = {
    success: false,
    timestamp: new Date().toISOString()
  };

  try {
    var payload = null;

    // Parse input from postData contents (JSON) or form parameters
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        // If not valid JSON string, try parameter fallback
        payload = e.parameter;
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    if (!payload) {
      throw new Error("Missing request payload or invalid POST body.");
    }

    var classID = String(payload.classID || "UNKNOWN").trim().toUpperCase();
    var studentID = String(payload.studentID || "0").trim();
    var studentName = String(payload.studentName || "").trim();
    var imageBase64 = String(payload.imageBase64 || "").trim();
    var tag = String(payload.tag || "REGISTRATION").trim().toUpperCase();

    if (!imageBase64) {
      throw new Error("imageBase64 field is required and cannot be empty.");
    }

    // Strip Data URL prefix if present (e.g. data:image/jpeg;base64,)
    var cleanBase64 = imageBase64;
    var commaIndex = cleanBase64.indexOf(",");
    if (commaIndex !== -1) {
      cleanBase64 = cleanBase64.substring(commaIndex + 1);
    }

    // Decode Base64 string into binary bytes
    var decodedBytes = Utilities.base64Decode(cleanBase64);

    // Generate formatted filename: {classID}_{studentID}_{studentName}_{yyyyMMdd_HHmmss}_{tag}.jpg
    var recordDate = (payload.timestamp && !isNaN(Number(payload.timestamp))) ? new Date(Number(payload.timestamp)) : new Date();
    var timeStampStr = Utilities.formatDate(recordDate, "GMT+8", "yyyyMMdd_HHmmss");
    var safeName = studentName.replace(/[\\/:*?"<>|]/g, "");
    var fileName = classID + "_" + studentID + "_" + safeName + "_" + timeStampStr + "_" + tag + ".jpg";

    // Locate target Drive folder
    var targetFolderId = payload.folderId || TARGET_FOLDER_ID;
    var folder;
    try {
      folder = DriveApp.getFolderById(targetFolderId);
    } catch (folderErr) {
      throw new Error("Unable to access target folder with ID " + targetFolderId + ": " + folderErr.message);
    }

    // Create file blob and save to Drive
    var blob = Utilities.newBlob(decodedBytes, "image/jpeg", fileName);
    var createdFile = folder.createFile(blob);

    // Set human-readable file description
    var description = "高中數學科防作弊拍照存檔 | 班別: " + classID + 
                      " | 學號: " + studentID + 
                      " | 姓名: " + studentName + 
                      " | 類型: " + tag + 
                      " | 時間: " + timeStampStr;
    createdFile.setDescription(description);

    responseData = {
      success: true,
      fileId: createdFile.getId(),
      fileName: fileName,
      fileUrl: createdFile.getUrl(),
      createdTime: timeStampStr,
      classID: classID,
      studentID: studentID,
      studentName: studentName,
      tag: tag,
      folderId: targetFolderId,
      timestamp: payload.timestamp || Date.now()
    };

  } catch (error) {
    responseData = {
      success: false,
      error: error.message || "Unknown error occurred during photo upload."
    };
  }

  // Return CORS-friendly JSON output
  return ContentService.createTextOutput(JSON.stringify(responseData))
    .setMimeType(ContentService.MimeType.JSON);
}
