import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { makeStyles } from "@/theme/theme";
import { Typo } from "./Typography";
import { s } from "@/theme/spacing";
import { Icon } from "./Icons";

type Props = {
  label: String;
  pressable?: boolean;
  onCancel?: () => void;
  id?: string;
};
export const Chip: React.FC<Props> = ({ label, pressable, onCancel }) => {
  const s = useStyles();
  return (
    <View style={s.container}>
      <View style={s.avatar}>
        <Typo variant="bodyStrong" tone="inverse">
          {label?.[0]?.[0]}
        </Typo>
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
    borderColor: "#93b091ff",
    height: s("2xl"),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#bcc4d1ff",
  },
  avatar: {
    height: s("2xl"),
    width: s("2xl"),
    backgroundColor: t.mutedText,
    borderRadius: s("2xl") / 2,
    marginRight: 4,
    justifyContent: "center",
    alignItems: "center",
  },
}));
