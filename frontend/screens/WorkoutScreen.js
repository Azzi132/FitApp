import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WorkoutScreen() {
  const [workouts, setWorkouts] = useState([]);
  const [name, setName] = useState('');
  const [reps, setReps] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const data = await AsyncStorage.getItem('workouts');
        if (data) setWorkouts(JSON.parse(data));
      } catch (e) {}
    };
    loadWorkouts();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('workouts', JSON.stringify(workouts));
  }, [workouts]);

  const addWorkout = () => {
    if (!name || !reps || !time) return;
    setWorkouts([...workouts, { id: Date.now().toString(), name, reps, time }]);
    setName('');
    setReps('');
    setTime('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Workout Tracker</Text>
      <TextInput
        style={styles.input}
        placeholder="Workout Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Reps"
        value={reps}
        onChangeText={setReps}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Workout Time (min)"
        value={time}
        onChangeText={setTime}
        keyboardType="numeric"
      />
      <Button title="Add Workout" onPress={addWorkout} />
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.workoutItem}>
            <Text style={styles.workoutText}>
              {item.name} - {item.reps} reps - {item.time} min
            </Text>
          </View>
        )}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
  },
  workoutItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  workoutText: {
    fontSize: 16,
  },
  list: {
    marginTop: 16,
  },
});
