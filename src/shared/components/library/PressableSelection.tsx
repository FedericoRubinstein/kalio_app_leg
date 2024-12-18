import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-rapi-ui";
import { theme } from "../../../theme/theme";

interface SelectableFieldProps {
  label?: string;
  value: string;
  onPress: () => void;
  description?: string;
}

export default function PressableSelection({
  label,
  value,
  onPress,
  description,
}: SelectableFieldProps) {
  return (
    <View style={styles.container}>
      {label && (
        <Text
          size="xl"
          numberOfLines={1}
          adjustsFontSizeToFit
          style={{ color: theme.colors.textSecondary }}
        >
          {label}
        </Text>
      )}
      <Pressable onPress={onPress} style={styles.input}>
        <Text
          size="xl"
          fontWeight="medium"
          style={{ color: theme.colors.textSecondary }}
        >
          {value}
        </Text>
      </Pressable>
      {description && (
        <Text
          size="sm"
          style={{ marginTop: 4, color: theme.colors.textSecondary }}
        >
          {description}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  input: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    borderColor: "#ccc",
    width: "100%",
    minHeight: 68,
  },
});
