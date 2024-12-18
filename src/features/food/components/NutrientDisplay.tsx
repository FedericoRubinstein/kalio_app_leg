import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FoodItem, NutrientEnum } from "../../../shared/utils/types";
import { calculateTotalFoodValues } from "../../../shared/utils/utils";
import i18n from "../../../i18n/i18n";

interface NutrientDisplayProps {
  analysisResult: FoodItem | null;
  handleEditNutrient: (nutrientId: string) => void;
}

const NutrientDisplay: React.FC<NutrientDisplayProps> = ({
  analysisResult,
  handleEditNutrient,
}) => {
  const getNutrientValue = (nutrient: NutrientEnum) => {
    if (!analysisResult) return "--";
    const totalFoodValues = calculateTotalFoodValues(analysisResult);
    switch (nutrient) {
      case NutrientEnum.CALORIES:
        return totalFoodValues.calories.toString();
      case NutrientEnum.PROTEIN:
        return totalFoodValues.protein
          ? totalFoodValues.protein.toString()
          : "0";
      case NutrientEnum.CARBOHYDRATES:
        return totalFoodValues.carbohydrates
          ? totalFoodValues.carbohydrates.toString()
          : "0";
      case NutrientEnum.FAT:
        return totalFoodValues.fat ? totalFoodValues.fat.toString() : "0";
      default:
        return "--";
    }
  };

  return (
    <View>
      <View style={styles.nutrientContainer}>
        <Text style={styles.text} numberOfLines={1} adjustsFontSizeToFit>
          {i18n.t("common.Calories")}
        </Text>
        <Text
          style={styles.sectionTitle}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {getNutrientValue(NutrientEnum.CALORIES)}
          {" kcal"}
        </Text>
      </View>
      <View style={styles.container}>
        <NutrientBox
          label={i18n.t("common.Protein")}
          id="protein"
          value={getNutrientValue(NutrientEnum.PROTEIN)}
          backgroundColor="#FF7515"
          handleEditNutrient={handleEditNutrient}
        />
        <NutrientBox
          label={i18n.t("common.Carbs")}
          id="carbohydrates"
          value={getNutrientValue(NutrientEnum.CARBOHYDRATES)}
          backgroundColor="#FEA6E6"
          handleEditNutrient={handleEditNutrient}
        />
        <NutrientBox
          id="fat"
          label={i18n.t("common.Fat")}
          value={getNutrientValue(NutrientEnum.FAT)}
          backgroundColor="#ADCB3B"
          handleEditNutrient={handleEditNutrient}
        />
      </View>
    </View>
  );
};

interface NutrientBoxProps {
  label: string;
  id: string;
  value: string;
  backgroundColor: string;
  handleEditNutrient: (nutrientId: string) => void;
}

export const NutrientBox: React.FC<NutrientBoxProps> = ({
  label,
  id,
  value,
  backgroundColor,
  handleEditNutrient,
}) => {
  return (
    <TouchableOpacity
      style={[styles.nutrientContainer, { backgroundColor }]}
      onPress={() => handleEditNutrient(id)}
    >
      <Text style={styles.text} numberOfLines={1} adjustsFontSizeToFit>
        {label}
      </Text>
      <Text style={styles.sectionTitle} numberOfLines={1} adjustsFontSizeToFit>
        {`${value}g`}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  nutrientContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default NutrientDisplay;
