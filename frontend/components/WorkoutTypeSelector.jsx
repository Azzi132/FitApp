import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function WorkoutTypeSelector({ selectedType, onTypeSelect }) {
  const WorkoutTypeButton = ({ type, icon, isSelected }) => (
    <TouchableOpacity
      style={[styles.typeButton, isSelected && styles.selectedType]}
      onPress={() => onTypeSelect(type)}
    >
      <MaterialCommunityIcons
        name={icon}
        size={24}
        color={isSelected ? '#fff' : '#8e9aaf'}
      />
      <Text style={[styles.typeText, isSelected && styles.selectedTypeText]}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.typeContainer}>
      <WorkoutTypeButton
        type="cardio"
        icon="heart-pulse"
        isSelected={selectedType === 'cardio'}
      />
      <WorkoutTypeButton
        type="power"
        icon="dumbbell"
        isSelected={selectedType === 'power'}
      />
      <WorkoutTypeButton
        type="steps"
        icon="walk"
        isSelected={selectedType === 'steps'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  typeButton: {
    flex: 1,
    backgroundColor: '#f0f3ff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  selectedType: {
    backgroundColor: '#ff6b6b',
  },
  typeText: {
    marginTop: 5,
    color: '#8e9aaf',
    fontSize: 12,
  },
  selectedTypeText: {
    color: '#fff',
  },
});
