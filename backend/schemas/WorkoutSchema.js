import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    cardio: {
      type: Number,
      default: 0,
    },
    dailyCardioGoal: {
      type: Number,
      default: 0,
    },
    power: {
      type: Number,
      default: 0,
    },
    dailyPowerGoal: {
      type: Number,
      default: 0,
    },
    steps: {
      type: Number,
      default: 0,
    },
    dailyStepGoal: {
      type: Number,
      default: 0,
    },
  },
  { versionKey: false }
);

// Ensure only one entry per user per date
workoutSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model('Workout', workoutSchema, 'WorkoutData');
