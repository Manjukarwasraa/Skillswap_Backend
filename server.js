require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
// const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const sessionRoutes = require('./routes/sessions');
const reviewRoutes = require('./routes/reviews');
const bookingRoutes = require('./routes/bookings');


mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Database connected");
}).catch((err) => console.log(err));

// https://github.com/Manjukarwasraa/Skillswap_Backend.git

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/bookings', bookingRoutes);

io.on('connection', function(socket) {
  socket.on('join_room', function(roomId) {
    socket.join(roomId);
  });

  socket.on('send_message', function(data) {
    io.to(data.roomId).emit('receive_message', data);
  });
});

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT)
});
