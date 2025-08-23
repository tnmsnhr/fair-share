// src/UI-Components/Input.tsx
import { withAlpha } from "@/Theme/colorUtils";
import { useTheme } from "@/Theme/theme";
import React, { forwardRef, useMemo, useState } from "react";
import {
  TextInput,
  TextInputProps,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  StyleProp,
} from "react-native";
// import { useTheme } from '@/theme/simpleThemeStrict';
// import { withAlpha } from '@/theme/colorUtils';

type Size = "sm" | "md" | "lg";
type Tone = "default" | "error" | "warning" | "success" | "info" | "disabled";

export type InputProps = Omit<
  TextInputProps,
  "style" | "placeholderTextColor"
> & {
  label?: string;
  helperText?: string;
  tone?: Tone;
  size?: Size;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onPressRightIcon?: () => void;

  /** NEW: minimum height for textarea-style inputs (applies when multiline is true) */
  minHeight?: number;

  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  helperStyle?: StyleProp<TextStyle>;
};

const HEIGHT: Record<Size, number> = { sm: 36, md: 44, lg: 52 };
const PADX: Record<Size, number> = { sm: 10, md: 12, lg: 14 };
const FONTSZ: Record<Size, number> = { sm: 14, md: 16, lg: 18 };

export const Input = forwardRef<TextInput, InputProps>(function Input(
  {
    label,
    helperText,
    tone = "default",
    size = "md",
    leftIcon,
    rightIcon,
    onPressRightIcon,
    editable = true,
    containerStyle,
    inputStyle,
    helperStyle,
    onFocus,
    onBlur,
    multiline,
    minHeight, // ← NEW
    ...rest
  },
  ref
) {
  const t = useTheme();
  const [focused, setFocused] = useState(false);

  const baseHeight = HEIGHT[size];
  const paddingHorizontal = PADX[size];
  const fontSize = FONTSZ[size];

  // If textarea (multiline), honor minHeight (fallback to baseHeight)
  const effectiveMinHeight = multiline
    ? Math.max(baseHeight, minHeight ?? baseHeight)
    : baseHeight;

  const disabled =
    rest.readOnly === true || editable === false || tone === "disabled";

  const colors = useMemo(() => {
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
      : focused
      ? focusBorder
      : toneBorder;

    return {
      bg: t.card,
      text: t.text,
      placeholder: withAlpha(t.mutedText, t.isDark ? 0.55 : 0.5),
      border: borderColor,
      helper:
        tone === "error"
          ? t.danger
          : tone === "warning"
          ? t.warning
          : tone === "success"
          ? t.success
          : tone === "info"
          ? t.primary
          : t.mutedText,
    };
  }, [t, focused, tone, disabled]);

  const wrapperStyle: ViewStyle = {
    backgroundColor: colors.bg,
    borderColor: colors.border,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    minHeight: effectiveMinHeight, // ← key line
    paddingHorizontal,
    flexDirection: "row",
    alignItems: multiline ? ("flex-start" as const) : ("center" as const),
    gap: 8,
    opacity: disabled ? 0.6 : 1,
  };

  const tiStyle: TextStyle = {
    flex: 1,
    color: colors.text,
    fontSize,
    paddingVertical: multiline ? 10 : 0,
    textAlignVertical: multiline ? "top" : "center", // ← keep text at top for textarea
    // You can also set minHeight on the TextInput itself; wrapper already enforces minHeight
  };

  return (
    <View style={{ width: "100%" }}>
      {label ? (
        <Text style={{ color: t.mutedText, fontSize: 13, marginBottom: 6 }}>
          {label}
        </Text>
      ) : null}

      <View style={[wrapperStyle, containerStyle]}>
        {leftIcon ? (
          <View style={{ paddingVertical: 6 }}>{leftIcon}</View>
        ) : null}

        <TextInput
          ref={ref}
          editable={!disabled}
          placeholderTextColor={colors.placeholder}
          style={[tiStyle, inputStyle]}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          multiline={multiline}
          {...rest}
        />

        {rightIcon ? (
          onPressRightIcon ? (
            <TouchableOpacity
              onPress={onPressRightIcon}
              style={{ paddingVertical: 6 }}
            >
              {rightIcon}
            </TouchableOpacity>
          ) : (
            <View style={{ paddingVertical: 6 }}>{rightIcon}</View>
          )
        ) : null}
      </View>

      {helperText ? (
        <Text
          style={[
            { color: colors.helper, fontSize: 12, marginTop: 6 },
            helperStyle,
          ]}
        >
          {helperText}
        </Text>
      ) : null}
    </View>
  );
});
