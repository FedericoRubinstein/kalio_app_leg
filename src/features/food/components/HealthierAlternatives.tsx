import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { FoodItem } from "../../../shared/utils/types";
import i18n from "../../../i18n/i18n";
import { theme } from "../../../theme/theme";

interface HealthierAlternativesProps {
  analysisResult: FoodItem | null;
  backgroundColor: Animated.AnimatedInterpolation<string | number>;
}

const HealthierAlternatives: React.FC<HealthierAlternativesProps> = ({
  analysisResult,
  backgroundColor,
}) => (
  <View>
    <Text style={[styles.sectionTitle, { marginTop: 32, marginBottom: 16 }]}>
      {i18n.t("screens.photo_analysis.healthier_alternatives")}
    </Text>
    {analysisResult != null ? (
      analysisResult.healthier_alternatives.length > 0 ? (
        analysisResult.healthier_alternatives.map((alternative, index) => (
          <Text key={index} style={styles.text}>
            {alternative}
          </Text>
        ))
      ) : (
        <Text style={styles.text}>
          {i18n.t("screens.photo_analysis.no_alternatives")}
        </Text>
      )
    ) : (
      <>
        <Animated.View
          style={[styles.loadingText, { backgroundColor, marginBottom: 8 }]}
        />
        <Animated.View style={[styles.loadingText, { backgroundColor }]} />
      </>
    )}
  </View>
);

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
    color: theme.colors.textSecondary,
  },
  loadingText: {
    height: 25,
    width: 300,
    borderRadius: 10,
  },
});

export default HealthierAlternatives;
