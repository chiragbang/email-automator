import mongoose from 'mongoose';

const UserProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    unique: true,
  },
  fullName: String,
  location: String,
  skills: [String],
  totalExperience: String,
  linkedinUrl: String,
  githubUrl: String,
  resumeUrl: String
});

export default mongoose.models.UserProfile || mongoose.model('UserProfile', UserProfileSchema);
