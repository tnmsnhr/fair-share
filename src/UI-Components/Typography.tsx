// src/UI-Components/Typography.tsx
import React from "react";
import { Text, TextProps, TextStyle, StyleSheet, Platform } from "react-native";
import { useTheme } from "@/theme/theme";
import { withAlpha } from "@/theme/colorUtils";

/** Variants (type ramp) */
export type Variant =
  | "displayXL"
  | "displayL"
  | "h1"
  | "h2"
  | "h3"
  | "title"
  | "subtitle"
  | "body"
  | "bodyStrong"
  | "bodySmall"
  | "caption"
  | "overline"
  | "code";

/** Semantic tones mapped to theme colors */
export type Tone =
  | "default"
  | "muted"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "debug"
  | "disabled"
  | "inverse";

export type TypoProps = TextProps & {
  variant?: Variant;
  tone?: Tone;
  align?: TextStyle["textAlign"];
  italic?: boolean;
  underline?: boolean;
  uppercase?: boolean;
  /** Optional explicit weight override (e.g. "700") */
  weight?: Exclude<TextStyle["fontWeight"], undefined>;
  /** Respect OS font scaling (default true) */
  allowFontScaling?: boolean;
  /** Cap accessibility scaling */
  maxFontSizeMultiplier?: number;
  /** When true, text behaves inline (does NOT stretch). Default is block-level. */
  inline?: boolean;
};

/**
 * Type ramp on a 4pt grid.
 * - Headings tighter (≈1.15–1.25)
 * - Body generous (≈1.45–1.5)
 * - Subtle letter-spacing adjustments
 */
const VARIANT: Record<Variant, TextStyle> = StyleSheet.create({
  displayXL: {
    fontSize: 48,
    lineHeight: 56,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  displayL: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: "800",
    letterSpacing: -0.2,
  },

  h1: { fontSize: 32, lineHeight: 40, fontWeight: "700", letterSpacing: -0.1 },
  h2: { fontSize: 28, lineHeight: 36, fontWeight: "700" },
  h3: { fontSize: 24, lineHeight: 32, fontWeight: "700" },

  title: { fontSize: 20, lineHeight: 28, fontWeight: "600" },
  subtitle: { fontSize: 16, lineHeight: 24, fontWeight: "600" },

  body: { fontSize: 16, lineHeight: 24, fontWeight: "400" },
  bodyStrong: { fontSize: 16, lineHeight: 24, fontWeight: "600" },
  bodySmall: { fontSize: 14, lineHeight: 20, fontWeight: "400" },

  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  overline: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "600",
    letterSpacing: Platform.OS === "ios" ? 0.6 : 0.8,
    textTransform: "uppercase",
  },

  code: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: Platform.OS === "ios" ? "500" : "400",
    fontFamily: Platform.select({
      ios: "Menlo",
      android: "monospace",
      default: undefined,
    }),
  },
});

function toneColor(tone: Tone, t: ReturnType<typeof useTheme>): string {
  switch (tone) {
    case "default":
      return t.text;
    case "muted":
      return t.mutedText;
    case "info":
      return t.primary;
    case "success":
      return t.success ?? t.primary;
    case "warning":
      return t.warning ?? "#E6A700";
    case "danger":
      return t.danger ?? "#D14343";
    case "debug":
      return t.mutedText;
    case "disabled":
      return withAlpha(t.text, 0.5);
    case "inverse":
      return t.onPrimary ?? "#ffffff";
    default:
      return t.text;
  }
}

/** Core component: block-level by default; set inline to true for inline usage */
export const Typo: React.FC<TypoProps> = ({
  children,
  variant = "body",
  tone = "default",
  align,
  italic,
  underline,
  uppercase,
  weight,
  style,
  allowFontScaling = true,
  maxFontSizeMultiplier = 1.2,
  inline = false,
  ...rest
}) => {
  const t = useTheme();
  const base = VARIANT[variant];
  const color = toneColor(tone, t);

  const computed: TextStyle = {
    ...base,
    color,
    textAlign: align ?? base.textAlign,
    fontStyle: italic ? "italic" : base.fontStyle,
    textDecorationLine: underline ? "underline" : base.textDecorationLine,
    textTransform: uppercase ? "uppercase" : base.textTransform,
    ...(weight ? { fontWeight: weight } : null),
    // ...(inline ? null : { alignSelf: "stretch", width: "100%" }),
  };

  return (
    <Text
      {...rest}
      allowFontScaling={allowFontScaling}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      style={[computed, style]}
    >
      {children}
    </Text>
  );
};

/** Handy aliases */
export const DisplayXL = (p: TypoProps) => <Typo {...p} variant="displayXL" />;
export const DisplayL = (p: TypoProps) => <Typo {...p} variant="displayL" />;
export const H1 = (p: TypoProps) => <Typo {...p} variant="h1" />;
export const H2 = (p: TypoProps) => <Typo {...p} variant="h2" />;
export const H3 = (p: TypoProps) => <Typo {...p} variant="h3" />;
export const Title = (p: TypoProps) => <Typo {...p} variant="title" />;
export const Subtitle = (p: TypoProps) => <Typo {...p} variant="subtitle" />;
export const Body = (p: TypoProps) => <Typo {...p} variant="body" />;
export const BodyStrong = (p: TypoProps) => (
  <Typo {...p} variant="bodyStrong" />
);
export const BodySmall = (p: TypoProps) => <Typo {...p} variant="bodySmall" />;
export const Caption = (p: TypoProps) => <Typo {...p} variant="caption" />;
export const Overline = (p: TypoProps) => <Typo {...p} variant="overline" />;
export const Code = (p: TypoProps) => <Typo {...p} variant="code" />;
