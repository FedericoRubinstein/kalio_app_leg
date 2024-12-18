import React, { useState } from "react";
import {
  Alert,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Updates from "expo-updates";
import { Layout, Text, TopNav } from "react-native-rapi-ui";
import { useNavigation } from "@react-navigation/native";
import AnimatedLottieView from "lottie-react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { EvilIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppContext } from "../../../shared/context/AppContext";
import useAppReview from "../../../shared/hooks/useAppReview";
import analytics from "../../../shared/services/analytics";
import {
  AppStackParamList,
  AppStackScreenNames,
} from "../../../navigation/AppStack";
import i18n from "../../../i18n/i18n";
import { theme } from "../../../theme/theme";
import { UnitSystem } from "../../../shared/utils/types";

export default function Settings() {
  const { navigateToStore } = useAppReview();
  const { resetTodayData, unitPreference, toggleUnitSystem } = useAppContext();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSourcesModal, setShowSourcesModal] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const sourcesModal = () => {
    return (
      <Modal
        visible={showSourcesModal}
        style={{ backgroundColor: theme.colors.primary }}
      >
        <View
          style={{
            marginTop: 16,
            flex: 1,
            justifyContent: "center",
            alignItems: "flex-start",
            padding: 16,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setShowSourcesModal(false);
            }}
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              padding: 8,
              backgroundColor: "white",
              borderRadius: 20,
              elevation: 2,
            }}
          >
            <Text style={{ fontSize: 18, color: "black" }}>✖</Text>
          </TouchableOpacity>
          <Text size="md" style={{ marginBottom: 8, fontStyle: "italic" }}>
            {i18n.t("screens.settings.sources_description")}
          </Text>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                "https://www.healthline.com/health/what-is-basal-metabolic-rate",
              )
            }
          >
            <Text style={{ color: "blue", textDecorationLine: "underline" }}>
              {i18n.t("screens.settings.bmr")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://pubmed.ncbi.nlm.nih.gov/28630601/")
            }
          >
            <Text style={{ color: "blue", textDecorationLine: "underline" }}>
              {i18n.t("screens.settings.isns")}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };

  const menuElements = [
    {
      title: i18n.t("screens.settings.review"),
      onPress: navigateToStore,
      icon: "📝",
    },
    {
      title: i18n.t("screens.settings.edit_goals"),
      onPress: async () => {
        await analytics.track("Menu:EditGoals");
        navigation.navigate(AppStackScreenNames.EditGoals);
      },
      icon: "🎯",
    },
    {
      title: i18n.t("screens.settings.reset_today"),
      onPress: async () => {
        Alert.alert(
          i18n.t("screens.settings.reset_today"),
          i18n.t("screens.settings.reset_today_description"),
          [
            {
              text: i18n.t("screens.settings.reset_today_cancel"),
              style: "cancel",
            },
            {
              text: i18n.t("screens.settings.reset_today_confirm"),
              style: "destructive",
              onPress: () => {
                resetTodayData();
                setShowSuccess(true);
              },
            },
          ],
          { cancelable: false },
        );
      },
      icon: "🔄",
    },

    {
      title: i18n.t("screens.settings.email_us"),
      onPress: async () => {
        await analytics.track("Menu:EmailUs");
        const email = "mateo@rubitec.co";
        Linking.openURL(`mailto:${email}`);
      },
      icon: "📭",
    },
    {
      title: i18n.t("screens.settings.about_us"),
      onPress: async () => {
        await analytics.track("Menu:AboutUs");
        WebBrowser.openBrowserAsync("https://www.rubitec.co/about-us");
      },
      icon: "👋",
    },
    {
      title: i18n.t("screens.settings.privacy_policy"),
      onPress: async () => {
        await analytics.track("Menu:PrivacyPolicy");
        WebBrowser.openBrowserAsync(
          "https://www.rubitec.co/kalio-privacy-policy",
        );
      },
      icon: "🔐",
    },
    {
      title: i18n.t("screens.settings.terms_and_conditions"),
      onPress: async () => {
        await analytics.track("Menu:TermsAndConditions");
        WebBrowser.openBrowserAsync(
          "https://www.rubitec.co/kalio-terms-of-service",
        );
      },
      icon: "📜",
    },
    {
      title: i18n.t("screens.settings.user_license_agreement"),
      onPress: async () => {
        await analytics.track("Menu:UserLicenseAgreement");
        WebBrowser.openBrowserAsync(
          "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/",
        );
      },
      icon: "📝",
    },
    {
      title: i18n.t("screens.settings.sources"),
      onPress: () => {
        setShowSourcesModal(true);
      },
      icon: "📚",
    },
  ];

  const resetApp = () => {
    AsyncStorage.clear();
    Updates.reloadAsync();
  };

  return (
    <Layout backgroundColor={theme.colors.primary}>
      <TopNav
        backgroundColor="transparent"
        borderColor="transparent"
        middleContent={
          <Text
            fontWeight="bold"
            style={{
              padding: 16,
              textAlign: "center",
              color: theme.colors.textSecondary,
            }}
          >
            {i18n.t("screens.settings.title")}
          </Text>
        }
      />
      <ScrollView>
        {__DEV__ && (
          <>
            <PressableComponent
              index={0}
              element={{
                title: "Change unit system",
                onPress: toggleUnitSystem,
                subtitle: `Active: ${
                  unitPreference === UnitSystem.METRIC ? "Metric" : "Imperial"
                }`,
                icon: "🔄",
              }}
            />
            <PressableComponent
              index={1}
              element={{
                title: "RESET APP",
                onPress: () => {
                  Alert.alert(
                    "RESET APP",
                    "Are you sure you want to reset the app? This can't be undone.",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Reset",
                        style: "destructive",
                        onPress: resetApp,
                      },
                    ],
                    { cancelable: false },
                  );
                },
                icon: "⛔️",
              }}
            />
          </>
        )}
        {menuElements.map((element, index) => (
          <PressableComponent key={index} index={index} element={element} />
        ))}
      </ScrollView>
      {sourcesModal()}
      {showSuccess && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: theme.colors.primary,
              padding: 20,
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <AnimatedLottieView
              source={require("../../../assets/animations/success.json")}
              autoPlay
              loop={false}
              style={{ width: 150, height: 150 }}
              onAnimationFinish={() => {
                setTimeout(() => setShowSuccess(false), 500);
              }}
            />
          </View>
        </View>
      )}
    </Layout>
  );
}

const PressableComponent = ({
  index,
  element,
}: {
  index: number;
  element: {
    title: string;
    onPress: () => void;
    icon: string;
    subtitle?: string;
  };
}) => {
  return (
    <TouchableOpacity
      key={index}
      style={styles.pressable}
      onPress={element.onPress}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text size="xl" style={{ marginTop: -4 }}>
          {element.icon}
        </Text>
        <View>
          <Text
            size="xl"
            numberOfLines={1}
            adjustsFontSizeToFit
            style={{
              marginLeft: 10,
              color: theme.colors.textSecondary,
            }}
          >
            {element.title}
          </Text>
          {element.subtitle && (
            <Text
              size="md"
              style={{ marginLeft: 10, color: theme.colors.textSecondary }}
            >
              {element.subtitle}
            </Text>
          )}
        </View>
      </View>
      <EvilIcons
        name="arrow-right"
        size={32}
        color={theme.colors.textSecondary}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pressable: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.textSecondary,
  },
});
