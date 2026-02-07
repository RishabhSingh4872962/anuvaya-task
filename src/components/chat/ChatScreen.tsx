// src/screens/ChatScreen.tsx
import { ChatMessageSender } from "./ChatMessageSender";
import { ChatMessageReceiver } from "./ChatMessageReceiver";
import { spacing } from "../theme/spacing";
import { colors } from "../theme/colors";
import { ChatMessage } from "@/src/types/chat";

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";

const MESSAGES = [
  {
    id: "1",
    sender: "me",
    text: "I wanted to know about my marriage.",
    time: "6:21 PM",
    isRead: true,
  },
  {
    id: "2",
    sender: "other",
    text: "Venus in Gemini in the 11th house is great for marriage.",
    time: "6:21 PM",
  },
  {
    id: "3",
    sender: "other",
    text: "Venus Mahadasha is the most favourable time for marriage, especially when your Venus is in such a strong position.",
    time: "6:21 PM",
  },

  {
    id: "4",
    sender: "other",
    text: "Venus Mahadasha is the most favourable time for marriage, especially when your Venus is in such a strong position.",
    time: "6:21 PM",
  },
  {
    id: "5",
    sender: "other",
    text: "Venus Mahadasha is the most favourable time for marriage, especially when your Venus is in such a strong position.",
    time: "6:21 PM",
  },
  {
    id: "6",
    sender: "me",
    text: "I wanted to know about my marriage.",
    time: "6:21 PM",
    isRead: true,
  },
];

export const ChatScreen = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.back}>{"‹"}</Text>
          <Image
            source={{ uri: "https://via.placeholder.com/40" }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.name}>Sanjai Maharaj</Text>
            <Text style={styles.subtitle}>Vedic Astrologer</Text>
          </View>
        </View>
        <Text style={styles.menu}>⋮</Text>
      </View>

      {/* Chat */}
      <FlatList
        data={MESSAGES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) =>
          item.sender === "me" ? (
            <ChatMessageSender
              message={item.text}
              time={item.time}
              isRead={item?.isRead}
            />
          ) : (
            <ChatMessageReceiver message={item.text} time={item.time} />
          )
        }
        ListHeaderComponent={<Text style={styles.today}>Today</Text>}
      />

      {/* Input */}
      <View style={styles.inputBar}>
        <TouchableOpacity style={styles.plus}>
          <Text style={styles.plusText}>＋</Text>
        </TouchableOpacity>

        <TextInput
          placeholder="Ask your planets..."
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />

        <TouchableOpacity style={styles.send}>
          <Text style={styles.sendText}>↑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  back: {
    fontSize: 28,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  name: {
    fontWeight: "600",
    fontSize: 15,
  },

  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
  },

  menu: {
    fontSize: 22,
  },

  list: {
    padding: spacing.lg,
    gap: spacing.lg,
  },

  today: {
    alignSelf: "center",
    marginBottom: spacing.lg,
    color: colors.textMuted,
    fontSize: 12,
  },

  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderTopWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },

  plus: {
    marginRight: spacing.sm,
  },

  plusText: {
    fontSize: 22,
  },

  input: {
    flex: 1,
    backgroundColor: "#F5F5F4",
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    height: 40,
  },

  send: {
    marginLeft: spacing.sm,
    backgroundColor: colors.inputComplete,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  sendText: {
    color: "#fff",
    fontSize: 16,
  },
});
