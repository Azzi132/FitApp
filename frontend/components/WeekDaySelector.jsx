import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function WeekDaySelector({ selectedDay, onDaySelect }) {
  const WeekDay = ({ day }) => (
    <TouchableOpacity
      style={styles.weekDayContainer}
      onPress={() => onDaySelect(day)}
    >
      <View
        style={[styles.weekDay, day === selectedDay && styles.selectedDay]}
      />
      <Text
        style={[
          styles.weekDayText,
          day === selectedDay && styles.selectedDayText,
        ]}
      >
        {day}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.weekContainer}>
      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
        <WeekDay key={day} day={day} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#4a6ee0',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  weekDayContainer: {
    alignItems: 'center',
    padding: 5,
  },
  weekDay: {
    width: 20,
    height: 30,
    backgroundColor: '#ffffff33',
    borderRadius: 3,
  },
  selectedDay: {
    backgroundColor: '#ff6b6b',
    transform: [{ scale: 1.1 }],
  },
  selectedDayText: {
    fontWeight: 'bold',
  },
  weekDayText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
  },
});
