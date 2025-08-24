// src/UI-Components/Layout.tsx
import React from "react";
import {
  View,
  ViewProps,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/theme/theme";
import { s, type SpaceKey } from "@/theme/spacing";
import { withAlpha } from "@/theme/colorUtils";

type BaseProps = {
  /** token padding horizontally and vertically (defaults: md) */
  paddingX?: SpaceKey;
  paddingY?: SpaceKey;

  /** include top safe area at the start of content (default: true) */
  safeTop?: boolean;

  /** include bottom inset + tab bar height (default: true) */
  safeBottomWithTab?: boolean;

  /** container background override (defaults to theme.bg) */
  style?: StyleProp<ViewStyle>;

  /** extra props for ScrollView content container */
  contentContainerStyle?: ScrollViewProps["contentContainerStyle"];

  /** --- Top gradient options --- */
  topGradient?: boolean; // show gradient overlay at the top (default: true)
  topGradientExtra?: SpaceKey | number; // extra height below status area for the fade (default: 'xl')
};

export type LayoutProps =
  | (BaseProps & { scroll?: false; children?: React.ReactNode })
  | (BaseProps & {
      scroll: true;
      scrollProps?: Omit<
        ScrollViewProps,
        "style" | "contentContainerStyle" | "children"
      >;
      children?: React.ReactNode;
    });

export function Layout(props: LayoutProps) {
  const {
    paddingX = "md",
    paddingY = "md",
    safeTop = true,
    safeBottomWithTab = true,
    style,
    contentContainerStyle,
    topGradient = true,
    topGradientExtra = "xl",
  } = props as BaseProps;

  const t = useTheme();
  const insets = useSafeAreaInsets();
  const tabH = useBottomTabBarHeight();

  // compute paddings
  const topPad = (safeTop ? insets.top : 0) + s(paddingY);
  const bottomPad =
    (safeBottomWithTab ? insets.bottom + tabH : 0) + s(paddingY);
  const horizontal = s(paddingX);

  // gradient height = safe area + some extra fade distance
  const extraPx =
    typeof topGradientExtra === "number"
      ? topGradientExtra
      : s(topGradientExtra);
  const gradientHeight = (safeTop ? insets.top : 0) + extraPx;

  // gradient colors (solid bg → soft → transparent)
  const gradColors = [
    t.bg,
    withAlpha(t.bg, t.isDark ? 0.85 : 0.92),
    withAlpha(t.bg, 0),
  ];

  // container wraps either ScrollView or View so we can place the gradient absolutely
  const Container = ({ children }: { children: React.ReactNode }) => (
    <View style={[styles.fill, { backgroundColor: t.bg }, style]}>
      {children}
      {topGradient && (
        <LinearGradient
          pointerEvents="none"
          colors={gradColors}
          locations={[0, 0.6, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.topGradient, { height: Math.max(gradientHeight, 1) }]}
        />
      )}
    </View>
  );

  if ("scroll" in props && props.scroll) {
    const { scrollProps, children } = props as Extract<
      LayoutProps,
      { scroll: true }
    >;
    return (
      <Container>
        <ScrollView
          {...scrollProps}
          style={styles.fill}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            {
              paddingTop: topPad,
              paddingBottom: bottomPad,
              paddingHorizontal: horizontal,
            },
            contentContainerStyle,
          ]}
          overScrollMode="always"
          contentInsetAdjustmentBehavior="never"
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </Container>
    );
  }

  const { children } = props as Extract<LayoutProps, { scroll?: false }>;
  return (
    <Container>
      <View
        style={[
          styles.fill,
          {
            paddingTop: topPad,
            paddingBottom: bottomPad,
            paddingHorizontal: horizontal,
          },
        ]}
      >
        {children}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
});
