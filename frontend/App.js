import React from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LoginScreen from "./screens/LoginScreen";
import MainScreen from "./screens/MainScreen";
import WorkoutScreen from "./screens/WorkoutScreen";
import GoalScreen from "./screens/GoalScreen";
import CalorieScreen from "./screens/CalorieScreen";
import ChatScreen from "./screens/ChatScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab navigator for main screens
function MainTabsGoal() {
  return (
    <Tab.Navigator
      initialRouteName="Goal"
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Goal" component={GoalScreen} />
      <Tab.Screen name="Workout" component={WorkoutScreen} />
      <Tab.Screen name="Calorie" component={CalorieScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
    </Tab.Navigator>
  );
}

function MainTabsWorkout() {
  return (
    <Tab.Navigator
      initialRouteName="Workout"
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Goal" component={GoalScreen} />
      <Tab.Screen name="Workout" component={WorkoutScreen} />
      <Tab.Screen name="Calorie" component={CalorieScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
    </Tab.Navigator>
  );
}

function MainTabsCalorie() {
  return (
    <Tab.Navigator
      initialRouteName="Calorie"
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Goal" component={GoalScreen} />
      <Tab.Screen name="Workout" component={WorkoutScreen} />
      <Tab.Screen name="Calorie" component={CalorieScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
    </Tab.Navigator>
  );
}

function MainTabsChat() {
  return (
    <Tab.Navigator
      initialRouteName="Chat"
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Goal" component={GoalScreen} />
      <Tab.Screen name="Workout" component={WorkoutScreen} />
      <Tab.Screen name="Calorie" component={CalorieScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainScreen"
          component={MainScreen}
          options={{ title: "Main Menu" }}
        />
        <Stack.Screen
          name="TabsGoal"
          component={MainTabsGoal}
          options={{ title: "Fit App" }}
        />
        <Stack.Screen
          name="TabsWorkout"
          component={MainTabsWorkout}
          options={{ title: "Fit App" }}
        />
        <Stack.Screen
          name="TabsCalorie"
          component={MainTabsCalorie}
          options={{ title: "Fit App" }}
        />
        <Stack.Screen
          name="TabsChat"
          component={MainTabsChat}
          options={{ title: "Fit App" }}
        />
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
