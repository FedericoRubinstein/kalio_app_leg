import React from "react";
import { Text, TopNav } from "react-native-rapi-ui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScrollView, StyleSheet, View } from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import { Shadow } from "react-native-shadow-2";
import AnimatedLottieView from "lottie-react-native";
import * as HapticFeedback from "expo-haptics";
import {
  OnboardingStackParamList,
  OnboardingStackScreenNames,
} from "../../../navigation/Onboarding";
import PrimaryButton from "../../../shared/components/library/PrimaryButton";
import i18n from "../../../i18n/i18n";
import { theme } from "../../../theme/theme";
import useIsSmallScreen from "../../../shared/hooks/useIsSmallScreen";

export default function GoalsMotivation() {
  const { top, bottom } = useSafeAreaInsets();
  const isSmallScreen = useIsSmallScreen();

  const navigation =
    useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();
  const handleNextPress = () => {
    HapticFeedback.impactAsync(HapticFeedback.ImpactFeedbackStyle.Medium);
    navigation.navigate(OnboardingStackScreenNames.Obstacles);
  };

  return (
    <View
      style={[styles.container, { paddingTop: top, paddingBottom: bottom }]}
    >
      <TopNav
        middleContent={
          <Text size="h3" style={{ color: theme.colors.textPrimary }}>
            {i18n.t("screens.goals_motivation.title")}
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
        contentContainerStyle={{ paddingBottom: 24 }}
        style={{ marginTop: 16, flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1, marginBottom: 24 }}>
          <Text
            size="h1"
            fontWeight="bold"
            style={{
              fontFamily: "SpaceMono-Regular",
              color: theme.colors.textPrimary,
            }}
          >
            {i18n.t("screens.goals_motivation.subtitle")}
          </Text>
          <Text
            size="xl"
            style={{
              marginTop: 24,
              marginBottom: 4,
              color: theme.colors.textPrimary,
            }}
          >
            {i18n.t("screens.goals_motivation.description_1")}
          </Text>
          <Text
            size="xl"
            style={{
              marginTop: 24,
              marginBottom: 4,
              color: theme.colors.textPrimary,
            }}
          >
            {i18n.t("screens.goals_motivation.description_2")}
          </Text>
          <AnimatedLottieView
            source={require("../../../assets/animations/scale.json")}
            autoPlay
            loop
            style={{
              width: "100%",
              height: isSmallScreen ? 150 : 230,
              marginTop: isSmallScreen ? 12 : 24,
            }}
          />
          <Text
            size="lg"
            style={{ marginTop: 24, color: theme.colors.textPrimary }}
            italic
          >
            {i18n.t("screens.goals_motivation.footer")}
          </Text>
        </View>
        <Shadow style={{ width: "100%", borderRadius: 16 }} offset={[2, 2]}>
          <PrimaryButton
            text={i18n.t("common.continue")}
            onPress={handleNextPress}
            disabled={false}
          />
        </Shadow>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondary,
    padding: 16,
  },
});
