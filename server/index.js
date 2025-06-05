import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './server.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import clubRoutes from './routes/clubRoutes.js';
import clubContentRoutes from './routes/clubContentRoutes.js';
import sentimentRoutes from './routes/sentimentRoutes.js';

import eventRoutes from './routes/events.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// MIDDLEWARE 
app.use(cors());
app.use(express.json()); //ugh??

// adding logs to every incoming requests  - logs every request method and URL
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Incoming request: ${req.method} ${req.url}`);
  next();
});
//  ROUTES 
app.use('/api/auth', authRoutes);               // Auth: signup/login/update
app.use('/api/club', clubRoutes);               // Club details and management
app.use('/api/club-content', clubContentRoutes); // Posters, reels, announcements
app.use('/api/sentiment', sentimentRoutes);     // Feedback sentiment analysis
app.use('/api/events', eventRoutes);
// Serve uploaded static files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

//  Testing routes incase some loading fails in backend :)
app.get('/', (req, res) => {
  res.send(' CampusConnect AI Backend is running!');
});

app.get('/test', (req, res) => {
  res.send(' API is working!');
});

//  START SERVER 
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
