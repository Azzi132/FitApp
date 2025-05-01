import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CalorieScreen() {
  const [totalCalories, setTotalCalories] = useState(2000);
  const [consumedCalories, setConsumedCalories] = useState(0);
  const [inputCalories, setInputCalories] = useState('');

  const CALORIES_KEY = 'consumedCalories';

  useEffect(() => {
    const loadCalories = async () => {
      try {
        const storedCalories = await AsyncStorage.getItem(CALORIES_KEY);
        if (storedCalories !== null) {
          setConsumedCalories(parseInt(storedCalories, 10));
        }
      } catch (error) {
        console.error('Failed to load calories from storage:', error);
      }
    };

    loadCalories();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(CALORIES_KEY, consumedCalories.toString());
  }, [consumedCalories]);

  const remainingCalories = totalCalories - consumedCalories;

  const handleAddCalories = () => {
    const value = parseInt(inputCalories, 10);
    if (!isNaN(value) && value > 0) {
      setConsumedCalories(consumedCalories + value);
      setInputCalories('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Calorie Tracker</Text>
      <View style={styles.trackerBox}>
        <Text style={styles.label}>
          Total Daily Calories:{' '}
          <Text style={styles.value}>{totalCalories}</Text>
        </Text>
        <Text style={styles.label}>
          Consumed Calories:{' '}
          <Text style={styles.value}>{consumedCalories}</Text>
        </Text>
        <Text style={styles.label}>
          Remaining Calories:{' '}
          <Text style={styles.value}>{remainingCalories}</Text>
        </Text>
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Add calories"
          keyboardType="numeric"
          value={inputCalories}
          onChangeText={setInputCalories}
        />
        <Button title="Add" onPress={handleAddCalories} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  trackerBox: {
    width: '100%',
    marginBottom: 32,
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#f2f2f2',
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  value: {
    fontWeight: 'bold',
    color: '#007AFF',
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
    padding: 10,
    marginRight: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});
