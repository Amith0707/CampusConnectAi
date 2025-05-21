import express from 'express';
import { registerParticipant, loginParticipant } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Participant Registration
router.post('/register', registerParticipant);

// Participant Login
router.post('/login', loginParticipant);

router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: `Hello ${req.user.email}, you are authorized!` });
});

export default router;
