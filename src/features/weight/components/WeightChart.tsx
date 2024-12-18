import React, { useState } from "react";
import { View } from "react-native";
import { GraphPoint } from "react-native-graph";
import { Text } from "react-native-rapi-ui";
import { LineChart } from "react-native-gifted-charts";
import i18n from "../../../i18n/i18n";
import { theme } from "../../../theme/theme";
import { UnitSystem } from "../../../shared/utils/types";
import { useAppContext } from "../../../shared/context/AppContext";

export default function WeightChart({
  filteredGraphPoints,
}: {
  filteredGraphPoints: GraphPoint[];
}) {
  const { unitPreference } = useAppContext();
  const data = filteredGraphPoints.map((point) => ({
    value: Number(point.value),
  }));
  const [width, setWidth] = useState<number | null>(null);
  return (
    <View
      onLayout={(e) => {
        setWidth(e.nativeEvent.layout.width);
      }}
    >
      <View
        style={{ flexDirection: "row", marginBottom: 16, alignItems: "center" }}
      >
        <View>
          <Text size="lg" style={{ color: theme.colors.textSecondary }}>
            {i18n.t("screens.weight_tracker.current_weight")}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              size="h1"
              fontWeight="bold"
              style={{ color: theme.colors.textSecondary }}
            >
              {filteredGraphPoints[0].value}
            </Text>
            <Text
              size="lg"
              fontWeight="bold"
              style={{ color: theme.colors.textSecondary }}
            >
              {" "}
              {unitPreference === UnitSystem.METRIC ? "kg" : "lbs"}
            </Text>
          </View>
        </View>
      </View>
      {width && (
        <LineChart
          areaChart
          curved
          data={data.reverse()}
          showVerticalLines={false}
          yAxisColor={theme.colors.textSecondary}
          xAxisColor={theme.colors.textSecondary}
          yAxisTextStyle={{ color: theme.colors.textSecondary }}
          width={width - 64}
          initialSpacing={0}
          color1={theme.colors.cta}
          dataPointsColor1={theme.colors.cta}
          startFillColor1={theme.colors.cta}
          startOpacity={0.8}
          endOpacity={0.3}
        />
      )}
    </View>
  );
}
