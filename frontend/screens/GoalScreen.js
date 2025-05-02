import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";

export default function GoalScreen() {
  const [stepGoal, setStepGoal] = useState("");
  const [savedStepGoal, setSavedStepGoal] = useState("");

  const [calorieGoal, setCalorieGoal] = useState("");
  const [savedCalorieGoal, setSavedCalorieGoal] = useState("");

  const [runningGoal, setRunningGoal] = useState("");
  const [savedRunningGoal, setSavedRunningGoal] = useState("");

  const [currentSteps, setCurrentSteps] = useState(2500);
  const [currentCalories, setCurrentCalories] = useState(1000);
  const [currentRunning, setCurrentRunning] = useState(3.5);

  useEffect(() => {
    loadStepGoal();
  }, []);

  const loadStepGoal = async () => {
    try {
      const value = await AsyncStorage.getItem("@step_goal");
      if (value !== null) {
        setSavedStepGoal(value);
      }

      const calorieValue = await AsyncStorage.getItem("@calorie_goal");
      if (calorieValue !== null) {
        setSavedCalorieGoal(calorieValue);
      }

      const runningValue = await AsyncStorage.getItem("@running_goal");
      if (runningValue !== null) {
        setSavedRunningGoal(runningValue);
      }
    } catch (error) {
      console.error("Error loading step goal:", error);
    }
  };

  const saveStepGoal = async () => {
    try {
      await AsyncStorage.setItem("@step_goal", stepGoal);
      await AsyncStorage.setItem("@calorie_goal", calorieGoal);
      await AsyncStorage.setItem("@running_goal", runningGoal);
      setSavedStepGoal(stepGoal);
      setSavedCalorieGoal(calorieGoal);
      setSavedRunningGoal(runningGoal);
      setStepGoal("");
      setCalorieGoal("");
      setRunningGoal("");
    } catch (error) {
      console.error("Error saving goals", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <Text style={styles.header}>Set your Daily Goals</Text>
          <Text style={styles.subheader}>Set Your Step Goal</Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. 10000"
            keyboardType="numeric"
            value={stepGoal}
            onChangeText={setStepGoal}
          />

          <Text style={styles.subheader}>Set Your Calorie Goal</Text>
          <TextInput
            style={styles.input}
            placeholder="Calories to burn (e.g. 500)"
            keyboardType="numeric"
            value={calorieGoal}
            onChangeText={setCalorieGoal}
          />

          <Text style={styles.subheader}>Set Your Running Goal</Text>
          <TextInput
            style={styles.input}
            placeholder="ex. 5"
            keyboardType="numeric"
            value={runningGoal}
            onChangeText={setRunningGoal}
          />

          <Button title="Save Goals" onPress={saveStepGoal} />

          {savedStepGoal !== "" && (
            <>
              <Text style={styles.saved}>
                Saved Step Goal: {savedStepGoal} Steps
              </Text>
              <Text style={styles.progress}>
                Progress: {currentSteps} / {savedStepGoal || 0} Steps
              </Text>
            </>
          )}

          {savedCalorieGoal !== "" && (
            <>
              <Text style={styles.saved}>
                Saved Calorie Goal: {savedCalorieGoal} Kcal
              </Text>
              <Text style={styles.progress}>
                Progress: {currentCalories} / {savedCalorieGoal || 0} Kcal
              </Text>
            </>
          )}

          {savedRunningGoal !== "" && (
            <>
              <Text style={styles.saved}>
                Saved Running Goal: {savedRunningGoal} Km
              </Text>
              <Text style={styles.progress}>
                Progress: {currentRunning} / {savedRunningGoal || 0} Km
              </Text>
            </>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 32,
  },
  trackerBox: {
    width: "100%",
    marginBottom: 32,
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#f2f2f2",
    alignItems: "flex-start",
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  value: {
    fontWeight: "bold",
    color: "#007AFF",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "#fff",
    height: 44,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 20,
  },
  progress: {
    fontSize: 16,
    color: "#555",
    marginTop: 4,
    marginBottom: 10,
  },
});
