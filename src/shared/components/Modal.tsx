import React from "react";
import { View, StyleSheet, Pressable, Modal } from "react-native";

interface CustomModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({
  isVisible,
  onClose,
  children,
}) => (
  <Modal transparent visible={isVisible} animationType="fade">
    <Pressable style={styles.overlay} onPress={onClose}>
      <View style={styles.modalContainer}>{children}</View>
    </Pressable>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
});

export default CustomModal;
