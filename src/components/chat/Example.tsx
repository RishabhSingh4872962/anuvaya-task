/**
 * EXAMPLE USAGE
 * Complete example showing how to integrate all chat components
 * with the global ActionSheet API
 *
 * Dependencies:
 * - react-native-reanimated
 * - react-native-gesture-handler
 * - react-native-bottom-sheet (for ProfileSheet)
 */

import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ChatScreen from "./ChatScreen";
import { ActionSheetProvider } from "../action-sheet/ActionSheetProvider";
import { Message, Astrologer } from "./types";
import { useActionSheet } from "../action-sheet/ActionSheetApi";
import TrashIcon from "react-native-vector-icons/EvilIcons";

import BroomIcon from "react-native-vector-icons/FontAwesome6";

// ============================================
// SAMPLE DATA
// ============================================

const sampleAstrologer: Astrologer = {
  id: "1",
  name: "Sanjai Maharaj",
  title: "Vedic Astrologer",
  avatar: "https://example.com/avatar.jpg",
  experience: "21+ years of experience",
  education: "B.A. Mathematical Honours, Hindu College",
  age: 37,
  description:
    "Krishnamurti Paddhati system of Astrology with spiritual guidance",
};

const sampleMessages: Message[] = [
  {
    id: "1",
    text: "I wanted to know about my marriage.",
    sender: "user",
    timestamp: "6:21 PM",
    isRead: true,
  },
  {
    id: "2",
    text: "Venus in Gemini in the 11th house is great for marriage.",
    sender: "astrologer",
    timestamp: "6:21 PM",
  },
  {
    id: "3",
    text: "Venus Mahadasha is the most favourable time for marriage, especially when your Venus is in such a strong position.",
    sender: "astrologer",
    timestamp: "6:21 PM",
  },
];

// ============================================
// ICON COMPONENTS (Replace with your icon library)
// ============================================

// import ClearIcon from "react-native-vector-icons/MaterialDesignIcons";

const ClearIcon = () => <BroomIcon name="broom" size={18} color={"#CA8A04"} />;

const DeleteIcon = () => <TrashIcon name="trash" size={28} color={"#EF4444"} />;

// ============================================
// CHAT SCREEN WRAPPER
// Uses the global ActionSheet API
// ============================================

interface ChatScreenWrapperProps {
  astrologer: Astrologer;
  messages: Message[];
  onSendMessage: (text: string, replyTo?: Message) => void;
  onBack: () => void;
  onClearChat: () => void;
  onDeleteChat: () => void;
}

const ChatScreenWrapper: React.FC<ChatScreenWrapperProps> = ({
  astrologer,
  messages,
  onSendMessage,
  onBack,
  onClearChat,
  onDeleteChat,
}) => {
  const { showActionSheet } = useActionSheet();

  const handleOpenSettings = useCallback(() => {
    showActionSheet({
      type: "clearChat", // Add this line
      actions: [
        {
          title: "Clear Chat",
          icon: <ClearIcon />,
          onPress: onClearChat,
        },
        {
          title: "Delete Chat",
          icon: <DeleteIcon />,
          onPress: onDeleteChat,
        },
      ],
      highlightIndex: 3, // Highlight "Delete Chat" as destructive
    });
  }, [showActionSheet, onClearChat, onDeleteChat]);

  return (
    <ChatScreen
      astrologer={astrologer}
      messages={messages}
      onSendMessage={onSendMessage}
      onBack={onBack}
      onOpenSettings={handleOpenSettings}
    />
  );
};

// ============================================
// MAIN APP COMPONENT
// ============================================

const ExampleApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(sampleMessages);

  const handleSendMessage = useCallback((text: string, replyTo?: Message) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isRead: false,
      replyTo: replyTo ? { id: replyTo.id, text: replyTo.text } : undefined,
    };
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  const handleClearChat = useCallback(() => {
    setMessages([]);
    console.log("Chat cleared");
  }, []);

  const handleDeleteChat = useCallback(() => {
    setMessages([]);
    // Navigate back or handle deletion
    console.log("Chat deleted");
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <ActionSheetProvider>
        <ChatScreenWrapper
          astrologer={sampleAstrologer}
          messages={messages}
          onSendMessage={handleSendMessage}
          onBack={() => console.log("Go back")}
          onClearChat={handleClearChat}
          onDeleteChat={handleDeleteChat}
        />
      </ActionSheetProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ExampleApp;
