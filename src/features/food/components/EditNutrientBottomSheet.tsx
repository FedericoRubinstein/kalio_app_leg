import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
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
  onSave: (value: string) => void;
  title: string;
  inputPlaceholder: string;
  initialValue?: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
}

const EditNutrientBottomSheet: React.FC<BottomSheetProps> = ({
  isVisible,
  onClose,
  onSave,
  title,
  inputPlaceholder,
  initialValue = "",
  keyboardType = "default",
}) => {
  const [value, setValue] = useState<string>(initialValue);
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);
  const backgroundOpacity = useRef(new Animated.Value(0));

  const handleSave = useCallback(() => {
    onSave(value);
    onClose();
  }, [value, onSave, onClose]);

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
        style={{ flex: 1 }}
      >
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          onDismiss={onClose}
          snapPoints={["50%", "80%"]}
          keyboardBehavior="interactive"
          keyboardBlurBehavior="restore"
          android_keyboardInputMode="adjustResize"
          style={{
            borderRadius: 16,
          }}
        >
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{title}</Text>
            <TextInput
              style={styles.input}
              value={value}
              autoFocus
              onChangeText={setValue}
              keyboardType={keyboardType}
              placeholder={inputPlaceholder}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={onClose}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
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

export default EditNutrientBottomSheet;
