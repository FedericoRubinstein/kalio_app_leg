import React, { useCallback, useState } from "react";
import { Text, TopNav } from "react-native-rapi-ui";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { EvilIcons } from "@expo/vector-icons";
import * as HapticFeedback from "expo-haptics";
import StepProgress from "../components/StepProgress";
import SelectableField from "../../../shared/components/library/SelectableField";
import {
  ONBOARDING_STEPS,
  OnboardingStackParamList,
  OnboardingStackScreenNames,
} from "../../../navigation/Onboarding";
import analytics from "../../../shared/services/analytics";
import { useOnboardingContext } from "../../../shared/context/OnboardingContext";
import { WeeklyLossGoal } from "./types";
import PrimaryButton from "../../../shared/components/library/PrimaryButton";
import i18n from "../../../i18n/i18n";
import { theme } from "../../../theme/theme";
import { useAppContext } from "../../../shared/context/AppContext";
import { lossCopy } from "../utils";

export default function WeeklyLossGoalScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const [selectedGoal, setSelectedGoal] = useState<WeeklyLossGoal | null>(null);
  const { unitPreference } = useAppContext();
  const { setWeeklyLossGoal } = useOnboardingContext();
  const navigation =
    useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();

  const weeklyLossGoals = Object.values(WeeklyLossGoal);

  const handleNextPress = useCallback(() => {
    if (selectedGoal) {
      analytics.track("WeeklyGoal", { goal: selectedGoal });
      setWeeklyLossGoal(selectedGoal as WeeklyLossGoal);
      HapticFeedback.impactAsync(HapticFeedback.ImpactFeedbackStyle.Medium);
      navigation.navigate(OnboardingStackScreenNames.Results);
    }
  }, [navigation, selectedGoal, setWeeklyLossGoal]);

  const handleGoalPress = (goal: WeeklyLossGoal) => {
    if (selectedGoal === goal) {
      setSelectedGoal(null);
      return;
    }

    setSelectedGoal(goal);
  };

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <TopNav
        middleContent={
          <Text size="h3" style={{ color: theme.colors.textSecondary }}>
            {i18n.t("screens.weekly_loss_goal.title")}
          </Text>
        }
        backgroundColor="transparent"
        borderColor="transparent"
        leftAction={() => navigation.goBack()}
        leftContent={
          <EvilIcons
            name="chevron-left"
            size={34}
            color={theme.colors.textSecondary}
          />
        }
      />
      <StepProgress
        currentStep={ONBOARDING_STEPS}
        totalSteps={ONBOARDING_STEPS}
      />
      <ScrollView
        style={{ marginTop: 24, flex: 1 }}
        contentContainerStyle={{ paddingBottom: bottom + 24, flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1 }}>
          <Text
            size="h1"
            fontWeight="bold"
            style={{ marginBottom: 24, color: theme.colors.textSecondary }}
          >
            {i18n.t("screens.weekly_loss_goal.subtitle")}
          </Text>
          <View>
            {weeklyLossGoals.map((goal) => (
              <SelectableField
                key={goal}
                label={`${lossCopy(goal, unitPreference)} ${i18n.t(`screens.weekly_loss_goal.per_week`)}`}
                selected={selectedGoal === goal}
                onPress={() => handleGoalPress(goal)}
                description={
                  goal === WeeklyLossGoal.medium
                    ? `(${i18n.t("screens.weekly_loss_goal.recommended")})`
                    : ""
                }
              />
            ))}
          </View>
        </View>
        <PrimaryButton
          text={i18n.t("common.continue")}
          onPress={handleNextPress}
          disabled={selectedGoal == null}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
    paddingBottom: 0,
  },
});
