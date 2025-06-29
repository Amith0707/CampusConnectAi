import { google } from "googleapis";
import path from "path";
import Participant from "../models/participant.js";
import Event from "../models/Events.js";
import { logParticipation } from "./logParticipation.js";

export async function readSheetAndLogParticipants(eventTitle, sheetId) {
  console.log(`Reading sheet for free event: ${eventTitle}`);

  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join("credentials.json"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "A1:Z1000", // Adjust depending on form layout
    });

    const rows = res.data.values;
    if (!rows || rows.length === 0) {
      console.warn("Sheet is empty or inaccessible.");
      return;
    }

    const headers = rows[0].map(h => h.toLowerCase());
    const usnIndex = headers.findIndex(h => h.includes("usn"));

    if (usnIndex === -1) {
      console.warn(" USN column not found in sheet.");
      return;
    }

    const event = await Event.findOne({ title: eventTitle });
    if (!event) {
      console.warn(" Event not found in DB.");
      return;
    }

    let successCount = 0;

    for (let i = 1; i < rows.length; i++) {
      const usn = rows[i][usnIndex]?.trim().toUpperCase();
      if (!usn) continue;

      const participant = await Participant.findOne({ usn });
      if (!participant) continue;

      await logParticipation(usn, eventTitle);
      successCount++;
    }

    console.log(` Logged ${successCount} participants for free event: ${eventTitle}`);
  } catch (err) {
    console.error(" Error reading Google Sheet:", err.message);
  }
}
