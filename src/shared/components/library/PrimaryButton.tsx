import React from "react";
import { Button } from "react-native-rapi-ui";

interface PrimaryButtonProps {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  backgroundColor?: string;
}

export default function PrimaryButton({
  text,
  onPress,
  disabled,
  backgroundColor = "#2ecc71",
}: PrimaryButtonProps) {
  return (
    <Button
      style={{ paddingVertical: 16, height: 68, borderRadius: 16 }}
      text={text}
      onPress={onPress}
      color={backgroundColor}
      disabled={disabled}
      textStyle={{
        fontSize: 24,
      }}
    />
  );
}
