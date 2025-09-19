import { StyleSheet, Text, View, ViewStyle } from "react-native";
import React, { ReactNode } from "react";
import { makeStyles } from "@/theme/theme";
import { colors } from "@/theme/colors";
import { s } from "@/theme/spacing";

type Props = { children?: ReactNode; style?: ViewStyle };

export const Card: React.FC<Props> = ({ children, style }) => {
  const s = useStyles();
  return <View style={[s.root, style]}>{children}</View>;
};

const useStyles = makeStyles((t) => ({
  root: {
    backgroundColor: colors.white,
    width: "100%",
    borderRadius: s("xl"),
    padding: s("lg"),
    borderWidth: 1,
    borderColor: t.border,
    flex: 1,
    overflow: "hidden",
  },
}));
