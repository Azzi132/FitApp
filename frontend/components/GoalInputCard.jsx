import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function GoalInputCard({
  title, // Title of goal
  value, // Input Value
  onChangeText, // Handle input change
  unit, // Unit (kg, steps, etc.)
  placeholder, // Placeholder text
  icon, // Icon from material
}) {
  return (
    <View style={styles.goalCard}>
      <View style={styles.goalHeader}>
        <MaterialCommunityIcons name={icon} size={24} color="#666" />
        <Text style={styles.goalTitle}>{title}</Text>
      </View>
      <View style={styles.goalContent}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            keyboardType="numeric"
            value={value}
            onChangeText={onChangeText}
          />
          <Text style={styles.unitText}>{unit}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  goalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  goalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#444',
    marginLeft: 10,
  },
  goalContent: {
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f3ff',
    borderRadius: 12,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 18,
    color: '#333',
  },
  unitText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
});
