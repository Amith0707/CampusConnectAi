import express from 'express';
import { loginClubMember} from '../controllers/clubController.js';
import authClubMiddleware from '../middleware/authClubMiddleware.js';

const router = express.Router();
//sedding the data (temporary for now)
// router.post('/register', registerClubMember);

// Club member login
router.post('/login', loginClubMember);

// Protected test route
router.get('/protected', authClubMiddleware, (req, res) => {
  res.json({ message: `Welcome ${req.club.usn} to ${req.club.clubName} dashboard!` });
});

export default router;
