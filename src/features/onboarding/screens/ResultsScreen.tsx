import React, { useCallback, useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "react-native-rapi-ui";
import { useNavigation } from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Platform,
} from "react-native";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import AnimatedLottieView from "lottie-react-native";
import { EvilIcons } from "@expo/vector-icons";
import * as HapticFeedback from "expo-haptics";
import { getLocales } from "expo-localization";
import Purchases from "react-native-purchases";
import { useOnboardingContext } from "../../../shared/context/OnboardingContext";
import { ActivityLevelEnum, WeeklyLossGoal } from "./types";

import useAppReview from "../../../shared/hooks/useAppReview";
import analytics from "../../../shared/services/analytics";
import { useAppContext } from "../../../shared/context/AppContext";
import GradientBackground from "../../../shared/components/library/GradientBackground";
import PrimaryButton from "../../../shared/components/library/PrimaryButton";
import useIsSmallScreen from "../../../shared/hooks/useIsSmallScreen";
import {
  OnboardingStackParamList,
  OnboardingStackScreenNames,
} from "../../../navigation/Onboarding";
import i18n from "../../../i18n/i18n";
import { theme } from "../../../theme/theme";
import { calculateDailyIntake } from "../../../shared/utils/utils";
import { UnitSystem } from "../../../shared/utils/types";
import { convertWeight } from "../../../shared/utils/unitConversion";

export default function ResultsScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const [calorieIntake, setCalorieIntake] = useState<number | null>();
  const { weeklyLossGoal, userInfo, activityLevel } = useOnboardingContext();
  const {
    handleFinishOnboarding,
    setIntakeGoal,
    addToWeightHistory,
    unitPreference,
  } = useAppContext();
  const { rateTheApp } = useAppReview();
  const isSmallScreen = useIsSmallScreen();

  const navigation =
    useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();

  useEffect(() => {
    if (calorieIntake) {
      return;
    }

    const intake = calculateDailyIntake({
      age: Number.parseInt(userInfo.age, 10),
      gender: userInfo.gender,
      height:
        unitPreference === UnitSystem.IMPERIAL
          ? Number.parseInt(userInfo.height, 10) * 2.54
          : Number.parseInt(userInfo.height, 10),
      weight:
        unitPreference === UnitSystem.IMPERIAL
          ? Number.parseInt(userInfo.currentWeight, 10) * 0.453592
          : Number.parseInt(userInfo.currentWeight, 10),
      activityLevel: activityLevel as ActivityLevelEnum,
      weeklyLossGoal: weeklyLossGoal as WeeklyLossGoal,
    });
    analytics.track("onboarding_completed", {
      intakeGoal: intake,
      weeklyLossGoal,
      activityLevel,
      ...userInfo,
    });

    const timer = setTimeout(() => {
      Promise.all([
        setIntakeGoal(intake),
        addToWeightHistory({
          date: new Date().toISOString(),
          value: Number(userInfo.currentWeight),
        }),
      ]).then(() => {
        HapticFeedback.notificationAsync(
          HapticFeedback.NotificationFeedbackType.Success,
        );
        setCalorieIntake(intake.calories);
      });
    }, 4000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activityLevel,
    addToWeightHistory,
    calorieIntake,
    userInfo,
    weeklyLossGoal,
  ]);

  const totalLossInKg = () => {
    const lossInKg =
      weeklyLossGoal === WeeklyLossGoal.small
        ? 0.1
        : weeklyLossGoal === WeeklyLossGoal.medium
          ? 0.2
          : weeklyLossGoal === WeeklyLossGoal.large
            ? 0.4
            : 0.8;
    return lossInKg;
  };

  const totalLossCopy = () => {
    const twoMonthsFromNow = new Date();
    twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);
    const formattedDate = twoMonthsFromNow.toLocaleDateString(
      getLocales()[0].languageCode ?? "en",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      },
    );
    return (
      <Text
        style={{
          textAlign: "center",
          color: theme.colors.cta,
          fontSize: 24,
          marginTop: 8,
          fontWeight: "bold",
        }}
      >
        {i18n.t("screens.results.final.total_loss", {
          totalLoss:
            unitPreference === UnitSystem.IMPERIAL
              ? convertWeight(
                  totalLossInKg() * 8,
                  UnitSystem.METRIC,
                  UnitSystem.IMPERIAL,
                ).value
              : totalLossInKg() * 8,
          date: formattedDate,
          unit: unitPreference === UnitSystem.IMPERIAL ? "lbs" : "kg",
        })}
      </Text>
    );
  };

  const handleNextPress = useCallback(async () => {
    try {
      HapticFeedback.notificationAsync(
        HapticFeedback.NotificationFeedbackType.Success,
      );

      // Wait for the app review process to complete
      await rateTheApp();

      // Request tracking permissions
      if (Platform.OS === "ios") {
        await requestTrackingPermissionsAsync();
        await Purchases.collectDeviceIdentifiers();
      }

      // Identify the user with analytics
      analytics.identify({
        calorieIntakeGoal: calorieIntake,
        weeklyLossGoal,
        activityLevel,
        ...userInfo,
      });

      // Finish onboarding and navigate to the main screen
      handleFinishOnboarding();
      navigation.navigate(OnboardingStackScreenNames.InstructionsScan);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error during onboarding completion:", error);
      // Handle any errors that occurred during the process
      // You might want to show an error message to the user here
    }
  }, [
    activityLevel,
    calorieIntake,
    handleFinishOnboarding,
    navigation,
    rateTheApp,
    userInfo,
    weeklyLossGoal,
  ]);

  const renderLoading = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 24,
        }}
      >
        <Text
          size="h1"
          fontWeight="bold"
          style={{ color: theme.colors.textSecondary }}
        >
          {i18n.t("screens.results.loading.title")}
        </Text>
        <Text
          size="xl"
          style={{
            marginTop: 16,
            marginBottom: 24,
            textAlign: "center",
            color: theme.colors.textSecondary,
          }}
        >
          {i18n.t("screens.results.loading.subtitle")}
        </Text>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <AnimatedLottieView
            source={require("../../../assets/animations/loading_onboarding.json")}
            autoPlay
            loop
            style={{
              width: 250,
              height: 250,
            }}
            resizeMode="cover"
          />
        </View>
        <View style={{ flex: 0.5, justifyContent: "center" }}>
          <Text
            size="lg"
            style={{
              marginTop: 16,
              marginBottom: 24,
              textAlign: "center",
              color: theme.colors.textSecondary,
            }}
          >
            {i18n.t("screens.results.loading.description")}
          </Text>
        </View>
      </View>
    );
  };

  const renderResults = () => {
    return (
      <ScrollView
        horizontal={false}
        contentContainerStyle={{
          paddingBottom: bottom,
          width: "100%",
          alignItems: "center",
        }}
        style={{ marginTop: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedLottieView
          source={require("../../../assets/animations/confetti.json")}
          autoPlay
          loop
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.6,
            zIndex: 0,
            marginTop: -48,
          }}
          resizeMode="cover"
        />
        <AnimatedLottieView
          source={require("../../../assets/animations/confetti_explosion.json")}
          autoPlay
          loop={false}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.6,
            zIndex: 0,
            marginTop: -48,
          }}
          resizeMode="cover"
        />
        <Text
          size="h1"
          fontWeight="bold"
          style={{ color: theme.colors.textPrimary }}
        >
          {i18n.t("screens.results.final.title")}
        </Text>
        <Text
          size="xl"
          style={{
            marginVertical: 32,
            textAlign: "center",
            color: theme.colors.textPrimary,
          }}
        >
          {i18n.t("screens.results.final.subtitle")}
        </Text>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderRadius: 16,
            borderColor: theme.colors.textPrimary,
            padding: 16,
          }}
        >
          <Text
            size="xl"
            style={{
              marginBottom: isSmallScreen ? 24 : 32,
              textAlign: "center",
              color: theme.colors.textPrimary,
            }}
          >
            {i18n.t("screens.results.final.daily_intake")}
          </Text>
          <View
            style={{
              alignItems: "center",
            }}
          >
            <Text
              fontWeight="bold"
              size="h1"
              style={{ fontSize: 48, color: theme.colors.textPrimary }}
            >
              {calorieIntake}
            </Text>
            <Text size="xl" style={{ color: theme.colors.textPrimary }}>
              {i18n.t("common.calories")}
            </Text>
          </View>
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: theme.colors.textPrimary,
            minWidth: "100%",
            marginVertical: isSmallScreen ? 32 : 48,
          }}
        />
        <Text
          size="xl"
          style={{ textAlign: "center", color: theme.colors.textPrimary }}
        >
          {i18n.t("screens.results.final.help_you_lose")}
        </Text>
        {totalLossCopy()}
        <View
          style={{
            marginTop: isSmallScreen ? 32 : 48,
            flex: 1,
            justifyContent: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              marginBottom: isSmallScreen ? 12 : 16,
            }}
          >
            <EvilIcons
              name="check"
              size={24}
              color={theme.colors.textPrimary}
            />
            <Text
              size="lg"
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{ color: theme.colors.textPrimary }}
            >
              {i18n.t("screens.results.final.feature_1")}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: isSmallScreen ? 12 : 16,
            }}
          >
            <EvilIcons
              name="check"
              size={24}
              color={theme.colors.textPrimary}
            />
            <Text
              size="lg"
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{ color: theme.colors.textPrimary }}
            >
              {i18n.t("screens.results.final.feature_2")}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
              maxWidth: "80%",
            }}
          >
            <EvilIcons
              name="check"
              size={24}
              color={theme.colors.textPrimary}
            />
            <Text size="lg" style={{ color: theme.colors.textPrimary }}>
              {i18n.t("screens.results.final.feature_3")}
            </Text>
          </View>
          <View style={{ marginTop: 48, alignItems: "flex-start" }}>
            <Text
              size="lg"
              style={{ marginBottom: 8, color: theme.colors.textPrimary }}
            >
              {i18n.t("screens.results.final.sources")}
            </Text>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  "https://www.healthline.com/health/what-is-basal-metabolic-rate",
                )
              }
            >
              <Text
                style={{
                  color: theme.colors.primary,
                  textDecorationLine: "underline",
                }}
              >
                {i18n.t("screens.results.final.bmr")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL("https://pubmed.ncbi.nlm.nih.gov/28630601/")
              }
            >
              <Text
                style={{
                  color: theme.colors.primary,
                  textDecorationLine: "underline",
                }}
              >
                International Sport Nutrition Society
              </Text>
            </TouchableOpacity>
            <View
              style={{
                marginVertical: 48,
                width: "100%",
              }}
            >
              <PrimaryButton
                text={i18n.t("common.continue")}
                onPress={handleNextPress}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: top,
          backgroundColor: calorieIntake
            ? theme.colors.secondary
            : theme.colors.primary,
        },
      ]}
    >
      {calorieIntake && <GradientBackground />}
      {calorieIntake ? renderResults() : renderLoading()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 0,
    alignItems: "center",
  },
});
