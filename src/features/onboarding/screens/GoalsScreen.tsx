import React, { useCallback, useState } from "react";
import { Text, TopNav } from "react-native-rapi-ui";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
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
import { Goal } from "./types";
import PrimaryButton from "../../../shared/components/library/PrimaryButton";
import i18n from "../../../i18n/i18n";
import { theme } from "../../../theme/theme";

export default function Goals() {
  const { top, bottom } = useSafeAreaInsets();
  const [selectedGoal, setSelectedGoal] = useState<Goal>();
  const { setGoals } = useOnboardingContext();
  const navigation =
    useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();

  const goals = [
    Goal.LoseWeight,
    Goal.GainWeight,
    Goal.MaintainWeight,
    Goal.ImproveHealth,
    Goal.BuildMuscle,
    Goal.ManageStress,
    Goal.ImproveSleep,
    Goal.ChangeDiet,
  ];

  const handleNextPress = useCallback(() => {
    analytics.track("GoalsMotivation", selectedGoal);
    HapticFeedback.impactAsync(HapticFeedback.ImpactFeedbackStyle.Medium);
    if (selectedGoal) {
      // Leaving as an array if we want to add more goals in the future
      setGoals([selectedGoal]);
      navigation.navigate(OnboardingStackScreenNames.GoalsMotivation);
    }
  }, [navigation, selectedGoal, setGoals]);

  const handleGoalPress = (goal: Goal) => {
    if (selectedGoal === goal) {
      setSelectedGoal(undefined);
      return;
    }
    setSelectedGoal(goal);
  };

  return (
    <View
      style={[styles.container, { paddingTop: top, paddingBottom: bottom }]}
    >
      <TopNav
        middleContent={<Text size="h3">{i18n.t("screens.goals.heading")}</Text>}
        backgroundColor="transparent"
        borderColor="transparent"
      />
      <StepProgress currentStep={0} totalSteps={ONBOARDING_STEPS} />
      <ScrollView
        style={{ marginTop: 24 }}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          size="h1"
          fontWeight="bold"
          style={{
            fontFamily: "SpaceMono-Regular",
            color: theme.colors.textSecondary,
          }}
        >
          {i18n.t("screens.goals.title")}
        </Text>
        <Text
          size="lg"
          style={{
            marginTop: 24,
            marginBottom: 8,
            color: theme.colors.textSecondary,
          }}
        >
          {i18n.t("screens.goals.description")}
        </Text>
        <View style={styles.buttonsContainer}>
          {goals.map((goal, index) => (
            <View key={goal} style={styles.buttonItem}>
              <SelectableField
                label={i18n.t(`goal.${goal}`)}
                selected={selectedGoal === goal}
                onPress={() => handleGoalPress(goal)}
              />
              {index % 2 === 0 && index < goals.length - 1 && (
                <View style={styles.buttonSpacer} />
              )}
            </View>
          ))}
        </View>
        <PrimaryButton
          text={i18n.t("common.continue")}
          onPress={handleNextPress}
          backgroundColor="#2ecc71"
          disabled={!selectedGoal}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.primary,
    paddingBottom: 0,
  },
  buttonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  buttonItem: {
    width: "48%",
  },
  buttonSpacer: {
    width: "100%",
    height: 8,
  },
});
