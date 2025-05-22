import mongoose from 'mongoose';

const clubMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  usn: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  clubName: { type: String, required: true }, // e.g., TEDx, CSI, etc.
  role: { type: String, default: "member" } // Optional: For future role-based control
});

const ClubMember = mongoose.model('ClubMember', clubMemberSchema);

export default ClubMember;

