import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
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
import { Message, Astrologer } from "../types/types";
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
                  color={"#14B8A6"}
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
    backgroundColor: colors.background,
  },
  dateSeparator: {
    alignItems: "center",
    paddingVertical: spacing.xl,
  },
  dateText: {
    fontSize: 12,
    color: colors.timestamp,
  },
  messageRow: {
    marginBottom: spacing.lg,
    alignItems: "flex-start",
  },
  messageRowUser: {
    alignItems: "flex-end",
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: colors.userBubbleColor,
    borderBottomRightRadius: 4,
  },
  astrologerBubble: {
    backgroundColor: colors.astrologerBubbleColor,
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
    color: colors.textPrimary,
  },
  timestampContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
    marginRight: spacing.sm,
  },
  timestamp: {
    fontSize: 11,
    color: colors.timestamp,
  },
  readIndicator: {
    fontSize: 11,
    color: colors.readStatusColor,
    marginLeft: spacing.sm,
  },
  checkStyle: { marginTop: -8 },
  replyIcon: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.replyIconBg,
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
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.3)",
  },
  replyBar: {
    width: 3,
    backgroundColor: "#FFF",
    borderRadius: 2,
    marginRight: spacing.md,
  },
  replyPreviewText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    flex: 1,
  },
});

export default ChatScreen;
