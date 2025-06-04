import express from 'express';
import { registerParticipant, loginParticipant } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Participant Registration
router.post('/register', registerParticipant);

// Participant Login
router.post('/login', loginParticipant);

router.get('/protected', authMiddleware, (req, res) => {
  console.log('Decoded JWT:', req.user);
  res.json({ message: `Hello ${req.user.name}, you are authorized!` });
});

export default router;
