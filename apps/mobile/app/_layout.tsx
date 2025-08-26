import "@/globals.css";
import { Stack } from "expo-router";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { ThemeProvider, useTheme } from "@/lib/theme/theme-context";

function ThemedStack() {
  const { isDark } = useTheme();

  return (
    <GluestackUIProvider mode={isDark ? "dark" : "light"}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </GluestackUIProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ThemedStack />
    </ThemeProvider>
  );
}
