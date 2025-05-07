import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StatItem({ icon, label, value }) {
  return (
    <View style={styles.statItem}>
      <View style={styles.iconTextContainer}>
        <Text style={styles.statLabel}>{icon}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
