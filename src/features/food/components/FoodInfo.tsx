import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FoodItem } from "../../../shared/utils/types";
import { theme } from "../../../theme/theme";
import i18n from "../../../i18n/i18n";

interface FoodInfoProps {
  analysisResult: FoodItem | null;
  backgroundColor: Animated.AnimatedInterpolation<string | number>;
  handleEditNutrient: (nutrientId: string) => void;
}

const FoodInfo: React.FC<FoodInfoProps> = ({
  analysisResult,
  backgroundColor,
  handleEditNutrient,
}) => {
  const getPortionSize = () => {
    if (!analysisResult || !analysisResult.portion_size) return "--";
    return analysisResult.portion_size.toString();
  };

  return (
    <>
      <View style={styles.titleContainer}>
        {analysisResult ? (
          <>
            <Text style={styles.title}>{analysisResult.name}</Text>
            <TouchableOpacity
              onPress={() => handleEditNutrient("portion_size")}
            >
              <Text style={styles.portionContainer}>
                {i18n.t("common.Portion_size")}
                {": "}
                <Text style={styles.portionSizeValue}>
                  {`${getPortionSize()}g `}
                </Text>
                <Ionicons name="create-outline" />
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <Animated.View
            style={[
              styles.loadingText,
              { backgroundColor, height: 40, width: "34%" },
            ]}
          />
        )}
      </View>

      {analysisResult ? (
        <Text style={styles.description}>
          {analysisResult.short_description}
        </Text>
      ) : (
        <>
          <Animated.View
            style={[styles.loadingText, { backgroundColor, marginBottom: 8 }]}
          />
          <Animated.View style={[styles.loadingText, { backgroundColor }]} />
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  portionContainer: {
    color: theme.colors.textSecondary,
  },
  portionSizeValue: {
    textDecorationLine: "underline",
  },
  description: {
    fontSize: 16,
    marginBottom: 8,
    color: theme.colors.textSecondary,
  },
  loadingText: {
    height: 25,
    width: 300,
    borderRadius: 10,
  },
});

export default FoodInfo;
