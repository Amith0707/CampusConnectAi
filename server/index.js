import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './server.js';

import authRoutes from './routes/authRoutes.js';  // import routes
import clubRoutes from './routes/clubRoutes.js';
import clubContentRoutes from './routes/clubContentRoutes.js';

import path from 'path';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Use auth routes with prefix /api/auth (can be changed)
app.use('/api/auth', authRoutes);
app.use('/api/club', clubRoutes);
app.use('/api/club-content', clubContentRoutes);// added annonucemtn route

app.get('/', (req, res) => {
  res.send('CampusConnect AI Backend is running!');
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/test", (req, res) => {
  res.send("API is working!");
});

// Serve static files from uploads/
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));