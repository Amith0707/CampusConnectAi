import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './server.js';

import authRoutes from './routes/authRoutes.js';
import clubRoutes from './routes/clubRoutes.js';
import clubContentRoutes from './routes/clubContentRoutes.js';
import sentimentRoutes from './routes/sentimentRoutes.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

//  Register middleware BEFORE routes
app.use(cors());
app.use(express.json()); // Important: this must come before routes

//  Routes
app.use('/api/sentiment', sentimentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/club', clubRoutes);
app.use('/api/club-content', clubContentRoutes);

// Static files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

//  Test routes
app.get('/', (req, res) => {
  res.send('CampusConnect AI Backend is running!');
});

app.get('/test', (req, res) => {
  res.send('API is working!');
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
