import { Platform, StyleSheet, Text, View } from "react-native";
import React from "react";
import { createIconSetFromIcoMoon } from "@expo/vector-icons";
import icoMoonConfig from "@/assets/fonts/selection.json";
import type { SvgProps } from "react-native-svg";
import { useTheme } from "@/theme/theme";

// import Icons

const RawIcon = createIconSetFromIcoMoon(
  icoMoonConfig as any,
  "IcoMoon", // ← must match the family you loaded with useFonts
  require("@/assets/fonts/icomoon.ttf") // optional fallback on web
);

export type IconName =
  | "bill"
  | "bill-outline"
  | "home-outline"
  | "home"
  | "doc"
  | "doc-outline"
  | "group"
  | "group-outline"
  | "person"
  | "person-outline"
  | "activity-outline"
  | "activity"
  | "cancel"
  | "plus"
  | "settings"
  | "pie-chart-outline"
  | "pie-chart"
  | "bar-chart"
  | "bar-chart-outline"
  | "category"
  | "tag"
  | "filter"
  | "pen-square"
  | "pen"
  | "info"
  | "trash"
  | "drink"
  | "sports-outline"
  | "sports"
  | "sync"
  | "reset"
  | "recent"
  | "search"
  | "arrow-up"
  | "arrow-right"
  | "arrow-down"
  | "arrow-left"
  | "chevron-left"
  | "chevron-up"
  | "chevron-right"
  | "chevron-down";

export type IconVariant = "outline" | "default";

export type IconProps = {
  name: IconName;
  variant?: IconVariant;
  size?: number;
  color?: string;
} & React.ComponentProps<typeof RawIcon>;

// export const Icon: React.FC<IconProps> = ({
//   name,
//   variant = "default",
//   size = 24,
//   color,
//   ...rest
// }) => {
//   const t = useTheme();
//   const Cmp = registry?.[name]?.[variant];
//   const resolvedColor = color ?? t.icon;
//   if (typeof Cmp !== "function" && typeof Cmp?.render !== "function") {
//     console.warn(
//       "[Icon] SVG import is not a component. Check metro.config.js + transformer."
//     );
//     return null;
//   }
//   return <Cmp width={size} height={size} color={resolvedColor} {...rest} />;
// };

export const Icon: React.FC<IconProps> = ({ color, size = 20, ...rest }) => {
  const t = useTheme();
  console.log(rest?.name);
  return <RawIcon size={size} color={color ?? t.text} {...rest} />;
};

const styles = StyleSheet.create({});
