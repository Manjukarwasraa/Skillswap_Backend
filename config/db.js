const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.log('MongoDB connection failed');
    console.log(error.message);
    process.exit(1);
  }

  
}

module.exports = connectDB;
