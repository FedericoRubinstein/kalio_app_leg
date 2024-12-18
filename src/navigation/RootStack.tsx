import { ParamListBase } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { OnboardingStackNavigator } from "./Onboarding";
import { AppStackNavigator } from "./AppStack";
import { useAppContext } from "../shared/context/AppContext";
import SplashScreen from "../features/onboarding/screens/SplashScreen";

export enum RootStackScreenNames {
  Main = "Main",
  Onboarding = "Onboarding",
}

export interface RootStackParamList extends ParamListBase {
  [RootStackScreenNames.Main]: undefined;
  [RootStackScreenNames.Onboarding]: undefined;
}

export const RootStack = createStackNavigator<RootStackParamList>();

const FORCE_ONBOARDING = false;
export const RootStackNavigator = () => {
  const { hasSeenIntro, isFullyLoaded } = useAppContext();

  if (!isFullyLoaded) {
    return <SplashScreen />;
  }

  return (
    <RootStack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: false }}
      initialRouteName={
        FORCE_ONBOARDING || !hasSeenIntro
          ? RootStackScreenNames.Onboarding
          : RootStackScreenNames.Main
      }
    >
      <RootStack.Screen
        name={RootStackScreenNames.Main}
        component={AppStackNavigator}
      />
      <RootStack.Screen
        name={RootStackScreenNames.Onboarding}
        component={OnboardingStackNavigator}
      />
    </RootStack.Navigator>
  );
};
