export type Scheme = 'light' | 'dark';
export type ColorDef = string | { light: string; dark?: string };
export type Palette = Record<string, ColorDef>;
export type ResolvedColors = Record<string, string>;

/** If a token has no dark value, it falls back to light. */
export function resolvePalette(p: Palette, scheme: Scheme): ResolvedColors {
    const out: ResolvedColors = {};
    for (const [k, v] of Object.entries(p)) {
        if (typeof v === 'string') out[k] = v;
        else out[k] = scheme === 'dark' ? (v.dark ?? v.light) : v.light;
    }
    return out;
}

export const basePalette: Palette = {
    // Your “charcoal” text example
    textPrimary: { light: '#1a1f26', dark: '#f2f4f8' },
    textSecondary: { light: '#475569', dark: '#cbd5e1' },

    // Surfaces
    bg: { light: '#f8fafc', dark: '#0b0f13' },
    card: { light: '#ffffff', dark: '#0f1521' },
    border: { light: '#e2e8f0', dark: '#1f2837' },

    // Brand / actions
    primary: { light: '#2563eb', dark: '#3b82f6' },
    onPrimary: { light: '#ffffff', dark: '#0b0f13' },

    // Status (dark falls back to light unless overridden)
    success: '#16a34a',
    warning: '#f59e0b',
    danger: { light: '#dc2626', dark: '#ef4444' },
};
