import "../../assets/astrologer/astrologericon.png";
import "../../assets/astrologer/astrologerprofile.png";

import React, {
  useState,
  useCallback,
  useMemo,
  ReactNode,
  useRef,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  Keyboard,
} from "react-native";

import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { ActionSheet, ActionSheetAction } from "../types/types";
import { ActionSheetContext } from "./ActionSheetApi";

export const astrologerImages = {
  icon: require("../../assets/astrologer/astrologericon.png"),
  profile: require("../../assets/astrologer/astrologerprofile.png"),
};

const SAFE_AREA_BOTTOM = Platform.OS === "ios" ? 34 : 24;

// ============================================
// ACTION BUTTON COMPONENT
// ============================================

interface ActionButtonProps {
  action: ActionSheetAction;
  isHighlighted: boolean;
  onPress: () => void;
  index: number;
  isLast: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  action,
  isHighlighted,
  onPress,
  index,
  isLast,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <TouchableOpacity
      style={[
        styles.actionButton,
        !isLast && styles.actionButtonBorder,
        isPressed && styles.actionButtonPressed,
      ]}
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      activeOpacity={0.7}
    >
      <View style={styles.actionIcon}>{action.icon}</View>
      <Text
        style={[
          styles.actionTitle,
          isHighlighted && styles.actionTitleHighlighted,
        ]}
      >
        {action.title}
      </Text>
    </TouchableOpacity>
  );
};

// ============================================
// ACTION SHEET COMPONENT
// ============================================

interface ActionSheetContentProps {
  options: ActionSheet | null;
  onClose: () => void;
}

const ActionSheetContent: React.FC<ActionSheetContentProps> = ({
  options,
  onClose,
}) => {
  if (!options) return null;

  const handleActionPress = useCallback(
    async (action: ActionSheetAction) => {
      await action.onPress();
      onClose();
    },
    [onClose],
  );

  return (
    <View
      style={[
        styles.sheetContent,
        options.type !== "clearChat" && styles.optionChatSheet,
      ]}
    >
      {options.type === "clearChat" ? null : (
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>
      )}
      {/* Avatar */}
      {options.title && (
        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            <Image source={astrologerImages["profile"]} style={styles.avatar} />
          </View>
        </View>
      )}

      {/* Header */}
      {(options.title || options.description) && (
        <View style={styles.header}>
          {options.title && <Text style={styles.title}>{options.title}</Text>}
          {options.description && (
            <Text style={styles.description}>{options.description}</Text>
          )}
        </View>
      )}

      {/* Divider */}
      {options.title && (
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerIcon}>✦</Text>
          <View style={styles.dividerLine} />
        </View>
      )}

      {/* Actions */}
      <View style={styles.actionsContainer}>
        {options.actions.map((action, index) => (
          <ActionButton
            key={index}
            action={action}
            isHighlighted={options.highlightIndex === index}
            onPress={() => handleActionPress(action)}
            index={index}
            isLast={index === options.actions.length - 1}
          />
        ))}
      </View>

      {/* Cancel Button */}
      {!options.title && (
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// ============================================
// PROVIDER COMPONENT
// ============================================

interface ActionSheetProviderProps {
  children: ReactNode;
}

export const ActionSheetProvider: React.FC<ActionSheetProviderProps> = ({
  children,
}) => {
  const [options, setOptions] = useState<ActionSheet | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => {
    if (!options) return [10];

    let height = SAFE_AREA_BOTTOM + 60; // Cancel button + padding
    if (options.title) height += 28;
    if (options.description) height += 50;
    if (options.title || options.description) height += 26;
    height += options.actions.length * 56;
    height += 12;

    return [height + 120];
  }, [options]);

  const showActionSheet = useCallback((newOptions: ActionSheet) => {

    Keyboard.dismiss();
    setOptions(newOptions);
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  const hideActionSheet = useCallback(() => {
    bottomSheetRef.current?.close();
    setTimeout(() => {
      setOptions(null);
    }, 300);
  }, []);

  const contextValue = useMemo(
    () => ({ showActionSheet, hideActionSheet }),
    [showActionSheet, hideActionSheet],
  );

  const isOptionChat = useMemo(() => {
    return options?.type === "clearChat";
  }, [options?.type]);

  return (
    <ActionSheetContext.Provider value={contextValue}>
      {children}
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={-1}
        enablePanDownToClose
        onClose={hideActionSheet}
        backgroundStyle={styles.bottomSheetBackground}
        backdropComponent={
          isOptionChat
            ? (props) => (
                <BottomSheetBackdrop
                  {...props}
                  opacity={0.35}
                  appearsOnIndex={0}
                  disappearsOnIndex={-1}
                />
              )
            : undefined
        }
        handleComponent={null}
        enableDynamicSizing={false}
      >
        <ActionSheetContent options={options} onClose={hideActionSheet} />
      </BottomSheet>
    </ActionSheetContext.Provider>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: "transparent",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#F5A623",
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent", // 🔴 important
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    zIndex: 101,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    paddingHorizontal: 40,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerIcon: {
    fontSize: 20,
    color: "#CCC",
    marginHorizontal: 12,
  },
  handleIndicator: {
    backgroundColor: "#E0E0E0",
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  sheetContent: {
    position: "relative",
    marginHorizontal: 16, // ⬅️ gap on left & right
  },
  optionChatSheet: {
    borderRadius: 24,
    borderWidth: 1,
    backgroundColor: "white",
    borderColor: "#D5D5D5",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    zIndex: 101,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 1,
  },
  handleContainer: {
    alignItems: "center",
    paddingVertical: 12,
  },
  handle: {
    width: 30,
    height: 4,
    backgroundColor: "#D6D3D1",
    borderRadius: 2,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    textAlign: "center",
  },
  description: {
    fontSize: 13,
    color: "#888",
    textAlign: "center",
    marginTop: 4,
  },
  actionsContainer: {
    marginHorizontal: 16,
    backgroundColor: "#f5f5f4",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    minHeight: 56,
  },
  actionButtonBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E0E0E0",
  },
  actionButtonPressed: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  actionIcon: {
    width: 24,
    height: 24,
    marginRight: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  actionTitle: {
    fontSize: 16,
    color: "#1A1A1A",
    fontWeight: "500",
  },
  actionTitleHighlighted: {
    color: "#EF4444",
  },
  cancelButton: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 0,
    paddingVertical: 14,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
});

export default ActionSheetProvider;
