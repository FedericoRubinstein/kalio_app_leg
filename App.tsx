/* eslint-disable react/style-prop-object */
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { Text, ThemeProvider } from "react-native-rapi-ui";
import {
  NavigationContainer,
  NavigationContainerRefWithCurrent,
} from "@react-navigation/native";
import { useEffect, useRef } from "react";
import * as Sentry from "@sentry/react-native";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { AppStackParamList } from "./src/navigation/AppStack";
import { OnboardingStackParamList } from "./src/navigation/Onboarding";
import useBlockBackAndroid from "./src/shared/hooks/useBlockBackAndroid";
import analytics from "./src/shared/services/analytics";
import { AppProvider } from "./src/shared/context/AppContext";
import { FeatureFlagsProvider } from "./src/shared/context/FeatureFlagsContext";
import { OnboardingProvider } from "./src/shared/context/OnboardingContext";
import { RootStackNavigator } from "./src/navigation/RootStack";
import SplashScreen from "./src/features/onboarding/screens/SplashScreen";

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  debug: true,
});

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

export default function App() {
  const navigationRef =
    useRef<
      NavigationContainerRefWithCurrent<
        AppStackParamList | OnboardingStackParamList
      >
    >(null);

  useBlockBackAndroid();

  useEffect(() => {
    // Init services
    analytics.initialize();
  }, []);

  useEffect(() => {
    if (!navigationRef.current) {
      return;
    }

    const stateChangeHandler = () => {
      const currentRoute = navigationRef.current?.getCurrentRoute();
      if (currentRoute?.name) {
        analytics.trackNavigation(currentRoute.name);
      }
    };

    const unsubscribe = navigationRef.current.addListener(
      "state",
      stateChangeHandler,
    );

    // Track initial screen
    stateChangeHandler();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [navigationRef]);

  return (
    <GestureHandlerRootView>
      <ThemeProvider theme="light" loading={<SplashScreen />}>
        <ActionSheetProvider>
          <NavigationContainer ref={navigationRef}>
            <StatusBar style="dark" />
            <AppProvider>
              <FeatureFlagsProvider>
                <OnboardingProvider>
                  <RootStackNavigator />
                </OnboardingProvider>
              </FeatureFlagsProvider>
            </AppProvider>
          </NavigationContainer>
        </ActionSheetProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
