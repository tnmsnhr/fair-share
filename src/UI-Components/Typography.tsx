// src/UI-Components/Typography.tsx
import React from "react";
import { Text, TextProps, TextStyle, StyleSheet, Platform } from "react-native";
import { useTheme } from "@/theme/theme";
import { withAlpha } from "@/theme/colorUtils";

/** Variants (type ramp) */
export type Variant =
  | "displayXL"
  | "displayLG"
  | "header1"
  | "header2"
  | "header3"
  | "header4"
  | "header5"
  | "body1"
  | "body2"
  | "body3"
  | "body4"
  | "micro";

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
  | "primary"
  | "inverse";

export type Weight = "regular" | "medium" | "semibold" | "bold";

export type TypoProps = TextProps & {
  variant?: Variant;
  tone?: Tone;
  // align?: TextStyle["textAlign"];
  italic?: boolean;
  underline?: boolean;
  uppercase?: boolean;
  /** Optional explicit weight override (e.g. "700") */
  weight?: Weight;
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
 *   Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
 */
const VARIANT: Record<Variant, TextStyle> = StyleSheet.create({
  displayXL: {
    fontSize: 60,
    lineHeight: 72,
  },
  displayLG: {
    fontSize: 48,
    lineHeight: 60,
  },

  header1: {
    fontSize: 36,
    lineHeight: 48,
  },
  header2: { fontSize: 30, lineHeight: 40 },
  header3: { fontSize: 24, lineHeight: 36 },
  header4: { fontSize: 20, lineHeight: 30 },
  header5: { fontSize: 18, lineHeight: 27 },

  body1: { fontSize: 16, lineHeight: 24 },
  body2: { fontSize: 14, lineHeight: 21 },
  body3: { fontSize: 12, lineHeight: 18 },
  body4: { fontSize: 10, lineHeight: 15 },
  micro: { fontSize: 8, lineHeight: 12 },
});

const WEIGHT: Record<Weight, { fontFamily: string }> = {
  regular: {
    fontFamily: "Inter_400Regular",
  },
  medium: {
    fontFamily: "Inter_500Medium",
  },
  semibold: {
    fontFamily: "Inter_600SemiBold",
  },
  bold: {
    fontFamily: "Inter_700Bold",
  },
};

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
    case "primary":
      return t.primary;
    default:
      return t.text;
  }
}

/** Core component: block-level by default; set inline to true for inline usage */
export const Typo: React.FC<TypoProps> = ({
  children,
  variant = "body3",
  tone = "default",
  // align,
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
    // textAlign: align ?? base.textAlign,
    textDecorationLine: underline ? "underline" : "none",
    textTransform: uppercase ? "uppercase" : "none",
    fontFamily: "Inter_400Regular",
    ...(weight ? WEIGHT[weight] : null),
    letterSpacing: 0.1,
    // width: "100%",
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
export const DisplayLG = (p: TypoProps) => <Typo {...p} variant="displayLG" />;
export const Header1 = (p: TypoProps) => <Typo {...p} variant="header1" />;
export const Header2 = (p: TypoProps) => <Typo {...p} variant="header2" />;
export const Header3 = (p: TypoProps) => <Typo {...p} variant="header3" />;
export const Header4 = (p: TypoProps) => <Typo {...p} variant="header4" />;
export const Header5 = (p: TypoProps) => <Typo {...p} variant="header5" />;

export const Body1 = (p: TypoProps) => <Typo {...p} variant="body1" />;
export const Body2 = (p: TypoProps) => <Typo {...p} variant="body2" />;
export const Body3 = (p: TypoProps) => <Typo {...p} variant="body3" />;
export const Body4 = (p: TypoProps) => <Typo {...p} variant="body4" />;

export const Micro = (p: TypoProps) => <Typo {...p} variant="micro" />;
