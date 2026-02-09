import {
  View,
  TextInput,
  StyleSheet,
  Text,
} from "react-native";
import React from "react";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import ArrowIcon from "react-native-vector-icons/Octicons";
import PlusSign from "react-native-vector-icons/AntDesign";
import { CircleButton } from "../button/CircleButton";
import Animated from "react-native-reanimated";
import { Message } from "../types/types";
import CrossIcon from "react-native-vector-icons/Entypo";

interface ChatInputProps {
  inputText: string;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  handleSend: () => void;

  onBack: () => void;
  replyingTo: Message | null;
  cancelReply: () => void;
  replyBarStyle: {
    height: number;
    opacity: number;
    overflow: "hidden";
  };
}
const ChatInput: React.FC<ChatInputProps> = ({
  inputText,
  setInputText,
  handleSend,
  onBack,
  replyingTo,
  cancelReply,
  replyBarStyle,
}) => {
  return (
    <View style={styles.inputContainer}>
      <CircleButton
        size={55}
        onPress={onBack}
        borderColor={colors.inputBorder}
        borderWidth={1}
        backgroundColor={colors.inputBackground}
        Icon={<PlusSign name="plus" size={20} color={colors.textMuted} />}
        style={{ margin: 5 }}
      />

      <View style={styles.inputCard}>
        {/* Reply bar */}

        {replyingTo && (
          <Animated.View style={[styles.replyBarContainer, replyBarStyle]}>
            <View style={styles.replyBarContent}>
              <View style={styles.replyBarTextContainer}>
                <Text style={styles.replyBarText} numberOfLines={3}>
                  {replyingTo.text}
                </Text>
              </View>

              <CircleButton
                size={24}
                onPress={cancelReply}
                borderColor="#E4E4E4"
                backgroundColor="#E0E0E0"
                Icon={<CrossIcon name="cross" color={"white"} size={15} />}
              />
            </View>
          </Animated.View>
        )}

        {/* Input row */}
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, replyingTo && styles.inputWithReply]}
            placeholder="Ask your planets..."
            placeholderTextColor={colors.inputPlaceholder}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />

          <CircleButton
            size={40}
            onPress={handleSend}
            borderColor={colors.inputBorder}
            borderWidth={0}
            backgroundColor={inputText.length > 0 ? colors.sendButtonActive : colors.sendButtonInactive}
            Icon={<ArrowIcon name="arrow-up" size={20} color={"white"} />}
          />
        </View>
      </View>
    </View>
  );
};

export default ChatInput;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: 5,
    backgroundColor: colors.background,
  },
  inputCard: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: colors.inputBackground,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.inputBorder,
    padding: 6,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingLeft: spacing.xl,
    paddingRight: 6,
    paddingVertical: spacing.xs,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    maxHeight: 90,
    paddingVertical: 6,
  },
  inputWithReply: {
    minHeight: 44,
  },
  replyBarContainer: {
    backgroundColor: "rgba(255,255,255,0.8)",
    borderTopLeftRadius: 15,
    borderLeftWidth: 2,
    borderTopRightRadius: 15,
    borderLeftColor: colors.replyBorderColor,
  },
  replyBarContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 7,
    paddingVertical: 9,
  },
  replyBarTextContainer: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  replyBarText: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
});
