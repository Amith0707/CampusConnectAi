import Participant from '../models/participant.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerParticipant = async (req, res) => {
  const { name, email, password, department, interests } = req.body;
  console.log('[registerParticipant] Request body:', req.body);

  try {
    const existingUser = await Participant.findOne({ email });
    if (existingUser) {
      console.log(`[registerParticipant] Email already registered: ${email}`);
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('[registerParticipant] Password hashed');

    const newParticipant = new Participant({
      name,
      email,
      password: hashedPassword,
      department,
      interests,
    });

    await newParticipant.save();
    console.log('[registerParticipant] New participant saved:', newParticipant._id);

    res.status(201).json({
      message: 'User registered successfully',
      _id: newParticipant._id,
      name: newParticipant.name,
      email: newParticipant.email,
      department: newParticipant.department,
      interests: newParticipant.interests || [],
    });
  } catch (error) {
    console.error('[registerParticipant] Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

export const loginParticipant = async (req, res) => {
  const { email, password } = req.body;
  console.log('[loginParticipant] Request body:', req.body);

  try {
    const user = await Participant.findOne({ email });
    if (!user) {
      console.log(`[loginParticipant] User not found: ${email}`);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('[loginParticipant] Password mismatch');
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    console.log('[loginParticipant] JWT token created');

    res.status(200).json({
      message: 'Login successful',
      token,
      userId: user._id,
      name: user.name,
      interests: user.interests || [],
      department: user.department,
    });
  } catch (error) {
    console.error('[loginParticipant] Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const updateParticipantInterests = async (req, res) => {
  const { id } = req.params;
  const { interests } = req.body;
  console.log(`[updateParticipantInterests] Update request for user: ${id} with interests:`, interests);

  try {
    const updatedUser = await Participant.findByIdAndUpdate(
      id,
      { interests },
      { new: true }
    );

    if (!updatedUser) {
      console.log(`[updateParticipantInterests] Participant not found: ${id}`);
      return res.status(404).json({ message: 'Participant not found' });
    }

    console.log(`[updateParticipantInterests] Interests updated for user: ${id}`);

    res.status(200).json({
      message: 'Interests updated successfully',
      participant: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        interests: updatedUser.interests,
      },
    });
  } catch (error) {
    console.error('[updateParticipantInterests] Error updating interests:', error);
    res.status(500).json({ message: 'Server error during interest update' });
  }
};


/*connecting to dashboard from loading*/
// GET: Fetch participant by ID
export const getParticipantById = async (req, res) => {
  try {
    const user = await Participant.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Participant not found' });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      department: user.department,
      interests: user.interests || [],
    });
  } catch (error) {
    console.error('Error fetching participant:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
