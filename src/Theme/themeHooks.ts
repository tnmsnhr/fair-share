// src/theme/hooks.ts
import { useMemo, useSyncExternalStore } from 'react';
import { getTheme, subscribe, Theme } from './themeStore';
import { StyleSheet } from 'react-native';

export function useTheme(): Theme {
    return useSyncExternalStore(subscribe, getTheme, getTheme);
}

export function makeStyles<T extends Record<string, any>>(factory: (t: Theme) => T) {
    return () => {
        const t = useTheme();
        return useMemo(() => StyleSheet.create(factory(t)), [t.scheme, t.colors]);
    };
}
