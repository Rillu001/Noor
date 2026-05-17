import "./global.css";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { colors } from "./constants/theme";
import { useDatabase } from "./hooks/useDatabase";
import { RootNavigator } from "./navigation/RootNavigator";
import { useAppStore } from "./store/useAppStore";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const dbReady = useAppStore((s) => s.dbReady);
  const hydrateSession = useAuthStore((s) => s.hydrateSession);
  const { error } = useDatabase();

  useEffect(() => {
    if (dbReady) {
      hydrateSession();
    }
  }, [dbReady, hydrateSession]);

  if (!fontsLoaded || !dbReady) {
    return (
      <View style={styles.loading}>
        <Text style={styles.logo}>Noor</Text>
        <ActivityIndicator color={colors.accent.gold} style={styles.spinner} />
        {error ? (
          <Text style={styles.error}>{error.message}</Text>
        ) : null}
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <RootNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  loading: {
    flex: 1,
    backgroundColor: colors.bg.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    color: colors.text.primary,
    fontSize: 36,
    fontWeight: "700",
    letterSpacing: -1,
    marginBottom: 24,
  },
  spinner: {
    marginTop: 8,
  },
  error: {
    color: "#e57373",
    marginTop: 16,
    paddingHorizontal: 24,
    textAlign: "center",
  },
});
