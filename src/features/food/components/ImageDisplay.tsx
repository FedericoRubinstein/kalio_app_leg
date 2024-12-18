import React from "react";
import { Image, View, StyleSheet, Dimensions } from "react-native";
import { images } from "../../../assets/images";

interface ImageDisplayProps {
  imageUri: string | null;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageUri }) =>
  imageUri ? (
    <Image source={{ uri: imageUri }} style={styles.fullScreenImage} />
  ) : (
    <View style={styles.logoContainer}>
      <Image source={images.logo} style={styles.logo} />
    </View>
  );

const styles = StyleSheet.create({
  fullScreenImage: {
    width: Dimensions.get("window").width,
    height: 400,
    resizeMode: "cover",
    backgroundColor: "black",
  },
  logoContainer: {
    width: Dimensions.get("window").width,
    paddingTop: 24,
    resizeMode: "contain",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
});

export default ImageDisplay;
