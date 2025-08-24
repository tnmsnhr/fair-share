import React, { useMemo, useRef } from "react";
import {
  View,
  Pressable,
  LayoutChangeEvent,
  StyleSheet,
  Text,
} from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@/theme/theme";
import { withAlpha } from "@/theme/colorUtils";

// optional: if you added spacing tokens
// import { s } from '@/theme/spacing';

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const t = useTheme();
  const insets = useSafeAreaInsets();

  const hasBottomInset = insets.bottom > 0;
  const GAP = 8; // or s('sm') if using your spacing tokens
  const bottomOffset = hasBottomInset ? insets.bottom + GAP : GAP;

  const count = state.routes.length;
  const width = useSharedValue(0);
  const itemW = useSharedValue(0);
  const indicatorX = useSharedValue(0);

  const containerOnLayout = (e: LayoutChangeEvent) => {
    width.value = e.nativeEvent.layout.width;
    itemW.value = width.value / count;
    // set initial indicator position
    indicatorX.value = withTiming(itemW.value * state.index);
  };

  // animate indicator whenever active index changes
  React.useEffect(() => {
    if (itemW.value > 0) {
      indicatorX.value = withTiming(itemW.value * state.index, {
        duration: 240,
      });
    }
  }, [state.index]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: itemW.value,
  }));

  const iconFor = (name: string, focused: boolean) => {
    const map: Record<string, keyof typeof Ionicons.glyphMap> = {
      Home: focused ? "home" : "home-outline",
      Activity: focused ? "stats-chart" : "stats-chart-outline",
      Groups: focused ? "people" : "people-outline",
      Settings: focused ? "settings" : "settings-outline",
    };
    return map[name] ?? "ellipse-outline";
  };

  return (
    <View
      onLayout={containerOnLayout}
      style={[
        styles.wrap,
        {
          bottom: bottomOffset,
          paddingTop: 8,
          backgroundColor: "transparent",
        },
      ]}
    >
      <View
        style={[
          styles.bar,
          {
            backgroundColor: "red",
            // backgroundColor: t.card,
            borderColor: t.border,
          },
        ]}
      >
        {/* animated pill behind active item */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.indicator,
            { backgroundColor: withAlpha(t.primary, t.isDark ? 0.18 : 0.12) },
            indicatorStyle,
          ]}
        />

        {state.routes.map((route, idx) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? (options.tabBarLabel as string)
              : options.title !== undefined
              ? options.title
              : route.name;

          const focused = state.index === idx;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented)
              navigation.navigate(route.name as never);
          };

          const onLongPress = () => {
            navigation.emit({ type: "tabLongPress", target: route.key });
          };

          const color = focused ? t.primary : t.mutedText;

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              style={({ pressed }) => [
                styles.item,
                pressed && { opacity: 0.9 },
              ]}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
            >
              <Ionicons
                name={iconFor(route.name, focused)}
                size={20}
                color={color}
              />
              <Text style={[styles.label, { color }]} numberOfLines={1}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    // If you want the bar to float above content, keep wrap transparent
  },
  bar: {
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  item: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
  },
  indicator: {
    position: "absolute",
    top: 4,
    bottom: 4,
    left: 0,
    borderRadius: 12,
  },
});
