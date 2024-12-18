import { useState, useEffect } from "react";
import { Animated } from "react-native";

const useLoading = () => {
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    const animateLoading = () => {
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 1250,
          useNativeDriver: false,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 1250,
          useNativeDriver: false,
        }),
      ]).start(() => animateLoading());
    };

    animateLoading();

    return () => {
      animation.stopAnimation();
    };
  }, [animation]);

  const backgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["#E0E0E0", "#C9C5C5"],
  });

  return { backgroundColor };
};

export default useLoading;
