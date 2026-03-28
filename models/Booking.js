const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true
  },
  sessionTitle: {
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
  learnerId: {
    type: String,
    required: true
  },
  learnerName: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
