import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CalorieLog from '../schemas/CaloriesSchema.js';

dotenv.config();

const router = express.Router();
const mongoUrl = process.env.MONGODB_URI;

if (!mongoUrl) {
  console.error('MONGODB_URI is not defined in environment variables');
}

// Connect to MongoDB database
mongoose
  .connect(mongoUrl, {
    dbName: 'FitAppBackend',
  })
  .then(() => console.log('Connected to MongoDB - FitAppBackend'))
  .catch((err) => console.error('MongoDB connection error:', err));

router.get('/:date/:userId', async (req, res) => {
  try {
    const { date, userId } = req.params;
    const parsedDate = new Date(date);
    const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));

    const log = await CalorieLog.findOne({
      userId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    if (!log) {
      return res.status(404).json({ message: 'No data found for this date' });
    }

    res.status(200).json(log);
  } catch (error) {
    console.error('Error fetching calorie log:', error);
    res
      .status(500)
      .json({ message: 'Error fetching calorie log', error: error.message });
  }
});

// Create user calorie log or update existing one
router.post('/:date/:userId', async (req, res) => {
  try {
    const { userId, date } = req.params;
    const { dailyGoal, consumed, burnedExercise, burnedSteps } = req.body;
    const parsedDate = new Date(date);
    const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));

    // Check if a log already exists for the user on a given date
    let existingLog = await CalorieLog.findOne({
      userId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    // Update current data
    const update = {
      userId,
      date: startOfDay,
      dailyGoal: dailyGoal ?? existingLog?.dailyGoal ?? 2000,
      consumed: consumed ?? existingLog?.consumed ?? 0,
      burnedExercise: burnedExercise ?? existingLog?.burnedExercise ?? 0,
      burnedSteps: burnedSteps ?? existingLog?.burnedSteps ?? 0,
    };

    // If document exists, update it; if not, create new one
    const log = await CalorieLog.findOneAndUpdate(
      {
        userId,
        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      },
      { $set: update },
      { new: true, upsert: true }
    );

    res.status(200).json(log);
  } catch (error) {
    console.error('Error updating calorie log:', error);
    res
      .status(500)
      .json({ message: 'Error updating calorie log', error: error.message });
  }
});

export default router;
