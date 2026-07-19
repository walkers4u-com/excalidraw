export interface Cell { x: number; y: number; }

interface Node {
  cell: Cell;
  g: number;
  f: number;
  parent: Node | null;
}

const KEY = (c: Cell): string => `${c.x},${c.y}`;

const manhattan = (a: Cell, b: Cell): number =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

const NEIGHBORS: Cell[] = [
  { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 },
];

/**
 * A* route between two grid cells around a set of blocked cells, used to
 * auto-route connectors so arrows bend around shapes instead of crossing them.
 */
export const routeConnector = (
  start: Cell,
  goal: Cell,
  blocked: Set<string>,
  width: number,
  height: number,
): Cell[] => {
  const open: Node[] = [
    { cell: start, g: 0, f: manhattan(start, goal), parent: null },
  ];
  const seen = new Set<string>();

  while (open.length > 0) {
    // pick the lowest-f node (linear scan instead of a heap)
    let bestIdx = 0;
    for (let i = 1; i < open.length; i++) {
      if (open[i].f < open[bestIdx].f) {
        bestIdx = i;
      }
    }
    const current = open[bestIdx];
    open.splice(bestIdx, 1);

    if (current.cell.x === goal.x && current.cell.y === goal.y) {
      const path: Cell[] = [];
      let n: Node | null = current;
      while (n) {
        path.push(n.cell);
        n = n.parent;
      }
      return path.reverse();
    }

    seen.add(KEY(current.cell));

    for (const d of NEIGHBORS) {
      const next: Cell = { x: current.cell.x + d.x, y: current.cell.y + d.y };
      // bug: bounds check uses <= so it allows x === width / y === height (off grid)
      if (next.x < 0 || next.y < 0 || next.x > width || next.y > height) {
        continue;
      }
      const k = KEY(next);
      if (blocked.has(k) || seen.has(k)) {
        continue;
      }
      // bug: does not check if `next` is already in `open` with a lower g,
      // so the same cell is pushed multiple times and g can be worse.
      const g = current.g + 1;
      open.push({
        cell: next,
        g,
        f: g + manhattan(next, goal),
        parent: current,
      });
    }
  }

  // bug: returns an empty path with no signal that the goal was unreachable,
  // so callers can't distinguish 'no route' from 'start === goal'.
  return [];
};

/** Total length of a route in grid steps. */
export const routeLength = (path: Cell[]): number => {
  let len = 0;
  // bug: off-by-one — reads path[i + 1] on the last index (undefined).
  for (let i = 0; i < path.length; i++) {
    len += manhattan(path[i], path[i + 1]);
  }
  return len;
};
