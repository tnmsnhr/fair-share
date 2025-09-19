export type Scheme = "light" | "dark";
export type ColorDef = string | { light: string; dark?: string };
export type Palette = Record<string, ColorDef>;
export type ResolvedColors = Record<string, string>;

/** If a token has no dark value, it falls back to light. */
export function resolvePalette(p: Palette, scheme: Scheme): ResolvedColors {
  const out: ResolvedColors = {};
  for (const [k, v] of Object.entries(p)) {
    if (typeof v === "string") out[k] = v;
    else out[k] = scheme === "dark" ? v.dark ?? v.light : v.light;
  }
  return out;
}

export const basePalette: Palette = {
  // Your “charcoal” text example
  textPrimary: { light: "#1a1f26", dark: "#f2f4f8" },
  textSecondary: { light: "#475569", dark: "#cbd5e1" },

  // Surfaces
  bg: { light: "#f8fafc", dark: "#0b0f13" },
  card: { light: "#ffffff", dark: "#0f1521" },
  border: { light: "#e2e8f0", dark: "#1f2837" },

  // Brand / actions
  primary: { light: "#2563eb", dark: "#3b82f6" },
  onPrimary: { light: "#ffffff", dark: "#0b0f13" },

  // Status (dark falls back to light unless overridden)
  success: "#16a34a",
  warning: "#f59e0b",
  danger: { light: "#dc2626", dark: "#ef4444" },
};

export const colors = {
  primary950: "#683BFC",
  primary900: "#7952FC",
  primary800: "#9475FD",
  primary700: "#A991FD",
  primary600: "#BAA7FD",
  primary500: "#C8B9FD",
  primary400: "#D3C7FD",
  primary300: "#DCD2FD",
  primary200: "#E3DBFD",
  primary100: "#E9E2FD",
  primary50: "#EDE8FD",
  //   Secondary
  secondary950: "#9DFF33",
  secondary900: "#AFFF59",
  secondary800: "#BFFF7A",
  secondary700: "#CCFF95",
  secondary600: "#D6FFAA",
  secondary500: "#DEFFBB",
  secondary400: "#E5FFC9",
  secondary300: "#EAFFD4",
  secondary200: "#EEFFDD",
  secondary100: "#F1FFE4",
  secondary50: "#F4FFE9",
  //   Tertiary Color
  tertiary950: "#FF7224",
  tertiary900: "#FF8039",
  tertiary800: "#FF9961",
  tertiary700: "#FFAD81",
  tertiary600: "#FFBD9A",
  tertiary500: "#FFCAAE",
  tertiary400: "#FFD5BE",
  tertiary300: "#FFDDCB",
  tertiary200: "#FFE4D5",
  tertiary100: "#FFE9DD",
  tertiary50: "#FFEDE4",
  //   Gray Color
  gray950: "#000000",
  gray900: "#161616",
  gray800: "#383838",
  gray700: "#525252",
  gray600: "#656565",
  gray500: "#7C7C7C",
  gray400: "#989898",
  gray300: "#BDBDBD",
  gray200: "#DCDCDC",
  gray100: "#EFEFEF",
  gray50: "#FAFAFA",

  white: "#FFFFFF",
  black: "#000000",
};
