import Animated, {
  useSharedValue,
  withTiming,
  withSpring,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";

import { withAlpha } from "@/theme/colorUtils";
import { useTheme } from "@/theme/theme";
import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";

export type DropdownOption = {
  label: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  meta?: any;
};

type Size = "sm" | "md" | "lg";
type Tone = "default" | "error" | "warning" | "success" | "info" | "disabled";

export type DropdownProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange: (value: string, option: DropdownOption) => void;
  options: DropdownOption[];

  size?: Size;
  tone?: Tone;
  disabled?: boolean;

  searchable?: boolean;
  searchPlaceholder?: string;

  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;

  maxPanelHeight?: number;
  minPanelHeight?: number;

  containerStyle?: StyleProp<ViewStyle>;
  controlStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  optionRowStyle?: StyleProp<ViewStyle>;
  renderOption?: (opt: DropdownOption, selected: boolean) => React.ReactNode;
};

const HEIGHT: Record<Size, number> = { sm: 36, md: 44, lg: 52 };
const PADX: Record<Size, number> = { sm: 10, md: 12, lg: 14 };
const FONTSZ: Record<Size, number> = { sm: 14, md: 16, lg: 18 };

export function Dropdown({
  label,
  placeholder = "Select…",
  value,
  onChange,
  options,
  size = "md",
  tone = "default",
  disabled: propDisabled,
  searchable = false,
  searchPlaceholder = "Search…",
  leftIcon,
  rightIcon,
  maxPanelHeight,
  minPanelHeight = 280,
  containerStyle,
  controlStyle,
  textStyle,
  optionRowStyle,
  renderOption,
}: DropdownProps) {
  const t = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // keep modal mounted for exit animation
  const [query, setQuery] = useState("");

  const selected = options.find((o) => o.value === value) ?? null;
  const disabled = propDisabled || tone === "disabled";

  /* -------- control visuals (focus / tone) -------- */
  const baseBorder = t.border;
  const focusBorder = t.primary;
  const toneBorder =
    tone === "error"
      ? t.danger
      : tone === "warning"
      ? t.warning
      : tone === "success"
      ? t.success
      : tone === "info"
      ? t.primary
      : baseBorder;

  const borderColor = disabled
    ? withAlpha(baseBorder, 0.5)
    : open
    ? focusBorder
    : toneBorder;

  const ctrl: ViewStyle = {
    minHeight: HEIGHT[size],
    paddingHorizontal: PADX[size],
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor,
    backgroundColor: t.card,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    opacity: disabled ? 0.6 : 1,
  };

  const valueStyle: TextStyle = {
    flex: 1,
    color: t.text,
    fontSize: FONTSZ[size],
  };
  const placeholderStyle: TextStyle = {
    ...valueStyle,
    color: withAlpha(t.mutedText, t.isDark ? 0.55 : 0.5),
  };

  /* -------- data / filtering -------- */
  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [query, options]);

  /* -------- panel sizing -------- */
  const screenH = Dimensions.get("window").height;
  const panelMax = maxPanelHeight ?? Math.round(screenH * 0.6);

  /* -------- Reanimated shared values -------- */
  const overlay = useSharedValue(0); // 0..1
  const sheetY = useSharedValue(24); // px translateY
  const sheetS = useSharedValue(0.98); // scale

  // Animated styles
  const maxBackdrop = t.isDark ? 0.6 : 0.45;
  const backdropAStyle = useAnimatedStyle(() => ({
    opacity: overlay.value * maxBackdrop,
  }));

  const sheetAStyle = useAnimatedStyle(() => ({
    opacity: overlay.value,
    transform: [{ translateY: sheetY.value }, { scale: sheetS.value }] as const,
  }));

  // Animate open/close
  useEffect(() => {
    if (open) {
      setMounted(true);
      // reset for open
      overlay.value = 0;
      sheetY.value = 24;
      sheetS.value = 0.98;

      overlay.value = withTiming(1, { duration: 180 });
      sheetY.value = withSpring(0, { damping: 16, stiffness: 180, mass: 0.9 });
      sheetS.value = withSpring(1, { damping: 18, stiffness: 200, mass: 0.9 });
    } else {
      // exit animation then unmount
      overlay.value = withTiming(0, { duration: 140 }, (finished) => {
        if (finished) runOnJS(setMounted)(false);
      });
      sheetY.value = withTiming(16, { duration: 140 });
      sheetS.value = withTiming(0.98, { duration: 140 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /* -------- helpers -------- */
  const close = () => setOpen(false);
  const select = (opt: DropdownOption) => {
    if (opt.disabled) return;
    onChange?.(opt.value, opt);
    close();
  };

  const Chevron = () => (
    <Text style={{ color: t.mutedText, fontSize: 16, marginLeft: 4 }}>
      {open ? "▴" : "▾"}
    </Text>
  );

  return (
    <View style={containerStyle}>
      {label ? (
        <Text style={{ color: t.mutedText, fontSize: 13, marginBottom: 6 }}>
          {label}
        </Text>
      ) : null}

      <Pressable
        disabled={disabled}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          ctrl,
          pressed && !disabled
            ? { backgroundColor: withAlpha(t.text, t.isDark ? 0.1 : 0.06) }
            : null,
          controlStyle,
        ]}
      >
        {leftIcon ? (
          <View style={{ paddingVertical: 6 }}>{leftIcon}</View>
        ) : null}
        {selected ? (
          <Text style={[valueStyle, textStyle]} numberOfLines={1}>
            {selected.label}
          </Text>
        ) : (
          <Text style={[placeholderStyle, textStyle]} numberOfLines={1}>
            {placeholder}
          </Text>
        )}
        {rightIcon ?? <Chevron />}
      </Pressable>

      {/* Panel (Modal stays mounted during exit anim) */}
      <Modal
        transparent
        visible={mounted}
        animationType="none"
        onRequestClose={close}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={StyleSheet.absoluteFill}
        >
          {/* Backdrop */}
          <Pressable style={StyleSheet.absoluteFill} onPress={close}>
            <Animated.View
              pointerEvents="none"
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: withAlpha(t.backdrop, 1), filter: "" },
                backdropAStyle,
              ]}
            />
          </Pressable>

          {/* Panel card */}
          <View style={styles.panelWrap} pointerEvents="box-none">
            <Animated.View
              style={[
                styles.panel,
                {
                  backgroundColor: t.card,
                  borderColor: t.border,
                  maxHeight: panelMax,
                  minHeight: Math.min(panelMax, minPanelHeight),
                },
                sheetAStyle,
              ]}
            >
              {/* Search */}
              {searchable ? (
                <View
                  style={[
                    styles.searchBox,
                    {
                      borderColor: t.border,
                      backgroundColor: withAlpha(t.text, t.isDark ? 0.1 : 0.06),
                    },
                  ]}
                >
                  <TextInput
                    value={query}
                    onChangeText={setQuery}
                    placeholder={searchPlaceholder}
                    placeholderTextColor={withAlpha(
                      t.mutedText,
                      t.isDark ? 0.55 : 0.5
                    )}
                    style={{
                      flex: 1,
                      color: t.text,
                      fontSize: 16,
                      paddingVertical: 8,
                    }}
                    autoFocus
                  />
                </View>
              ) : null}

              {/* Options */}
              <FlatList
                data={data}
                keyExtractor={(it) => String(it.value)}
                keyboardShouldPersistTaps="handled"
                ItemSeparatorComponent={() => (
                  <View
                    style={{
                      height: StyleSheet.hairlineWidth,
                      backgroundColor: withAlpha(t.border, 0.8),
                    }}
                  />
                )}
                renderItem={({ item }) => {
                  const isSel = selected?.value === item.value;
                  const rowBg = isSel
                    ? withAlpha(t.primary, t.isDark ? 0.18 : 0.12)
                    : "transparent";
                  const rowFg = isSel ? t.primary : t.text;

                  return (
                    <Pressable
                      onPress={() => select(item)}
                      disabled={item.disabled}
                      style={({ pressed }) => [
                        styles.row,
                        { backgroundColor: rowBg },
                        pressed && !item.disabled
                          ? {
                              backgroundColor: withAlpha(
                                t.text,
                                t.isDark ? 0.1 : 0.06
                              ),
                            }
                          : null,
                        optionRowStyle,
                        item.disabled ? { opacity: 0.5 } : null,
                      ]}
                    >
                      {renderOption ? (
                        renderOption(item, isSel)
                      ) : (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                            flex: 1,
                          }}
                        >
                          {item.icon ? <View>{item.icon}</View> : null}
                          <Text
                            style={{ color: rowFg, fontSize: 16, flex: 1 }}
                            numberOfLines={1}
                          >
                            {item.label}
                          </Text>
                          {isSel ? (
                            <Text style={{ color: rowFg }}>✓</Text>
                          ) : null}
                        </View>
                      )}
                    </Pressable>
                  );
                }}
              />
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  panelWrap: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
  },
  panel: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    paddingBottom: 20,
  },
  searchBox: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
  },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
