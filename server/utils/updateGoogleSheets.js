import { google } from "googleapis";
import path from "path";

// Utility to extract Google Sheet ID from link
function extractSheetId(sheetUrl) {
  const match = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}

export async function updateGoogleSheet(sheetUrl, usn, status) {
  const sheetId = extractSheetId(sheetUrl);
  if (!sheetId) throw new Error("Invalid Google Sheet URL");

  const auth = new google.auth.GoogleAuth({
    keyFile: path.resolve("credentials.json"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],//??????????
  });

  const sheets = google.sheets({ version: "v4", auth: await auth.getClient() });

  // Get the first sheet name
  const sheetMeta = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
  const sheetName = sheetMeta.data.sheets[0].properties.title;

  // Get the data to find the row
  const readRange = `${sheetName}!A1:Z1000`; // Adjust if needed
  const result = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: readRange,
  });

  const rows = result.data.values;
  if (!rows || rows.length === 0) throw new Error("Sheet is empty");

  const header = rows[0];
  const usnCol = header.findIndex(col => /usn/i.test(col));
  if (usnCol === -1) throw new Error("USN column not found");

  // Find row index matching USN
  const rowIndex = rows.findIndex((row, i) => i > 0 && row[usnCol]?.toLowerCase() === usn.toLowerCase());
  if (rowIndex === -1) throw new Error("USN not found in sheet");

  // Get or create 'ocr_verification' column
  let statusCol = header.findIndex(col => /ocr.?verification/i.test(col));
  if (statusCol === -1) {
    // Add new column if not present
    statusCol = header.length;
    rows[0].push("ocr_verification");
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${sheetName}!A1:Z1`,
      valueInputOption: "RAW",
      requestBody: { values: [rows[0]] },
    });
  }

  // Update status in correct row/column
  const cell = `${String.fromCharCode(65 + statusCol)}${rowIndex + 1}`;
  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: `${sheetName}!${cell}`,
    valueInputOption: "RAW",
    requestBody: { values: [[status]] },
  });

  console.log(` Sheet updated for USN ${usn} at ${cell}: ${status}`);
}
