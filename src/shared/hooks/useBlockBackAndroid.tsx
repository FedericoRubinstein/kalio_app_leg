import { useEffect } from "react";
import { BackHandler } from "react-native";

export default function useBlockBackAndroid() {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true,
    );
    return () => backHandler.remove();
  }, []);
}
