import Participant from '../models/participant.js';
import Event from '../models/Events.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ✅ Register Participant
export const registerParticipant = async (req, res) => {
  const { name, email, password, department, interests } = req.body;
  console.log('[registerParticipant] 📥 Request body:', req.body);

  try {
    const existingUser = await Participant.findOne({ email });
    if (existingUser) {
      console.log(`[registerParticipant] ⚠️ Email already registered: ${email}`);
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newParticipant = new Participant({
      name,
      email,
      password: hashedPassword,
      department,
      interests,
    });

    await newParticipant.save();
    console.log('[registerParticipant] ✅ New participant saved:', newParticipant._id);

    res.status(201).json({
      message: 'User registered successfully',
      _id: newParticipant._id,
      name,
      email,
      department,
      interests,
    });
  } catch (error) {
    console.error('[registerParticipant] ❌ Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

// ✅ Login Participant + Recommended Events
export const loginParticipant = async (req, res) => {
  const { email, password } = req.body;
  console.log('[loginParticipant] 📥 Request body:', req.body);

  try {
    const user = await Participant.findOne({ email });
    if (!user) {
      console.log('[loginParticipant] ❌ User not found');
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('[loginParticipant] ❌ Password mismatch');
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    console.log('[loginParticipant] 🔐 JWT created');

    // Fetch & recommend events
    const recommendedEvents = await getRecommendedEvents(user);
    res.status(200).json({
      message: 'Login successful',
      token,
      userId: user._id,
      name: user.name,
      interests: user.interests || [],
      department: user.department,
      recommendedEvents,
    });
  } catch (error) {
    console.error('[loginParticipant] ❌ Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// ✅ Update Interests
export const updateParticipantInterests = async (req, res) => {
  const { id } = req.params;
  const { interests } = req.body;
  console.log(`[updateParticipantInterests] 🛠️ User ${id} →`, interests);

  try {
    const updatedUser = await Participant.findByIdAndUpdate(
      id,
      { interests },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Participant not found' });
    }

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
    console.error('[updateParticipantInterests] ❌ Error:', error);
    res.status(500).json({ message: 'Server error during interest update' });
  }
};

// ✅ Get Participant + Events
export const getParticipantById = async (req, res) => {
  try {
    const user = await Participant.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Participant not found' });
    }

    const recommendedEvents = await getRecommendedEvents(user);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      department: user.department,
      interests: user.interests || [],
      recommendedEvents,
    });
  } catch (error) {
    console.error('[getParticipantById]  Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

//  Shared Event Recommender Function for tracing i have added this
const getRecommendedEvents = async (user) => {
  const participantInterests = (user.interests || []).map(i => i.toLowerCase());

  try {
    const allEvents = await Event.find({ isRegistrationOpen: true });
    console.log(`[EventMatch] 🧠 Total open events: ${allEvents.length}`);

    const withMatchCount = allEvents.map(event => {
      const matchCount = event.interests.filter(tag =>
        participantInterests.includes(tag.toLowerCase())
      ).length;
      return { event, matchCount };
    });

    withMatchCount.sort((a, b) => b.matchCount - a.matchCount);

    withMatchCount.forEach(({ event, matchCount }) => {
      console.log(`→ ${event.title} (${event.clubName}) — ${matchCount} match(es)`);
    });

    return withMatchCount.map(e => e.event);
  } catch (err) {
    console.error('[EventMatch] ⚠️ Error fetching events:', err);
    return [];
  }
};

