import React, { useEffect } from 'react';
import { StyleSheet, Button, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { clearUserData } from './utils/auth';
import LoginScreen from './screens/LoginScreen';
import WorkoutScreen from './screens/WorkoutScreen';
import GoalScreen from './screens/GoalScreen';
import CalorieScreen from './screens/CalorieScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import MainScreen from './screens/MainScreen';
import ChatScreen from './screens/ChatScreen';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    clearUserData();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={({ navigation, route }) => ({
          headerShown: true,
          headerRight: () => {
            if (route.name !== 'Login' && route.name !== 'Registration') {
              return (
                <View style={{ marginRight: 16 }}>
                  <Button
                    onPress={async () => {
                      await clearUserData();
                      navigation.reset({
                        index: 0,
                        routes: [{ name: 'Login' }],
                      });
                    }}
                    title="Logout"
                    color="#FF0000"
                  />
                </View>
              );
            }
            return null;
          },
        })}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Workout" component={WorkoutScreen} />
        <Stack.Screen name="Goal" component={GoalScreen} />
        <Stack.Screen name="Calorie" component={CalorieScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Navigator>
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
