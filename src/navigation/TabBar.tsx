import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Pressable,
  LayoutChangeEvent,
  StyleSheet,
  Text,
} from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { useTheme } from "@/theme/theme";
import { withAlpha } from "@/theme/colorUtils";
import { SCREEN } from "./type";
import { Icon, IconName, IconVariant } from "@/ui-components";

type Props = BottomTabBarProps & {
  onPlusPress?: () => void;
};

const FAB_SIZE = 64; // diameter of the + circle
const CENTER_GAP = 10; // horizontal padding around FAB inside the bar
const BOTTOM_GAP = 8; // float distance of the whole bar from device bottom
const BAR_PAD_H = 8;

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
  onPlusPress,
}: Props) {
  const t = useTheme();
  const insets = useSafeAreaInsets();

  const hasBottomInset = insets.bottom > 0;
  const GAP = -10; // or s('sm') if using your spacing tokens
  const bottomOffset = hasBottomInset ? insets.bottom + GAP : GAP;

  const barWidthRef = useRef(0);
  const [barHeight, setBarHeight] = useState(0);

  const onBarLayout = (e: LayoutChangeEvent) => {
    barWidthRef.current = e.nativeEvent.layout.width;
    setBarHeight(e.nativeEvent.layout.height);
  };

  const fabRadius = FAB_SIZE / 2;
  const fabBottomWithinWrap = Math.max(0, barHeight - fabRadius);

  const iconFor = (
    name: keyof SCREEN,
    focused: boolean
  ): { name: IconName; variant: IconVariant } => {
    const map: Record<keyof SCREEN, IconName> = {
      Home: focused ? "home" : "home-outline",
      Activity: focused ? "activity" : "activity-outline",
      Groups: focused ? "group" : "group-outline",
      Friends: focused ? "person" : "person-outline",
    };
    return { name: map[name], variant: focused ? "default" : "outline" };
  };

  return (
    <View
      onLayout={onBarLayout}
      style={[
        styles.wrap,
        {
          bottom: 0,
        },
      ]}
    >
      <View
        style={[
          styles.bar,
          {
            backgroundColor: t.card,
            borderColor: t.navBorder,
            paddingBottom: bottomOffset,
          },
        ]}
      >
        <View
          pointerEvents="none"
          style={[
            styles.indicator,
            { backgroundColor: withAlpha(t.primary, t.isDark ? 0.18 : 0.12) },
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
            console.log("long press");
            navigation.emit({ type: "tabLongPress", target: route.key });
          };

          const color = focused ? t.primary : t.mutedText;

          return (
            <React.Fragment key={route.key}>
              <Pressable
                onPress={onPress}
                onLongPress={onLongPress}
                style={({ pressed }) => [
                  styles.item,
                  pressed && { opacity: 0.9 },
                  idx == 2 && { marginLeft: 20 },
                  idx == 1 && { marginRight: 20 },
                ]}
                accessibilityRole="button"
                accessibilityState={focused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
              >
                <Icon
                  {...iconFor(route.name, focused)}
                  size={20}
                  color={focused ? t.primary : t.mutedText}
                />
                <Text style={[styles.label, { color }]} numberOfLines={1}>
                  {label}
                </Text>
              </Pressable>
            </React.Fragment>
          );
        })}

        <Pressable
          key={"plus"}
          onPress={onPlusPress}
          style={[
            styles.addExpenses,
            {
              width: FAB_SIZE,
              height: FAB_SIZE,
              borderRadius: fabRadius,
              bottom: fabBottomWithinWrap,
              left: "50%",
              transform: [{ translateX: -fabRadius + 8 }],
              backgroundColor: t.primary,
              borderColor: withAlpha(t.onPrimary, 0.12),
            },
          ]}
          accessibilityRole="button"
        >
          <Icon name="plus" size={30} color={t.white} />
        </Pressable>
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
  },
  bar: {
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
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
  addExpenses: {
    backgroundColor: "#2563eb",
    borderRadius: 100,
    position: "absolute",
    bottom: 30,
    height: FAB_SIZE,
    width: FAB_SIZE,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    left: "50%",
  },
});
