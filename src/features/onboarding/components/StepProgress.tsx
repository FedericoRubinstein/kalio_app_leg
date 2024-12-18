import React from "react";
import { StyleSheet, View } from "react-native";
import { theme } from "../../../theme/theme";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  isDarkBackground?: boolean;
}

export default function StepProgress({
  currentStep,
  totalSteps,
  isDarkBackground = false,
}: StepProgressProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.line,
            {
              backgroundColor:
                index <= currentStep
                  ? isDarkBackground
                    ? theme.colors.textPrimary
                    : theme.colors.secondary
                  : "#B0BEC5",
              marginRight: index < totalSteps - 1 ? 8 : 0,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  line: {
    flex: 1,
    height: 8,
    borderRadius: 4,
  },
});
