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
import { PastAttempt } from "./types";
import PrimaryButton from "../../../shared/components/library/PrimaryButton";
import i18n from "../../../i18n/i18n";
import { theme } from "../../../theme/theme";

export default function PastAttemptsScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const [selectedAttempts, setSelectedAttempts] = useState<PastAttempt[]>([]);
  const { setPastAttempts } = useOnboardingContext();
  const navigation =
    useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();

  const pastAttempts: PastAttempt[] = [
    PastAttempt.CalorieCounting,
    PastAttempt.KetoDiet,
    PastAttempt.IntermittentFasting,
    PastAttempt.LowCarbDiet,
    PastAttempt.VegetarianVeganDiet,
    PastAttempt.IncreasedPhysicalActivity,
    PastAttempt.WeightLossSupplements,
    PastAttempt.MealReplacementShakes,
  ];

  const handleNextPress = useCallback(() => {
    analytics.track("PastAttempts", selectedAttempts);
    HapticFeedback.impactAsync(HapticFeedback.ImpactFeedbackStyle.Medium);
    setPastAttempts(selectedAttempts);
    navigation.navigate(OnboardingStackScreenNames.ActivityLevel);
  }, [navigation, selectedAttempts, setPastAttempts]);

  const handleAttemptPress = (attempt: PastAttempt) => {
    setSelectedAttempts((prevAttempts) =>
      prevAttempts.includes(attempt)
        ? prevAttempts.filter((a) => a !== attempt)
        : [...prevAttempts, attempt],
    );
  };

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <TopNav
        middleContent={
          <Text size="h3" style={{ color: theme.colors.textSecondary }}>
            {i18n.t("screens.past_attempts.heading")}
          </Text>
        }
        backgroundColor="transparent"
        borderColor="transparent"
        leftAction={() => {
          navigation.goBack();
        }}
        leftContent={
          <EvilIcons
            name="chevron-left"
            size={34}
            color={theme.colors.textSecondary}
          />
        }
      />
      <StepProgress currentStep={2} totalSteps={ONBOARDING_STEPS} />
      <ScrollView
        style={{ marginTop: 16 }}
        contentContainerStyle={{ paddingBottom: 24 + bottom }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1, marginBottom: 16 }}>
          <Text
            size="h1"
            fontWeight="bold"
            style={{
              fontFamily: "SpaceMono-Regular",
              color: theme.colors.textSecondary,
            }}
          >
            {i18n.t("screens.past_attempts.title")}
          </Text>
          <Text
            size="lg"
            style={{
              marginTop: 24,
              marginBottom: 8,
              color: theme.colors.textSecondary,
            }}
          >
            {i18n.t("screens.past_attempts.subtitle")}
          </Text>
          <View style={styles.attemptsContainer}>
            {pastAttempts.map((attempt, index) => (
              <React.Fragment key={attempt}>
                <View style={styles.attemptItem}>
                  <SelectableField
                    label={i18n.t(`past_attempts.${attempt}`)}
                    selected={selectedAttempts.includes(attempt)}
                    onPress={() => handleAttemptPress(attempt)}
                  />
                </View>
                {index % 2 !== 0 && index < pastAttempts.length - 1 && (
                  <View style={styles.attemptSpacer} />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>
        <PrimaryButton
          text={i18n.t("common.continue")}
          onPress={handleNextPress}
          disabled={selectedAttempts.length === 0}
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
  attemptsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  attemptItem: {
    width: "48%",
  },
  attemptSpacer: {
    width: "100%",
    height: 8,
  },
});
