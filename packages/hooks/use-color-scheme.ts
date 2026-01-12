import { useThemeContext } from "@/packages/contexts/theme-provider";

export function useColorScheme() {
  return useThemeContext().colorScheme;
}
