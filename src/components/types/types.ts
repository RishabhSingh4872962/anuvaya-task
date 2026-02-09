import React from "react";

export interface ChatMessageSenderProps {
  message: string;
  time: string;
  isRead: boolean;
}

/**
 * REACT NATIVE TYPES
 * Core type definitions for Chat application
 */

// ============================================
// MESSAGE TYPES
// ============================================

export interface Message {
  id: string;
  text: string;
  sender: "user" | "astrologer";
  timestamp: string;
  isRead?: boolean;
  replyTo?: {
    id: string;
    text: string;
  };
}

// ============================================
// ASTROLOGER TYPES
// ============================================

export interface Astrologer {
  id: string;
  name: string;
  title: string;
  avatar: string;
  experience: string;
  education: string;
  age: number;
  description: string;
}

// ============================================
// ACTION SHEET TYPES
// ============================================

export interface ActionSheetAction {
  title: string;
  icon: React.ReactNode;
  onPress: () => void | Promise<void>;
}

export interface ActionSheet {
  title?: string;
  description?: string;
  actions: ActionSheetAction[];
  highlightIndex?: number;
  type?: "clearChat" | "default"; // Add this line
}

export interface ActionSheetContextType {
  showActionSheet: (options: ActionSheet) => void;
  hideActionSheet: () => void;
}

// ============================================
// CHAT SCREEN PROPS
// ============================================

export interface ChatScreenProps {
  astrologer: Astrologer;
  messages: Message[];
  onSendMessage: (text: string, replyTo?: Message) => void;
  onBack: () => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
}

// ============================================
// PROFILE SHEET PROPS
// ============================================

export interface ProfileSheetProps {
  astrologer: Astrologer;
  visible: boolean;
  onClose: () => void;
}
