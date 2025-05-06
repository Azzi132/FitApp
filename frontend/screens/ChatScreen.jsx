import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() === "") return;

    const userMessage = { text: input, sender: "user" };
    const aiMessage = {
      text: "Dette er et AI-svar (dummy)",
      sender: "ai",
    };

    setMessages((prev) => [...prev, userMessage, aiMessage]);
    setInput("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.chatContainer}>
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.messageWrapper,
              msg.sender === "user"
                ? { justifyContent: "flex-start" }
                : { justifyContent: "flex-end" },
            ]}
          >
            {msg.sender === "user" && (
              <View style={[styles.tail, styles.userTail]} />
            )}
            <View
              style={[
                styles.messageBubble,
                msg.sender === "user" ? styles.userBubble : styles.aiBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  msg.sender === "user" ? styles.userMessage : null,
                ]}
              >
                {msg.text}
              </Text>
            </View>
            {msg.sender === "ai" && (
              <View style={[styles.tail, styles.aiTail]} />
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          placeholder="Skriv en besked..."
          onChangeText={setInput}
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  chatContainer: {
    padding: 12,
    paddingBottom: 80,
  },
  messageWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 4,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 12,
    marginVertical: 4,
    maxWidth: "75%",
  },
  userBubble: {
    backgroundColor: "#007aff",
    alignSelf: "flex-start",
  },
  aiBubble: {
    backgroundColor: "#8c8f94",
    alignSelf: "flex-end",
  },
  messageText: {
    color: "#000",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
    position: "absolute",
    bottom: Platform.OS === "ios" ? 20 : 10,
    width: "100%",
  },
  input: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 10,
    color: "#000",
  },
  sendButton: {
    backgroundColor: "#007aff",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sendText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  tail: {
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderTopColor: "transparent",
    borderTopWidth: 10,
    borderTopColor: "transparent",
    alignSelf: "flex-end",
    marginBottom: 4,
  },
  aiTail: {
    borderLeftWidth: 10,
    borderLeftColor: "#8c8f94",
    marginLeft: -10,
  },
  userTail: {
    borderRightWidth: 10,
    borderRightColor: "#007aff",
    marginRight: -10,
  },
});
