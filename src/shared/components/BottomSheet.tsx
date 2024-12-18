import React, { useCallback, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";

interface BottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  isVisible,
  onClose,
  children,
}) => {
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);
  const backgroundOpacity = useRef(new Animated.Value(0));

  const handleBackgroundPress = useCallback(() => {
    if (Keyboard.isVisible()) {
      Keyboard.dismiss();
      onClose();
      return;
    }
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (isVisible) {
      Animated.timing(backgroundOpacity.current, {
        toValue: 0.6,
        duration: 500,
        useNativeDriver: true,
      }).start();
      bottomSheetModalRef.current?.present();
    } else {
      Animated.timing(backgroundOpacity.current, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isVisible]);

  return (
    <BottomSheetModalProvider>
      <Pressable
        onPress={handleBackgroundPress}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
          display: isVisible ? "flex" : "none",
        }}
      >
        <Animated.View
          style={{
            backgroundColor: "black",
            height: "100%",
            width: "100%",
            opacity: backgroundOpacity.current,
          }}
        />
      </Pressable>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          flex: 1,
          display: isVisible ? "flex" : "none",
        }}
      >
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          onDismiss={onClose}
          keyboardBehavior="interactive"
          keyboardBlurBehavior="restore"
          android_keyboardInputMode="adjustResize"
          style={{
            borderRadius: 16,
            maxHeight: "80%", // Adjust height according to content
          }}
        >
          <View style={styles.contentContainer}>{children}</View>
        </BottomSheetModal>
      </KeyboardAvoidingView>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
    backgroundColor: "#ccc",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default BottomSheet;
