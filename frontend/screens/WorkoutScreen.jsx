import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  getCurrentDay,
  getCurrentDate,
  getLocalDate,
  formatDateForAPI,
  startOfDay,
} from '../utils/dateUtils';
import CircularProgress from '../components/CircularProgress';
import WeekDaySelector from '../components/WeekDaySelector';
import WorkoutTypeSelector from '../components/WorkoutTypeSelector';
import { loadGoalsAndWorkouts } from '../handlers/workoutHandlers';

export default function WorkoutScreen() {
  const [selectedType, setSelectedType] = useState('power'); // Current workout type (power, cardio, steps)
  const [workoutDuration, setWorkoutDuration] = useState(''); // Duration/steps input value
  const [selectedDay, setSelectedDay] = useState(getCurrentDay()); // Selected day of the week
  const [selectedDate, setSelectedDate] = useState(getCurrentDate()); // Full date for selected day
  const [inputTitle, setInputTitle] = useState('How long was your workout?'); // Dynamic input label
  const [inputPlaceholder, setInputPlaceholder] = useState(
    'Enter duration in minutes'
  ); // Dynamic input placeholder
  const [workoutStats, setWorkoutStats] = useState({}); // Stores workout statistics for each day
  const [userId, setUserId] = useState(null); // Current user's ID
  const [goals, setGoals] = useState({
    cardio: 0,
    power: 0,
    steps: 0,
  }); // User's goals for each workout type

  // Update selected date when day changes
  useEffect(() => {
    setSelectedDate(getCurrentDate(selectedDay));
  }, [selectedDay]);

  // Load user's goals and workout data on loading screen
  useEffect(() => {
    const startDate = startOfDay();
    startDate.setDate(startDate.getDate() - startDate.getDay());
    loadGoalsAndWorkouts(startDate, setWorkoutStats, setUserId, setGoals);
  }, [selectedDay]);

  // Calculate progress
  const calculateProgress = (completed = 0, goal = 1) => {
    if (!goal) return 0; // Return 0 if goal is 0 to avoid division by zero
    return Math.min(Math.round((completed / goal) * 100), 100);
  };

  // Handle adding new workout data
  const addWorkout = async () => {
    if (!workoutDuration || isNaN(workoutDuration) || !userId) return;

    // Process and validate workout data
    const duration = parseInt(workoutDuration);
    const currentStats = { ...workoutStats[selectedDay] };

    try {
      // Calculate the correct date for the workout
      const selectedDate = getLocalDate();
      const currentDay = getCurrentDay();
      const daysDiff =
        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(selectedDay) -
        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(currentDay);

      selectedDate.setDate(selectedDate.getDate() + daysDiff);
      selectedDate.setHours(0, 0, 0, 0);

      const existingDayStats = workoutStats[selectedDay] || {
        cardio: { goal: 0 },
        power: { goal: 0 },
        steps: { goal: 0 },
      };

      // Add the new duration to the existing value
      const newValue =
        (existingDayStats[selectedType]?.completed || 0) + duration;

      // Prepare workout data for API
      const workoutData = {
        dailyCardioGoal: existingDayStats.cardio.goal,
        dailyPowerGoal: existingDayStats.power.goal,
        dailyStepGoal: existingDayStats.steps.goal,
        [selectedType]: newValue, // Send the sum of existing and new value
      };

      // Calculate calories burned based on workout type
      let burnedExercise = 0;
      let burnedSteps = 0;

      if (selectedType === 'cardio') {
        burnedExercise = duration * 7; // 7 calories per minute for cardio
      } else if (selectedType === 'power') {
        burnedExercise = duration * 5; // 5 calories per minute for power
      } else if (selectedType === 'steps') {
        burnedSteps = duration * 0.05; // 0.05 calories per step
      }

      // Save workout data to backend
      const workoutResponse = await fetch(
        `http://10.0.2.2:3000/workouts/${userId}/${formatDateForAPI(
          selectedDate
        )}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ workoutData }),
        }
      );

      // Update calories data in backend
      const calorieResponse = await fetch(
        `http://10.0.2.2:3000/calories/${formatDateForAPI(
          selectedDate
        )}/${userId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            burnedExercise: burnedExercise || undefined,
            burnedSteps: burnedSteps || undefined,
          }),
        }
      );

      // Update local state if API calls successful
      if (workoutResponse.ok && calorieResponse.ok) {
        setWorkoutStats((prev) => ({
          ...prev,
          [selectedDay]: {
            ...prev[selectedDay],
            [selectedType]: {
              completed: newValue, // Update with the sum
              goal: prev[selectedDay][selectedType].goal,
            },
          },
        }));
        setWorkoutDuration('');
      }
    } catch (error) {
      console.error('Error saving workout:', error);
    }
  };

  // Update input fields based on selected workout type
  useEffect(() => {
    if (selectedType === 'steps') {
      setInputTitle('How many steps did you walk today?');
      setInputPlaceholder('Enter steps walked');
    } else {
      setInputTitle('How long was your workout?');
      setInputPlaceholder('Enter duration in minutes');
    }
  }, [selectedType]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workouts for {selectedDate}</Text>
      <View style={styles.progressContainer}>
        <View style={styles.progressWrapper}>
          <CircularProgress
            value={calculateProgress(
              workoutStats[selectedDay]?.cardio?.completed ?? 0,
              workoutStats[selectedDay]?.cardio?.goal ?? 0
            )}
            maxValue={100}
            size={100}
            strokeWidth={8}
            showPercentage={true}
            textSize={24}
            labelFormat="percentage"
            reversePercentage={true}
          />
          <Text style={styles.progressLabel}>Cardio</Text>
          <Text style={styles.goalText}>
            Goal: {workoutStats[selectedDay]?.cardio?.completed ?? 0}/
            {workoutStats[selectedDay]?.cardio?.goal ?? 0} min
          </Text>
        </View>
        <View style={styles.progressWrapper}>
          <CircularProgress
            value={calculateProgress(
              workoutStats[selectedDay]?.power?.completed ?? 0,
              workoutStats[selectedDay]?.power?.goal ?? 0
            )}
            maxValue={100}
            size={100}
            strokeWidth={8}
            showPercentage={true}
            textSize={24}
            labelFormat="percentage"
            reversePercentage={true}
          />
          <Text style={styles.progressLabel}>Power</Text>
          <Text style={styles.goalText}>
            Goal: {workoutStats[selectedDay]?.power?.completed ?? 0}/
            {workoutStats[selectedDay]?.power?.goal ?? 0} min
          </Text>
        </View>
        <View style={styles.progressWrapper}>
          <CircularProgress
            value={calculateProgress(
              workoutStats[selectedDay]?.steps?.completed ?? 0,
              workoutStats[selectedDay]?.steps?.goal ?? 0
            )}
            maxValue={100}
            size={100}
            strokeWidth={8}
            showPercentage={true}
            textSize={24}
            labelFormat="percentage"
            reversePercentage={true}
          />
          <Text style={styles.progressLabel}>Steps</Text>
          <Text style={styles.goalText}>
            Goal: {workoutStats[selectedDay]?.steps?.completed ?? 0}/
            {workoutStats[selectedDay]?.steps?.goal ?? 0} steps
          </Text>
        </View>
      </View>
      <WeekDaySelector
        selectedDay={selectedDay}
        onDaySelect={(day) => {
          setSelectedDay(day);
          loadGoalsAndWorkouts();
        }}
      />
      <Text style={styles.sectionTitle}>{inputTitle}</Text>
      <View style={styles.durationContainer}>
        <TextInput
          style={styles.durationInput}
          value={workoutDuration}
          onChangeText={setWorkoutDuration}
          placeholder={inputPlaceholder}
          keyboardType="numeric"
          maxLength={selectedType === 'steps' ? 6 : 4}
        />
      </View>
      <Text style={styles.sectionTitle}>Workout Type</Text>
      <WorkoutTypeSelector
        selectedType={selectedType}
        onTypeSelect={setSelectedType}
      />
      <TouchableOpacity style={styles.addButton} onPress={addWorkout}>
        <MaterialCommunityIcons name="plus" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginTop: 60,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 30,
    paddingHorizontal: 10,
  },
  progressWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
  },
  progressLabel: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
  goalText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  typeButton: {
    flex: 1,
    backgroundColor: '#f0f3ff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  selectedType: {
    backgroundColor: '#ff6b6b',
  },
  typeText: {
    marginTop: 5,
    color: '#8e9aaf',
    fontSize: 12,
  },
  selectedTypeText: {
    color: '#fff',
  },
  durationContainer: {
    marginBottom: 30,
  },
  durationInput: {
    backgroundColor: '#f0f3ff',
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#4a6ee0',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  weekDayContainer: {
    alignItems: 'center',
    padding: 5,
  },
  weekDay: {
    width: 20,
    height: 30,
    backgroundColor: '#ffffff33',
    borderRadius: 3,
  },
  selectedDay: {
    backgroundColor: '#ff6b6b',
    transform: [{ scale: 1.1 }],
  },
  selectedDayText: {
    fontWeight: 'bold',
  },
  weekDayText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#ff6b6b',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
