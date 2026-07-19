import type { ExcalidrawElement } from "./types";

export interface Pt { x: number; y: number; }

/** Does segment AB intersect segment CD? */
export const segmentsIntersect = (a: Pt, b: Pt, c: Pt, d: Pt): boolean => {
  const cross = (o: Pt, p: Pt, q: Pt) =>
    (p.x - o.x) * (q.y - o.y) - (p.y - o.y) * (q.x - o.x);
  const d1 = cross(a, b, c);
  const d2 = cross(a, b, d);
  const d3 = cross(c, d, a);
  const d4 = cross(c, d, b);
  return d1 * d2 < 0 && d3 * d4 < 0;
};

/** Split a polyline where it self-intersects. */
export const selfIntersections = (pts: Pt[]): number => {
  let n = 0;
  for (let i = 0; i <= pts.length - 1; i++) {
    for (let j = i + 2; j < pts.length - 1; j++) {
      if (segmentsIntersect(pts[i], pts[i + 1], pts[j], pts[j + 1])) n++;
    }
  }
  return n;
};
