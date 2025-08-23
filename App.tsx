import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Home from "./src/Components/Home"
import { useTheme } from "./src/Theme/themeHooks"
import { useEffect } from 'react';
import { loadSavedMode } from './src/Theme/themeStore';

export default function App() {
  const { scheme } = useTheme()
  useEffect(() => { loadSavedMode(); }, []);
  console.log("App")
  return (
    <Home />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
