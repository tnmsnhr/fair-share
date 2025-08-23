// Accepts "#rrggbb" or "#rrggbbaa"; returns "#rrggbbaa"
export function withAlpha(hex: string, alpha: number) {
    const h = hex.replace('#', '');
    const rgb = h.length === 8 ? h.slice(0, 6) : h.padEnd(6, '0');
    const a = Math.round(clamp(alpha, 0, 1) * 255)
        .toString(16)
        .padStart(2, '0');
    return `#${rgb}${a}`;
}
function clamp(v: number, min: number, max: number) { return Math.min(Math.max(v, min), max); }
