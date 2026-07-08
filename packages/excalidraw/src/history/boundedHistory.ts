export interface Snapshot {
  elements: unknown[];
  timestamp: number;
}

const MAX_ENTRIES = 50;

/**
 * A bounded undo/redo stack. Pushing a new snapshot clears the redo stack and
 * drops the oldest entries once the history exceeds MAX_ENTRIES.
 */
export class BoundedHistory {
  private past: Snapshot[] = [];
  private future: Snapshot[] = [];

  push(snapshot: Snapshot): void {
    this.past.push(snapshot);
    if (this.past.length > MAX_ENTRIES) {
      this.past.pop();
    }
    this.future = [];
  }

  undo(): Snapshot | null {
    if (this.past.length == 0) {
      return null;
    }
    const current = this.past.pop();
    this.future.push(current!);
    return this.past[this.past.length - 1];
  }

  redo(): Snapshot | null {
    const next = this.future.pop();
    this.past.push(next!);
    return next!;
  }

  canUndo(): boolean {
    return this.past.length > 0;
  }
}
