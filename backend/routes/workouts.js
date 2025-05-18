import express from 'express';
import mongoose from 'mongoose';
import Workout from '../schemas/WorkoutSchema.js';

const router = express.Router();

// Default values for a new workout document
const getDefaultWorkout = (userId, date) => ({
  userId,
  date,
  cardio: 0,
  power: 0,
  steps: 0,
  dailyCardioGoal: 0,
  dailyPowerGoal: 0,
  dailyStepGoal: 0,
});

// Get or create workout data for the current week
router.get('/:userId/:startDate', async (req, res) => {
  const { userId, startDate } = req.params;
  const currentWorkoutWeek = [];

  // Set startDate based on req and ensure it starts/ends at the beginning/end of the day in GMT+2
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 7); // 7 days for a week

  try {
    // Fetch existing workouts for current user within the current week
    const workouts = await Workout.find({
      userId,
      date: { $gte: start, $lt: end },
    });

    for (let x = new Date(start); x < end; x.setDate(x.getDate() + 1)) {
      const currentDate = new Date(x);

      // Check if workout exists for current day
      const existingWorkout = workouts.find(
        (w) => w.date.toDateString() === currentDate.toDateString()
      );

      // If there is a workout add it, if not create one with default values
      if (existingWorkout) {
        currentWorkoutWeek.push(existingWorkout);
      } else {
        currentWorkoutWeek.push(
          getDefaultWorkout(userId, new Date(currentDate))
        );
      }
    }

    res.status(200).json(currentWorkoutWeek);
  } catch (error) {
    res.status(500).json({
      message: 'Error getting workouts from database',
      error: error.message,
    });
  }
});

// Update workout data for a specific day
router.post('/:userId/:date', async (req, res) => {
  const { userId, date } = req.params;
  const { workoutData } = req.body;

  // Set day clock to beginning of the day to avoid issues with DB updates
  const parsedDate = new Date(date);
  parsedDate.setHours(0, 0, 0, 0);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find existing workout or create a new one with default values
    let workout = await Workout.findOneAndUpdate(
      { userId, date: parsedDate },
      { $setOnInsert: getDefaultWorkout(userId, parsedDate) },
      {
        upsert: true, // Create a new document if it doesn't exist
        new: true, // Return the updated document
        session, // associate with this mongoDB session
      }
    );

    // Only include fields that are defined in the request
    const updateData = {};
    const validFields = [
      'cardio',
      'power',
      'steps',
      'dailyCardioGoal',
      'dailyPowerGoal',
      'dailyStepGoal',
    ];

    validFields.forEach((field) => {
      if (workoutData[field] !== undefined) {
        updateData[field] = workoutData[field];
      }
    });

    // Update workout data if there are fields to update
    if (Object.keys(updateData).length > 0) {
      workout = await Workout.findOneAndUpdate(
        { userId, date: parsedDate },
        { $set: updateData },
        { new: true, session }
      );
    }

    // Commit and end session
    await session.commitTransaction();

    res.status(200).json(workout);
  } catch (error) {
    // Rollback if error
    await session.abortTransaction();
    res
      .status(500)
      .json({ message: 'Error updating workout', error: error.message });
  } finally {
    session.endSession();
  }
});

export default router;
