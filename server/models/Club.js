import mongoose from 'mongoose';

const clubSchema = new mongoose.Schema({
  clubName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  description: String,
  department: String,
});

const Club = mongoose.model('Club', clubSchema);

export default Club;
