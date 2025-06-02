// server/routes/clubContentRoutes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import { postAnnouncement, postMedia } from '../controllers/clubController.js';
import authClubMiddleware from '../middleware/authClubMiddleware.js';

const router = express.Router();

//  Configure Multer for file storage in 'uploads' directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); //  Folder must exist at project root
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });

//  Route for posting an announcement
router.post('/announcement', authClubMiddleware, postAnnouncement);

// Route for uploading media (poster or reel)
router.post('/media', authClubMiddleware, upload.single('media'), postMedia);

export default router;
