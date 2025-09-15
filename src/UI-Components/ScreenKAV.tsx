import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  /** Visible header height (not including safe top). Your Header default is 56. */
  headerHeight?: number;
  /** If this screen has no header (e.g., full-screen modal), set 0. */
  hasHeader?: boolean;
  children: React.ReactNode;
};

export const ScreenKAV: React.FC<Props> = ({
  headerHeight = 0,
  hasHeader = true,
  children,
}) => {
  const inset = useSafeAreaInsets();
  const offset = hasHeader ? inset.top + headerHeight : 0;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      //   keyboardVerticalOffset={Platform.OS === "ios" ? offset : 0}
    >
      {children}
    </KeyboardAvoidingView>
  );
};
