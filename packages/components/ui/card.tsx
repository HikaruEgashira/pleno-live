import { View, TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { useColors } from "@/packages/hooks/use-colors";

type CardVariant = "default" | "interactive";

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: ViewStyle;
  selected?: boolean;
}

export function Card({
  children,
  variant = "default",
  onPress,
  onLongPress,
  style,
  selected = false,
}: CardProps) {
  const colors = useColors();

  const cardStyle: ViewStyle = {
    backgroundColor: selected ? colors.primary + "10" : colors.surface,
    borderColor: selected ? colors.primary : colors.border,
  };

  if (variant === "interactive" && onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        activeOpacity={0.7}
        style={[styles.card, cardStyle, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.card, cardStyle, style]}>
      {children}
    </View>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function CardHeader({ children, style }: CardHeaderProps) {
  return (
    <View style={[styles.header, style]}>
      {children}
    </View>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function CardContent({ children, style }: CardContentProps) {
  return (
    <View style={style}>
      {children}
    </View>
  );
}

interface CardFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function CardFooter({ children, style }: CardFooterProps) {
  const colors = useColors();
  return (
    <View style={[styles.footer, { borderTopColor: colors.border }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  footer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
});
