import mongoose from 'mongoose';

const caloriesSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  dailyGoal: {
    type: Number,
    default: 2000,
  },
  consumed: {
    type: Number,
    default: 0,
  },
  burnedExercise: {
    type: Number,
    default: 0,
  },
  burnedSteps: {
    type: Number,
    default: 0,
  },
});

// Index to ensure one entry per user per date
caloriesSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model('CalorieLog', caloriesSchema, 'DailyCalories');
