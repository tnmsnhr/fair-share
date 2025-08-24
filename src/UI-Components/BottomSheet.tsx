import { useTheme } from "@/theme/theme";
import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
  Platform,
} from "react-native";

type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;

  /** Fractions [0..1] of the sheet height to snap to (0 = fully expanded, 1 = fully hidden) */
  snapPoints?: number[]; // e.g. [0.15, 0.5, 0.9, 1]
  initialSnapIndex?: number; // default: second last (e.g. 0.9 if you provided [0.15,0.5,0.9,1])
  height?: number; // px (default: 90% of screen height)
  backdropOpacity?: number; // default 0.4
  enableBackdropPress?: boolean; // default true

  style?: StyleProp<ViewStyle>; // extra styles for the sheet
  children?: React.ReactNode;
};

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);
const nearest = (v: number, arr: number[]) =>
  arr.reduce((a, b) => (Math.abs(b - v) < Math.abs(a - v) ? b : a), arr[0]);

export default function BottomSheet({
  isOpen,
  onClose,
  snapPoints = [0.25, 0.5, 0.9, 1],
  initialSnapIndex,
  height,
  backdropOpacity = 0.4,
  enableBackdropPress = true,
  style,
  children,
}: BottomSheetProps) {
  const t = useTheme();
  const { height: H } = Dimensions.get("window");
  const SHEET_HEIGHT = Math.min(height ?? Math.round(H * 0.9), H);
  // sanitize & ensure "1" (closed) is present
  const snaps = useMemo(() => {
    const uniq = Array.from(
      new Set(snapPoints.map((n) => clamp(n, 0, 1)))
    ).sort((a, b) => a - b);
    return uniq[uniq.length - 1] === 1 ? uniq : [...uniq, 1];
  }, [snapPoints]);

  const DEFAULT_INDEX = Math.max(0, initialSnapIndex ?? snaps.length - 2); // second last (before close)
  const snapPx = useMemo(
    () => snaps.map((f) => f * SHEET_HEIGHT),
    [snaps, SHEET_HEIGHT]
  );

  // translateY: 0 (fully open) .. SHEET_HEIGHT (hidden)
  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const currentY = useRef(SHEET_HEIGHT);
  useEffect(() => {
    const id = translateY.addListener(
      ({ value }) => (currentY.current = value)
    );
    return () => translateY.removeListener(id);
  }, [translateY]);

  // open/close effects
  useEffect(() => {
    if (isOpen) {
      animateTo(snapPx[DEFAULT_INDEX]);
    } else {
      animateTo(SHEET_HEIGHT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, SHEET_HEIGHT]);

  const animateTo = (to: number, cb?: () => void) => {
    Animated.spring(translateY, {
      toValue: clamp(to, 0, SHEET_HEIGHT),
      useNativeDriver: true,
      tension: 40,
      friction: 12,
    }).start(({ finished }) => {
      if (finished && cb) cb();
    });
  };

  // Pan handling (drag only from the top handle for reliable scroll interoperability)
  const startY = useRef(0);
  const responder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_e, g) =>
        Math.abs(g.dy) > Math.abs(g.dx) && Math.abs(g.dy) > 3,
      onPanResponderGrant: () => {
        translateY.stopAnimation((v: number) => (startY.current = v));
      },
      onPanResponderMove: (_e, g) => {
        translateY.setValue(clamp(startY.current + g.dy, 0, SHEET_HEIGHT));
      },
      onPanResponderRelease: (_e, g) => {
        const dragToss = 180; // px "momentum"
        const projected = clamp(
          currentY.current + g.vy * dragToss,
          0,
          SHEET_HEIGHT
        );
        const target = nearest(projected, snapPx);
        if (Math.abs(target - SHEET_HEIGHT) < 1) {
          animateTo(SHEET_HEIGHT, onClose); // close
        } else {
          animateTo(target);
        }
      },
      onPanResponderTerminate: () => {
        const target = nearest(currentY.current, snapPx);
        if (Math.abs(target - SHEET_HEIGHT) < 1) {
          animateTo(SHEET_HEIGHT, onClose);
        } else {
          animateTo(target);
        }
      },
    })
  ).current;

  const backdropStyle = {
    opacity: translateY.interpolate({
      inputRange: [0, SHEET_HEIGHT],
      outputRange: [backdropOpacity, 0],
      extrapolate: "clamp",
    }),
  };

  const visible = isOpen || currentY.current < SHEET_HEIGHT - 1;

  return (
    <View
      pointerEvents={visible ? "auto" : "none"}
      style={StyleSheet.absoluteFill}
    >
      {/* Backdrop */}
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={enableBackdropPress ? onClose : undefined}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: "#000" },
            backdropStyle,
          ]}
        />
      </Pressable>

      {/* Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          {
            height: SHEET_HEIGHT,
            backgroundColor: t.card,
            borderTopColor: t.border,
            transform: [{ translateY }],
          },
          style,
        ]}
      >
        {/* Drag handle area (iOS-style) */}
        <View {...responder.panHandlers} style={styles.dragZone}>
          <View
            style={[
              styles.handle,
              { backgroundColor: t.mutedText + (t.isDark ? "55" : "66") }, // subtle
            ]}
          />
        </View>

        {/* Content */}
        <View style={[styles.content, { backgroundColor: t.card }]}>
          {children}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: -1, // tuck under for rounded corners
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  dragZone: {
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 999,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 20 : 16, // simple safe-area-ish padding
  },
});
