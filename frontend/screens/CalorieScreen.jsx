import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native';
import CircularProgress from '../components/CircularProgress';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getUserData } from '../handlers/authHandlers';
import {
  handleAddCalories,
  handleRemoveCalories,
} from '../handlers/calorieHandlers';
import StatItem from '../components/StatItem';
import { getLocalDate, formatDateForAPI } from '../utils/dateUtils';

export default function CalorieScreen() {
  // Variables for UI and user interaction
  const [userId, setUserId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getLocalDate());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Variables for calorie tracking data from MongoDB
  const [totalDailyGoal, setTotalDailyGoal] = useState(2000);
  const [consumedCalories, setConsumedCalories] = useState(0);
  const [burnedExercise, setBurnedExercise] = useState(0);
  const [burnedSteps, setBurnedSteps] = useState(0);

  // Variables for input
  const [addCalories, setAddCalories] = useState('');
  const [removeCalories, setRemoveCalories] = useState('');

  // Load user data and calorie info
  useEffect(() => {
    const loadDataAndUser = async () => {
      const userData = await getUserData();
      if (!userData || !userData._id) return;
      setUserId(userData._id);

      try {
        // Fetch calorie data for selected date
        const dateStr = formatDateForAPI(selectedDate);
        const response = await fetch(
          `http://10.0.2.2:3000/calories/${dateStr}/${userData._id}`
        );

        // If no data exists for this date do default values
        if (response.status === 404) {
          setConsumedCalories(0);
          setBurnedExercise(0);
          setBurnedSteps(0);
          setTotalDailyGoal(2000);
          return;
        }

        // Update with fetched data
        const data = await response.json();
        if (response.ok && data) {
          setTotalDailyGoal(data.dailyGoal || 2000);
          setConsumedCalories(data.consumed || 0);
          setBurnedExercise(data.burnedExercise || 0);
          setBurnedSteps(data.burnedSteps || 0);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    loadDataAndUser();
  }, [selectedDate]);

  // Save calorie data to backend
  const saveCalorieData = async (updates) => {
    if (!userId) return false;

    const dateStr = formatDateForAPI(selectedDate);
    try {
      const response = await fetch(
        `http://10.0.2.2:3000/calories/${dateStr}/${userId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates), // Only send what is updated
        }
      );

      if (!response.ok) {
        console.error('Failed to save calorie data:', await response.text());
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving calorie data:', error);
      return false;
    }
  };

  // Calculate calories burned and remaining
  const caloriesBurnedFromSteps = Math.round(burnedSteps * 0.04) || 0; // Convert steps to calories (approximate)
  const totalCaloriesBurned = caloriesBurnedFromSteps + Math.round(burnedSteps);

  const remainingCalories = Math.max(
    0,
    totalDailyGoal - consumedCalories + totalCaloriesBurned
  );

  const onAddCalories = () =>
    handleAddCalories(
      addCalories,
      consumedCalories,
      saveCalorieData,
      setConsumedCalories,
      setAddCalories
    );

  const onRemoveCalories = () =>
    handleRemoveCalories(
      removeCalories,
      consumedCalories,
      saveCalorieData,
      setConsumedCalories,
      setRemoveCalories
    );

  // Handler for date picker changes
  const onDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date && date <= getLocalDate()) {
      setSelectedDate(date);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text style={[styles.dateText, styles.clickableText]}>
            {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={onDateChange}
            maximumDate={new Date()}
          />
        )}
        <CircularProgress
          value={remainingCalories}
          maxValue={totalDailyGoal}
          labelFormat="remaining"
        />
        <View style={styles.statsContainer}>
          <Text style={styles.breakdownText}>
            Here's a breakdown of your daily calorie distribution.
          </Text>
          <StatItem icon="🎯" label="Daily Goal" value={totalDailyGoal} />
          <StatItem icon="🍽️" label="Food" value={consumedCalories} />
          <StatItem icon="🏋️" label="Exercise" value={`-${burnedExercise}`} />
          <StatItem
            icon="👣"
            label="Steps"
            value={`-${Math.round(burnedSteps)}`}
          />
        </View>
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Add calories"
          value={addCalories}
          onChangeText={setAddCalories}
          keyboardType="number-pad"
        />
        <Button title="Add" onPress={onAddCalories} />
      </View>
      <View style={[styles.inputRow, { marginTop: 10 }]}>
        <TextInput
          style={styles.input}
          placeholder="Remove calories"
          value={removeCalories}
          onChangeText={setRemoveCalories}
          keyboardType="number-pad"
        />
        <Button title="Remove" onPress={onRemoveCalories} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginBottom: 15,
  },
  statsContainer: {
    width: '100%',
    marginTop: 20,
  },
  breakdownText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
    fontSize: 20,
    backgroundColor: '#fff',
    height: 50,
    color: '#000',
  },
  clickableText: {
    textDecorationLine: 'underline',
  },
});
