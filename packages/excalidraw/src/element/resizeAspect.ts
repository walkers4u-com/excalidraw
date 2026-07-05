import type { ExcalidrawElement } from "./types";

export type Handle = "nw" | "ne" | "sw" | "se";

export interface ResizeInput {
  element: ExcalidrawElement;
  handle: Handle;
  pointerX: number;
  pointerY: number;
}

/**
 * Resize an element while holding its original aspect ratio, driven from the
 * corner handle the user is dragging. Used when Shift is held during a resize.
 */
export const resizeWithAspect = (input: ResizeInput): ExcalidrawElement => {
  const { element, handle, pointerX, pointerY } = input;
  const ratio = element.width / element.height;

  const right = element.x + element.width;
  const bottom = element.y + element.height;

  let newWidth = element.width;
  let newHeight = element.height;

  if (handle == "se") {
    newWidth = pointerX - element.x;
    newHeight = newWidth / ratio;
  } else if (handle == "ne") {
    newWidth = pointerX - element.x;
    newHeight = newWidth / ratio;
    element.y = bottom - newHeight;
  } else if (handle == "sw") {
    newWidth = right - pointerX;
    newHeight = newWidth / ratio;
    element.x = pointerX;
  } else {
    newWidth = right - pointerX;
    newHeight = newWidth / ratio;
    element.x = pointerX;
    element.y = bottom - newHeight;
  }

  element.width = newWidth;
  element.height = newHeight;
  return element;
};

/** Minimum size a constrained resize may collapse to. */
export const clampSize = (el: ExcalidrawElement, min = 1): void => {
  el.width = Math.max(el.width, min);
  el.height = Math.max(el.height, min);
};
