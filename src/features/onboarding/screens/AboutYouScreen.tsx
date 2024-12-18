import React, { useCallback, useEffect, useState } from "react";
import { Text, Button, TopNav } from "react-native-rapi-ui";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Picker } from "@react-native-picker/picker";
import { EvilIcons } from "@expo/vector-icons";
import * as HapticFeedback from "expo-haptics";

import StepProgress from "../components/StepProgress";
import {
  ONBOARDING_STEPS,
  OnboardingStackParamList,
  OnboardingStackScreenNames,
} from "../../../navigation/Onboarding";
import analytics from "../../../shared/services/analytics";
import { useOnboardingContext } from "../../../shared/context/OnboardingContext";
import { Gender } from "./types";
import PressableSelection from "../../../shared/components/library/PressableSelection";
import PrimaryButton from "../../../shared/components/library/PrimaryButton";
import i18n from "../../../i18n/i18n";
import { theme } from "../../../theme/theme";
import { useAppContext } from "../../../shared/context/AppContext";
import { UnitSystem } from "../../../shared/utils/types";
import SelectableField from "../../../shared/components/library/SelectableField";
import {
  getHeightPickerItems,
  getWeightPickerItems,
} from "../../../shared/utils/utils";

const enum PickerFields {
  Height = "height",
  Gender = "gender",
  CurrentWeight = "currentWeight",
  DesiredWeight = "desiredWeight",
  Age = "age",
}

const units = {
  Imperial: "Imperial (lbs/in)",
  Metric: "Metric (kg/cm)",
};

export default function AboutYouScreen() {
  const { top } = useSafeAreaInsets();
  const { toggleUnitSystem, unitPreference } = useAppContext();
  const { setUserInfo } = useOnboardingContext();

  const [height, setHeight] = useState(175);
  const [gender, setGender] = useState<Gender>(Gender.Male);
  const [age, setAge] = useState(25);

  const [currentWeight, setCurrentWeight] = useState(70);
  const [desiredWeight, setDesiredWeight] = useState(70);

  const [showPicker, setShowPicker] = useState<PickerFields | null>(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();

  const handleNextPress = useCallback(() => {
    if (height && gender && currentWeight && desiredWeight) {
      const userInfo = {
        height: height.toString(),
        gender,
        age: age.toString(),
        currentWeight: currentWeight.toString(),
        desiredWeight: desiredWeight.toString(),
      };
      analytics.track("UserInfo", userInfo);
      HapticFeedback.impactAsync(HapticFeedback.ImpactFeedbackStyle.Medium);
      setUserInfo(userInfo);
      navigation.navigate(OnboardingStackScreenNames.WeeklyLossGoal);
    }
  }, [
    height,
    gender,
    currentWeight,
    desiredWeight,
    age,
    setUserInfo,
    navigation,
  ]);

  const isFormValid = height && gender && currentWeight && desiredWeight;

  // Update starting weight and height when we change unit preferences
  useEffect(() => {
    if (unitPreference === UnitSystem.IMPERIAL) {
      setCurrentWeight(154);
      setDesiredWeight(154);
      setHeight(60);
    } else {
      setCurrentWeight(70);
      setDesiredWeight(70);
      setHeight(175);
    }
  }, [unitPreference]);

  const handlePickerPress = (field: PickerFields) => {
    setShowPicker(field);
  };

  const handlePickerClose = () => {
    setShowPicker(null);
  };

  const renderPicker = useCallback(() => {
    if (!showPicker) return null;

    let pickerItems: JSX.Element[] = [];
    let selectedValue: string = "";
    let onValueChange: (value: string) => void = () => {};

    switch (showPicker) {
      case PickerFields.Height:
        pickerItems = getHeightPickerItems(unitPreference).map((value) => (
          <Picker.Item
            key={value}
            label={`${value} ${
              unitPreference === UnitSystem.METRIC ? "cm" : "in"
            }`}
            value={value.toString()}
          />
        ));
        selectedValue = height.toString();
        onValueChange = (value: string) => setHeight(Number(value));
        break;
      case PickerFields.Age:
        pickerItems = Array.from({ length: 83 }, (_, i) => i + 18).map(
          (value) => (
            <Picker.Item
              key={value}
              label={value.toString()}
              value={value.toString()}
            />
          ),
        );
        selectedValue = age.toString();
        onValueChange = (value: string) => setAge(parseInt(value, 10));
        break;
      case PickerFields.Gender:
        pickerItems = Object.values(Gender).map((value) => (
          <Picker.Item
            key={value}
            label={i18n.t(`genre.${value.toLowerCase()}`)}
            value={value}
          />
        ));
        selectedValue = gender;
        onValueChange = (value: string) => setGender(value as Gender);
        break;
      case PickerFields.CurrentWeight:
      case PickerFields.DesiredWeight:
        pickerItems = getWeightPickerItems(unitPreference).map((value) => (
          <Picker.Item
            key={value}
            label={`${value} ${
              unitPreference === UnitSystem.METRIC ? "kg" : "lbs"
            }`}
            value={value.toString()}
          />
        ));
        selectedValue =
          showPicker === PickerFields.CurrentWeight
            ? currentWeight.toString()
            : desiredWeight.toString();
        onValueChange =
          showPicker === PickerFields.CurrentWeight
            ? (value: string) => setCurrentWeight(Number(value))
            : (value: string) => setDesiredWeight(Number(value));
        break;
      default:
        return null;
    }

    return (
      <View style={styles.pickerContainer}>
        {showPicker && (
          <Pressable
            onPress={handlePickerClose}
            style={{ flex: 1, backgroundColor: "transparent" }}
          />
        )}
        <View style={{ backgroundColor: "white" }}>
          <Picker
            selectedValue={selectedValue}
            style={{
              height: 200,
              width: "100%",
              backgroundColor: "white",
              paddingBottom: 32,
            }}
            onValueChange={(itemValue) => onValueChange(itemValue.toString())}
          >
            {pickerItems}
          </Picker>
          <Button
            text={i18n.t("common.done")}
            onPress={handlePickerClose}
            color={theme.colors.cta}
            style={{
              marginHorizontal: 16,
              marginBottom: 32,
            }}
          />
        </View>
      </View>
    );
  }, [
    age,
    currentWeight,
    desiredWeight,
    gender,
    height,
    showPicker,
    unitPreference,
  ]);

  return (
    <>
      <View style={[styles.container, { paddingTop: top }]}>
        <TopNav
          middleContent={
            <Text size="h3" style={{ color: theme.colors.textSecondary }}>
              {i18n.t("screens.about_you.heading")}
            </Text>
          }
          backgroundColor="transparent"
          borderColor="transparent"
          leftAction={() => navigation.goBack()}
          leftContent={
            <EvilIcons
              name="chevron-left"
              size={34}
              color={theme.colors.textSecondary}
            />
          }
        />
        <StepProgress currentStep={4} totalSteps={ONBOARDING_STEPS} />
        <ScrollView
          style={{ marginTop: 16 }}
          contentContainerStyle={{ paddingBottom: 90 }}
          showsVerticalScrollIndicator={false}
        >
          <Text
            size="h1"
            fontWeight="bold"
            style={{ marginBottom: 16, color: theme.colors.textSecondary }}
          >
            {i18n.t("screens.about_you.title")}
          </Text>
          <View style={styles.row}>
            <View style={styles.spacerView}>
              <SelectableField
                label={units.Imperial}
                selected={unitPreference === UnitSystem.IMPERIAL}
                onPress={toggleUnitSystem}
              />
            </View>
            <View style={{ width: 16 }} />
            <View style={styles.spacerView}>
              <SelectableField
                label={units.Metric}
                selected={unitPreference === UnitSystem.METRIC}
                onPress={toggleUnitSystem}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.spacerView}>
              <PressableSelection
                label={`${i18n.t("screens.about_you.height")} ${
                  unitPreference === UnitSystem.IMPERIAL ? "(in)" : "(cm)"
                }`}
                value={`${height} ${
                  unitPreference === UnitSystem.IMPERIAL ? "in" : "cm"
                }`}
                onPress={() => handlePickerPress(PickerFields.Height)}
              />
            </View>
            <View style={{ width: 16 }} />
            <View style={styles.spacerView}>
              <PressableSelection
                label={i18n.t("screens.about_you.age")}
                value={age.toString()}
                onPress={() => handlePickerPress(PickerFields.Age)}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.spacerView}>
              <PressableSelection
                label={i18n.t("screens.about_you.gender")}
                value={i18n.t(`genre.${gender.toLowerCase()}`)}
                onPress={() => handlePickerPress(PickerFields.Gender)}
              />
            </View>
            <View style={{ width: 16 }} />
            <View style={styles.spacerView}>
              <PressableSelection
                label={`${i18n.t("screens.about_you.current_weight")} ${
                  unitPreference === UnitSystem.IMPERIAL ? "(lbs)" : "(kg)"
                }`}
                value={`${currentWeight} ${
                  unitPreference === UnitSystem.IMPERIAL ? "lbs" : "kg"
                }`}
                onPress={() => handlePickerPress(PickerFields.CurrentWeight)}
              />
            </View>
          </View>

          <View
            style={[
              styles.spacerView,
              {
                width: "80%",
                paddingRight: 16,
                alignSelf: "center",
                marginBottom: 16,
              },
            ]}
          >
            <PressableSelection
              label={`${i18n.t("screens.about_you.desired_weight")} ${
                unitPreference === UnitSystem.IMPERIAL ? "(lbs)" : "(kg)"
              }`}
              value={`${desiredWeight} ${
                unitPreference === UnitSystem.IMPERIAL ? "lbs" : "kg"
              }`}
              onPress={() => handlePickerPress(PickerFields.DesiredWeight)}
            />
          </View>
          <PrimaryButton
            text={i18n.t("common.continue")}
            onPress={handleNextPress}
            disabled={!isFormValid}
          />
        </ScrollView>
      </View>
      {renderPicker()}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
    paddingBottom: 0,
  },
  spacerView: {
    marginTop: 16,
    flex: 1,
  },
  row: {
    flexDirection: "row",
    flex: 1,
  },
  pickerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    top: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
});
