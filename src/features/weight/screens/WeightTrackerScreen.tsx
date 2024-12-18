import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, themeColor, TopNav } from "react-native-rapi-ui";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Swipeable } from "react-native-gesture-handler";
import { FontAwesome5 } from "@expo/vector-icons";
import {
  AppStackParamList,
  AppStackScreenNames,
} from "../../../navigation/AppStack";
import { useAppContext } from "../../../shared/context/AppContext";
import WeightChart from "../components/WeightChart";
import { WeightEntry } from "../../../shared/utils/types";
import i18n from "../../../i18n/i18n";
import { theme } from "../../../theme/theme";
import { formatWeight } from "../../../shared/utils/unitConversion";

export enum Timeframe {
  WEEK = "week",
  MONTH = "month",
  YEAR = "year",
  ALL = "all",
}

const WeightTracker = () => {
  const { top } = useSafeAreaInsets();
  const timeframes = [
    Timeframe.WEEK,
    Timeframe.MONTH,
    Timeframe.YEAR,
    Timeframe.ALL,
  ];
  const { weightHistory, unitPreference } = useAppContext();
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>(
    Timeframe.ALL,
  );

  const graphPoints = useMemo(() => {
    return weightHistory.map((entry) => ({
      value: entry.value,
      date: new Date(entry.date),
      displayValue: formatWeight(entry.value, unitPreference),
    }));
  }, [weightHistory, unitPreference]);

  const filteredGraphPoints = useMemo(() => {
    const now = new Date();
    switch (selectedTimeframe) {
      case Timeframe.WEEK:
        return graphPoints.filter(
          (point) => point.date >= new Date(now.setDate(now.getDate() - 7)),
        );
      case Timeframe.MONTH:
        return graphPoints.filter(
          (point) => point.date >= new Date(now.setMonth(now.getMonth() - 1)),
        );
      case Timeframe.YEAR:
        return graphPoints.filter(
          (point) =>
            point.date >= new Date(now.setFullYear(now.getFullYear() - 1)),
        );
      case Timeframe.ALL:
      default:
        return graphPoints;
    }
  }, [graphPoints, selectedTimeframe]);

  const handleAddWeight = useCallback(() => {
    navigation.navigate(AppStackScreenNames.AddWeight);
  }, [navigation]);

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <TopNav
        middleContent={
          <Text fontWeight="bold" style={{ color: theme.colors.textSecondary }}>
            {i18n.t("screens.weight_tracker.title")}
          </Text>
        }
        backgroundColor="transparent"
        borderColor="transparent"
      />
      {filteredGraphPoints.length > 0 ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.headerContainer}>
            <View style={styles.timeframeContainer}>
              {timeframes.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.timeframeButton,
                    {
                      backgroundColor:
                        selectedTimeframe === t
                          ? theme.colors.cta
                          : theme.colors.primary,
                      borderWidth: selectedTimeframe !== t ? 1 : 0,
                      borderColor: theme.colors.textSecondary,
                    },
                  ]}
                  onPress={() => setSelectedTimeframe(t)}
                >
                  <Text size="lg" style={{ color: theme.colors.textSecondary }}>
                    {i18n.t(`timeframes.${t}`)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              hitSlop={30}
              onPress={handleAddWeight}
              style={styles.addButton}
            >
              <FontAwesome5 name="plus" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <View style={[styles.dataContainer, { height: 350 }]}>
            <WeightChart filteredGraphPoints={filteredGraphPoints} />
          </View>
          <View
            style={[
              styles.dataContainer,
              {
                paddingTop: 0,
              },
            ]}
          >
            <FlatList
              data={filteredGraphPoints}
              renderItem={({ item }) => (
                <WeightRow
                  item={{
                    value: item.value,
                    date: item.date.toISOString().split("T")[0],
                  }}
                />
              )}
              scrollEnabled={false}
              keyExtractor={(item) => item.date.toString()}
              style={styles.list}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </ScrollView>
      ) : (
        <>
          <View style={styles.headerContainer}>
            <View style={styles.timeframeContainer}>
              {timeframes.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.timeframeButton,
                    {
                      backgroundColor:
                        selectedTimeframe === t
                          ? theme.colors.cta
                          : theme.colors.textSecondary,
                    },
                  ]}
                  onPress={() => setSelectedTimeframe(t)}
                >
                  <Text size="lg" style={{ color: theme.colors.textPrimary }}>
                    {i18n.t(`timeframes.${t}`)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              hitSlop={30}
              onPress={handleAddWeight}
              style={styles.addButton}
            >
              <FontAwesome5 name="plus" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <LottieView
            source={require("../../../assets/animations/no_data.json")}
            autoPlay
            loop
            style={{ width: 200, height: 200, alignSelf: "center" }}
          />
          <Text style={styles.noDataText}>
            {i18n.t("screens.weight_tracker.no_data")}
          </Text>
          <TouchableOpacity
            style={styles.noDataButton}
            onPress={handleAddWeight}
          >
            <Text style={{ color: "white" }} size="lg">
              {i18n.t("screens.weight_tracker.add_weight")}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const WeightRow = ({ item }: { item: WeightEntry }) => {
  const { deleteWeightEntry, unitPreference } = useAppContext();
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
          deleteWeightEntry(item.date);
        }}
      >
        <Text>{i18n.t("common.delete")}</Text>
      </TouchableOpacity>
    ),
    [deleteWeightEntry, item.date],
  );

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      containerStyle={styles.swipeable}
      ref={swipeableRef}
    >
      <Pressable
        onPress={() => swipeableRef.current?.openRight()}
        style={styles.weightItem}
      >
        <Text style={styles.date}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
        <Text style={styles.weight}>
          {formatWeight(item.value, unitPreference)}
        </Text>
      </Pressable>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingBottom: 0,
  },
  dataContainer: {
    width: "100%",
    padding: 16,
    paddingBottom: 0,
    borderRadius: 12,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  timeframeContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  timeframeButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 12,
    width: "100%",
  },
  list: {
    flexGrow: 0,
  },
  listContent: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  weightItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: theme.colors.secondary,
    backgroundColor: theme.colors.primary,
    height: "100%",
    width: "100%",
    paddingHorizontal: 16,
  },
  swipeable: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 8,
    height: 68,
    marginBottom: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  date: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  weight: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.textSecondary,
  },
  noDataText: {
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "center",
    marginTop: 16,
  },
  noDataButton: {
    backgroundColor: theme.colors.cta,
    padding: 16,
    borderRadius: 24,
    marginTop: 16,
    alignSelf: "center",
  },
  addButton: {
    backgroundColor: theme.colors.accentBlue,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
  },
});

export default WeightTracker;
