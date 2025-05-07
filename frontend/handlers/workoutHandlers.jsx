import { getUserData } from './authHandlers';

// Creates an empty stats object with default values for each day of the week
export const getDefaultStats = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const stats = {};
  days.forEach((day) => {
    stats[day] = {
      cardio: { completed: 0, goal: 0 },
      power: { completed: 0, goal: 0 },
      steps: { completed: 0, goal: 0 },
    };
  });
  return stats;
};

// Fetches workout data and goals for a given week starting from startDate
export const loadGoalsAndWorkouts = async (
  startDate,
  setWorkoutStats,
  setUserId,
  setGoals
) => {
  // Get current user data
  const userData = await getUserData();
  if (!userData || !userData._id) return;
  setUserId(userData._id);

  try {
    // Fetch workout data from the backend for the specified user and date
    const response = await fetch(
      `http://10.0.2.2:3000/workouts/${userData._id}/${startDate.toISOString()}`
    );

    // If fetch fails, set empty default stats
    if (!response.ok) {
      setWorkoutStats(getDefaultStats());
      return;
    }

    const workouts = await response.json();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const initialStats = getDefaultStats();

    // Process each workout and update the stats accordingly
    workouts.forEach((workout) => {
      const workoutDate = new Date(workout.date);
      const day = days[workoutDate.getDay()];
      if (day) {
        // Update goals if they exist in the workout data
        if (
          workout.dailyCardioGoal ||
          workout.dailyPowerGoal ||
          workout.dailyStepGoal
        ) {
          setGoals({
            cardio: workout.dailyCardioGoal || 0,
            power: workout.dailyPowerGoal || 0,
            steps: workout.dailyStepGoal || 0,
          });
        }

        // Update the stats for the specific day with completed workouts and goals
        initialStats[day] = {
          cardio: {
            completed: workout.cardio || 0,
            goal: workout.dailyCardioGoal || 0,
          },
          power: {
            completed: workout.power || 0,
            goal: workout.dailyPowerGoal || 0,
          },
          steps: {
            completed: workout.steps || 0,
            goal: workout.dailyStepGoal || 0,
          },
        };
      }
    });

    setWorkoutStats(initialStats);
  } catch (error) {
    console.error('Error loading workout data:', error);
    setWorkoutStats(getDefaultStats());
  }
};
