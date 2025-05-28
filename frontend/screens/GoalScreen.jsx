import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getUserData } from '../handlers/authHandlers';
import GoalInputCard from '../components/GoalInputCard';

export default function GoalScreen() {
  const [goals, setGoals] = useState({
    calories: '',
    cardio: '',
    power: '',
    steps: '',
  });

  const [savedGoals, setSavedGoals] = useState({
    calories: '',
    cardio: '',
    power: '',
    steps: '',
  });

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const loadUserAndGoals = async () => {
      const userData = await getUserData();
      if (!userData || !userData._id) return;
      setUserId(userData._id);

      try {
        // Set date to start of current day for consistency
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const calorieResponse = await fetch(
          `http://10.0.2.2:3000/calories/${today.toISOString()}/${userData._id}`
        );

        const workoutResponse = await fetch(
          `http://10.0.2.2:3000/workouts/${userData._id}/${today.toISOString()}`
        );

        const calorieData = await calorieResponse.json();
        const workoutData = await workoutResponse.json();

        // Update the saved goals state with fetched data
        setSavedGoals({
          calories: calorieData?.dailyGoal?.toString() || '',
          cardio: workoutData?.cardio?.goal?.toString() || '',
          power: workoutData?.power?.goal?.toString() || '',
          steps: workoutData?.steps?.goal?.toString() || '',
        });
      } catch (error) {
        console.error('Error loading goals:', error);
      }
    };

    loadUserAndGoals();
  }, []); // Run once when component mounts

  // Function to save new goals to the server
  const saveGoals = async () => {
    if (!userId) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
      // Save calorie goal if provided
      if (goals.calories) {
        await fetch(
          `http://10.0.2.2:3000/calories/${today.toISOString()}/${userId}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              dailyGoal: parseInt(goals.calories, 10),
            }),
          }
        );
      }

      // Prepare workout goals object
      const workoutGoals = {
        dailyCardioGoal: goals.cardio ? parseInt(goals.cardio, 10) : undefined,
        dailyPowerGoal: goals.power ? parseInt(goals.power, 10) : undefined,
        dailyStepGoal: goals.steps ? parseInt(goals.steps, 10) : undefined,
      };

      // Save workout goals if any are provided
      if (Object.values(workoutGoals).some((value) => value !== undefined)) {
        await fetch(
          `http://10.0.2.2:3000/workouts/${userId}/${today.toISOString()}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ workoutData: workoutGoals }),
          }
        );
      }

      // Update local state with new saved goals
      setSavedGoals({
        calories: goals.calories || savedGoals.calories,
        cardio: goals.cardio || savedGoals.cardio,
        power: goals.power || savedGoals.power,
        steps: goals.steps || savedGoals.steps,
      });

      // Clear input fields after saving
      setGoals({ calories: '', cardio: '', power: '', steps: '' });
    } catch (error) {
      console.error('Error saving goals:', error);
    }
  };

  // Configuration for goal input fields
  const goalInputs = [
    {
      title: 'Daily Calories',
      key: 'calories',
      unit: 'kcal',
      placeholder: 'Enter calorie goal',
      icon: 'food-apple',
    },
    {
      title: 'Cardio Exercise',
      key: 'cardio',
      unit: 'min',
      placeholder: 'Enter cardio minutes',
      icon: 'run',
    },
    {
      title: 'Power Training',
      key: 'power',
      unit: 'min',
      placeholder: 'Enter training minutes',
      icon: 'dumbbell',
    },
    {
      title: 'Daily Steps',
      key: 'steps',
      unit: 'steps',
      placeholder: 'Enter step goal',
      icon: 'walk',
    },
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <Text style={styles.header}>Set Your Goals</Text>
            {goalInputs.map((input) => (
              <GoalInputCard
                key={input.key}
                title={input.title}
                value={goals[input.key]}
                onChangeText={(value) =>
                  setGoals((prev) => ({ ...prev, [input.key]: value }))
                }
                unit={input.unit}
                placeholder={input.placeholder}
                icon={input.icon}
              />
            ))}
            <TouchableOpacity style={styles.saveButton} onPress={saveGoals}>
              <MaterialCommunityIcons
                name="content-save"
                size={24}
                color="#fff"
              />
              <Text style={styles.saveButtonText}>Save All Goals</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#4a6ee0',
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
});
