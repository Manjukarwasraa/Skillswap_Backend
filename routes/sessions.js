const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const Booking = require('../models/Booking');
const checkToken = require('../middleware/auth');

router.get('/user/hosted', checkToken, async function(req, res) {
  try {
    var sessions = await Session.find({ mentorId: req.user.id }).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/user/joined', checkToken, async function(req, res) {
  try {
    var approvedBookings = await Booking.find({ learnerId: req.user.id, status: 'approved' });
    var sessionIds = approvedBookings.map(function(b) { return b.sessionId; });
    var sessions = await Session.find({ _id: { $in: sessionIds } });
    res.json(sessions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', async function(req, res) {
  try {
    var filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.search) filter.title = { $regex: req.query.search, $options: 'i' };
    var sessions = await Session.find(filter).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async function(req, res) {
  try {
    var session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', checkToken, async function(req, res) {
  try {
    var newSession = new Session({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      mentorId: req.user.id,
      mentorName: req.user.name,
      date: req.body.date,
      maxParticipants: req.body.maxParticipants || 10,
      participants: [],
      status: 'open'
    });
    await newSession.save();
    res.status(201).json(newSession);
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      var firstError = Object.values(err.errors)[0];
      return res.status(400).json({ message: firstError.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id/complete', checkToken, async function(req, res) {
  try {
    var session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (session.mentorId !== req.user.id) return res.status(403).json({ message: 'Not allowed' });
    session.status = 'completed';
    await session.save();
    res.json({ message: 'Session marked as completed', session: session });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', checkToken, async function(req, res) {
  try {
    var session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (session.mentorId !== req.user.id) return res.status(403).json({ message: 'Not allowed' });
    await session.deleteOne();
    res.json({ message: 'Session deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
