import { View, Text, StyleSheet } from "react-native";
import { useColors } from "@/packages/hooks/use-colors";

type BadgeVariant = "default" | "success" | "warning" | "error" | "primary" | "secondary" | "muted";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  size?: "sm" | "md";
}

export function Badge({
  children,
  variant = "default",
  icon,
  size = "md",
}: BadgeProps) {
  const colors = useColors();

  const getColors = (): { bg: string; text: string } => {
    switch (variant) {
      case "success":
        return { bg: colors.success + "20", text: colors.success };
      case "warning":
        return { bg: colors.warning + "20", text: colors.warning };
      case "error":
        return { bg: colors.error + "20", text: colors.error };
      case "primary":
        return { bg: colors.primary + "20", text: colors.primary };
      case "secondary":
        return { bg: colors.secondary + "20", text: colors.secondary };
      case "muted":
        return { bg: colors.muted + "20", text: colors.muted };
      default:
        return { bg: colors.surface, text: colors.foreground };
    }
  };

  const { bg, text } = getColors();
  const isSmall = size === "sm";

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bg,
          paddingHorizontal: isSmall ? 6 : 8,
          paddingVertical: isSmall ? 2 : 4,
        },
      ]}
    >
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text
        style={[
          styles.text,
          {
            color: text,
            fontSize: isSmall ? 10 : 11,
          },
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 9999,
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontWeight: "600",
  },
});
