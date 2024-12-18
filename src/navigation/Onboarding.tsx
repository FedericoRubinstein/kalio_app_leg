import { ParamListBase } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Goals from "../features/onboarding/screens/GoalsScreen";
import GoalsMotivation from "../features/onboarding/screens/GoalsMotivationScreen";
import Obstacles from "../features/onboarding/screens/ObstaclesScreen";
import ObstaclesMotivationScreen from "../features/onboarding/screens/ObstaclesMotivationScreen";
import PastAttemptsScreen from "../features/onboarding/screens/PastAttemptsScreen";
import ActivityLevelScreen from "../features/onboarding/screens/ActivityLevelScreen";
import AboutYouScreen from "../features/onboarding/screens/AboutYouScreen";
import WeeklyLossGoalScreen from "../features/onboarding/screens/WeeklyLossGoal";
import ResultsScreen from "../features/onboarding/screens/ResultsScreen";
import PaywallsScreen from "../features/onboarding/screens/PaywallsScreen";
import Scan from "../features/onboarding/screens/how_it_works/Scan";
import Analyze from "../features/onboarding/screens/how_it_works/Analyze";
import Track from "../features/onboarding/screens/how_it_works/Track";

export enum OnboardingStackScreenNames {
  Goals = "Goals",
  GoalsMotivation = "GoalsMotivation",
  Obstacles = "Obstacles",
  ObstaclesMotivation = "ObstaclesMotivation",
  PastAttempts = "PastAttempts",
  ActivityLevel = "ActivityLevel",
  AboutYou = "AboutYou",
  WeeklyLossGoal = "WeeklyLossGoal",
  Results = "Results",
  InstructionsScan = "InstructionsScan",
  InstructionsAnalyze = "InstructionsAnalyze",
  InstructionsTrack = "InstructionsTrack",
  Paywall = "Paywall",
}

export interface OnboardingStackParamList extends ParamListBase {
  [OnboardingStackScreenNames.Goals]: undefined;
  [OnboardingStackScreenNames.GoalsMotivation]: undefined;
  [OnboardingStackScreenNames.Obstacles]: undefined;
  [OnboardingStackScreenNames.ObstaclesMotivation]: undefined;
  [OnboardingStackScreenNames.PastAttempts]: undefined;
  [OnboardingStackScreenNames.ActivityLevel]: undefined;
  [OnboardingStackScreenNames.AboutYou]: undefined;
  [OnboardingStackScreenNames.WeeklyLossGoal]: undefined;
  [OnboardingStackScreenNames.Results]: undefined;
  [OnboardingStackScreenNames.Paywall]: undefined;
  [OnboardingStackScreenNames.InstructionsScan]: undefined;
  [OnboardingStackScreenNames.InstructionsAnalyze]: undefined;
  [OnboardingStackScreenNames.InstructionsTrack]: undefined;
}

export const ONBOARDING_STEPS = 6;
export const OnboardingStack = createStackNavigator<OnboardingStackParamList>();

export const OnboardingStackNavigator = () => (
  <OnboardingStack.Navigator
    initialRouteName={OnboardingStackScreenNames.Goals}
    screenOptions={{
      headerShown: false,
      gestureEnabled: true,
      animationEnabled: true,
    }}
  >
    <OnboardingStack.Screen
      name={OnboardingStackScreenNames.Goals}
      component={Goals}
    />
    <OnboardingStack.Screen
      name={OnboardingStackScreenNames.GoalsMotivation}
      component={GoalsMotivation}
    />
    <OnboardingStack.Screen
      name={OnboardingStackScreenNames.Obstacles}
      component={Obstacles}
    />
    <OnboardingStack.Screen
      name={OnboardingStackScreenNames.ObstaclesMotivation}
      component={ObstaclesMotivationScreen}
    />
    <OnboardingStack.Screen
      name={OnboardingStackScreenNames.PastAttempts}
      component={PastAttemptsScreen}
    />
    <OnboardingStack.Screen
      name={OnboardingStackScreenNames.ActivityLevel}
      component={ActivityLevelScreen}
    />
    <OnboardingStack.Screen
      name={OnboardingStackScreenNames.AboutYou}
      component={AboutYouScreen}
    />
    <OnboardingStack.Screen
      name={OnboardingStackScreenNames.WeeklyLossGoal}
      component={WeeklyLossGoalScreen}
    />
    <OnboardingStack.Screen
      name={OnboardingStackScreenNames.Results}
      component={ResultsScreen}
    />
    <OnboardingStack.Screen
      name={OnboardingStackScreenNames.InstructionsScan}
      component={Scan}
    />
    <OnboardingStack.Screen
      name={OnboardingStackScreenNames.InstructionsAnalyze}
      component={Analyze}
    />
    <OnboardingStack.Screen
      name={OnboardingStackScreenNames.InstructionsTrack}
      component={Track}
    />
    <OnboardingStack.Screen
      name={OnboardingStackScreenNames.Paywall}
      component={PaywallsScreen}
    />
  </OnboardingStack.Navigator>
);
