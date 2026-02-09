import {
  View,
  TextInput,
  StyleSheet,
  Text,
} from "react-native";
import React from "react";

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
  console.log(replyingTo);
  return (
    <View style={styles.inputContainer}>
      <CircleButton
        size={55}
        onPress={onBack}
        borderColor="#E4E4E4"
        borderWidth={1}
        backgroundColor="#f5f5f4"
        Icon={<PlusSign name="plus" size={20} color={"#78716C"} />}
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
            placeholderTextColor="#A8A29E"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />

          <CircleButton
            size={40}
            onPress={handleSend}
            borderColor="#E4E4E4"
            borderWidth={0}
            backgroundColor={inputText.length > 0 ? "#F97316" : "#FED7AA"}
            Icon={<ArrowIcon name="arrow-up" size={20} color={"white"} />}
          />
        </View>
      </View>
    </View>
  );
};

export default ChatInput;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    paddingTop: 50, // Safe area
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    fontSize: 24,
    color: "#333",
  },
  profileInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  nameContainer: {
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  title: {
    fontSize: 12,
    color: "#888",
  },
  settingsButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  settingsIcon: {
    fontSize: 20,
    color: "#333",
  },
  dateSeparator: {
    alignItems: "center",
    paddingVertical: 16,
  },
  dateText: {
    fontSize: 12,
    color: "#888",
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  messageRow: {
    marginBottom: 12,
    alignItems: "flex-start",
  },
  messageRowUser: {
    alignItems: "flex-end",
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: "#F5A623",
    borderBottomRightRadius: 4,
  },
  astrologerBubble: {
    backgroundColor: "#F5F5F5",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userText: {
    color: "#FFFFFF",
  },
  astrologerText: {
    color: "#1A1A1A",
  },
  timestampContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginRight: 4,
  },
  timestamp: {
    fontSize: 11,
    color: "#888",
  },
  readIndicator: {
    fontSize: 11,
    color: "#14B8A6",
    marginLeft: 4,
  },
  replyIcon: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    top: "50%",
    marginTop: -15,
  },
  replyIconLeft: {
    left: 0,
  },
  replyIconRight: {
    right: 0,
  },
  replyIconText: {
    fontSize: 16,
    color: "#666",
  },
  replyPreview: {
    flexDirection: "row",
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.3)",
  },
  replyBar: {
    width: 3,
    backgroundColor: "#FFF",
    borderRadius: 2,
    marginRight: 8,
  },
  replyPreviewText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    flex: 1,
  },
  replyBarContainer: {
    backgroundColor: "rgba(255,255,255,0.8)",
    borderTopLeftRadius: 15,
    borderLeftWidth: 2,
    borderTopRightRadius: 15,
    borderLeftColor: "#F5A623",
  },
  replyBarContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 7,
    paddingVertical: 9,
  },
  replyBarLine: {
    width: 3,
    height: 36,
    backgroundColor: "#F5A623",
    borderRadius: 2,
  },
  replyBarTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  replyBarLabel: {
    fontSize: 12,
    color: "#F5A623",
    fontWeight: "600",
  },
  replyBarText: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  cancelReply: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelReplyIcon: {
    fontSize: 12,
    color: "white",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 34,
    backgroundColor: "#FFFFFF",
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#1C1917",
    maxHeight: 90,
    paddingVertical: 6,
  },

  inputWithReply: {
    minHeight: 44,
  },
  attachButton: {
    width: 58,
    height: 58,
    borderRadius: 33,
    borderColor: "#E4E4E4",
    backgroundColor: "#f5f5f4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  attachIcon: {
    fontSize: 26,
    color: "#57534E",
  },

  inputCard: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#F5F5F4",
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E4E4E4",
    padding: 6,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 5,
  },

  // input: {
  //   flex: 1,
  //   fontSize: 15,
  //   color: "#1C1917",
  //   maxHeight: 90,
  //   paddingVertical: 6,
  // },

  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FED7AA",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 6,
  },

  sendIcon: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "600",
  },

  inputWrapper: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
  },
});
