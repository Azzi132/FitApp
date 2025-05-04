import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

export default function GoalScreen() {
  const [stepGoal, setStepGoal] = useState('');
  const [savedStepGoal, setSavedStepGoal] = useState('');

  const [calorieGoal, setCalorieGoal] = useState('');
  const [savedCalorieGoal, setSavedCalorieGoal] = useState('');

  const [runningGoal, setRunningGoal] = useState('');
  const [savedRunningGoal, setSavedRunningGoal] = useState('');

  const [currentSteps, setCurrentSteps] = useState(2500);
  const [currentCalories, setCurrentCalories] = useState(1000);
  const [currentRunning, setCurrentRunning] = useState(3.5);

  useEffect(() => {
    loadStepGoal();
  }, []);

  const loadStepGoal = async () => {
    try {
      const value = await AsyncStorage.getItem('@step_goal');
      if (value !== null) {
        setSavedStepGoal(value);
      }

      const calorieValue = await AsyncStorage.getItem('@calorie_goal');
      if (calorieValue !== null) {
        setSavedCalorieGoal(calorieValue);
      }

      const runningValue = await AsyncStorage.getItem('@running_goal');
      if (runningValue !== null) {
        setSavedRunningGoal(runningValue);
      }
    } catch (error) {
      console.error('Error loading step goal:', error);
    }
  };

  const saveStepGoal = async () => {
    try {
      await AsyncStorage.setItem('@step_goal', stepGoal);
      await AsyncStorage.setItem('@calorie_goal', calorieGoal);
      await AsyncStorage.setItem('@running_goal', runningGoal);
      setSavedStepGoal(stepGoal);
      setSavedCalorieGoal(calorieGoal);
      setSavedRunningGoal(runningGoal);
      setStepGoal('');
      setCalorieGoal('');
      setRunningGoal('');
    } catch (error) {
      console.error('Error saving goals', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <Text style={styles.header}>Daily Goals</Text>

            <View style={styles.section}>
              <Text style={styles.subheader}>Steps</Text>
              <TextInput
                style={styles.input}
                placeholder="Set daily step goal (e.g. 10000)"
                keyboardType="numeric"
                value={stepGoal}
                onChangeText={setStepGoal}
              />
              {savedStepGoal !== '' && (
                <View style={styles.progressContainer}>
                  <Text style={styles.progressLabel}>
                    {currentSteps} / {savedStepGoal}
                  </Text>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${Math.min(
                            (currentSteps / savedStepGoal) * 100,
                            100
                          )}%`,
                        },
                      ]}
                    />
                  </View>
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.subheader}>Calories</Text>
              <TextInput
                style={styles.input}
                placeholder="Set calorie goal (e.g. 500)"
                keyboardType="numeric"
                value={calorieGoal}
                onChangeText={setCalorieGoal}
              />
              {savedCalorieGoal !== '' && (
                <View style={styles.progressContainer}>
                  <Text style={styles.progressLabel}>
                    {currentCalories} / {savedCalorieGoal} kcal
                  </Text>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${Math.min(
                            (currentCalories / savedCalorieGoal) * 100,
                            100
                          )}%`,
                        },
                      ]}
                    />
                  </View>
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.subheader}>Running</Text>
              <TextInput
                style={styles.input}
                placeholder="Set running goal in km (e.g. 5)"
                keyboardType="numeric"
                value={runningGoal}
                onChangeText={setRunningGoal}
              />
              {savedRunningGoal !== '' && (
                <View style={styles.progressContainer}>
                  <Text style={styles.progressLabel}>
                    {currentRunning} / {savedRunningGoal} km
                  </Text>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${Math.min(
                            (currentRunning / savedRunningGoal) * 100,
                            100
                          )}%`,
                        },
                      ]}
                    />
                  </View>
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={saveStepGoal}>
              <Text style={styles.saveButtonText}>Save Goals</Text>
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
    paddingTop: 40,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subheader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  progressContainer: {
    marginTop: 12,
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
