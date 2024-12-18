import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Text } from "react-native-rapi-ui";
import * as HapticFeedback from "expo-haptics";
import { theme } from "../../../theme/theme";

interface SelectableFieldProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  description?: string;
  alignment?: "center" | "flex-start";
}

export default function SelectableField({
  label,
  selected,
  onPress,
  description,
  alignment = "center",
}: SelectableFieldProps) {
  const handlePress = () => {
    HapticFeedback.impactAsync(HapticFeedback.ImpactFeedbackStyle.Light);
    onPress();
  };
  return (
    <Pressable
      onPress={handlePress}
      style={[
        styles.container,
        {
          borderColor: selected ? theme.colors.secondary : "#ccc",
          justifyContent: alignment,
        },
      ]}
    >
      <Text
        size="lg"
        numberOfLines={2}
        adjustsFontSizeToFit
        style={{
          color: selected ? theme.colors.secondary : "black",
          fontWeight: selected ? "bold" : "medium",
          textAlign: "center",
        }}
      >
        {label}
      </Text>
      {description && (
        <Text size="sm" style={{ marginTop: 4, color: "#666" }}>
          {description}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    minHeight: 68,
  },
});
