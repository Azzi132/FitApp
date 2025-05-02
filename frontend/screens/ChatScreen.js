import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function ChatScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  header: {
    marginTop: 30,
    alignItems: "center",
    marginBottom: 2,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
  },
  buttonGroup: {
    flex: 1, // eller brug marginBottom på knapper
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
});
