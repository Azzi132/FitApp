import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function CustomButton({ title, onPress, icon, description }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View style={styles.buttonContent}>
        <MaterialCommunityIcons name={icon} size={32} color="#fff" />
        <View style={styles.buttonTextContainer}>
          <Text style={styles.buttonText}>{title}</Text>
          <Text style={styles.buttonDescription}>{description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4a6ee0',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonContent: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  buttonTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  buttonDescription: {
    color: '#fff',
    opacity: 0.8,
    fontSize: 14,
    marginTop: 4,
  },
});
