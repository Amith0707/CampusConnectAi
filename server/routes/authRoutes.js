import express from 'express';
import { registerParticipant, loginParticipant } from '../controllers/authController.js';

const router = express.Router();

// Participant Registration
router.post('/register', registerParticipant);

// Participant Login
router.post('/login', loginParticipant);

export default router;
