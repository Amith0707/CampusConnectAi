// server/controllers/clubController.js
import ClubMember from '../models/clubMember.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import Announcement from '../models/Announcement.js';
import Media from '../models/Media.js';

//  Login club member and generate JWT token
export const loginClubMember = async (req, res) => {
  const { usn, password } = req.body;

  try {
    const clubMember = await ClubMember.findOne({ usn });
    if (!clubMember) {
      return res.status(400).json({ message: 'Invalid USN or password' });
    }

    const isMatch = await bcrypt.compare(password, clubMember.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid USN or password' });
    }

    const token = jwt.sign(
      { clubId: clubMember._id, usn: clubMember.usn },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      clubMember: {
        id: clubMember._id,
        usn: clubMember.usn,
        clubName: clubMember.clubName,
        email: clubMember.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login' });
  }
};

// 📢 POST a new announcement
export const postAnnouncement = async (req, res) => {
  try {
    const { title, content, clubName } = req.body;

    if (!title || !content || !clubName) {
      return res.status(400).json({ message: 'Missing fields in announcement.' });
    }

    const newAnnouncement = new Announcement({
      title,
      content,
      clubName,
    });

    await newAnnouncement.save();
    res.status(201).json({ message: 'Announcement posted successfully' });
  } catch (error) {
    console.error('Error posting announcement:', error);
    res.status(500).json({ message: 'Server error while posting announcement' });
  }
};

//  POST media upload (image or video)
export const postMedia = async (req, res) => {
  try {
    const { clubName } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No media file uploaded.' });
    }

    let fileType;
    if (file.mimetype.startsWith('image/')) {
      fileType = 'image';
    } else if (file.mimetype.startsWith('video/')) {
      fileType = 'video';
    } else {
      return res.status(400).json({ message: 'Unsupported file type.' });
    }

    const mediaUrl = `/uploads/${file.filename}`;

    const newMedia = new Media({
      clubName,
      fileUrl: mediaUrl,
      fileType,
    });

    await newMedia.save();

    res.status(200).json({
      message: 'Media uploaded successfully.',
      mediaUrl,
      fileType,
      clubName,
    });
  } catch (error) {
    console.error('Error uploading media:', error);
    res.status(500).json({ message: 'Server error while uploading media.' });
  }
};
