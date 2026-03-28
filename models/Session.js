const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
    trim: true
  },
  description: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 500,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  mentorId: {
    type: String,
    required: true
  },
  mentorName: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String,
    required: true
  },
  maxParticipants: {
    type: Number,
    required: true,
    min: 1,
    max: 50,
    default: 10
  },
  participants: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    default: 'open'
  }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
