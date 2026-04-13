const mongoose = require('mongoose');

let _mongod = null;

const connectDB = async () => {
  // If a real MONGO_URI is provided, use it directly
  if (process.env.MONGO_URI && !process.env.MONGO_URI.includes('localhost')) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`[SUCCESS] MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(`[ERROR] MongoDB Connection Error: ${error.message}`);
      process.exit(1);
    }
  }

  // Development fallback: use in-memory MongoDB
  if (process.env.NODE_ENV !== 'production') {
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      console.log('[INFO] No real MONGO_URI found — starting in-memory MongoDB for development...');
      _mongod = await MongoMemoryServer.create();
      const uri = _mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`[SUCCESS] In-Memory MongoDB started and connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(`[ERROR] In-Memory MongoDB Error: ${error.message}`);
      process.exit(1);
    }
  }

  // Production: no URI is fatal
  console.error('[ERROR] Error: MONGO_URI is not defined in environment variables.');
  process.exit(1);
};

module.exports = connectDB;
