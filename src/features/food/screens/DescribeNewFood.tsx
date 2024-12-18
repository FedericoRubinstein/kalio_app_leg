import React, { useCallback, useState } from "react";
import { View, TextInput, StyleSheet, Keyboard, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { EvilIcons } from "@expo/vector-icons";
import { Text, TopNav } from "react-native-rapi-ui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import i18n from "../../../i18n/i18n";
import {
  AppStackParamList,
  AppStackScreenNames,
} from "../../../navigation/AppStack";
import PrimaryButton from "../../../shared/components/library/PrimaryButton";

const MAX_LENGTH = 300;

export default function DescribeNewFood() {
  const [description, setDescription] = useState("");
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { top } = useSafeAreaInsets();

  const handleSubmit = useCallback(() => {
    navigation.navigate(AppStackScreenNames.FoodAnalysisScreen, {
      description,
    });
  }, [navigation, description]);

  const handleDismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  const handleKeyPress = useCallback(
    ({ nativeEvent: { key } }: { nativeEvent: { key: string } }) => {
      if (key === "Enter" && description.length > 0) {
        handleDismissKeyboard();
      }
    },
    [description.length, handleDismissKeyboard],
  );

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <TopNav
        middleContent={
          <Text fontWeight="bold">{i18n.t("screens.home.describe_food")}</Text>
        }
        backgroundColor="transparent"
        borderColor="transparent"
        leftAction={() => navigation.goBack()}
        leftContent={<EvilIcons name="chevron-left" size={34} />}
        rightContent={
          <Text adjustsFontSizeToFit numberOfLines={1}>
            {`${MAX_LENGTH - description.length}`}
          </Text>
        }
      />
      <TextInput
        style={styles.input}
        multiline
        maxLength={MAX_LENGTH}
        onKeyPress={handleKeyPress}
        placeholder={i18n.t("screens.home.describe_food_placeholder")}
        value={description}
        onChangeText={(text) => {
          setDescription(text);
        }}
        scrollEnabled
        autoFocus
        returnKeyType="done"
      />
      <Pressable onPress={handleDismissKeyboard} style={{ flex: 1 }} />
      <PrimaryButton
        text={i18n.t("common.continue")}
        onPress={handleSubmit}
        disabled={description.length === 0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  topNavigation: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 0,
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
  },
});
