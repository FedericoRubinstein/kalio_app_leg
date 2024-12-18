import { FontAwesome6 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import { Text, TopNav } from "react-native-rapi-ui";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getLocales } from "expo-localization";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import {
  BottomTabParamList,
  BottomTabScreenNames,
} from "../../../navigation/BottomTab";
import { useAppContext } from "../../../shared/context/AppContext";
import i18n from "../../../i18n/i18n";
import { theme } from "../../../theme/theme";
import { UnitSystem } from "../../../shared/utils/types";
import { getWeightPickerItems } from "../../../shared/utils/utils";

export default function AddWeight() {
  const navigation =
    useNavigation<NativeStackNavigationProp<BottomTabParamList>>();
  const { weightHistory, addToWeightHistory, unitPreference } = useAppContext();
  const lastWeight = weightHistory[0];
  const { bottom } = useSafeAreaInsets();

  const [date, setDate] = useState<Date>(new Date());
  const [isDateInputVisible, setIsDateInputVisible] = useState(false);
  const [isWeightPickerVisible, setIsWeightPickerVisible] = useState(false);

  const formatDate = (selectedDate: Date) => {
    return selectedDate.toLocaleDateString(
      getLocales()[0].languageCode ?? "en",
      {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      },
    );
  };
  const [formattedDate, setFormattedDate] = useState<string>(formatDate(date));

  const [weight, setWeight] = useState<number>(
    lastWeight?.value ?? (unitPreference === UnitSystem.METRIC ? 80 : 176),
  );

  const isSaveButtonDisabled = !weight || date === undefined;

  const handleWeightPress = () => {
    setIsDateInputVisible(false);
    setIsWeightPickerVisible(true);
  };

  const handleDatePress = () => {
    setIsWeightPickerVisible(false);
    setIsDateInputVisible(true);
  };

  const handleSave = useCallback(() => {
    if (isSaveButtonDisabled) {
      return;
    }

    if (weight !== undefined && date !== undefined) {
      addToWeightHistory({
        value: weight,
        date: date.toISOString(),
      });
      navigation.navigate(BottomTabScreenNames.TRACKER);
    }
  }, [isSaveButtonDisabled, weight, date, addToWeightHistory, navigation]);

  return (
    <TouchableWithoutFeedback>
      <View style={styles.container}>
        <TopNav
          middleContent={
            <Text
              style={{ color: theme.colors.textSecondary }}
              fontWeight="bold"
            >
              {i18n.t("screens.add_weight.title")}
            </Text>
          }
          backgroundColor="transparent"
          borderColor="transparent"
          leftContent={
            <FontAwesome6
              name="xmark"
              color={theme.colors.textSecondary}
              size={34}
              style={{ paddingLeft: 8 }}
            />
          }
          leftAction={() => {
            navigation.goBack();
          }}
          rightContent={
            <FontAwesome6
              name="check-circle"
              color={theme.colors.cta}
              size={34}
              style={{
                paddingRight: 8,
                opacity: isSaveButtonDisabled ? 0.5 : 1,
              }}
            />
          }
          rightAction={handleSave}
        />
        <View style={styles.container}>
          <TouchableOpacity style={styles.row} onPress={handleWeightPress}>
            <Text style={styles.label}>{i18n.t("common.weight")}</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputValue}>
                {`${weight} ${unitPreference === UnitSystem.METRIC ? "kg" : "lbs"}`}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row} onPress={handleDatePress}>
            <Text style={styles.label}>{i18n.t("common.date")}</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputValue}>
                {formattedDate || i18n.t("screens.add_weight.select_date")}
              </Text>
            </View>
          </TouchableOpacity>

          {isWeightPickerVisible && (
            <View style={[styles.pickerContainer, { paddingBottom: bottom }]}>
              <Picker
                selectedValue={weight}
                style={{ width: "100%", height: 200 }}
                onValueChange={(itemValue) => {
                  setWeight(itemValue);
                }}
                onResponderTerminationRequest={() => false}
                onStartShouldSetResponder={() => true}
              >
                {getWeightPickerItems(unitPreference).map((value) => (
                  <Picker.Item
                    key={value}
                    label={`${value} ${
                      unitPreference === UnitSystem.METRIC ? "kg" : "lbs"
                    }`}
                    value={value}
                  />
                ))}
              </Picker>
            </View>
          )}

          {isDateInputVisible && (
            <View style={[styles.pickerContainer, { paddingBottom: bottom }]}>
              <RNDateTimePicker
                display="spinner"
                locale={getLocales()[0].languageCode ?? "en"}
                value={date}
                maximumDate={new Date()}
                onChange={(_, selectedDate) => {
                  if (selectedDate) {
                    setDate(selectedDate ?? new Date());
                    setFormattedDate(formatDate(selectedDate));
                  }
                }}
              />
            </View>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingHorizontal: 0,
    backgroundColor: theme.colors.primary,
    paddingBottom: 0,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 16,
    height: 68,
  },
  label: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.textSecondary,
    flex: 1,
  },
  inputContainer: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  inputValue: {
    fontSize: 24,
    color: theme.colors.textSecondary,
    marginRight: 5,
  },
  pickerContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
