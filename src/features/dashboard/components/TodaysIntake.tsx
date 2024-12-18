import React, { useCallback, useRef } from "react";
import { Swipeable } from "react-native-gesture-handler";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { Text, themeColor } from "react-native-rapi-ui";
import { Dimensions, Image, Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppContext } from "../../../shared/context/AppContext";
import i18n from "../../../i18n/i18n";
import { FoodEntry } from "../../../shared/utils/types";
import { calculateTotalFoodValues } from "../../../shared/utils/utils";
import { theme } from "../../../theme/theme";
import { images } from "../../../assets/images";

interface TodaysIntakeProps {
  addFood: () => void;
}

export default function TodaysIntake({ addFood }: TodaysIntakeProps) {
  const { todaysFoodEntries } = useAppContext();

  return (
    <View style={styles.container}>
      <Text
        size="lg"
        fontWeight="bold"
        style={{
          marginBottom: 16,
          color: theme.colors.textSecondary,
        }}
      >
        {i18n.t("screens.home.today_intake")}
      </Text>

      {todaysFoodEntries.length === 0 ? (
        <Pressable onPress={addFood}>
          <Text
            size="md"
            style={{ color: theme.colors.cta, textDecorationLine: "underline" }}
          >
            {i18n.t("screens.home.add_first_intake")}
          </Text>
        </Pressable>
      ) : (
        <View style={styles.fullView}>
          {todaysFoodEntries.map((food, index) => (
            <FoodItem key={`${food}-${index}`} item={food} />
          ))}
        </View>
      )}
    </View>
  );
}

interface FoodItemProps {
  item: FoodEntry;
}

const FoodItem = ({ item }: FoodItemProps) => {
  const { deleteTodaysFoodEntry } = useAppContext();
  const swipeableRef = useRef<Swipeable>(null);
  const renderRightActions = useCallback(
    () => (
      <TouchableOpacity
        style={{
          height: "100%",
          backgroundColor: themeColor.danger,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 16,
          borderRadius: 8,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        }}
        onPress={() => {
          deleteTodaysFoodEntry(item.date);
          swipeableRef.current?.close();
        }}
      >
        <Text>{i18n.t("common.delete")}</Text>
      </TouchableOpacity>
    ),
    [deleteTodaysFoodEntry, item.date],
  );
  const { calories } = calculateTotalFoodValues(item.item);
  return (
    <Swipeable
      renderRightActions={renderRightActions}
      containerStyle={styles.swipeable}
      ref={swipeableRef}
    >
      <Pressable
        onPress={() => swipeableRef.current?.openRight()}
        style={styles.item}
      >
        <Image
          source={item.image ? { uri: item.image } : images.logo}
          style={styles.image}
        />
        <View style={styles.infoContainer}>
          <Text
            style={styles.name}
            fontWeight="bold"
            adjustsFontSizeToFit
            numberOfLines={2}
          >
            {item.item.name}
          </Text>
          <View style={styles.rowContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={star <= item.item.healthy_score ? "star" : "star-outline"}
                size={Dimensions.get("window").width * 0.05}
                color="#FFD700"
              />
            ))}
          </View>
          <View
            style={[styles.rowContainer, { flex: 1, alignItems: "flex-end" }]}
          >
            <Text>{i18n.t("common.today")}</Text>
            <Text style={styles.date}>
              {`${new Date(item.date).getHours()}:${String(new Date(item.date).getMinutes()).padStart(2, "0")}`}
            </Text>
          </View>
        </View>

        <Text style={styles.macro} fontWeight="bold">
          {calories} kcal
        </Text>
      </Pressable>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
  },
  fullView: {
    flex: 1,
  },
  header: {
    fontWeight: "bold",
    marginBottom: 16,
  },
  noDataContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  noDataText: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginTop: 16,
  },
  noDataButton: {
    backgroundColor: theme.colors.accentBlue,
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  infoContainer: {
    flex: 1,
    height: "100%",
    padding: 8,
    paddingRight: 0,
  },
  swipeable: {
    marginBottom: 8,
    borderRadius: 8,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    height: 86,
  },
  image: {
    width: 86,
    height: 86,
  },
  macro: {
    marginTop: 4,
    paddingRight: 8,
    fontSize: 18,
  },
  date: {
    fontSize: 16,
    color: "black",
    marginLeft: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  rowContainer: {
    flexDirection: "row",
  },
});
