import express from "express";
import { execFile } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const router = express.Router();

// Resolve __dirname since you're using ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.post("/", (req, res) => {
  const { branches, interests } = req.body;

  if (!branches || !interests) {
    return res.status(400).json({ message: "branches and interests are required" });
  }

  const input = { branches, interests };

  // ✅ Correct relative path
  const scriptPath = path.join(__dirname, "..", "utils", "predict_participation.py");

  execFile("python", [scriptPath, JSON.stringify(input)], (err, stdout, stderr) => {
    if (err) {
      console.error("Prediction script failed:", stderr);
      return res.status(500).json({ message: "Prediction failed", error: stderr });
    }

    try {
      const result = JSON.parse(stdout);
      return res.status(200).json(result);
    } catch (e) {
      return res.status(500).json({ message: "Failed to parse Python output", error: e.message });
    }
  });
});

export default router;
