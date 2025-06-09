import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const analyzeSentiment = (req, res) => {
  console.log("Incoming req.body:", req.body);

  const { event_name } = req.body;

  if (!event_name) {
    return res.status(400).json({ error: 'event_name is required' });
  }

  // Build Excel file path
  const feedbackDir = 'D:/MiniProject/CampusConnectAi/feedback_files';
  const safeEventName = event_name.replace(/\s+/g, '_'); // replace spaces with _
  const fileName = `feedback_${safeEventName}.xlsx`;
  const filePath = path.join(feedbackDir, fileName);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Feedback file not found for event' });
  }

  // Read Excel file
  let feedbackList;
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert sheet to JSON (array of arrays)
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    // Assume feedback is in first column, skip header row
    feedbackList = data.slice(1).map(row => row[0]).filter(f => typeof f === 'string' && f.trim() !== '');

    if (feedbackList.length === 0) {
      return res.status(400).json({ error: 'No feedback data found in file' });
    }
  } catch (err) {
    console.error('Excel read error:', err);
    return res.status(500).json({ error: 'Failed to read feedback file' });
  }

  // Prepare payload for python script
  const payload = JSON.stringify({ event_name, feedback_list: feedbackList });

  const python = spawn('python', [
    path.join(__dirname, '../utils/sentiment.py'),
    payload
  ]);

  let result = '';
  python.stdout.on('data', (data) => {
    result += data.toString();
  });

  python.stderr.on('data', (data) => {
    console.error('Python error:', data.toString());
  });

  python.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: 'Sentiment analysis failed' });
    }
    try {
      const sentimentStats = JSON.parse(result);
      res.json({
        message: 'Sentiment analysis completed',
        event: event_name,
        stats: sentimentStats,
        filePath: `/api/sentiment/download/${event_name}` // placeholder for download route
      });
    } catch (err) {
      console.error('Parse error:', err);
      res.status(500).json({ error: 'Invalid response from Python script' });
    }
  });
};
