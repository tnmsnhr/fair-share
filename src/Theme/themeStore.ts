import { Appearance, ColorSchemeName } from 'react-native';
import { basePalette, resolvePalette, ResolvedColors, Scheme, Palette } from './colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Mode = 'system' | 'light' | 'dark';
export type Theme = { scheme: Scheme; colors: ResolvedColors; version: number };

let mode: Mode = 'system';
let systemScheme: Scheme = (Appearance.getColorScheme() ?? 'light') as Scheme;
let overrides: Partial<Palette> = {};
let version = 0;

function compute(): Theme {
    const scheme: Scheme = mode === 'system' ? systemScheme : mode;
    const palette: Palette = { ...basePalette, ...overrides };
    return { scheme, colors: resolvePalette(palette, scheme), version };
}
let theme: Theme = compute();

const subs = new Set<() => void>();
const notify = () => {
    version++;
    console.log(version)
    theme = compute();
    subs.forEach((f) => f());
};

Appearance.addChangeListener(({ colorScheme }: { colorScheme: ColorSchemeName }) => {
    systemScheme = (colorScheme ?? 'light') as Scheme;
    if (mode === 'system') notify();
});

export function getTheme(): Theme { return theme; }

export async function loadSavedMode() {
    try {
        const saved = await AsyncStorage.getItem('theme.mode');
        if (saved === 'light' || saved === 'dark' || saved === 'system') { mode = saved; notify(); }
    } catch { }
}

export async function setMode(next: Mode) {
    mode = next;
    notify();
    try { await AsyncStorage.setItem('theme.mode', next); } catch { }
}

/** Override tokens at runtime (branding/festivals). */
export function setOverrides(next: Partial<Palette>) { overrides = { ...overrides, ...next }; notify(); }

/** Subscribe without React Context. */
export function subscribe(fn: () => void) { subs.add(fn); return () => subs.delete(fn); }
