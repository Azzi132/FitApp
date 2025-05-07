import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const url = process.env.MONGODB_URI;

const dbName = 'FitAppBackend';

if (!url) {
  console.error('MONGODB_URI is missing in .env');
}

// Connect to mongoDB (used for schema, updates, deletes etc.)
export const connectMongoose = async () => {
  try {
    await mongoose.connect(url, {
      dbName: 'FitAppBackend',
    });
    console.log('Connected to MongoDB - FitAppBackend (Mongoose)');
  } catch (error) {
    console.error('MongoDB Mongoose connection error:', error);
    throw error;
  }
};

// Connect to mongoDB (Direct)
export const getMongoClient = async () => {
  try {
    const client = await MongoClient.connect(url);
    return client;
  } catch (error) {
    console.error('Could not connect to mongoDB:', error);
    throw error;
  }
};

export { url, dbName };
