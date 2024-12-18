import React from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "../../../theme/theme";

interface StickyFrameProps {
  children: React.ReactNode;
  footer: React.ReactNode;
  backgroundColor?: string;
}

const StickyFrame: React.FC<StickyFrameProps> = ({
  children,
  footer,
  backgroundColor = theme.colors.primary,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.content}>{children}</View>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 8 }]}>
        {footer}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  footer: {
    padding: 16,
  },
});

export default StickyFrame;
