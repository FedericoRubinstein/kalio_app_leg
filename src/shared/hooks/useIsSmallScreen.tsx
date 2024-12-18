import { Dimensions } from "react-native";

export default function useIsSmallScreen() {
  return Dimensions.get("window").width <= 375;
}
