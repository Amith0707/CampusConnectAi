import express from "express";
import multer from "multer";
import fs from "fs";
import { execFile } from "child_process";
import Event from "../models/Events.js";
import { updateGoogleSheet } from "../utils/updateGoogleSheets.js";

const router = express.Router();

// Multer setup for handling uploaded files
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("receipt"), async (req, res) => {
  console.log("Incoming receipt verification request");

  const { eventId } = req.body;
  const receiptPath = req.file?.path;

  if (!eventId || !receiptPath) {
    console.warn("Missing eventId or receipt file");
    return res.status(400).json({ message: "Event ID and receipt file are required." });
  }

  try {
    console.log("Fetching event from database...");
    const event = await Event.findById(eventId);

    if (!event || event.freeOrPaid !== "paid") {
      console.warn("Invalid or unpaid event");
      return res.status(400).json({ message: "Invalid or unpaid event." });
    }

    const expectedAmount = parseInt(event.entryFee);
    const sheetLink = event.googleSheetLink;

    if (!sheetLink) {
      console.warn("Missing Google Sheet link for this event");
      return res.status(400).json({ message: "Google Sheet link not available for this event." });
    }

    console.log("Running OCR on:", receiptPath);

    execFile("python", ["utils/receipt_ocr.py", receiptPath], async (err, stdout, stderr) => {
      // Clean up uploaded file
      fs.unlink(receiptPath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Failed to delete temp file:", unlinkErr.message);
        }
      });

      if (err) {
        console.error("OCR script failed:", stderr);
        return res.status(500).json({ message: "OCR failed", error: stderr });
      }

      console.log("OCR result:", stdout);

      let ocrResult;
      try {
        ocrResult = JSON.parse(stdout);
      } catch (parseErr) {
        console.error("Failed to parse OCR output:", parseErr.message);
        return res.status(500).json({ message: "Invalid OCR output format." });
      }

      const { usn, amountFound } = ocrResult;

      if (!usn || typeof amountFound !== "number") {
        console.error("Incomplete OCR result:", ocrResult);
        return res.status(400).json({ message: "OCR did not extract required information." });
      }

      const isValid = amountFound === expectedAmount;
      console.log(`Expected: ${expectedAmount}, Found: ${amountFound}, Match: ${isValid}`);

      try {
        console.log("Updating Google Sheet...");
        await updateGoogleSheet(sheetLink, usn, isValid ? "Verified" : "Invalid");
        console.log("Google Sheet updated successfully");

        return res.status(200).json({
          message: isValid ? "Receipt verified successfully" : "Invalid receipt amount",
          usn,
          status: isValid ? "Verified" : "Invalid"
        });
      } catch (sheetErr) {
        console.error("Failed to update Google Sheet:", sheetErr.message);
        return res.status(500).json({ message: "Failed to update Google Sheet", error: sheetErr.message });
      }
    });

  } catch (err) {
    console.error("Server error:", err.message);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
