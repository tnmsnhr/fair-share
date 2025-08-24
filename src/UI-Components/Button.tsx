import { useTheme } from "@/theme/theme";
import React from "react";
import {
  ActivityIndicator,
  GestureResponderEvent,
  Pressable,
  PressableStateCallbackType,
  StyleProp,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";
export type ButtonWeight = "regular" | "medium" | "semibold" | "bold";

export type ButtonProps = {
  label?: string;
  children?: React.ReactNode; // alternative to label
  onPress?: (e: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  weight?: ButtonWeight;
  disabled?: boolean;
  loading?: boolean;

  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;

  fullWidth?: boolean;
  rounded?: "sm" | "md" | "lg" | "pill";

  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;

  accessibilityLabel?: string;
  hitSlop?:
    | number
    | { top?: number; bottom?: number; left?: number; right?: number };
};

const radiusMap = { sm: 8, md: 12, lg: 16, pill: 999 } as const;
const heightMap = { sm: 36, md: 44, lg: 52 } as const;
const padXMap = { sm: 12, md: 16, lg: 20 } as const;
const fontMap: Record<ButtonSize, number> = { sm: 14, md: 16, lg: 18 };
const weightMap: Record<ButtonWeight, TextStyle["fontWeight"]> = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
};

function palette(variant: ButtonVariant, t: ReturnType<typeof useTheme>) {
  switch (variant) {
    case "primary":
      return { bg: t.primary, fg: t.onPrimary, border: t.primary };
    case "secondary":
      return { bg: t.card, fg: t.text, border: t.border };
    case "outline":
      return { bg: "transparent", fg: t.primary, border: t.primary };
    case "ghost":
      return { bg: "transparent", fg: t.primary, border: "transparent" };
    default:
      return { bg: t.primary, fg: t.onPrimary, border: t.primary };
  }
}

export function Button({
  label,
  children,
  onPress,
  variant = "primary",
  size = "md",
  weight = "bold",
  disabled,
  loading,
  leftIcon,
  rightIcon,
  fullWidth,
  rounded = "md",
  style,
  contentStyle,
  textStyle,
  accessibilityLabel,
  hitSlop = { top: 6, bottom: 6, left: 6, right: 6 },
}: ButtonProps) {
  const t = useTheme();
  const { bg, fg, border } = palette(variant, t);

  const height = heightMap[size];
  const paddingHorizontal = padXMap[size];
  const borderRadius = radiusMap[rounded];
  const fontSize = fontMap[size];
  const fontWeight = weightMap[weight];

  // Press feedback helpers
  const pressedOverlay =
    variant === "primary"
      ? { opacity: 0.92 }
      : {
          backgroundColor: t.isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(0,0,0,0.06)",
        };

  const baseContainer: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height,
    paddingHorizontal,
    borderRadius,
    backgroundColor: bg,
    borderWidth: variant === "outline" || variant === "secondary" ? 1 : 0,
    borderColor:
      variant === "outline" || variant === "secondary" ? border : "transparent",
    ...(fullWidth ? { alignSelf: "stretch" } : { alignSelf: "flex-start" }),
  };

  const contentGap = size === "lg" ? 10 : 8;

  const getStyle = ({
    pressed,
  }: PressableStateCallbackType): StyleProp<ViewStyle> => [
    baseContainer,
    pressed && !disabled && !loading ? pressedOverlay : null,
    (disabled || loading) && { opacity: 0.55 },
    style,
  ];

  const labelStyle: TextStyle = {
    color: fg,
    fontSize,
    fontWeight,
  };

  return (
    <Pressable
      hitSlop={hitSlop}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={disabled || loading ? undefined : onPress}
      style={getStyle}
    >
      <Inner
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        gap={contentGap}
        loading={!!loading}
        spinnerColor={fg}
        contentStyle={contentStyle}
      >
        {/* If label is provided, render it; else render children */}
        {label ? (
          <Text style={[labelStyle, textStyle]}>{label}</Text>
        ) : (
          children ?? null
        )}
      </Inner>
    </Pressable>
  );
}

function Inner({
  leftIcon,
  rightIcon,
  loading,
  spinnerColor,
  gap,
  children,
  contentStyle,
}: {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading: boolean;
  spinnerColor: string;
  gap: number;
  children: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
}) {
  return (
    <React.Fragment>
      <Pressable
        // dummy to reuse RN's style resolver for row layout; could be a View too
        disabled
        style={[
          { flexDirection: "row", alignItems: "center", gap },
          contentStyle,
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={spinnerColor} />
        ) : (
          leftIcon
        )}
        {children}
        {rightIcon}
      </Pressable>
    </React.Fragment>
  );
}

/* ─────────────── Aliases ─────────────── */

export const PrimaryButton = (p: Omit<ButtonProps, "variant">) => (
  <Button {...p} variant="primary" />
);
export const SecondaryButton = (p: Omit<ButtonProps, "variant">) => (
  <Button {...p} variant="secondary" />
);
export const OutlineButton = (p: Omit<ButtonProps, "variant">) => (
  <Button {...p} variant="outline" />
);
export const GhostButton = (p: Omit<ButtonProps, "variant">) => (
  <Button {...p} variant="ghost" />
);
