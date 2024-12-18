import React from "react";
import { Text, TopNav } from "react-native-rapi-ui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScrollView, StyleSheet, View } from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import * as HapticFeedback from "expo-haptics";
import AnimatedLottieView from "lottie-react-native";
import {
  OnboardingStackParamList,
  OnboardingStackScreenNames,
} from "../../../navigation/Onboarding";

import PrimaryButton from "../../../shared/components/library/PrimaryButton";
import i18n from "../../../i18n/i18n";
import { theme } from "../../../theme/theme";
import useIsSmallScreen from "../../../shared/hooks/useIsSmallScreen";

export default function ObstaclesMotivationScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const isSmallScreen = useIsSmallScreen();
  const navigation =
    useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();
  const handleNextPress = () => {
    HapticFeedback.impactAsync(HapticFeedback.ImpactFeedbackStyle.Medium);
    navigation.navigate(OnboardingStackScreenNames.PastAttempts);
  };

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <TopNav
        middleContent={
          <Text size="h3" style={{ color: theme.colors.textPrimary }}>
            {i18n.t("screens.obstacles_motivation.title")}
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
            color={theme.colors.textPrimary}
          />
        }
      />
      <ScrollView
        style={{ marginTop: 16, paddingBottom: bottom }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1, marginBottom: 16 }}>
          <Text
            size="h1"
            fontWeight="bold"
            style={{ color: theme.colors.textPrimary }}
          >
            {i18n.t("screens.obstacles_motivation.subtitle")}
          </Text>
          <Text
            size="xl"
            style={{ marginTop: 24, color: theme.colors.textPrimary }}
          >
            {i18n.t("screens.obstacles_motivation.description_1")}
          </Text>
          <Text
            size="xl"
            style={{
              marginTop: 16,
              marginBottom: 4,
              color: theme.colors.textPrimary,
            }}
          >
            {i18n.t("screens.obstacles_motivation.description_2")}
          </Text>
          <AnimatedLottieView
            source={require("../../../assets/animations/checklist.json")}
            autoPlay
            loop
            style={{ width: "100%", height: isSmallScreen ? 150 : 230 }}
          />
          <Text
            size="lg"
            style={{ marginTop: 24, color: theme.colors.textPrimary }}
          >
            {i18n.t("screens.obstacles_motivation.description_3")}
          </Text>
        </View>
        <PrimaryButton
          text={i18n.t("common.continue")}
          onPress={handleNextPress}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.secondary,
  },
});
