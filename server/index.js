import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './server.js'; // MongoDB connection function

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('CampusConnect AI Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
