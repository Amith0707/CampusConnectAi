/*This handles login/signup*/

import Participant from '../models/participant.js';
import bcrypt from 'bcryptjs';
/*Adding JWT Token For securing connection when useres come into my website*/
import jwt from 'jsonwebtoken';

// Signup controller basically for sign in it is 
export const registerParticipant = async (req, res) => {
  const { name, email, password,department,interests } = req.body;

  try {
    // Check if user already exists
    const existingUser = await Participant.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new participant
    const newParticipant = new Participant({
      name,
      email,
      password: hashedPassword,
      department,
      interests
    });

    await newParticipant.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

// Login controller basically for login
export const loginParticipant = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Participant.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email ,name:user.name }, 
      process.env.JWT_SECRET,
      { expiresIn:'7d'}
    );

    // If login successful, respond with user info (later add JWT here)
    res.status(200).json({ message: 'Login successful',token, userId: user._id, name: user.name });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};
