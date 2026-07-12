// =====================================================================================
//             GOOGLE APPS SCRIPT: GOOGLE DRIVE IMAGE STORAGE BRIDGE
// =====================================================================================
// This script acts as a free, secure, serverless bridge between your frontend React application
// and your Google Drive folders for product images.
//
// 📁 CURRENT FOLDERS CONFIGURED IN FRONTEND:
// 1. Category "Jewellery" (Jewels) -> Folder ID: 1w5gw8xvWBzXFBJyv366u3F1hEkLLpido
// 2. Category "Cotton / Female"     -> Folder ID: 1oYvJU4aAMUdTEutz9RUC1oRAmzoJ113H
// 3. Category "Kids Collections"    -> Folder ID: 1D85Y_SooARVjcyWmCs6DsMKLlMRCIF_s
//
// 🛠️ DEPLOYMENT INSTRUCTIONS:
// 1. Go to Google Apps Script (https://script.google.com) using your Google account.
// 2. Click "New project" and name it (e.g., "Savi's Collection Google Drive Bridge").
// 3. Delete any default code in Code.gs and paste the code below.
// 4. Click the "Save" (disk) icon.
// 5. Click the blue "Deploy" button at the top right -> Choose "New deployment".
// 6. Click the gear icon next to "Select type" and select "Web app".
// 7. Configure:
//    - Description: "Savi's Collection Drive Bridge"
//    - Execute as: "Me (your-email@gmail.com)" (This gives it permission to write to your Drive)
//    - Who has access: "Anyone" (This allows your React storefront to communicate with it)
// 8. Click "Deploy".
// 9. You will be prompted to "Authorize Access". Click it, select your Google account, 
//    click "Advanced", then click "Go to Savi's Collection Google Drive Bridge (unsafe)" and grant permissions.
// 10. Copy the generated "Web App URL". It looks like:
//     https://script.google.com/macros/s/AKfycby.../exec
// 11. Paste this URL into the `GOOGLE_APPS_SCRIPT_URL` constant inside your:
//     frontend/src/App.jsx (around line 2261)
// =====================================================================================

const DEFAULT_FOLDER_ID = '1w5gw8xvWBzXFBJyv366u3F1hEkLLpido'; // Jewels fallback folder

// Handles image uploads (PUT/POST action)
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const base64Data = data.imageBase64;
    const filename = data.filename || ('image_' + Date.now() + '.png');
    const folderId = data.folderId || DEFAULT_FOLDER_ID; // Dynamically use folder ID sent by frontend!
    
    // Parse mime type and base64 body
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let contentType = 'image/png';
    let base64Body = base64Data;
    
    if (matches && matches.length === 3) {
      contentType = matches[1];
      base64Body = matches[2];
    }
    
    // Decode base64 to binary and save to Drive
    const decoded = Utilities.base64Decode(base64Body);
    const blob = Utilities.newBlob(decoded, contentType, filename);
    
    const folder = DriveApp.getFolderById(folderId);
    const file = folder.createFile(blob);
    
    // Set permission to anyone with link can view (public embedding)
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    const fileId = file.getId();
    const thumbnailUrl = 'https://drive.google.com/thumbnail?id=' + fileId + '&sz=w1000';
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      fileId: fileId,
      url: thumbnailUrl
    }))
    .setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handles listing folder images (GET action)
function doGet(e) {
  try {
    const folderId = (e.parameter && e.parameter.folderId);
    
    if (folderId) {
      const files = getFilesForFolderRaw(folderId);
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        files: files
      }))
      .setMimeType(ContentService.MimeType.JSON);
    } else {
      // Fetch files for all three folders
      const jewels = getFilesForFolderRaw('1w5gw8xvWBzXFBJyv366u3F1hEkLLpido');
      const female = getFilesForFolderRaw('1oYvJU4aAMUdTEutz9RUC1oRAmzoJ113H');
      const kids = getFilesForFolderRaw('1D85Y_SooARVjcyWmCs6DsMKLlMRCIF_s');
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        jewels: jewels,
        female: female,
        kids: kids
      }))
      .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

// Helper to list files from a folder
function getFilesForFolderRaw(folderId) {
  const folder = DriveApp.getFolderById(folderId);
  const files = folder.getFiles();
  const result = [];
  
  while (files.hasNext()) {
    const file = files.next();
    const fileId = file.getId();
    const mime = file.getMimeType();
    
    if (mime.indexOf('image/') === 0) {
      result.push({
        id: fileId,
        name: file.getName(),
        url: 'https://drive.google.com/thumbnail?id=' + fileId + '&sz=w1000',
        webViewLink: file.getUrl()
      });
    }
  }
  return result;
}
