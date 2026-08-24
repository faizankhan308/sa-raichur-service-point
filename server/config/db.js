const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.warn('⚠️ MONGODB_URI is not defined in environment variables.');
    console.warn('⚠️ Server will operate in Offline Mock Mode (using in-memory/JSON storage).');
    return false;
  }

  try {
    // Set connection options
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('🔌 MongoDB Atlas Connected Successfully!');
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️ Server will fall back to Offline Mock Mode.');
    return false;
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
