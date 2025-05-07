import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomButton from '../components/CustomButton';

export default function MainScreen({ navigation }) {
  return (
    <View style={styles.container}>
      // Header section containing app title and subtitle
      <View style={styles.header}>
        <Text style={styles.title}>Fit App</Text>
        <Text style={styles.subtitle}>Your Personal Fitness Companion</Text>
      </View>
      <View style={styles.buttonGroup}>
        <CustomButton
          title="Calories"
          icon="food-apple"
          description="Track your daily calorie intake and burns"
          onPress={() => navigation.navigate('Calorie')}
        />
        <CustomButton
          title="Workouts"
          icon="dumbbell"
          description="Log your workouts and track progress"
          onPress={() => navigation.navigate('Workout')}
        />
        <CustomButton
          title="Goals"
          icon="target"
          description="Set and manage your fitness goals"
          onPress={() => navigation.navigate('Goal')}
        />
        <CustomButton
          title="Chat"
          icon="chat"
          description="Get support and fitness advice"
          onPress={() => navigation.navigate('Chat')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    marginTop: 60,
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  buttonGroup: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 16,
  },
});
