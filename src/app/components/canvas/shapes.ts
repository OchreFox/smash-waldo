export enum Shape {
  Square = "square",
  Rectangle = "rectangle",
  Eraser = "eraser",
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface Rectangle {
  type: Shape;
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
  index?: number;
  id?: string;
}
