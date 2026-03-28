const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const checkToken = require('../middleware/auth');

router.post('/register', async function(req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const skillsOffered = req.body.skillsOffered;
  const skillsWanted = req.body.skillsWanted;

  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name: name,
    email: email,
    password: hashedPassword,
    skillsOffered: skillsOffered || [],
    skillsWanted: skillsWanted || []
  });

  await newUser.save();

  const token = jwt.sign(
    { id: newUser._id, name: newUser.name, email: newUser.email },
    process.env.JWT_SECRET
  );

  res.status(201).json({
    token: token,
    user: { id: newUser._id, name: newUser.name, email: newUser.email }
  });
});

router.post('/login', async function(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(400).json({ message: 'Email not found' });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(400).json({ message: 'Wrong password' });
  }

  const token = jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET
  );

  res.json({
    token: token,
    user: { id: user._id, name: user.name, email: user.email }
  });
});

router.get('/me', checkToken, async function(req, res) {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

router.put('/me', checkToken, async function(req, res) {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      skillsOffered: req.body.skillsOffered,
      skillsWanted: req.body.skillsWanted
    },
    { new: true }
  ).select('-password');

  res.json(updatedUser);
});

module.exports = router;
