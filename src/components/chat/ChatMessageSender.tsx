import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/src/components/theme/colors";
import { spacing } from "@/src/components/theme/spacing";
import { typography } from "@/src/components/theme/typography";
import { ChatMessageSenderProps } from "./types";

export const ChatMessageSender = ({
  message,
  time,
  isRead,
}: ChatMessageSenderProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <Text style={typography.message}>{message}</Text>
      </View>

      <View style={styles.meta}>
        <Text style={typography.timestamp}>{time}</Text>
        {isRead && <Text style={styles.read}>✓✓</Text>}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-end",
    gap: spacing.sm,
  },

  bubble: {
    backgroundColor: colors.senderBubble,
    borderRadius: 14,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    maxWidth: 242,
  },

  meta: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: spacing.xs,
  },

  read: {
    fontSize: 11,
    color: colors.timestamp,
  },
});
