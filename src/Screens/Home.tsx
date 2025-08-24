import { makeStyles, useTheme, useThemeMode } from "@/theme/theme";
import {
  Button,
  GhostButton,
  OutlineButton,
  PrimaryButton,
  SecondaryButton,
  CaptionBold,
  Subtitle,
  TitleBold,
  Typo,
  Input,
  Dropdown,
  Layout,
} from "@/ui-components";

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

export default function Home() {
  const t = useTheme();
  const { mode, setMode } = useThemeMode();
  const s = useStyles();

  const [state, setState] = useState(10);
  const [open, setOpen] = useState(false);
  const [who, setWho] = useState<string | undefined>();

  console.log(state, "Home Rendered");
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
            <TitleBold>FareShare</TitleBold>
            <Subtitle tone="debug">Split expenses the easy way</Subtitle>

            <Typo>Primary Text</Typo>
            <Typo tone="success">Payment received</Typo>
            <Typo tone="warning">Pending settlement</Typo>
            <Typo tone="info">UPI initiated…</Typo>
            <Typo tone="danger">Failed</Typo>
            <Typo tone="debug">Debug details…</Typo>
            <Typo tone="disabled">Disabled / hint</Typo>

            <CaptionBold uppercase underline>
              powered by Expo + TS
            </CaptionBold>
          </View>
        </View>
        <View style={{ ...s.card, marginTop: 20 }}>
          <PrimaryButton label="Pay now" onPress={() => {}} />
          <PrimaryButton label="Downloading…" loading fullWidth />

          <SecondaryButton label="Add member" size="lg" />
          <OutlineButton label="Retry" size="sm" weight="semibold" />
          <GhostButton label="More options" onPress={() => {}} />

          {/* Custom build */}
          <Button
            label="Custom"
            variant="primary"
            size="lg"
            weight="bold"
            rounded="pill"
            rightIcon={
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: t.onPrimary,
                }}
              />
            }
            onPress={() => {}}
          />
        </View>
        <View style={{ ...s.card, marginTop: 20 }}>
          <Input
            label="Full name"
            placeholder="Enter your name"
            //   value={name}
            //   onChangeText={setName}
            //   leftIcon={
            //     <Ionicons name="person" size={18} color={t.mutedText} />
            //   }
            //   tone={name.length > 0 ? "success" : "default"}
          />

          <Input
            label="UPI ID"
            placeholder="name@bank"
            helperText="We’ll never share your UPI."
            //   rightIcon={
            //     <Ionicons name="clipboard" size={18} color={t.mutedText} />
            //   }
            onPressRightIcon={() => {}}
            size="lg"
          />

          <Input
            label="Notes"
            placeholder="Add detailed notes…"
            multiline
            minHeight={120} // ← sets textarea minimum height
            helperText="You can enter multiple lines."
          />

          <Input
            label="Disabled"
            placeholder="Can't edit"
            value="Read-only"
            editable={false}
            tone="disabled"
          />
        </View>
        <View style={{ ...s.card, marginTop: 20 }}>
          <Typo>Split with</Typo>

          <Dropdown
            label="Member"
            placeholder="Choose a person"
            value={who}
            options={members}
            onChange={(val) => setWho(val)}
            // searchable
          />

          <PrimaryButton label="Continue" fullWidth disabled={!who} />
        </View>
      </View>
    </Layout>
  );
}
