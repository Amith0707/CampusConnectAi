import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  clubName: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  postedAt: {
    type: Date,
    default: Date.now,
  }
});

const Announcement = mongoose.model('Announcement', announcementSchema);
export default Announcement;


/*defines the schema for storing announcements made by club members 
(e.g., “Event on Friday!”). 
It creates a blueprint for how each announcement will be stored in
 MongoDB Atlas*/