// server/models/Media.js
import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
  clubName: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  fileType: {
    type: String, // image or video
    enum: ['image', 'video'],
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  }
});

// module.exports = mongoose.model('Media', mediaSchema);
const Media = mongoose.model('Media', mediaSchema);
export default Media;
/*
This file defines the schema for storing media files (images or videos) 
uploaded by club members.*/