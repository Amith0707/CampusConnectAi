// models/Events.js
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
    validate: {
      validator: arr => arr.length > 0,
      message: 'At least one interest is required',
    },
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
  isRegistrationOpen: {
    type: Boolean,
    default: false,
  },
  entryFee: {
    type: Number,
    default: 0,
  },
  googleFormLink: {
    type: String,
    required: true,
  },
  googleSheetLink: {
  type: String,
  required: true,
  },
});

const Event = mongoose.model('Event', eventSchema);
export default Event;
