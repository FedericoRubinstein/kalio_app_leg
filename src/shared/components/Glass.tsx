import React, { useState } from "react";
import { View, Button, StyleSheet, Animated } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import Svg, { Path } from "react-native-svg";

const Glass = () => {
  const [fillAnimation] = useState(new Animated.Value(0));

  const fillWater = () => {
    Animated.timing(fillAnimation, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  };

  const waterHeight = fillAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["100%", "0%"],
  });

  return (
    <View style={styles.container}>
      <MaskedView
        style={styles.maskedView}
        maskElement={
          <Svg height="300" width="150" viewBox="0 0 150 300">
            <Path
              d="M 40 10 Q 75 0, 110 10 L 130 250 Q 75 290, 20 250 Z"
              fill="white"
            />
          </Svg>
        }
      >
        <View style={{ flex: 1, backgroundColor: "lightgray" }} />
        <Animated.View
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: waterHeight,
            backgroundColor: "blue",
          }}
        />
      </MaskedView>
      <Button title="Fill the Glass" onPress={fillWater} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  maskedView: {
    height: 300,
    width: 150,
  },
});

export default Glass;
