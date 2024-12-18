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
import { ActivityLevel, ActivityLevelEnum } from "./types";
import PrimaryButton from "../../../shared/components/library/PrimaryButton";
import i18n from "../../../i18n/i18n";
import { theme } from "../../../theme/theme";

export default function ActivityLevelScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const [selectedActivityLevel, setSelectedActivityLevel] =
    useState<ActivityLevelEnum | null>(null);
  const { setActivityLevel } = useOnboardingContext();
  const navigation =
    useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();

  const activityLevels: ActivityLevel[] = [
    {
      id: ActivityLevelEnum.Sedentary,
      label: i18n.t("activity_level.sedentary"),
      description: i18n.t("activity_level.sedentary_description"),
    },
    {
      id: ActivityLevelEnum.LightlyActive,
      label: i18n.t("activity_level.lightly_active"),
      description: i18n.t("activity_level.lightly_active_description"),
    },
    {
      id: ActivityLevelEnum.ModeratelyActive,
      label: i18n.t("activity_level.moderately_active"),
      description: i18n.t("activity_level.moderately_active_description"),
    },
    {
      id: ActivityLevelEnum.VeryActive,
      label: i18n.t("activity_level.very_active"),
      description: i18n.t("activity_level.very_active_description"),
    },
  ];

  const handleNextPress = useCallback(() => {
    if (selectedActivityLevel) {
      analytics.track("ActivityLevel", { level: selectedActivityLevel });
      HapticFeedback.impactAsync(HapticFeedback.ImpactFeedbackStyle.Medium);
      setActivityLevel(selectedActivityLevel);
      navigation.navigate(OnboardingStackScreenNames.AboutYou);
    }
  }, [navigation, selectedActivityLevel, setActivityLevel]);

  const handleActivityLevelPress = (activityLevelId: ActivityLevelEnum) => {
    setSelectedActivityLevel(activityLevelId);
  };

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <TopNav
        middleContent={
          <Text size="h3" style={{ color: theme.colors.textSecondary }}>
            {i18n.t("screens.activity_level.heading")}
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
      <StepProgress currentStep={3} totalSteps={ONBOARDING_STEPS} />
      <ScrollView
        style={{ marginTop: 24, flex: 1 }}
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
            {i18n.t("screens.activity_level.title")}
          </Text>
          <Text
            size="lg"
            style={{
              marginTop: 24,
              marginBottom: 8,
              color: theme.colors.textSecondary,
            }}
          >
            {i18n.t("screens.activity_level.subtitle")}
          </Text>
          <View>
            {activityLevels.map((level) => (
              <SelectableField
                key={level.id}
                label={level.label}
                description={level.description}
                selected={selectedActivityLevel === level.id}
                onPress={() =>
                  handleActivityLevelPress(level.id as ActivityLevelEnum)
                }
              />
            ))}
          </View>
        </View>
        <PrimaryButton
          text={i18n.t("common.continue")}
          onPress={handleNextPress}
          disabled={!selectedActivityLevel}
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
