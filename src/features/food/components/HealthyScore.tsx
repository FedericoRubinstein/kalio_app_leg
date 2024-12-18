import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-rapi-ui";
import { theme } from "../../../theme/theme";
import i18n from "../../../i18n/i18n";

interface HealthyScoreProps {
  healthyScore: number;
}

export default function HealthyScore({ healthyScore }: HealthyScoreProps) {
  return (
    <View style={styles.container}>
      <Text fontWeight="bold" style={styles.title}>
        {i18n.t("screens.photo_analysis.healthy_score")}
      </Text>
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= healthyScore ? "star" : "star-outline"}
            size={36}
            color="#FFD700"
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.textSecondary,
  },
  starsContainer: {
    flexDirection: "row",
    gap: 4,
    marginTop: 8,
  },
  star: {
    fontSize: 24,
  },
});
