import React from "react";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider, useTheme } from "./src/Theme/theme";
import Home from "./src/Screens/Home";
import { Platform, SafeAreaView } from "react-native";

function Shell() {
  const t = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar
        style={t.isDark ? "light" : "dark"}
        backgroundColor={Platform.OS === "android" ? t.bg : undefined}
      />
      <Home />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Shell />
    </ThemeProvider>
  );
}
