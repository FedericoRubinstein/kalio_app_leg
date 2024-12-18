import React, { useCallback, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/core";
import { Text, TopNav } from "react-native-rapi-ui";
import { ScrollView, StyleSheet, View } from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import * as HapticFeedback from "expo-haptics";
import { useOnboardingContext } from "../../../shared/context/OnboardingContext";
import { Obstacle as ObstaclesEnum } from "./types";
import analytics from "../../../shared/services/analytics";
import {
  ONBOARDING_STEPS,
  OnboardingStackParamList,
  OnboardingStackScreenNames,
} from "../../../navigation/Onboarding";
import StepProgress from "../components/StepProgress";
import SelectableField from "../../../shared/components/library/SelectableField";
import PrimaryButton from "../../../shared/components/library/PrimaryButton";
import i18n from "../../../i18n/i18n";
import { theme } from "../../../theme/theme";

export default function Obstacles() {
  const { top, bottom } = useSafeAreaInsets();
  const [selectedObstacles, setSelectedObstacles] = useState<ObstaclesEnum[]>(
    [],
  );
  const { setObstacles } = useOnboardingContext();
  const navigation =
    useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();

  const obstacles = [
    ObstaclesEnum.Cravings,
    ObstaclesEnum.Food,
    ObstaclesEnum.Hard,
    ObstaclesEnum.Hunger,
    ObstaclesEnum.Motivation,
    ObstaclesEnum.Progress,
    ObstaclesEnum.Support,
    ObstaclesEnum.Other,
  ];

  const handleNextPress = useCallback(() => {
    analytics.track("ObstaclesMotivation", selectedObstacles);
    HapticFeedback.impactAsync(HapticFeedback.ImpactFeedbackStyle.Medium);
    setObstacles(selectedObstacles);
    navigation.navigate(OnboardingStackScreenNames.ObstaclesMotivation);
  }, [navigation, selectedObstacles, setObstacles]);

  const handleObstaclePress = (obstacle: ObstaclesEnum) => {
    if (selectedObstacles.includes(obstacle)) {
      setSelectedObstacles((prevObs) => prevObs.filter((o) => o !== obstacle));
      return;
    }

    setSelectedObstacles((prevObs) => [...prevObs, obstacle]);
  };

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <TopNav
        middleContent={
          <Text size="h3">{i18n.t("screens.obstacles.title")}</Text>
        }
        backgroundColor="transparent"
        borderColor="transparent"
        leftAction={() => {
          navigation.goBack();
        }}
        leftContent={<EvilIcons name="chevron-left" size={34} />}
      />
      <StepProgress currentStep={1} totalSteps={ONBOARDING_STEPS} />
      <ScrollView
        contentContainerStyle={{ paddingBottom: bottom }}
        style={{ marginTop: 24, flex: 1 }}
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
          {i18n.t("screens.obstacles.description")}
        </Text>
        <Text
          size="lg"
          style={{
            marginTop: 24,
            marginBottom: 8,
            color: theme.colors.textSecondary,
          }}
        >
          {i18n.t("screens.obstacles.description_2")}
        </Text>
        <View style={styles.obstaclesContainer}>
          {obstacles.map((obs, index) => (
            <View key={obs} style={styles.obstacleItem}>
              <SelectableField
                label={i18n.t(`obstacles.${obs}`)}
                selected={selectedObstacles.includes(obs)}
                onPress={() => handleObstaclePress(obs)}
              />
              {index % 2 === 0 && index < obstacles.length - 1 && (
                <View style={styles.obstacleSpacer} />
              )}
            </View>
          ))}
        </View>
        <View style={{ marginTop: 16, marginBottom: 24 }}>
          <PrimaryButton
            text={i18n.t("common.continue")}
            onPress={handleNextPress}
            disabled={selectedObstacles.length === 0}
          />
        </View>
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
  obstaclesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  obstacleItem: {
    width: "48%",
  },
  obstacleSpacer: {
    width: "100%",
    height: 8,
  },
});
