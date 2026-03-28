const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Session = require('../models/Session');
const checkToken = require('../middleware/auth');

router.post('/request', checkToken, async function(req, res) {
  try {
    var sessionId = req.body.sessionId;

    var session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    if (session.mentorId === req.user.id) {
      return res.status(400).json({ message: 'You cannot book your own session' });
    }

    if (session.status !== 'open') {
      return res.status(400).json({ message: 'Session is not open for booking' });
    }

    var existing = await Booking.findOne({ sessionId: sessionId, learnerId: req.user.id });
    if (existing) {
      return res.status(400).json({ message: 'You already requested this session' });
    }

    var booking = new Booking({
      sessionId: sessionId,
      sessionTitle: session.title,
      mentorId: session.mentorId,
      mentorName: session.mentorName,
      learnerId: req.user.id,
      learnerName: req.user.name,
      status: 'pending'
    });

    await booking.save();
    res.status(201).json({ message: 'Booking request sent to mentor', booking: booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/my-requests', checkToken, async function(req, res) {
  try {
    var bookings = await Booking.find({ learnerId: req.user.id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/mentor-requests', checkToken, async function(req, res) {
  try {
    var bookings = await Booking.find({ mentorId: req.user.id, status: 'pending' }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id/approve', checkToken, async function(req, res) {
  try {
    var booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.mentorId !== req.user.id) return res.status(403).json({ message: 'Not allowed' });

    booking.status = 'approved';
    await booking.save();

    var session = await Session.findById(booking.sessionId);
    if (session) {
      session.participants.push(booking.learnerId);
      await session.save();
    }

    res.json({ message: 'Booking approved', booking: booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id/reject', checkToken, async function(req, res) {
  try {
    var booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.mentorId !== req.user.id) return res.status(403).json({ message: 'Not allowed' });

    booking.status = 'rejected';
    await booking.save();

    res.json({ message: 'Booking rejected', booking: booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
