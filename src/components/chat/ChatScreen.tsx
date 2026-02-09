import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  FadeIn,
  Extrapolation,
  LinearTransition,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Message, Astrologer } from "./types";
import ChatHeader from "./ChatHeader";
import { scheduleOnRN } from "react-native-worklets";

import CheckIcon from "react-native-vector-icons/Feather";

import ChatInput from "./ChatInput";
import ChatMessageList from "./ChatMessageList";

interface ChatScreenProps {
  astrologer: Astrologer;
  messages: Message[];
  onSendMessage: (text: string, replyTo?: Message) => void;
  onBack: () => void;
  onOpenSettings: () => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({
  astrologer,
  messages,
  onSendMessage,
  onBack,
  onOpenSettings,
}) => {
  const [inputText, setInputText] = useState("");
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);

  const flatListRef = useRef<FlatList | null>(null);

  // Animation values
  const sendButtonScale = useSharedValue(1);
  const replyBarHeight = useSharedValue(0);

  // Handle reply selection
  const handleReply = useCallback(
    (message: Message) => {
      setReplyingTo(message);
      replyBarHeight.value = withSpring(60, { damping: 15, stiffness: 150 });
    },
    [replyBarHeight],
  );

  // Cancel reply
  const cancelReply = useCallback(() => {
    replyBarHeight.value = withTiming(0, { duration: 200 });
    setTimeout(() => setReplyingTo(null), 200);
  }, [replyBarHeight]);

  // Send message
  const handleSend = useCallback(() => {
    if (!inputText.trim()) return;

    // Animate send button
    sendButtonScale.value = withSpring(0.8, {}, () => {
      sendButtonScale.value = withSpring(1);
    });

    onSendMessage(inputText.trim(), replyingTo || undefined);
    setInputText("");
    if (replyingTo) cancelReply();
  }, [inputText, replyingTo, onSendMessage, cancelReply, sendButtonScale]);

  const replyBarStyle = useAnimatedStyle(() => ({
    height: replyBarHeight.value,
    opacity: interpolate(replyBarHeight.value, [0, 60], [0, 1]),
    overflow: "hidden",
  }));

  // Message bubble component with swipe-to-reply
  const MessageBubble = ({ item, index }: { item: Message; index: number }) => {
    const translateX = useSharedValue(0);
    const isUser = item.sender === "user";

    const panGesture = Gesture.Pan()
      .activeOffsetX([-20, 20])
      .onUpdate((event) => {
        const clampedX = isUser
          ? Math.max(-80, Math.min(0, event.translationX))
          : Math.min(80, Math.max(0, event.translationX));
        translateX.value = clampedX;
      })
      .onEnd(() => {
        if (Math.abs(translateX.value) > 50) {
          scheduleOnRN(handleReply, item);
        }
        translateX.value = withSpring(0, { damping: 20 });
      });

    const bubbleStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value }],
    }));

    const replyIconStyle = useAnimatedStyle(() => ({
      opacity: interpolate(
        Math.abs(translateX.value),
        [0, 30, 50],
        [0, 0.5, 1],
        Extrapolation.CLAMP,
      ),
      transform: [
        {
          scale: interpolate(
            Math.abs(translateX.value),
            [0, 50],
            [0.5, 1],
            Extrapolation.CLAMP,
          ),
        },
      ],
    }));

    return (
      <Animated.View
        entering={FadeIn.delay(index * 50).duration(300)}
        layout={LinearTransition.springify()}
        style={[styles.messageRow, isUser && styles.messageRowUser]}
      >
        {/* Reply icon indicator */}
        <Animated.View
          style={[
            styles.replyIcon,
            isUser ? styles.replyIconLeft : styles.replyIconRight,
            replyIconStyle,
          ]}
        >
          <Text style={styles.replyIconText}>↩</Text>
        </Animated.View>

        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              styles.messageBubble,
              isUser ? styles.userBubble : styles.astrologerBubble,
              bubbleStyle,
            ]}
          >
            {/* Reply preview if this message is a reply */}
            {item.replyTo && (
              <View style={styles.replyPreview}>
                <View style={styles.replyBar} />
                <Text style={styles.replyPreviewText} numberOfLines={1}>
                  {item.replyTo.text}
                </Text>
              </View>
            )}
            <Text
              style={[
                styles.messageText,
                isUser ? styles.userText : styles.astrologerText,
              ]}
            >
              {item.text}
            </Text>
          </Animated.View>
        </GestureDetector>

        {/* Timestamp */}
        {isUser && (
          <View style={styles.timestampContainer}>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
            {item.isRead && (
              <View style={styles.readIndicator}>
                <CheckIcon name="check" color={"#14B8A6"} />
                <CheckIcon
                  name="check"
                  color={"#14B8A6c"}
                  style={styles.checkStyle}
                />
              </View>
            )}
          </View>
        )}
      </Animated.View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ChatHeader
        astrologer={astrologer}
        onBack={onBack}
        onOpenSettings={onOpenSettings}
      />

      {/* Date separator */}
      <View style={styles.dateSeparator}>
        <Text style={styles.dateText}>Today</Text>
      </View>

      <ChatMessageList
        flatListRef={flatListRef}
        messages={messages}
        MessageBubble={MessageBubble}
      />

      <ChatInput
        onBack={onBack}
        inputText={inputText}
        setInputText={setInputText}
        handleSend={handleSend}
        replyingTo={replyingTo}
        cancelReply={cancelReply}
        replyBarStyle={replyBarStyle}
      />
    </KeyboardAvoidingView>
  );
};

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
  checkStyle: { marginTop: -8 },
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

export default ChatScreen;
