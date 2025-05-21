import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Club from '../models/Club.js';

const router = express.Router();

// Club Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const club = await Club.findOne({ username });
    if (!club) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, club.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: club._id }, process.env.JWT_SECRET);
    res.json({ token, club: { id: club._id, name: club.name, username: club.username } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
