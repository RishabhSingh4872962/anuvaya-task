import { StyleSheet } from "react-native";
import React from "react";
import { FlatList } from "react-native-gesture-handler";
import { Message } from "@/src/components/types/types";

interface ChatMessageProps {
  messages: Message[];
  flatListRef: React.RefObject<FlatList<any>> | null;
  MessageBubble: React.FC<{
    item: any;
    index: number;
  }>;
}

const ChatMessageList: React.FC<ChatMessageProps> = ({
  flatListRef,
  messages,
  MessageBubble,
}) => {
  return (
    <FlatList
      ref={flatListRef}
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <MessageBubble item={item} index={index} />
      )}
      contentContainerStyle={styles.messagesList}
      showsVerticalScrollIndicator={false}
      onContentSizeChange={() =>
        flatListRef?.current?.scrollToEnd({ animated: true })
      }
    />
  );
};

export default ChatMessageList;

const styles = StyleSheet.create({
  messagesList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});
