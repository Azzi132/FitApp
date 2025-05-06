import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
  Modal,
} from "react-native";
import CircularProgress from "../components/CircularProgress";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getUserData } from "../utils/auth";
import { isValidNumber } from "../utils/validation";
import {
  handleAddCalories,
  handleRemoveCalories,
  handleGoalUpdate,
} from "../utils/calorieHandlers";

export default function CalorieScreen() {
  // Frontend data
  const [userId, setUserId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isGoalModalVisible, setIsGoalModalVisible] = useState(false);

  // Mongodb data
  const [totalDailyGoal, setTotalDailyGoal] = useState(2000);
  const [consumedCalories, setConsumedCalories] = useState(0);
  const [burnedExercise, setBurnedExercise] = useState(0);
  const [burnedSteps, setBurnedSteps] = useState(0);

  // User input data
  const [addCalories, setAddCalories] = useState("");
  const [removeCalories, setRemoveCalories] = useState("");
  const [tempGoal, setTempGoal] = useState("");

  useEffect(() => {
    const loadDataAndUser = async () => {
      const userData = await getUserData();
      if (!userData || !userData._id) return;
      const currentUserId = userData._id;
      setUserId(currentUserId);

      try {
        const dateStr = selectedDate.toISOString().split("T")[0];
        const response = await fetch(
          `http://10.0.2.2:3000/calories/${dateStr}/${currentUserId}`
        );
        if (response.status === 404) {
          // No data exists for this date, set defaults without creating DB entry
          setTotalDailyGoal(2000);
          setConsumedCalories(0);
          setBurnedExercise(0);
          setBurnedSteps(0);
          return;
        }
        const data = await response.json();
        if (response.ok && data) {
          setTotalDailyGoal(
            isValidNumber(data.dailyGoal) ? data.dailyGoal : 2000
          );
          setConsumedCalories(isValidNumber(data.consumed) ? data.consumed : 0);
          setBurnedExercise(
            isValidNumber(data.burnedExercise) ? data.burnedExercise : 0
          );
          setBurnedSteps(
            isValidNumber(data.burnedSteps) ? data.burnedSteps : 0
          );
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };

    loadDataAndUser();
  }, [selectedDate]);

  const saveCalorieData = async (updates) => {
    if (!userId) return false;

    const dateStr = selectedDate.toISOString().split("T")[0];
    try {
      const response = await fetch(
        `http://10.0.2.2:3000/calories/${dateStr}/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dailyGoal: totalDailyGoal,
            consumed: consumedCalories,
            burnedExercise: burnedExercise,
            burnedSteps: burnedSteps,
            ...updates,
          }),
        }
      );

      if (!response.ok) {
        console.error("Failed to save calorie data:", await response.text());
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error saving calorie data:", error);
      return false;
    }
  };

  // Calculate total calories burned and remaining calories
  const caloriesBurnedFromSteps = Math.round(burnedSteps * 0.04) || 0;
  const totalCaloriesBurned = caloriesBurnedFromSteps + burnedExercise;
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

  const onGoalUpdate = () =>
    handleGoalUpdate(
      tempGoal,
      saveCalorieData,
      setTotalDailyGoal,
      setTempGoal,
      setIsGoalModalVisible
    );

  const onDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date && date <= new Date()) {
      setSelectedDate(date);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text style={[styles.dateText, styles.clickableText]}>
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
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
        <TouchableOpacity onPress={() => setIsGoalModalVisible(true)}>
          <CircularProgress
            value={remainingCalories}
            maxValue={totalDailyGoal}
          />
        </TouchableOpacity>
        <View style={styles.statsContainer}>
          <Text style={styles.breakdownText}>
            Here's a breakdown of your daily calorie distribution.
          </Text>
          <View style={styles.statItem}>
            <View style={styles.iconTextContainer}>
              <Text style={[styles.statLabel, styles.foodIcon]}>🎯</Text>
              <Text style={styles.statLabel}>Daily Goal</Text>
            </View>
            <Text style={styles.statValue}>{totalDailyGoal}</Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.iconTextContainer}>
              <Text style={[styles.statLabel, styles.foodIcon]}>🍽️</Text>
              <Text style={styles.statLabel}>Food</Text>
            </View>
            <Text style={styles.statValue}>{consumedCalories}</Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.iconTextContainer}>
              <Text style={styles.statLabel}>🏃</Text>
              <Text style={styles.statLabel}>Exercise</Text>
            </View>
            <Text style={styles.statValue}>{burnedExercise}</Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.iconTextContainer}>
              <Text style={styles.statLabel}>👣</Text>
              <Text style={styles.statLabel}>Steps</Text>
            </View>
            <Text style={styles.statValue}>{caloriesBurnedFromSteps}</Text>
          </View>
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={isGoalModalVisible}
        onRequestClose={() => setIsGoalModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Daily Goal</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter new goal"
              value={tempGoal}
              onChangeText={setTempGoal}
              keyboardType="number-pad"
            />
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => setIsGoalModalVisible(false)}
              />
              <Button title="Update" onPress={onGoalUpdate} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  progressContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
    marginBottom: 15,
  },
  statsContainer: {
    width: "100%",
    marginTop: 20,
  },
  statItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  statLabel: {
    fontSize: 16,
    color: "#666",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  iconTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
    padding: 12,
    marginRight: 10,
    fontSize: 20,
    backgroundColor: "#fff",
    height: 50,
    color: "#000",
  },
  clickableText: {
    textDecorationLine: "underline",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  breakdownText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 5,
  },
});
