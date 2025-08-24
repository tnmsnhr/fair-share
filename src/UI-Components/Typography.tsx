import { useTheme } from "@/theme/theme";
import React from "react";
import { Text, TextProps, TextStyle, StyleSheet } from "react-native";
// ⬇️ adjust import path if you use an alias like "@/theme/simpleThemeStrict"

/** Variants (size/weight/line-height presets) */
export type Variant =
  | "primary"
  | "secondary"
  | "caption"
  | "captionBold"
  | "subtitle"
  | "title"
  | "titleBold"
  | "display";

/** Color tone overlay on top of a variant */
export type Tone =
  | "default"
  | "muted"
  | "success"
  | "warning"
  | "info" // maps to theme.primary unless you add a dedicated token
  | "danger"
  | "debug" // maps to theme.mutedText by default (see mapping)
  | "disabled";

export type TypoProps = TextProps & {
  variant?: Variant;
  tone?: Tone;
  /** Optional style overrides */
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  uppercase?: boolean;
  align?: TextStyle["textAlign"];
};

/** Static, platform-agnostic variant styles */
const VARIANT_STYLES: Record<Variant, TextStyle> = StyleSheet.create({
  primary: { fontSize: 16, lineHeight: 22, fontWeight: "400" },
  secondary: { fontSize: 16, lineHeight: 22, fontWeight: "400" },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400",
    letterSpacing: 0.2,
  },
  captionBold: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  subtitle: { fontSize: 14, lineHeight: 20, fontWeight: "500" },
  title: { fontSize: 20, lineHeight: 26, fontWeight: "600" },
  titleBold: { fontSize: 20, lineHeight: 26, fontWeight: "800" },
  display: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
});

/** Map tone -> color using your existing theme tokens */
function resolveToneColor(
  tone: Tone,
  variant: Variant,
  t: ReturnType<typeof useTheme>
): string {
  if (tone === "default") {
    // sensible default: secondary/caption default to muted; others use main text
    if (
      variant === "secondary" ||
      variant === "caption" ||
      variant === "captionBold"
    ) {
      return t.mutedText;
    }
    return t.text;
  }
  switch (tone) {
    case "muted":
      return t.mutedText;
    case "success":
      return t.success;
    case "warning":
      return t.warning;
    case "info":
      return t.primary; // no dedicated "info" token in theme; using primary
    case "danger":
      return t.danger;
    case "debug":
      return t.mutedText; // adjust if you add a debug token later
    case "disabled":
      return t.mutedText; // or define a "disabled" token in theme
    default:
      return t.text;
  }
}

/** Core component */
export function Typo({
  children,
  variant = "primary",
  tone = "default",
  bold,
  italic,
  underline,
  uppercase,
  align,
  style,
  ...rest
}: TypoProps) {
  const t = useTheme();
  const base = VARIANT_STYLES[variant];
  const color = resolveToneColor(tone, variant, t);

  const computed: TextStyle = {
    ...base,
    color,
    textAlign: align,
    fontWeight: bold ? "700" : base.fontWeight,
    fontStyle: italic ? "italic" : base.fontStyle,
    textDecorationLine: underline ? "underline" : base.textDecorationLine,
    textTransform: uppercase ? "uppercase" : base.textTransform,
  };

  return (
    <Text {...rest} style={[computed, style]}>
      {children}
    </Text>
  );
}

/** Handy alias components */
export const Primary = (p: TypoProps) => <Typo {...p} variant="primary" />;
export const Secondary = (p: TypoProps) => <Typo {...p} variant="secondary" />;
export const Caption = (p: TypoProps) => <Typo {...p} variant="caption" />;
export const CaptionBold = (p: TypoProps) => (
  <Typo {...p} variant="captionBold" />
);
export const Subtitle = (p: TypoProps) => <Typo {...p} variant="subtitle" />;
export const Title = (p: TypoProps) => <Typo {...p} variant="title" />;
export const TitleBold = (p: TypoProps) => <Typo {...p} variant="titleBold" />;
export const Display = (p: TypoProps) => <Typo {...p} variant="display" />;
