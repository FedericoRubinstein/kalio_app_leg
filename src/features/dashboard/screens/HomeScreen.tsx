import React, { useCallback } from "react";
import { Layout, Text } from "react-native-rapi-ui";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { getCurrentGreeting } from "../../../shared/utils/utils";
import {
  AppStackParamList,
  AppStackScreenNames,
} from "../../../navigation/AppStack";
import analytics from "../../../shared/services/analytics";
import useIsSmallScreen from "../../../shared/hooks/useIsSmallScreen";
import { usePaywall } from "../../../shared/hooks/usePaywall";
import i18n from "../../../i18n/i18n";
import { theme } from "../../../theme/theme";
import CalorieSummary from "../components/CalorieSummary";
import IntakeSummary from "../components/IntakeSummary";
import TodaysIntake from "../components/TodaysIntake";

export default function Home() {
  const { showActionSheetWithOptions } = useActionSheet();
  const isSmallScreen = useIsSmallScreen();
  const { showPaywallIfNeeded } = usePaywall();
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const handleOpenCamera = useCallback(async () => {
    analytics.track("OpenImagePicker");

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      analytics.track("OpenImagePickerFailed", {
        reason: "Permission not granted",
      });
      Alert.alert(
        "Permission needed",
        "Camera permission is required to take a photo.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    analytics.track("OpenImagePickerSuccess");

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      navigation.navigate(AppStackScreenNames.FoodAnalysisScreen, {
        imageUri,
      });
    }
  }, [navigation]);
  const handleOpenLibrary = useCallback(async () => {
    analytics.track("OpenImagePicker");

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      analytics.track("OpenImagePickerFailed", {
        reason: "Permission not granted",
      });
      Alert.alert(
        "Permission needed",
        "Camera permission is required to take a photo.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    analytics.track("OpenImagePickerSuccess");

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      navigation.navigate(AppStackScreenNames.FoodAnalysisScreen, {
        imageUri,
      });
    }
  }, [navigation]);

  const navigateToDescribeNewFood = useCallback(() => {
    navigation.navigate(AppStackScreenNames.AddNewFoodFromDescription);
  }, [navigation]);

  const showActionSheet = useCallback(() => {
    const options = [
      i18n.t("screens.home.from_photo"),
      i18n.t("screens.home.from_library"),
      i18n.t("screens.home.from_description"),
      i18n.t("common.cancel"),
    ];
    const cancelButtonIndex = 3;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (selectedIndex?: number) => {
        switch (selectedIndex) {
          case 0:
            // Photo
            handleOpenCamera();
            break;

          case 1:
            // Library
            handleOpenLibrary();
            break;
          case 2:
            navigateToDescribeNewFood();
            break;
          case cancelButtonIndex:
          default:
          // Cancel
        }
      },
    );
  }, [
    handleOpenCamera,
    handleOpenLibrary,
    navigateToDescribeNewFood,
    showActionSheetWithOptions,
  ]);

  const handleAddFood = useCallback(async () => {
    analytics.track("AddFood");
    const hasPaid = await showPaywallIfNeeded();
    if (!hasPaid) {
      return;
    }
    showActionSheet();
  }, [showPaywallIfNeeded, showActionSheet]);

  return (
    <Layout style={styles.container} backgroundColor={theme.colors.primary}>
      <View
        style={{
          paddingHorizontal: 16,
          paddingBottom: 0,
          flex: 1,
        }}
      >
        <Text size="lg" fontWeight="regular" style={{ color: "grey" }}>
          {getCurrentGreeting()}!
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            size={isSmallScreen ? "h3" : "h2"}
            fontWeight="bold"
            style={{
              color: "black",
              marginTop: 8,
              width: "80%",
            }}
          >
            {i18n.t("screens.home.progress")}
          </Text>
          {/* New food icon */}
          <TouchableOpacity onPress={handleAddFood} style={styles.addButton}>
            <FontAwesome5 name="plus" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <Pressable
            onPress={() => navigation.navigate(AppStackScreenNames.EditGoals)}
            style={styles.summaryContainer}
          >
            <CalorieSummary />
            <IntakeSummary />
          </Pressable>
          <TodaysIntake addFood={handleAddFood} />
        </ScrollView>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
  },
  summaryContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 16,
  },
  addButton: {
    height: 50,
    width: 50,
    borderRadius: 100,
    backgroundColor: theme.colors.accentBlue,
    justifyContent: "center",
    alignItems: "center",
  },
});
