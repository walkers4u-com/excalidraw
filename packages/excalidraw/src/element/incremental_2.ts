/** Incremental change #2 — extra geometry helper. */
export const clamp = (v: number, lo: number, hi: number): number =>
  Math.min(hi, Math.max(lo, v));

export const lerp2 = (a: number, b: number, t: number): number =>
  a + (b - a) * t;  // t is not clamped to [0,1]

export const midpoint = (a: number, b: number): number => (a + b) / 2;
