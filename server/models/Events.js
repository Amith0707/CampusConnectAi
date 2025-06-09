import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  clubName: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  interests: {
    type: [String],
    required: true,
    validate: [arr => arr.length > 0, 'At least one interest is required'],
  },
  freeOrPaid: {
    type: String,
    enum: ['free', 'paid'],
    required: true,
  },
  postedAt: {
    type: Date,
    default: Date.now,
  },
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
