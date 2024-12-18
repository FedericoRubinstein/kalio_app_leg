import React, { useCallback } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Text } from "react-native-rapi-ui";
import { useNavigation } from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PrimaryButton from "../../../../shared/components/library/PrimaryButton";
import i18n from "../../../../i18n/i18n";
import { theme } from "../../../../theme/theme";
import {
  OnboardingStackParamList,
  OnboardingStackScreenNames,
} from "../../../../navigation/Onboarding";
import { images } from "../../../../assets/images";
import useIsSmallScreen from "../../../../shared/hooks/useIsSmallScreen";

export default function Scan() {
  const { bottom } = useSafeAreaInsets();
  const isSmallScreen = useIsSmallScreen();
  const navigation =
    useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();

  const handleNextPress = useCallback(() => {
    Haptics.selectionAsync();
    navigation.navigate(OnboardingStackScreenNames.InstructionsAnalyze);
  }, [navigation]);

  return (
    <View style={{ flex: 1 }}>
      <Image source={images.onboarding_scan} style={styles.image} />
      <View style={[styles.container, { paddingBottom: bottom + 8 }]}>
        <View style={{ flex: 1 }}>
          <Text
            size={isSmallScreen ? "h3" : "h1"}
            fontWeight="bold"
            style={styles.title}
          >
            {i18n.t("screens.how_it_works.scan.title")}
          </Text>
          <Text
            size="xl"
            style={{
              marginTop: isSmallScreen ? 8 : 16,
              marginBottom: isSmallScreen ? 16 : 24,
              color: theme.colors.textSecondary,
              textAlign: "center",
            }}
          >
            {i18n.t("screens.how_it_works.scan.subtitle")}
          </Text>
        </View>
        <PrimaryButton
          text={i18n.t("common.continue")}
          onPress={handleNextPress}
          backgroundColor={theme.colors.cta}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    marginTop: -24,
    paddingHorizontal: 24,
    borderTopEndRadius: 12,
    borderTopStartRadius: 12,
    backgroundColor: theme.colors.primary,
    flex: 1,
  },
  image: {
    flex: 1.8,
    width: "100%",
    resizeMode: "cover",
  },
  title: {
    color: theme.colors.textSecondary,
    marginBottom: 16,
    textAlign: "center",
  },
});
