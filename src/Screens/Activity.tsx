import { makeStyles, useTheme, useThemeMode } from "@/theme/theme";
import {
  Button,
  GhostButton,
  OutlineButton,
  PrimaryButton,
  SecondaryButton,
  Subtitle,
  Typo,
  Input,
  Dropdown,
  Layout,
} from "@/ui-components";
import { Body3, DisplayXL } from "@/ui-components/Typography";

import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, SafeAreaView } from "react-native";

const members = [
  { label: "You", value: "me" },
  { label: "Aarav", value: "aarav" },
  { label: "Isha", value: "isha" },
  { label: "Tanmoy", value: "Tanmoy" },
  { label: "Shreya", value: "Shreya" },
  { label: "Amit", value: "Amit" },
  { label: "Uttam", value: "Uttam" },
  { label: "Saurabh", value: "isSaurabhha" },
  { label: "Rahul", value: "rahul", disabled: true },
];

const useStyles = makeStyles((t) => {
  return {
    root: {
      flex: 1,
      backgroundColor: t.bg,
      justifyContent: "center",
    },
    card: {
      backgroundColor: t.card,
      borderColor: t.border,
      borderWidth: 1,
      borderRadius: 12,
      padding: 16,
      gap: 12,
      width: "100%",
    },
    title: { color: t.text, fontSize: 20, fontWeight: "700" },
    row: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
    chip: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: t.border,
    },
    cta: {
      paddingVertical: 14,
      alignItems: "center" as const,
      borderRadius: 10,
      backgroundColor: t.primary,
    },
    ctaText: { color: t.onPrimary, fontWeight: "700" },
  };
});

export default function Activity() {
  const t = useTheme();
  const { mode, setMode } = useThemeMode();
  const s = useStyles();

  const [state, setState] = useState(10);
  const [open, setOpen] = useState(false);
  const [who, setWho] = useState<string | undefined>();

  return (
    <Layout scroll>
      <View style={s.root}>
        <View style={s.card}>
          <Text style={s.title}>
            Mode: {mode} | Scheme: {t.scheme}
          </Text>

          {/* inline theme test */}
          <View
            style={{ height: 8, backgroundColor: t.primary, borderRadius: 4 }}
          />

          <View style={s.row}>
            <Pressable style={s.chip} onPress={() => setMode("system")}>
              <Text style={{ color: t.text }}>System</Text>
            </Pressable>
            <Pressable style={s.chip} onPress={() => setMode("light")}>
              <Text style={{ color: t.text }}>Light</Text>
            </Pressable>
            <Pressable style={s.chip} onPress={() => setMode("dark")}>
              <Text style={{ color: t.text }}>Dark</Text>
            </Pressable>
            <Pressable style={s.chip} onPress={() => setState(Math.random())}>
              <Text style={{ color: t.text }}>Set State</Text>
            </Pressable>
          </View>
          <Pressable style={s.cta}>
            <Text style={s.ctaText}>Primary CTA</Text>
          </Pressable>
        </View>
        <View style={{ ...s.card, marginTop: 20 }}>
          <View style={s.row}>
            <DisplayXL weight="regular">DisplayXL</DisplayXL>
            <DisplayXL weight="medium">DisplayXL</DisplayXL>
            <DisplayXL weight="semibold">DisplayXL</DisplayXL>
            <DisplayXL weight="bold">DisplayXL</DisplayXL>
          </View>
          <View style={s.row}></View>
        </View>
      </View>
    </Layout>
  );
}
