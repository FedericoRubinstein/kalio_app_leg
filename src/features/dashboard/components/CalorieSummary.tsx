import React, { useMemo } from "react";
import { View } from "react-native";
import CircularProgress from "react-native-circular-progress-indicator";
import { Text } from "react-native-rapi-ui";
import { useAppContext } from "../../../shared/context/AppContext";
import useIsSmallScreen from "../../../shared/hooks/useIsSmallScreen";
import { theme } from "../../../theme/theme";

const CalorieSummary = () => {
  const { currentIntake, intakeGoal } = useAppContext();
  const currentCalories = currentIntake.calories;
  const isSmallScreen = useIsSmallScreen();
  const maxCalories = intakeGoal.calories;

  const isOverCalories = useMemo(
    () => currentCalories > maxCalories,
    [currentCalories, maxCalories],
  );
  const value = useMemo(
    () => (isOverCalories ? 100 : (currentCalories * 100) / maxCalories),
    [isOverCalories, maxCalories, currentCalories],
  );

  return (
    <View
      style={{
        marginTop: 36,
        marginBottom: 36,
        alignItems: "center",
      }}
    >
      <CircularProgress
        value={value}
        maxValue={100}
        progressValueStyle={{ display: "none" }}
        radius={isSmallScreen ? 80 : 120}
        progressValueColor={theme.colors.cta}
        // @ts-expect-error CircularProgress is not typed
        title={
          <Text
            style={{ color: theme.colors.textSecondary }}
            numberOfLines={1}
            size="h2"
            fontWeight="medium"
            adjustsFontSizeToFit
          >
            {currentCalories.toString()}
          </Text>
        }
        subtitle={`/${maxCalories} kcal`}
        titleColor={theme.colors.textSecondary}
        inActiveStrokeColor={isOverCalories ? "red" : theme.colors.cta}
        inActiveStrokeOpacity={0.3}
        activeStrokeColor={isOverCalories ? "red" : theme.colors.cta}
        activeStrokeWidth={20}
        inActiveStrokeWidth={20}
        titleStyle={{
          fontWeight: "bold",
          marginTop: -5,
          fontSize: 48,
          color: theme.colors.cta,
        }}
        subtitleStyle={{
          fontSize: isSmallScreen ? 12 : 16,
          color: theme.colors.textSecondary,
        }}
      />
    </View>
  );
};

export default CalorieSummary;
