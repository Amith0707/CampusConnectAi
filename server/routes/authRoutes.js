import express from 'express';
import {
  registerParticipant,
  loginParticipant,
  updateParticipantInterests,
  getParticipantById, //  Import the new controller
} from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

//  Register new participant
router.post('/register', registerParticipant);

//  Login participant
router.post('/login', loginParticipant);

//  Protected route example
router.get('/protected', authMiddleware, (req, res) => {
  console.log('Decoded JWT:', req.user);
  res.json({ message: `Hello ${req.user.name}, you are authorized!` });
});

//  Update interests
router.patch('/:id/interests', updateParticipantInterests);

//  Get participant details by ID
router.get('/:id', getParticipantById);

export default router;
