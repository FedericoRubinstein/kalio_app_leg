import React, { useCallback, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-rapi-ui";
import Video, { VideoRef } from "react-native-video";
import { useNavigation } from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PrimaryButton from "../../../shared/components/library/PrimaryButton";
import { usePaywall } from "../../../shared/hooks/usePaywall";
import {
  RootStackParamList,
  RootStackScreenNames,
} from "../../../navigation/RootStack";
import { useOnboardingContext } from "../../../shared/context/OnboardingContext";
import { Gender } from "./types";
import i18n from "../../../i18n/i18n";
import { useFeatureFlags } from "../../../shared/context/FeatureFlagsContext";
import { theme } from "../../../theme/theme";

export default function PaywallsScreen() {
  const videoRef = useRef<VideoRef | null>(null);
  const { showMainPaywall, showOfferPaywall, showFreePaywall } = usePaywall();
  const { userInfo } = useOnboardingContext();
  const { bottom } = useSafeAreaInsets();
  const { flags } = useFeatureFlags();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleNextPress = useCallback(async () => {
    // show the free paywall if enabled
    if (flags.has_lifetime_free_offer) {
      const hasPaid = await showFreePaywall();
      if (hasPaid) {
        navigation.navigate(RootStackScreenNames.Main);
        return;
      }
      return;
    }

    const hasPaid = await showMainPaywall();
    if (hasPaid) {
      navigation.navigate(RootStackScreenNames.Main);
      return;
    }
    await showOfferPaywall();

    navigation.navigate(RootStackScreenNames.Main);
  }, [
    flags.has_lifetime_free_offer,
    navigation,
    showFreePaywall,
    showMainPaywall,
    showOfferPaywall,
  ]);

  const videoSource =
    userInfo.gender === Gender.Male
      ? require("../../../assets/videos/man_video.mp4")
      : require("../../../assets/videos/woman_video.mp4");

  return (
    <View style={{ flex: 1 }}>
      <Video
        source={videoSource}
        style={styles.video}
        ref={videoRef}
        onEnd={() => videoRef?.current?.seek(0)}
      />
      <View style={[styles.container, { paddingBottom: bottom + 8 }]}>
        <View style={{ flex: 1 }}>
          <Text size="h1" fontWeight="bold" style={styles.title}>
            {i18n.t("screens.paywall.title")}
          </Text>
          <Text size="xl" style={styles.description}>
            {i18n.t("screens.paywall.subtitle")}
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
  video: {
    flex: 1.8,
    width: "100%",
    resizeMode: "contain",
  },
  title: {
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  description: {
    color: theme.colors.textSecondary,
    marginTop: 16,
    marginBottom: 24,
    textAlign: "center",
  },
});
