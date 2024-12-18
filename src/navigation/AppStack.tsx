import { ParamListBase } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { BottomTabNavigator } from "./BottomTab";
import FoodAnalysisScreen from "../features/food/screens/FoodAnalysisScreen";
import DescribeNewFood from "../features/food/screens/DescribeNewFood";
import EditGoals from "../features/settings/screens/EditGoalsScreen";
import AddWeight from "../features/weight/screens/AddWeightScreen";

export enum AppStackScreenNames {
  App = "App",
  FoodAnalysisScreen = "FoodAnalysisScreen",
  AddNewFoodFromDescription = "AddNewFoodFromDescription",
  UserDetails = "UserDetails",
  EditGoals = "EditGoals",
  AddWeight = "AddWeight",
}

export interface AppStackParamList extends ParamListBase {
  [AppStackScreenNames.App]: undefined;
  [AppStackScreenNames.FoodAnalysisScreen]: {
    imageUri?: string;
    description?: string;
  };
  [AppStackScreenNames.AddNewFoodFromDescription]: undefined;
  [AppStackScreenNames.EditGoals]: undefined;
  [AppStackScreenNames.AddWeight]: undefined;
}

export const AppStack = createStackNavigator<AppStackParamList>();

export const AppStackNavigator = () => (
  <AppStack.Navigator
    screenOptions={{ headerShown: false, gestureEnabled: false }}
  >
    <AppStack.Screen
      name={AppStackScreenNames.App}
      component={BottomTabNavigator}
    />
    <AppStack.Screen
      name={AppStackScreenNames.FoodAnalysisScreen}
      component={FoodAnalysisScreen}
    />
    <AppStack.Screen
      name={AppStackScreenNames.AddNewFoodFromDescription}
      component={DescribeNewFood}
    />
    <AppStack.Screen
      name={AppStackScreenNames.EditGoals}
      component={EditGoals}
    />
    <AppStack.Screen
      name={AppStackScreenNames.AddWeight}
      component={AddWeight}
      options={{
        presentation: "modal",
        animationTypeForReplace: "pop",
        gestureDirection: "vertical",
      }}
    />
  </AppStack.Navigator>
);
