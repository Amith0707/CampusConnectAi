import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
  // Basic identity details
  name: { type: String, required: true },

  // Login credentials
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Academic info
  department: { type: String },

  // Interests for recommendations
  interests: {
    type: [String],
    default: []
  },

  // Followed clubs for tracking engagement and personalization
  followedclubs: {
    type: [String],
    default: []
  },
  usn: {
    type: String,
    required: true,
    unique: true, // Assuming every participant's USN is unique
    uppercase: true, // to automatically store as uppercase
    match: /^[1-9][A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{3}$/ // basic pattern
  },
  participatedEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
}, {
  timestamps: true // adds createdAt and updatedAt automatically
});

// Optionally log every time a participant is saved (useful in dev)
participantSchema.post('save', function (doc) {
  console.log(` New participant registered: ${doc.email}`);
});

const Participant = mongoose.model('Participant', participantSchema);

export default Participant;
