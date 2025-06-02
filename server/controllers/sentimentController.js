// server/controllers/sentimentController.js

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const analyzeSentiment = (req, res) => {
  console.log("Incoming req.body:", req.body);

  const { event_name, feedback_list } = req.body;

  if (!event_name || !Array.isArray(feedback_list)) {
    return res.status(400).json({ error: 'event_name and feedback_list (array) are required' });
  }

  const payload = JSON.stringify({ event_name, feedback_list });

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
        filePath: `/api/sentiment/download/${event_name}` // placeholder for future download route
      });
    } catch (err) {
      console.error('Parse error:', err);
      res.status(500).json({ error: 'Invalid response from Python script' });
    }
  });
};
