import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Text, TopNav } from "react-native-rapi-ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppContext } from "../../../shared/context/AppContext";
import analytics from "../../../shared/services/analytics";
import PressableInput from "../../../shared/components/library/PressableInput";
import i18n from "../../../i18n/i18n";
import { theme } from "../../../theme/theme";

export default function EditGoals() {
  const { intakeGoal, setIntakeGoal } = useAppContext();
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation();
  const [calories, setCalories] = useState(intakeGoal?.calories.toString());
  const [protein, setProtein] = useState(intakeGoal?.protein.toString());
  const [carbohydrates, setCarbohydrates] = useState(
    intakeGoal?.carbohydrates.toString(),
  );
  const [fat, setFat] = useState(intakeGoal?.fat.toString());

  const handleSave = () => {
    setIntakeGoal({
      calories: parseInt(calories.length > 0 ? calories : "0", 10),
      protein: parseInt(protein.length > 0 ? protein : "0", 10),
      carbohydrates: parseInt(
        carbohydrates.length > 0 ? carbohydrates : "0",
        10,
      ),
      fat: parseInt(fat.length > 0 ? fat : "0", 10),
    });

    analytics.track("GoalsUpdated", {
      calories,
      protein,
      carbohydrates,
      fat,
    });
    navigation.goBack();
  };

  const handleGoBack = useCallback(() => {
    const hasChanges =
      calories !== intakeGoal?.calories.toString() ||
      protein !== intakeGoal?.protein.toString() ||
      carbohydrates !== intakeGoal?.carbohydrates.toString() ||
      fat !== intakeGoal?.fat.toString();

    if (hasChanges) {
      Alert.alert(
        i18n.t("feedback.discard_changes"),
        i18n.t("feedback.discard_changes_description"),
        [
          {
            text: i18n.t("feedback.discard_changes_cancel"),
            style: "cancel",
          },
          {
            text: i18n.t("feedback.discard_changes_confirm"),
            onPress: () => navigation.goBack(),
            style: "destructive",
          },
        ],
      );
    } else {
      navigation.goBack();
    }
  }, [
    calories,
    intakeGoal?.calories,
    intakeGoal?.protein,
    intakeGoal?.carbohydrates,
    intakeGoal?.fat,
    protein,
    carbohydrates,
    fat,
    navigation,
  ]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={20}
    >
      <View style={[styles.container, { paddingTop: top }]}>
        <TopNav
          middleContent={
            <Text
              style={{
                color: theme.colors.textSecondary,
              }}
              fontWeight="bold"
            >
              {i18n.t("screens.edit_goals.title")}
            </Text>
          }
          leftContent={
            <Ionicons
              name="arrow-back"
              size={24}
              color={theme.colors.textSecondary}
            />
          }
          borderColor="transparent"
          backgroundColor="transparent"
          leftAction={handleGoBack}
          rightAction={handleSave}
          rightContent={
            <Text
              style={{ color: theme.colors.cta }}
              allowFontScaling={false}
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              OK
            </Text>
          }
        />
        <ScrollView
          contentContainerStyle={{ paddingBottom: 90 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.spacerView}>
            <PressableInput
              label={i18n.t("common.Calories")}
              value={calories}
              keyboardType="numeric"
              onChange={(text: string) => setCalories(text)}
            />
          </View>
          <View style={styles.spacerView}>
            <PressableInput
              label={`${i18n.t("common.Protein")} (g)`}
              value={protein}
              onChange={(text: string) => setProtein(text)}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.spacerView}>
            <PressableInput
              label={`${i18n.t("common.Carbohydrates")} (g)`}
              value={carbohydrates}
              onChange={(text: string) => setCarbohydrates(text)}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.spacerView}>
            <PressableInput
              label={`${i18n.t("common.Fat")} (g)`}
              value={fat}
              onChange={(text: string) => setFat(text)}
              keyboardType="numeric"
            />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 0,
  },
  spacerView: {
    marginTop: 16,
  },
  pickerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 32,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
});
