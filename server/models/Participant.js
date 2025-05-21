import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department:{type:String},
  interests: [{type:String}], // For personalized recommendations
});

const Participant = mongoose.model('Participant', participantSchema);

export default Participant;
