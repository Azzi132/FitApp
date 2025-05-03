import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function MainScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fit App</Text>
      </View>

      <View style={styles.buttonGroup}>
        <Button title="Goals" onPress={() => navigation.navigate('TabsGoal')} />
        <Button
          title="Workouts"
          onPress={() => navigation.navigate('TabsWorkout')}
        />
        <Button
          title="Calories"
          onPress={() => navigation.navigate('TabsCalorie')}
        />
        <Button title="Chat" onPress={() => navigation.navigate('TabsChat')} />
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
    marginBottom: 2,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  buttonGroup: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
});
