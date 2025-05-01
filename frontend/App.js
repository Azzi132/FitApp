import React from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LoginScreen from "./screens/LoginScreen";
import WorkoutScreen from "./screens/WorkoutScreen";
import GoalScreen from "./screens/GoalScreen";
import CalorieScreen from "./screens/CalorieScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab navigator for main screens
function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Calorie"
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Calorie" component={CalorieScreen} />
      <Tab.Screen name="Workout" component={WorkoutScreen} />
      <Tab.Screen name="Goal" component={GoalScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
