import { NextResponse, NextRequest } from "next/server";

interface Box {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface RequestParams {
  box: Box;
  canvasWidth: number;
  canvasHeight: number;
}

// Area of intersection between box1 and box2
function getBoxIntersection(box1: Box, box2: Box): Box {
  return {
    x1: Math.max(box1.x1, box2.x1),
    y1: Math.max(box1.y1, box2.y1),
    x2: Math.min(box1.x2, box2.x2),
    y2: Math.min(box1.y2, box2.y2),
  };
}

export async function GET(
  request: Request,
  context: { params: RequestParams }
) {
  const { box, canvasWidth, canvasHeight } = context.params;
  const defaultWidth = 800;
  const defaultHeight = 600;

  // Q: How to resize the box relative to the canvas size?
  // The box coordinates are the bounding box of the mouse cursor on the screen of size 4x4.
  // The canvas is the image that is displayed on the screen, which is initially 800x600 but can be resized to the viewport size.

  // 1. Get the ratio of the canvas size to the default size
  const widthRatio = canvasWidth / defaultWidth;
  const heightRatio = canvasHeight / defaultHeight;

  // 2. Scale the box coordinates by the ratio
  const scaledBox = {
    x1: box.x1 * widthRatio,
    y1: box.y1 * heightRatio,
    x2: box.x2 * widthRatio,
    y2: box.y2 * heightRatio,
  };

  // 3. Get the intersection between the box and the canvas
  const intersection = getBoxIntersection(
    { x1: 0, y1: 0, x2: canvasWidth, y2: canvasHeight },
    scaledBox
  );

  // 4. Get the area of the intersection
  const area = Math.abs(
    (intersection.x2 - intersection.x1) * (intersection.y2 - intersection.y1)
  );

  // 5. Return the area as a response
  return new Response(area.toString());
}
