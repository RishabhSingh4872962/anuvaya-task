import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/src/components/theme/colors";
import { spacing } from "@/src/components/theme/spacing";
import { typography } from "@/src/components/theme/typography";

interface Props {
  message: string;
  time: string;
}

export const ChatMessageReceiver = ({ message, time }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <Text style={typography.message}>{message}</Text>
      </View>

      <View style={styles.meta}>
        <Text style={typography.timestamp}>{time}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    gap: spacing.sm,
  },

  bubble: {
    backgroundColor: colors.receiverBubble,
    borderRadius: 14,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    maxWidth: 242,
  },

  meta: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
});
