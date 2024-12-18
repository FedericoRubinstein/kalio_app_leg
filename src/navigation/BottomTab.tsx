import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ParamListBase } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import { View } from "react-native";
import Home from "../features/dashboard/screens/HomeScreen";
import Settings from "../features/settings/screens/SettingsScreen";
import WeightTracker from "../features/weight/screens/WeightTrackerScreen";
import { theme } from "../theme/theme";

export enum BottomTabScreenNames {
  HOME = "home",
  SETTINGS = "settings",
  TRACKER = "tracker",
}

export interface BottomTabParamList extends ParamListBase {
  [BottomTabScreenNames.HOME]: undefined;
  [BottomTabScreenNames.TRACKER]: undefined;
  [BottomTabScreenNames.SETTINGS]: undefined;
}

export const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export const BottomTabNavigator = () => {
  const renderIcon = (iconName: string, focused: boolean) => (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {focused && (
        <View
          style={{
            position: "absolute",
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#2ecc71",
            opacity: 0.3,
          }}
        />
      )}
      <FontAwesome5
        name={iconName}
        size={24}
        color={focused ? "black" : "#666"}
      />
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <BottomTab.Navigator
        initialRouteName={BottomTabScreenNames.HOME}
        screenOptions={{
          headerShown: false,
          tabBarLabel: () => null,
          tabBarStyle: {
            backgroundColor: theme.colors.primary,
            borderTopWidth: 0,
            height: 80,
          },
        }}
      >
        <BottomTab.Screen
          name={BottomTabScreenNames.HOME}
          options={{
            tabBarIcon: ({ focused }) => renderIcon("home", focused),
          }}
          component={Home}
        />

        <BottomTab.Screen
          name={BottomTabScreenNames.TRACKER}
          options={{
            tabBarIcon: ({ focused }) => renderIcon("chart-bar", focused),
          }}
          component={WeightTracker}
        />

        <BottomTab.Screen
          options={{
            tabBarIcon: ({ focused }) => renderIcon("user", focused),
          }}
          name={BottomTabScreenNames.SETTINGS}
          component={Settings}
        />
      </BottomTab.Navigator>
    </View>
  );
};
