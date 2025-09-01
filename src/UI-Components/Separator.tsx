import React from "react";
import {
  View,
  StyleSheet,
  Platform,
  type ViewStyle,
  type StyleProp,
} from "react-native";
import { useTheme } from "@/theme/theme";
import { s, type SpaceKey } from "@/theme/spacing";

type Variant = "solid" | "dashed";
type Orientation = "horizontal" | "vertical";

type Inset =
  | number
  | { left?: number; right?: number }
  | { top?: number; bottom?: number };

export type SeparatorProps = {
  variant?: Variant; // 'solid' | 'dashed'
  orientation?: Orientation; // 'horizontal' | 'vertical'
  color?: string; // defaults to theme.border
  thickness?: number; // defaults to hairline-ish
  inset?: Inset; // distance from edges (for horizontal: left/right, vertical: top/bottom)
  margin?: SpaceKey; // spacing token around the separator (vertical for horizontal, horizontal for vertical)
  length?: number | "auto"; // fixed length along the axis; by default it stretches
  opacity?: number; // 0..1 to soften
  style?: StyleProp<ViewStyle>;
};

export const Separator: React.FC<SeparatorProps> = ({
  variant = "solid",
  orientation = "horizontal",
  color,
  thickness,
  inset,
  margin = "none",
  length = "auto",
  opacity,
  style,
}) => {
  const t = useTheme();

  // Slightly thicker on Android so hairline is visible
  const baseThickness =
    thickness ??
    (Platform.OS === "android"
      ? Math.max(1, StyleSheet.hairlineWidth * 1.5)
      : StyleSheet.hairlineWidth);

  const lineColor = color ?? t.border;
  const borderStyle: ViewStyle["borderStyle"] =
    variant === "dashed" ? "dashed" : "solid";

  // Normalize inset
  const insetObj =
    typeof inset === "number"
      ? orientation === "horizontal"
        ? { left: inset, right: inset }
        : { top: inset, bottom: inset }
      : inset ?? {};

  if (orientation === "horizontal") {
    const widthStyle =
      length === "auto"
        ? { alignSelf: "stretch" as const }
        : { width: length as number };
    return (
      <View
        style={[
          widthStyle,
          {
            height: 0,
            borderTopWidth: baseThickness,
            borderTopColor: lineColor,
            borderStyle,
            marginVertical: s(margin),
            marginLeft: (insetObj as any).left ?? 0,
            marginRight: (insetObj as any).right ?? 0,
            opacity: opacity ?? 1,
          },
          style,
        ]}
      />
    );
  }

  // vertical
  const heightStyle =
    length === "auto"
      ? { alignSelf: "stretch" as const }
      : { height: length as number };
  return (
    <View
      style={[
        heightStyle,
        {
          width: 0,
          borderLeftWidth: baseThickness,
          borderLeftColor: lineColor,
          borderStyle,
          marginHorizontal: s(margin),
          marginTop: (insetObj as any).top ?? 0,
          marginBottom: (insetObj as any).bottom ?? 0,
          opacity: opacity ?? 1,
        },
        style,
      ]}
    />
  );
};
