import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { sendMessage } from '../../api/chat.js';

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef();

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage = { text: input.trim(), sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessage(userMessage.text);
      const aiMessage = {
        text: response,
        sender: 'ai',
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <ScrollView
          contentContainerStyle={styles.chatContainer}
          ref={scrollViewRef}
          onContentSizeChange={() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }}
        >
          {messages.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.messageWrapper,
                msg.sender === 'user'
                  ? { alignItems: 'flex-start' }
                  : { alignItems: 'flex-end' },
              ]}
            >
              {msg.sender === 'user' && (
                <View style={[styles.tail, styles.userTail]} />
              )}
              <View
                style={[
                  styles.messageBubble,
                  msg.sender === 'user' ? styles.userBubble : styles.aiBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    msg.sender === 'user'
                      ? styles.userMessage
                      : styles.aiMessage,
                  ]}
                >
                  {msg.text}
                </Text>
              </View>
              {msg.sender === 'ai' && (
                <View style={[styles.tail, styles.aiTail]} />
              )}
            </View>
          ))}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#8c8f94" />
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            placeholder="Write a message..."
            onChangeText={setInput}
            editable={!isLoading}
          />
          <TouchableOpacity
            onPress={handleSend}
            style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
            disabled={isLoading}
          >
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  innerContainer: {
    flex: 1,
  },
  chatContainer: {
    padding: 12,
    paddingBottom: 10,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginVertical: 8,
    width: '100%',
  },
  messageBubble: {
    padding: 15,
    borderRadius: 20,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: '#0084ff',
    borderBottomLeftRadius: 5,
    marginRight: 50,
  },
  aiBubble: {
    backgroundColor: '#e4e6eb',
    borderBottomRightRadius: 5,
    marginLeft: 50,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessage: {
    color: '#ffffff',
  },
  aiMessage: {
    color: '#1c1e21',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
    width: '100%',
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 10,
    color: '#000',
  },
  sendButton: {
    backgroundColor: '#007aff',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sendText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tail: {
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderTopColor: 'transparent',
    position: 'absolute',
    bottom: 0,
  },
  aiTail: {
    borderLeftWidth: 12,
    borderLeftColor: '#e4e6eb',
    right: -8,
  },
  userTail: {
    borderRightWidth: 12,
    borderRightColor: '#0084ff',
    left: -8,
  },
  loadingContainer: {
    padding: 10,
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
