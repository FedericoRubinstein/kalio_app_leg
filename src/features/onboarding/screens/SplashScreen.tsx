import React from "react";
import { Image, View } from "react-native";
import { images } from "../../../assets/images";

export default function SplashScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Image
        source={images.splash}
        style={{ height: "100%", width: "100%" }}
        resizeMode="stretch"
      />
    </View>
  );
}
