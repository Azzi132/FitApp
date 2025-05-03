import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const url = process.env.MONGODB_URI;
const dbName = 'FitAppBackend';

if (!url) {
  console.error('MONGODB_URI is not defined in environment variables');
}

router.get('/', async (req, res) => {
  let client;
  try {
    client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const goals = await db.collection('Goals').find({}).toArray();
    res.status(200).json(goals);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching goals', error: error.message });
  } finally {
    if (client) await client.close();
  }
});

export default router;
