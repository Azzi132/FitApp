import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CustomButton = ({ title, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

export default function MainScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fit App</Text>
      </View>

      <View style={styles.buttonGroup}>
        <CustomButton
          title="Calories"
          onPress={() => navigation.navigate('Calorie')}
        />
        <CustomButton
          title="Workouts"
          onPress={() => navigation.navigate('Workout')}
        />
        <CustomButton
          title="Goals"
          onPress={() => navigation.navigate('Goal')}
        />
        <CustomButton
          title="Chat"
          onPress={() => navigation.navigate('Chat')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    marginTop: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  buttonGroup: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    width: '100%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
