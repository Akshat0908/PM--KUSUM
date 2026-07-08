/**
 * PM Kusum Portal — Google Sheets Web App
 * =========================================
 * This Apps Script receives lead POSTs from the PM Kusum website
 * and appends them as new rows to a Google Sheet.
 *
 * DEPLOY INSTRUCTIONS
 * -------------------
 * 1. Open Google Sheets → create a new spreadsheet named "PM Kusum Leads".
 * 2. Rename the first sheet tab to  "Leads".
 * 3. Go to Extensions → Apps Script. Delete the default code.
 * 4. Paste ALL of the code below.
 * 5. (Optional) Change SHEET_NAME below if your tab is named differently.
 * 6. Click "Deploy" → "New deployment" → gear icon → "Web app".
 *      - Description:      PM Kusum Leads Webhook
 *      - Execute as:       Me
 *      - Who has access:   Anyone
 *    Click Deploy → Authorize → Copy the "Web app URL".
 * 7. In the PM Kusum backend  /app/backend/.env  set:
 *      GOOGLE_SHEETS_WEBHOOK_URL="<paste the Web app URL here>"
 *    Then restart the backend:  sudo supervisorctl restart backend
 *
 * That's it — every new lead will now land in the sheet immediately,
 * and if the sheet is unreachable the website will refuse to redirect
 * the buyer to Razorpay.
 */

const SHEET_NAME = "Leads";

// Columns are written left-to-right in exactly this order.
const HEADERS = [
  "Timestamp",
  "Full Name",
  "Mobile Number",
  "WhatsApp Number",
  "Email",
  "State",
  "District",
  "Village",
  "Lead Source",
  "Payment Status"
];

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || "{}");

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }

    // Write header row on first run.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length)
           .setFontWeight("bold")
           .setBackground("#F1F5F9");
      sheet.setFrozenRows(1);
    }

    // Build the row in the exact required order. Defaults enforced here too
    // so that even a partial POST cannot break the schema.
    const row = [
      body["Timestamp"]       || new Date().toISOString(),
      body["Full Name"]       || "",
      body["Mobile Number"]   || body["Phone"] || "",
      body["WhatsApp Number"] || body["WhatsApp"] || "",
      body["Email"]           || "",
      body["State"]           || "",
      body["District"]        || "",
      body["Village"]         || "",
      body["Lead Source"]     || "Instagram Reel",
      body["Payment Status"]  || "Pending"
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: health check when the URL is hit in a browser.
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, service: "PM Kusum Leads Webhook" }))
    .setMimeType(ContentService.MimeType.JSON);
}
