import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const router = express.Router();
const SALT_ROUNDS = 10;

const url = process.env.MONGODB_URI;
if (!url) {
  console.error('MONGODB_URI is not defined in environment variables');
}
const dbName = 'FitAppBackend';

router.get('/', async (req, res) => {
  try {
    const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const users = await db.collection('Users').find({}).toArray();

    await client.close();
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching users', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  let client;
  try {
    const { username, password } = req.body;
    client = await MongoClient.connect(url);
    const db = client.db(dbName);

    const user = await db.collection('Users').findOne({
      username: username.toLowerCase(),
    });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // Don't send password back to client
      const { password: _, ...userWithoutPassword } = user;
      res.status(200).json({ success: true, user: userWithoutPassword });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Database error' });
  } finally {
    if (client) await client.close();
  }
});

router.post('/register', async (req, res) => {
  let client;
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required',
      });
    }

    client = await MongoClient.connect(url);
    const db = client.db(dbName);

    const existingUser = await db.collection('Users').findOne({
      username: username.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    await db.collection('Users').insertOne({
      username: username.toLowerCase(),
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
    });
  } finally {
    if (client) await client.close();
  }
});

export default router;
