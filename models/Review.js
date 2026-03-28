const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true
  },
  mentorId: {
    type: String,
    required: true
  },
  studentId: {
    type: String,
    required: true
  },
  studentName: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  feedback: {
    type: String,
    maxlength: 300,
    trim: true,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
