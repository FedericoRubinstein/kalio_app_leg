import { LinearGradient } from "expo-linear-gradient";
import React from "react";

export const GRADIENT_COLORS = ["#2F2B2A", "#1F1B1A"];
export default function GradientBackground({
  colors = GRADIENT_COLORS,
}: {
  colors?: string[];
}) {
  return (
    <LinearGradient
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        flex: 1,
      }}
      colors={colors}
    />
  );
}
