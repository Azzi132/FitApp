import { isValidNumber } from '../utils/validation';

// Handle add calories to daily goal
export const handleAddCalories = async (
  addCalories,
  consumedCalories,
  saveCalorieData,
  setConsumedCalories,
  setAddCalories
) => {
  const value = parseInt(addCalories, 10);
  if (isValidNumber(value)) {
    const newTotal = consumedCalories + value;
    const success = await saveCalorieData({ consumed: newTotal });
    if (success) {
      setConsumedCalories(newTotal);
      setAddCalories('');
    }
  }
};

// Handle calorie substraction from daily goal
export const handleRemoveCalories = async (
  removeCalories,
  consumedCalories,
  saveCalorieData,
  setConsumedCalories,
  setRemoveCalories
) => {
  const value = parseInt(removeCalories, 10);
  if (isValidNumber(value)) {
    const newTotal = Math.max(0, consumedCalories - value);
    const success = await saveCalorieData({ consumed: newTotal });
    if (success) {
      setConsumedCalories(newTotal);
      setRemoveCalories('');
    }
  }
};

// Handle update of daily goal
export const handleGoalUpdate = async (
  tempGoal,
  saveCalorieData,
  setTotalDailyGoal,
  setTempGoal,
  setIsGoalModalVisible
) => {
  const value = parseInt(tempGoal, 10);
  if (isValidNumber(value)) {
    const success = await saveCalorieData({ dailyGoal: value });
    if (success) {
      setTotalDailyGoal(value);
      setTempGoal('');
      setIsGoalModalVisible(false);
    }
  }
};
