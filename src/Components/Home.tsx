import React, { useEffect } from 'react';
import { View, Text, Pressable, TouchableOpacity } from 'react-native';
import { createStyles } from '@/Theme/createStyles';
import { setMode } from '@/Theme/themeStore';
import type { ViewStyle, TextStyle } from 'react-native';

type Styles = {
    cta: ViewStyle;
    title: TextStyle;
    card: ViewStyle;
    root: ViewStyle;
    ctaText: TextStyle;
};

/** Styles outside the component */
const styles = createStyles<Styles>((theme) => ({
    root: { flex: 1, backgroundColor: theme.colors.bg, padding: 20, justifyContent: 'center' },
    card: {
        backgroundColor: theme.colors.card,
        borderColor: theme.colors.border,
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        gap: 12,
    },
    title: { color: theme.colors.textPrimary, fontSize: 20, fontWeight: '700' },
    cta: { paddingVertical: 14, alignItems: 'center', borderRadius: 10, backgroundColor: theme.colors.primary },
    ctaText: { color: theme.colors.onPrimary, fontWeight: '700' },
}));

const Home: React.FC = () => {
    return (
        <View style={styles.root}>
            <View style={styles.card}>

                <Row>
                    <Chip label="Light" onPress={() => setMode('light')} />
                    <Chip label="Dark" onPress={() => setMode('dark')} />
                </Row>

                <TouchableOpacity style={styles.cta}><Text style={styles.ctaText}>Primary CTA</Text></TouchableOpacity>
            </View>
        </View>
    );
}

function Row({ children }: { children: React.ReactNode }) {
    return <View style={{ flexDirection: 'row', gap: 8 }}>{children}</View>;
}
function Chip({ label, onPress }: { label: string; onPress: () => void }) {
    return (
        <Pressable onPress={onPress} style={{ paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1 }}>
            <Text>{label}</Text>
        </Pressable>
    );
}

export default Home
