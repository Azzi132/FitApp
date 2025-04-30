import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WorkoutScreen from './screens/WorkoutScreen';
import GoalScreen from './screens/GoalScreen';
import CalorieScreen from './screens/CalorieScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Workout" component={WorkoutScreen} />
        <Tab.Screen name="Goal" component={GoalScreen} />
        <Tab.Screen name="Calorie" component={CalorieScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
