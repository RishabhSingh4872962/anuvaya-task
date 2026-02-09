import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";

type CircleButtonProps = {
  size: number;
  onPress: () => void;
  Icon: React.ReactNode;
  borderColor?: string;
  borderWidth?: number;
  backgroundColor?: string;
  style?: ViewStyle;
};

export const CircleButton = ({
  size,
  onPress,
  Icon,
  borderColor = "#9F0909",
  borderWidth = 3,
  backgroundColor = "transparent",
  style,
}: CircleButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor,
          borderWidth,
          backgroundColor,
        },
        style,
      ]}
    >
      {Icon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  circle: {
    justifyContent: "center",
    alignItems: "center",
  },
});