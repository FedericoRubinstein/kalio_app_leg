import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-rapi-ui";
import { useAppContext } from "../../../shared/context/AppContext";
import i18n from "../../../i18n/i18n";
import { theme } from "../../../theme/theme";

const IntakeSummary: React.FC = () => {
  const { intakeGoal, currentIntake } = useAppContext();
  const [totalWidth, setTotalWidth] = useState<number | null>(null);
  const { protein, carbohydrates, fat } = intakeGoal;
  const {
    protein: currentProtein,
    carbohydrates: currentCarbs,
    fat: currentFat,
  } = currentIntake;

  const maxIntake = Math.max(protein, carbohydrates, fat);
  const chartData = [
    {
      label: i18n.t("common.Protein"),
      goal: protein,
      currentValue: currentProtein,
    },
    {
      label: i18n.t("common.Carbs"),
      goal: carbohydrates,
      currentValue: currentCarbs,
    },
    {
      label: i18n.t("common.Fat"),
      goal: fat,
      currentValue: currentFat,
    },
  ];

  return (
    <View
      style={{
        flex: 1,
        paddingTop: 16,
        alignItems: "center",
        justifyContent: "center",
      }}
      onLayout={(e) => setTotalWidth(e.nativeEvent.layout.width)}
    >
      <View style={[styles.container, { width: totalWidth }]}>
        {chartData.map((data) => (
          <View key={data.label} style={styles.chartItem}>
            <View style={styles.labelContainer}>
              <Text
                style={{
                  color:
                    data.currentValue > data.goal
                      ? "red"
                      : theme.colors.textSecondary,
                }}
              >
                {data.label}
              </Text>
              <Text style={styles.progressLabel}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,
                    color:
                      data.currentValue > data.goal
                        ? "red"
                        : theme.colors.textSecondary,
                  }}
                >
                  {data.currentValue}g
                </Text>
                <Text style={styles.regularText}>{` / ${data.goal}g`}</Text>
              </Text>
            </View>
            <View style={styles.barWrapper}>
              <View
                style={[
                  styles.barContainer,
                  {
                    width:
                      data.goal === maxIntake
                        ? "100%"
                        : `${(data.goal / maxIntake) * 100}%`,
                  },
                ]}
              >
                <View
                  style={[
                    styles.background,
                    {
                      width: "100%",
                      backgroundColor: theme.colors.textSecondary,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.bar,
                    {
                      width:
                        data.currentValue >= data.goal
                          ? "100%"
                          : data.currentValue === 0
                            ? 1
                            : `${(data.currentValue / data.goal) * 100}%`,
                      backgroundColor:
                        data.currentValue > data.goal
                          ? "red"
                          : theme.colors.cta,
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  chartItem: {
    marginBottom: 24,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  barWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  regularText: {
    fontSize: 12,
    color: "gray",
    marginLeft: 4,
  },
  barContainer: {
    height: 8,
    position: "relative",
  },
  bar: {
    height: 8,
    position: "absolute",
    left: 0,
  },
  background: {
    height: 8,
    position: "absolute",
    left: 0,
    opacity: 0.15,
  },

  progressLabel: {
    marginLeft: 4,
  },
});

export default IntakeSummary;
