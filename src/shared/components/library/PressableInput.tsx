import { KeyboardTypeOptions, StyleSheet, TextInput, View } from "react-native";
import { Text } from "react-native-rapi-ui";

interface SelectableFieldProps {
  label: string;
  value: string;
  onChange: (text: string) => void;
  description?: string;
  keyboardType?: KeyboardTypeOptions;
}

export default function PressableInput({
  label,
  value,
  onChange,
  description,
  keyboardType,
}: SelectableFieldProps) {
  return (
    <View style={styles.container}>
      <Text>{label}</Text>
      <TextInput
        onChangeText={onChange}
        style={styles.input}
        value={value}
        keyboardType={keyboardType}
        textAlign="center"
      />
      {description && (
        <Text size="sm" style={{ marginTop: 4, color: "#666" }}>
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
    borderRadius: 5,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    borderColor: "#ccc",
    width: "100%",
    fontSize: 20,
  },
});
