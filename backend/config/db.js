const mongoose = require('mongoose');

async function connectDB() {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    throw new Error('MONGO_URI is missing in environment variables.');
  }

  await mongoose
    .connect(mongoURI)
    .then(() => {
      // eslint-disable-next-line no-console
      console.log('MongoDB connected');
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('MongoDB connection failed:', error.message);
      throw error;
    });
}

module.exports = connectDB;
