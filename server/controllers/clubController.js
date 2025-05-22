// server/controllers/clubController.js
/*Handles club actions*/
import ClubMember from '../models/clubMember.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
        email: clubMember.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login' });
  }
};
