import { useWindowDimensions } from "react-native";

export type LayoutMode = "compact" | "regular" | "wide";

interface ResponsiveInfo {
  layoutMode: LayoutMode;
  isDesktop: boolean;
  columns: number;
  showSidebar: boolean;
  width: number;
  height: number;
}

const BREAKPOINTS = {
  regular: 768,
  wide: 1200,
} as const;

export function useResponsive(): ResponsiveInfo {
  const { width, height } = useWindowDimensions();

  const layoutMode: LayoutMode =
    width >= BREAKPOINTS.wide
      ? "wide"
      : width >= BREAKPOINTS.regular
        ? "regular"
        : "compact";

  const isDesktop = width >= BREAKPOINTS.regular;
  const showSidebar = isDesktop;

  const columns =
    layoutMode === "wide" ? 3 : layoutMode === "regular" ? 2 : 1;

  return {
    layoutMode,
    isDesktop,
    columns,
    showSidebar,
    width,
    height,
  };
}
