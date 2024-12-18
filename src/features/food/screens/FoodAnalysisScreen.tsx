import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { apiService } from "../../../shared/services/api";
import { FoodItem, NutrientEnum } from "../../../shared/utils/types";
import { calculateTotalFoodValues } from "../../../shared/utils/utils";
import useLoading from "../../../shared/hooks/useLoading";
import ImageDisplay from "../components/ImageDisplay";
import FoodInfo from "../components/FoodInfo";
import NutrientDisplay from "../components/NutrientDisplay";
import HealthierAlternatives from "../components/HealthierAlternatives";
import { useAppContext } from "../../../shared/context/AppContext";
import {
  AppStackParamList,
  AppStackScreenNames,
} from "../../../navigation/AppStack";
import { BottomTabScreenNames } from "../../../navigation/BottomTab";
import analytics from "../../../shared/services/analytics";
import i18n from "../../../i18n/i18n";
import PrimaryButton from "../../../shared/components/library/PrimaryButton";
import StickyFrame from "../../../shared/components/library/StickyFrame";
import HealthyScore from "../components/HealthyScore";

type PhotoAnalysisRouteProp = RouteProp<
  AppStackParamList,
  AppStackScreenNames.FoodAnalysisScreen
>;

export default function FoodAnalysisScreen({
  route,
}: {
  route: PhotoAnalysisRouteProp;
}) {
  const { imageUri, description } = route.params;
  const [analysisResult, setAnalysisResult] = useState<FoodItem | null>(null);
  const { backgroundColor } = useLoading();
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { setCurrentIntake, currentIntake, addTodaysFoodEntry } =
    useAppContext();

  useEffect(() => {
    const analyzeImage = async () => {
      try {
        let result;
        if (imageUri) {
          result = await apiService.analyzeFoodImage(imageUri);
        } else if (description) {
          result = await apiService.analyzeFoodDescription(description);
        }
        setAnalysisResult(result);
      } catch (error) {
        analytics.track("ErrorAnalyzingFood:", { error });
        Alert.alert(
          i18n.t("screens.photo_analysis.error"),
          i18n.t("screens.photo_analysis.error_description"),
        );
      }
    };

    analyzeImage();
  }, [description, imageUri]);

  const handleSaveNutrient = useCallback(
    (newQuantity: string, nutrientId: NutrientEnum) => {
      if (analysisResult) {
        const parsedQuantity = Math.abs(parseFloat(newQuantity));
        if (Number.isNaN(parsedQuantity)) {
          Alert.alert(
            i18n.t("screens.photo_analysis.invalid_input"),
            i18n.t("screens.photo_analysis.invalid_input_description"),
          );
          return;
        }
        const newNutritientValuePer100g =
          parsedQuantity /
          (analysisResult.portion_size ? analysisResult.portion_size / 100 : 1);

        switch (nutrientId) {
          case NutrientEnum.PORTION_SIZE:
            setAnalysisResult({
              ...analysisResult,
              portion_size: parsedQuantity,
            });
            break;
          case NutrientEnum.PROTEIN:
            setAnalysisResult({
              ...analysisResult,
              protein_per_100g: newNutritientValuePer100g,
            });
            break;
          case NutrientEnum.CARBOHYDRATES:
            setAnalysisResult({
              ...analysisResult,
              carbohydrates_per_100g: newNutritientValuePer100g,
            });
            break;
          case NutrientEnum.FAT:
            setAnalysisResult({
              ...analysisResult,
              fat_per_100g: newNutritientValuePer100g,
            });
            break;
          default:
            break;
        }
      }
    },
    [analysisResult],
  );

  const getNutrientName = useCallback((nutrient: NutrientEnum): string => {
    switch (nutrient) {
      case NutrientEnum.CALORIES:
        return i18n.t("common.Calories");
      case NutrientEnum.PORTION_SIZE:
        return `${i18n.t("common.Portion_size")} (g)`;
      case NutrientEnum.PROTEIN:
        return `${i18n.t("common.Protein")} (g)`;
      case NutrientEnum.CARBOHYDRATES:
        return `${i18n.t("common.Carbohydrates")} (g)`;
      case NutrientEnum.FAT:
        return `${i18n.t("common.Fat")} (g)`;
      default:
        return i18n.t("screens.photo_analysis.unknown_nutrient");
    }
  }, []);

  const handleEditNutrient = useCallback(
    (nutrientId: string) => {
      if (analysisResult) {
        const nutrientName = getNutrientName(nutrientId as NutrientEnum);

        Alert.prompt(
          i18n.t("screens.photo_analysis.edit_nutrient", {
            nutrient: nutrientName,
          }),
          i18n.t("screens.photo_analysis.enter_new_nutrient", {
            nutrient: nutrientName.toLowerCase(),
          }),
          [
            {
              text: i18n.t("common.cancel"),
              onPress: () => {},
              style: "cancel",
            },
            {
              text: i18n.t("common.done"),
              onPress: (newValue?: string) => {
                if (newValue) {
                  analytics.track("EditNutrient", {
                    nutrient: nutrientName,
                    newValue,
                  });
                  handleSaveNutrient(newValue, nutrientId as NutrientEnum);
                }
              },
            },
          ],
          "plain-text",
          "",
          "numeric",
        );
      }
    },
    [analysisResult, getNutrientName, handleSaveNutrient],
  );

  const handleDiscardChanges = useCallback(() => {
    Alert.alert(
      i18n.t("feedback.discard_changes"),
      i18n.t("feedback.discard_changes_description"),
      [
        { text: i18n.t("feedback.discard_changes_cancel"), style: "cancel" },
        {
          text: i18n.t("feedback.discard_changes_confirm"),
          onPress: () => {
            setAnalysisResult(null);
            navigation.navigate(BottomTabScreenNames.HOME);
          },
          style: "destructive",
        },
      ],
    );
  }, [navigation]);

  const handleAddToDailyIntake = useCallback(() => {
    if (!analysisResult) {
      Alert.alert(
        i18n.t("feedback.error"),
        i18n.t("feedback.oops_something_went_wrong"),
      );
      return;
    }
    analytics.track("AddToDailyIntake", {
      analysisResult,
    });

    addTodaysFoodEntry({
      date: new Date().getTime(),
      item: analysisResult,
      image: imageUri ?? null,
    });

    const totalFoodValues = calculateTotalFoodValues(analysisResult);
    setCurrentIntake({
      calories: currentIntake.calories + totalFoodValues.calories,
      protein: currentIntake.protein + totalFoodValues.protein,
      carbohydrates:
        currentIntake.carbohydrates + totalFoodValues.carbohydrates,
      fat: currentIntake.fat + totalFoodValues.fat,
    });

    navigation.navigate(BottomTabScreenNames.HOME);
  }, [
    addTodaysFoodEntry,
    analysisResult,
    currentIntake.calories,
    currentIntake.carbohydrates,
    currentIntake.fat,
    currentIntake.protein,
    imageUri,
    navigation,
    setCurrentIntake,
  ]);

  return (
    <StickyFrame
      footer={
        <PrimaryButton
          disabled={!analysisResult || !analysisResult.is_food_item}
          onPress={handleAddToDailyIntake}
          text={i18n.t("common.add")}
        />
      }
    >
      <TouchableOpacity
        style={[styles.closeButton, styles.darkCircle]}
        onPress={handleDiscardChanges}
      >
        <Ionicons name="close" size={24} color="white" />
      </TouchableOpacity>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageDisplay imageUri={imageUri ?? null} />
        <View style={styles.contentContainer}>
          <FoodInfo
            analysisResult={analysisResult}
            backgroundColor={backgroundColor}
            handleEditNutrient={handleEditNutrient}
          />
          <NutrientDisplay
            analysisResult={analysisResult}
            handleEditNutrient={handleEditNutrient}
          />
          <HealthierAlternatives
            analysisResult={analysisResult}
            backgroundColor={backgroundColor}
          />
          {analysisResult && (
            <HealthyScore healthyScore={analysisResult.healthy_score} />
          )}
        </View>
      </ScrollView>
    </StickyFrame>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 100,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
  },
  darkCircle: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
