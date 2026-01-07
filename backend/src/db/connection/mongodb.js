const { MongoClient } = require('mongodb');
require('dotenv').config();

let db = null;
let client = null;

const connectDB = async () => {
  try {
    if (db) {
      console.log('MongoDB already connected');
      return db;
    }

    const mongoURI = process.env.MONGODB_URL;
    const dbName = process.env.DB_NAME || 'invento';

    if (!mongoURI) {
      throw new Error('MONGODB_URL is not defined in environment variables');
    }

    client = new MongoClient(mongoURI);
    await client.connect();
    
    db = client.db(dbName);
    
    console.log(`MongoDB Connected successfully to database: ${dbName}`);
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db;
};

const closeDB = async () => {
  if (client) {
    await client.close();
    db = null;
    client = null;
    console.log('MongoDB connection closed');
  }
};

module.exports = { connectDB, getDB, closeDB };
