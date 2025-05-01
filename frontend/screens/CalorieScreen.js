import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CalorieScreen() {
  const [totalCal, setCal] = useState(2000);
  const [usedCal, setUsedCal] = useState(0);
  const [newCal, setNewCal] = useState('');

  useEffect(() => {
    const loadCalories = async () => {
      try {
        const storedCalories = await AsyncStorage.getItem('calories');
        if (storedCalories !== null) {
          setUsedCal(parseInt(storedCalories, 10));
        }
      } catch (error) {
        console.error('Failed to load calories:', error);
      }
    };
    loadCalories();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('calories', usedCal.toString());
  }, [usedCal]);

  const remainingCalories = totalCal - usedCal;

  const handleAddCalories = () => {
    const value = parseInt(newCal, 10);
    if (!isNaN(value) && value > 0) {
      setUsedCal(usedCal + value);
      setNewCal('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Calorie Tracker</Text>
      <View style={styles.trackerBox}>
        <Text style={styles.label}>
          Total Daily Calories: <Text style={styles.value}>{totalCal}</Text>
        </Text>
        <Text style={styles.label}>
          Consumed Calories: <Text style={styles.value}>{usedCal}</Text>
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
          value={newCal}
          onChangeText={setNewCal}
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
