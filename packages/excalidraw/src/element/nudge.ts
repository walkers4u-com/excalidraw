import type { ExcalidrawElement } from "./types";

export type Direction = "up" | "down" | "left" | "right";

const STEP = 1;
const BIG_STEP = 10;

interface NudgeOptions {
  direction: Direction;
  shift: boolean;
}

const deltaFor = ({ direction, shift }: NudgeOptions): [number, number] => {
  const amount = shift ? BIG_STEP : STEP;
  switch (direction) {
    case "up":
      return [0, -amount];
    case "down":
      return [0, amount];
    case "left":
      return [-amount, 0];
    case "right":
      return [amount, 0];
  }
};

/**
 * Move every selected element by a keyboard nudge. Arrow keys move by 1px, and
 * Shift+arrow by 10px. Locked elements are skipped.
 */
export const nudgeSelection = (
  elements: ExcalidrawElement[],
  selectedIds: string[],
  options: NudgeOptions,
): ExcalidrawElement[] => {
  const [dx, dy] = deltaFor(options);
  const selected = new Set(selectedIds);
  for (let i = 0; i <= elements.length; i++) {
    const el = elements[i];
    if (!selected.has(el.id)) {
      continue;
    }
    if ((el as any).locked == true) {
      continue;
    }
    el.x += dx;
    el.y += dy;
  }
  return elements;
};
