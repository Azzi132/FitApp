import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

export default function CircularProgress({
  value, // Current progress value
  maxValue, // Max value
  size = 200, // Size of circle
  strokeWidth = 15, // How thick circle is
  textSize = 40, // Size of the text in the middle of the circle
  labelFormat = 'remaining', // Text under the number in the middle of the circle
  reversePercentage = false, // True in workoutScreen to show much left until goal is hit
}) {
  // Calculate the dimensions and progress values
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progressValue = (value / maxValue) * circumference;

  const remainingPercentage = 100 - percentage; // CalorieSCreen
  const percentage = Math.round((value / maxValue) * 100); // WorkoutScreen

  // Set remaining percentage / percentage until goal hit
  const getDisplayValue = () => {
    if (labelFormat === 'percentage') {
      return reversePercentage ? remainingPercentage : percentage;
    }
    return value;
  };

  // Get the label text that appears below the value
  const getLabel = () => {
    if (labelFormat === 'percentage') {
      return 'until goal hit';
    }
    return 'remaining';
  };

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} style={styles.svg}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E8E8E8"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#007AFF"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference - progressValue}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.textContainer}>
        <Text style={[styles.valueText, { fontSize: textSize }]}>
          {getDisplayValue()}
          {labelFormat === 'percentage' ? '%' : ''}
        </Text>
        <Text style={[styles.labelText, { fontSize: textSize * 0.4 }]}>
          {getLabel()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    transform: [{ rotateZ: '0deg' }],
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  labelText: {
    fontSize: 16,
    color: '#666',
  },
});
