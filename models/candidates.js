const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  jobTitle: { type: String, required: true, trim: true },
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Hired'],
    default: 'Pending'
  },
  resumeUrl: { type: String }, // public URL path to resume (optional)
}, {
  timestamps: true
});

module.exports = mongoose.model('Candidate', CandidateSchema);
