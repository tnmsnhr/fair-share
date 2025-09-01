// App.tsx
import React from "react";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Platform, SafeAreaView } from "react-native";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { ThemeProvider, useTheme } from "./src/theme/theme";
import RootNavigator from "./src/navigation/RootNavigator";

function Shell() {
  const t = useTheme();

  // Bridge your theme to React Navigation so background isn’t white
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
  return (
    <ThemeProvider>
      <Shell />
    </ThemeProvider>
  );
}
