const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Session = require('../models/Session');
const Booking = require('../models/Booking');
const checkToken = require('../middleware/auth');

router.post('/', checkToken, async function(req, res) {
  try {
    var sessionId = req.body.sessionId;
    var rating = req.body.rating;
    var feedback = req.body.feedback;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    var session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.status !== 'completed') {
      return res.status(400).json({ message: 'You can only review a completed session' });
    }

    // Check learner was approved for this session
    var booking = await Booking.findOne({ sessionId: sessionId, learnerId: req.user.id, status: 'approved' });
    if (!booking) {
      return res.status(403).json({ message: 'Only approved learners can review this session' });
    }

    var alreadyReviewed = await Review.findOne({ sessionId: sessionId, studentId: req.user.id });
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this session' });
    }

    var newReview = new Review({
      sessionId: sessionId,
      mentorId: session.mentorId,
      studentId: req.user.id,
      studentName: req.user.name,
      rating: rating,
      feedback: feedback || ''
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    console.error('Review error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/session/:sessionId', async function(req, res) {
  try {
    var reviews = await Review.find({ sessionId: req.params.sessionId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
