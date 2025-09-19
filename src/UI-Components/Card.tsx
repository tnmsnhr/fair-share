import { StyleSheet, Text, View, ViewStyle } from "react-native";
import React, { ReactNode } from "react";
import { makeStyles } from "@/theme/theme";
import { colors } from "@/theme/colors";
import { s } from "@/theme/spacing";

type Props = {
  children?: ReactNode;
  style?: ViewStyle;
  variant?: "primary" | "default";
};

export const Card: React.FC<Props> = ({
  children,
  style,
  variant = "default",
}) => {
  const s = useStyles();
  return (
    <View
      style={[
        s.root,
        variant == "primary"
          ? { backgroundColor: colors.primary900, borderWidth: 0 }
          : { backgroundColor: colors.white, borderWidth: 1 },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const useStyles = makeStyles((t) => ({
  root: {
    width: "100%",
    borderRadius: s("xl"),
    padding: s("lg"),
    borderColor: t.border,
    flex: 1,
    overflow: "hidden",
  },
}));
