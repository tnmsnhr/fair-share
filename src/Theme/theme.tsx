import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  StyleSheet,
  useColorScheme,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

/** Every token MUST have both light & dark */
export type Token = { light: string; dark: string };
export type TokenMap = Record<string, Token>;

const tokens = {
  bg: { light: "#f8fafc", dark: "#0b0f13" },
  card: { light: "#ffffff", dark: "#0f1521" },
  border: { light: "#e2e8f0", dark: "#1f2837" },
  primary: { light: "#2563eb", dark: "#3b82f6" },
  onPrimary: { light: "#ffffff", dark: "#0b0f13" },
  text: { light: "#1a1f26", dark: "#f2f4f8" },
  mutedText: { light: "#475569", dark: "#cbd5e1" },
  success: { light: "#16a34a", dark: "#22c55e" },
  warning: { light: "#f59e0b", dark: "#fbbf24" },
  danger: { light: "#dc2626", dark: "#ef4444" },
  backdrop: { light: "#5c636e", dark: "#213045" },
} as const satisfies TokenMap;

export type Scheme = "light" | "dark";
export type Theme = { scheme: Scheme; isDark: boolean } & {
  [K in keyof typeof tokens]: string;
};

function resolve(scheme: Scheme): Theme {
  const flat = Object.fromEntries(
    Object.entries(tokens).map(([k, v]) => [
      k,
      scheme === "dark" ? v.dark : v.light,
    ])
  ) as { [K in keyof typeof tokens]: string };
  return { scheme, isDark: scheme === "dark", ...flat };
}

type Mode = "system" | "light" | "dark";
const MODE_KEY = "fareshare.theme.mode";

const Ctx = createContext<{
  theme: Theme;
  mode: Mode;
  setMode: (m: Mode) => void;
  hydrated: boolean;
} | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const os = useColorScheme(); // 'light' | 'dark' | null
  const [mode, setModeState] = useState<Mode>("system");
  const [hydrated, setHydrated] = useState(false);

  // Load saved mode on first mount
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(MODE_KEY);
        if (saved === "light" || saved === "dark" || saved === "system") {
          setModeState(saved);
        }
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  // Persist on change
  const setMode = useCallback((m: Mode) => {
    setModeState(m);
    AsyncStorage.setItem(MODE_KEY, m).catch(() => {});
  }, []);

  const scheme: Scheme = mode === "system" ? ((os ?? "light") as Scheme) : mode;
  const value = useMemo(
    () => ({ theme: resolve(scheme), mode, setMode, hydrated }),
    [scheme, mode, setMode, hydrated]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx.theme; // flat: theme.primary, theme.bg, theme.text, ...
};

export const useThemeMode = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useThemeMode must be used within ThemeProvider");
  return { mode: ctx.mode, setMode: ctx.setMode, hydrated: ctx.hydrated };
};

/** For StyleSheet usage */
type NamedStyles<T> = { [K in keyof T]: ViewStyle | TextStyle | ImageStyle };
export function makeStyles<T extends NamedStyles<T>>(factory: (t: Theme) => T) {
  return () => {
    const t = useTheme();
    return useMemo(() => StyleSheet.create(factory(t)), [t]);
  };
}
