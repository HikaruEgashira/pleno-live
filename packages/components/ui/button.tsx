import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from "react-native";
import { useColors } from "@/packages/hooks/use-colors";

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

export function Button({
  onPress,
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  fullWidth = false,
}: ButtonProps) {
  const colors = useColors();

  const getBackgroundColor = () => {
    if (disabled) return colors.muted + "40";
    switch (variant) {
      case "primary":
        return colors.primary;
      case "secondary":
        return colors.secondary;
      case "ghost":
        return "transparent";
      case "destructive":
        return colors.error;
    }
  };

  const getBorderColor = () => {
    if (disabled) return colors.muted + "40";
    switch (variant) {
      case "ghost":
        return colors.border;
      default:
        return "transparent";
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.muted;
    switch (variant) {
      case "ghost":
        return colors.foreground;
      default:
        return "#FFFFFF";
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return { paddingHorizontal: 12, paddingVertical: 6 };
      case "lg":
        return { paddingHorizontal: 20, paddingVertical: 14 };
      default:
        return { paddingHorizontal: 16, paddingVertical: 10 };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case "sm":
        return 13;
      case "lg":
        return 16;
      default:
        return 14;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.button,
        getSizeStyles(),
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === "ghost" ? 1 : 0,
        },
        fullWidth && styles.fullWidth,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === "left" && <View style={styles.iconLeft}>{icon}</View>}
          <Text
            style={[
              styles.text,
              { color: getTextColor(), fontSize: getFontSize() },
            ]}
          >
            {children}
          </Text>
          {icon && iconPosition === "right" && <View style={styles.iconRight}>{icon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  fullWidth: {
    width: "100%",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontWeight: "600",
  },
  iconLeft: {
    marginRight: 6,
  },
  iconRight: {
    marginLeft: 6,
  },
});
