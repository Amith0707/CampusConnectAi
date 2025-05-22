import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './server.js';

import authRoutes from './routes/authRoutes.js';  // import routes
import clubRoutes from './routes/clubRoutes.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Use auth routes with prefix /api/auth (can be changed)
app.use('/api/auth', authRoutes);
app.use('/api/club', clubRoutes);

app.get('/', (req, res) => {
  res.send('CampusConnect AI Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
