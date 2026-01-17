import { View, TextInput as RNTextInput, Text, StyleSheet, TextInputProps } from "react-native";
import { useColors } from "@/packages/hooks/use-colors";

type InputVariant = "default" | "error";

interface InputProps extends TextInputProps {
  variant?: InputVariant;
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({
  variant = "default",
  label,
  error,
  icon,
  rightIcon,
  style,
  ...props
}: InputProps) {
  const colors = useColors();

  const getBorderColor = () => {
    if (error || variant === "error") return colors.error;
    return colors.border;
  };

  return (
    <View>
      {label && (
        <Text style={[styles.label, { color: colors.foreground }]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.surface,
            borderColor: getBorderColor(),
          },
        ]}
      >
        {icon && <View style={styles.iconLeft}>{icon}</View>}
        <RNTextInput
          style={[
            styles.input,
            {
              color: colors.foreground,
            },
            icon ? styles.inputWithLeftIcon : null,
            rightIcon ? styles.inputWithRightIcon : null,
            style,
          ]}
          placeholderTextColor={colors.muted}
          {...props}
        />
        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>
      {error && (
        <Text style={[styles.error, { color: colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
  inputWithLeftIcon: {
    marginLeft: 8,
  },
  inputWithRightIcon: {
    marginRight: 8,
  },
  iconLeft: {
    marginRight: 4,
  },
  iconRight: {
    marginLeft: 4,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
});
