import { View, StyleSheet } from "react-native";
import { ReactNode } from "react";

import { useColors } from "@/packages/hooks/use-colors";

interface ResponsiveLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
  showSidebar: boolean;
  footer?: ReactNode;
}

export function ResponsiveLayout({
  children,
  sidebar,
  showSidebar,
  footer,
}: ResponsiveLayoutProps) {
  const colors = useColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {showSidebar && sidebar && (
        <View style={styles.sidebarContainer}>{sidebar}</View>
      )}
      <View style={styles.mainContainer}>
        <View style={styles.mainContent}>{children}</View>
        {footer}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  sidebarContainer: {
    flexShrink: 0,
  },
  mainContainer: {
    flex: 1,
    flexDirection: "column",
  },
  mainContent: {
    flex: 1,
  },
});
