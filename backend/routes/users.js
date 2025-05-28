import express from 'express';
import bcrypt from 'bcrypt';
import { getMongoClient, dbName } from '../database/database.js';

const router = express.Router();

// Used for hashing passwords (data security)
const SALT = 10;

// Process user login
router.post('/login', async (req, res) => {
  let client;

  try {
    const { username, password } = req.body;

    // Connect to database
    client = await getMongoClient();
    const db = client.db(dbName);

    // Search for user in database
    const user = await db.collection('Users').findOne({
      username: username.toLowerCase(),
    });

    // If user doesn't exist, return error
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });
    }

    // Compare provided password with stored hash
    const passwordMatch = await bcrypt.compare(password, user.password);

    // If password matches, return user data without also returning the password
    if (passwordMatch) {
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

// Process new user registrations
router.post('/register', async (req, res) => {
  let client;
  try {
    // Get username and password that user entered
    const { username, password } = req.body;

    // Make sure both username and password have been provided
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required!',
      });
    }

    // Connect to MongoDB
    client = await getMongoClient();
    const db = client.db(dbName);

    // Check if username already exists
    const existingUser = await db.collection('Users').findOne({
      username: username.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists',
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT);

    // Create the user in the database
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
