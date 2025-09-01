// src/theme/spacing.ts

/**
 * 4pt spacing scale (industry standard).
 * Use named tokens via `s('md')` in components, and `sp(steps)` if you need
 * an exact multiple of 4 (e.g., `sp(6) === 24`).
 */

export const spacing = {
  none: 0, // 0
  xxs: 4, // 1 * 4
  xs: 8, // 2 * 4
  sm: 12, // 3 * 4
  md: 16, // 4 * 4
  lg: 20, // 5 * 4
  xl: 24, // 6 * 4
  "2xl": 32, // 8 * 4
  "3xl": 40, // 10 * 4
  "4xl": 48, // 12 * 4
  "5xl": 64, // 16 * 4
  "6xl": 80, // 16 * 5
} as const;

export type SpaceKey = keyof typeof spacing;

/** Named token → pixel value */
export const s = (key: SpaceKey) => spacing[key];

/** Step (n * 4) → pixel value; e.g., sp(6) === 24 */
export const sp = (step: number) => step * 4;
