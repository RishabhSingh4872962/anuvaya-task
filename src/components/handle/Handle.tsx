import { View, StyleSheet } from "react-native";
import React from "react";
import { colors } from "../theme/colors";

interface HandlProps {
  width?: number;
  height?: number;
  backgroundColor?: string;
  paddingVertical?: number;
}
const Handle: React.FC<HandlProps> = ({
  width = 13,
  height = 3,
  backgroundColor = colors.textMuted,
  paddingVertical = 2,
}) => {
  return (
    <View
      style={[
        styles.handleContainer,
        {
          paddingVertical,
        },
      ]}
    >
      <View
        style={[
          styles.handle,
          {
            width,
            height,
            backgroundColor,
          },
        ]}
      />
    </View>
  );
};

export default Handle;

const styles = StyleSheet.create({
  handleContainer: {
    alignItems: "center",
  },
  handle: {
    borderRadius: 2,
  },
});
