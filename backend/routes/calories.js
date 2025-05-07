import express from 'express';
import CalorieLog from '../schemas/CaloriesSchema.js';
import { getDayRange } from '../utils/getDateUtil.js';

const router = express.Router();

// Get the users calories data for a specific day
router.get('/:date/:userId', async (req, res) => {
  const { date, userId } = req.params;

  // Get start and end of day range so data is accurate for the current day
  const { start: startOfDay, end: endOfDay } = getDayRange(date);

  // Finds the calorie log for a user on a specific day
  try {
    const log = await CalorieLog.findOne({
      userId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    if (!log) {
      return res.status(404).json({ message: 'No log found for this date' });
    }

    res.status(200).json(log);
  } catch (error) {
    console.error('Something went wrong when fetching calorie log:', error);
    res.status(500).json({
      message: 'Something went wrong when fetching calorie log:',
      error: error.message,
    });
  }
});

// Create user calorie log or update existing one
router.post('/:date/:userId', async (req, res) => {
  const { userId, date } = req.params;
  const { dailyGoal, consumed, burnedExercise, burnedSteps } = req.body;

  // Get start and end of day range so data is accurate for the current day
  const { start: startOfDay, end: endOfDay } = getDayRange(date);

  try {
    // Check if a log already exists on the same day
    let existingLog = await CalorieLog.findOne({
      userId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    // If no log, prepare to update data
    const update = {
      userId,
      date: startOfDay,
      dailyGoal: dailyGoal ?? existingLog?.dailyGoal ?? 2000,
      consumed: consumed ?? existingLog?.consumed ?? 0,
    };

    // Check to see if there are exercise calories to add, if so add them to the update
    if (burnedExercise !== undefined) {
      update.burnedExercise =
        (existingLog?.burnedExercise || 0) + burnedExercise;
    }

    // Check to see if there are step calories to add (from walking), if so add them to update
    if (burnedSteps !== undefined) {
      update.burnedSteps = (existingLog?.burnedSteps || 0) + burnedSteps;
    }

    // Create a new log if none exists for the user on the current day, else update the existing one
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
