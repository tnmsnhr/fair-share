import { Platform, StyleSheet, Text, View } from "react-native";
import React from "react";
import { createIconSetFromIcoMoon } from "@expo/vector-icons";
import icoMoonConfig from "@/assets/fonts/selection.json";
import type { SvgProps } from "react-native-svg";
import { useTheme } from "@/theme/theme";
import {
  Group,
  GroupOutline,
  Home,
  HomeOutline,
  Person,
  PersonOutline,
  Plus,
  Receipt,
  ReceiptOutline,
  Cancel,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ChevronLeft,
  Check,
} from "@/assets/icons";

// import Icons

const RawIcon = createIconSetFromIcoMoon(
  icoMoonConfig as any,
  "IcoMoon", // ← must match the family you loaded with useFonts
  require("@/assets/fonts/icomoon.ttf") // optional fallback on web
);

export type IconName =
  | "receipt"
  | "group"
  | "home"
  | "person"
  | "plus"
  | "cancel"
  | "chevronRight"
  | "chevronLeft"
  | "chevronUp"
  | "chevronDown"
  | "check";

export type IconVariant = "outline" | "default";

export type IconProps = {
  name: IconName;
  variant?: IconVariant;
  size?: number;
  color?: string;
} & React.ComponentProps<typeof RawIcon>;

const registry: Record<
  IconName,
  {
    outline?: React.ComponentType<SvgProps>;
    default: React.ComponentType<SvgProps>;
  }
> = {
  receipt: { default: Receipt, outline: ReceiptOutline },
  group: { default: Group, outline: GroupOutline },
  home: { default: Home, outline: HomeOutline },
  person: { default: Person, outline: PersonOutline },
  plus: { default: Plus },
  cancel: { default: Cancel },
  chevronRight: { default: ChevronRight },
  chevronLeft: { default: ChevronLeft },
  chevronUp: { default: ChevronUp },
  chevronDown: { default: ChevronDown },
  check: { default: Check },
};

export const Icon: React.FC<IconProps> = ({
  name,
  variant = "default",
  size = 24,
  color,
  ...rest
}) => {
  const t = useTheme();
  const Cmp = registry?.[name]?.[variant];
  const resolvedColor = color ?? t.icon;
  if (typeof Cmp !== "function" && typeof Cmp?.render !== "function") {
    console.warn(
      "[Icon] SVG import is not a component. Check metro.config.js + transformer."
    );
    return null;
  }
  return <Cmp width={size} height={size} color={resolvedColor} {...rest} />;
};

const styles = StyleSheet.create({});
