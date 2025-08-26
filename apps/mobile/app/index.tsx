import { View, StyleSheet } from "react-native";
import AuthScreen from "@/components/auth/auth-screen";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Index() {
  return (
    <View style={styles.container}>
      <AuthScreen defaultMode="signin" />
      <View style={styles.themeToggleContainer}>
        <ThemeToggle />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  themeToggleContainer: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    zIndex: 10,
  },
});
