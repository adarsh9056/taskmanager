const mongoose = require('mongoose');

const connectDB = async () => {
  mongoose.set('strictQuery', true);

  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000
  });

  if (process.env.NODE_ENV !== 'test') {
    console.log('MongoDB connected');
  }
};

module.exports = connectDB;
