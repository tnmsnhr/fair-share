// App.tsx
import React, { useEffect } from "react";
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_500Medium,
} from "@expo-google-fonts/inter";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Platform, SafeAreaView } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { ThemeProvider, useTheme } from "./src/theme/theme";
import RootNavigator from "./src/navigation/RootNavigator";
import { QueryProvider } from "@/contexts/QueryProvider";
import { installOnlineSync } from "@/services/bootSync";
import { registerBackgroundSync } from "@/services/backgroundSync";
import "@/services/bootstrapOnline";
import { useStore } from "@/state/store";

SplashScreen.preventAutoHideAsync();

function Shell() {
  const t = useTheme();

  const navTheme = {
    ...(t.isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(t.isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: t.bg,
      card: t.card,
      text: t.text,
      border: t.border,
      primary: t.primary,
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}> */}
      <StatusBar
        style={t.isDark ? "light" : "dark"}
        backgroundColor={Platform.OS === "android" ? t.bg : undefined}
      />
      <NavigationContainer theme={navTheme}>
        <RootNavigator />
      </NavigationContainer>
      {/* </SafeAreaView> */}
    </GestureHandlerRootView>
  );
}

export default function App() {
  const hydrated = useStore((s) => s._hydrated);
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_500Medium,
  });

  useEffect(() => {
    if (fontsLoaded && hydrated) SplashScreen.hideAsync();
  }, [fontsLoaded, hydrated]);

  useEffect(() => {
    installOnlineSync();
    registerBackgroundSync();
  }, []);

  if (!fontsLoaded || !hydrated) return null;
  return (
    <ThemeProvider>
      <QueryProvider>
        <Shell />
      </QueryProvider>
    </ThemeProvider>
  );
}
