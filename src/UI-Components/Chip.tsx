import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import { makeStyles } from "@/theme/theme";
import { Body3, Typo } from "./Typography";
import { s } from "@/theme/spacing";
import { Icon } from "./Icons";

type Props = {
  label: String;
  pressable?: boolean;
  onCancel?: () => void;
  id?: string;
  style?: ViewStyle;
};
export const Chip: React.FC<Props> = ({
  label,
  pressable,
  onCancel,
  style,
}) => {
  const s = useStyles();
  return (
    <View style={[s.container, style]}>
      <View style={s.avatar}>
        <Body3 weight="bold">{label?.[0]?.[0]}</Body3>
      </View>
      <Typo variant="bodySmall">{label}</Typo>
      {pressable && (
        <TouchableOpacity activeOpacity={0.6} style={{ paddingHorizontal: 4 }}>
          <Icon name="cancel" size={16} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const useStyles = makeStyles((t) => ({
  container: {
    borderWidth: 1,
    borderRadius: s("md"),
    paddingRight: 8,
    borderColor: t.border,
    height: s("2xl"),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: t.white,
  },
  avatar: {
    height: s("2xl"),
    width: s("2xl"),
    backgroundColor: t.border,
    borderRadius: s("2xl") / 2,
    marginRight: 4,
    justifyContent: "center",
    alignItems: "center",
  },
}));
