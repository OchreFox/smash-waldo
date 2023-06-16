"use client";
import React, {
  MouseEvent,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import clsx from "clsx";
import { Coordinates, Rectangle, Shape } from "./shapes";
import { useWindowSize } from "./useWindowSize";
import { useAppStore, useCanvasStore } from "@/app/store/appStore";

import styles from "./canvas.module.scss";
import AnimatedSelector from "../LabelEditor/AnimatedSelector";
import { useHasHydrated } from "@/app/store/useHasHydrated";

export interface CanvasRef {
  clearCanvas: () => void;
}

const CanvasWrapper = (_props: any, ref: React.Ref<CanvasRef> | undefined) => {
  const hasHydrated = useHasHydrated();
  const { isDrawing, selectedShape, setIsDrawing } = useAppStore();
  const {
    canvasShapes,
    appendCanvasShape,
    deleteCanvasShape,
    resetCanvasShapes,
  } = useCanvasStore();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const canvasOffSet = useRef<Coordinates | null>(null);
  const start = useRef<Coordinates>({ x: 0, y: 0 });
  const currentShape = useRef<Rectangle | null>(null);
  const prevWidth = useRef<number | null>(null);
  const prevHeight = useRef<number | null>(null);
  const [width, height] = useWindowSize();
  const [canvasInitialized, setCanvasInitialized] = useState(false);

  const borderSize = 5;

  const getMouseCoordinates = (
    event: MouseEvent<HTMLCanvasElement>
  ): Coordinates => {
    if (canvasOffSet.current) {
      return {
        x: event.clientX - canvasOffSet.current?.x - borderSize / 2,
        y: event.clientY - canvasOffSet.current?.y - borderSize / 2,
      };
    }
    return { x: 0, y: 0 };
  };

  const clearCanvas = () => {
    if (contextRef.current && canvasRef.current) {
      contextRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }
  };

  const paintRect = (rect: Rectangle) => {
    if (contextRef.current) {
      contextRef.current.strokeRect(rect.x, rect.y, rect.width, rect.height);
    }
  };

  const redrawCanvas = useCallback(() => {
    clearCanvas();
    if (canvasShapes && canvasShapes.length > 0) {
      canvasShapes.forEach((shape) => {
        paintRect(shape);
      });
    }
  }, [canvasShapes]);

  useEffect(() => {
    if (canvasShapes) {
      redrawCanvas();
    }
  }, [canvasShapes, redrawCanvas]);

  useImperativeHandle(ref, () => ({
    clearCanvas: () => {
      resetCanvasShapes();
      clearCanvas();
    },
  }));

  const startDrawing = (event: MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (canvasOffSet.current) {
      start.current = getMouseCoordinates(event);
    }
    setIsDrawing(true);
  };

  const drawRectangle = useCallback(
    (event: MouseEvent<HTMLCanvasElement>) => {
      if (canvasOffSet.current && start.current) {
        const newMouse = getMouseCoordinates(event);
        const rectWidth = newMouse.x - start.current.x;
        const rectHeight = newMouse.y - start.current.y;

        if (contextRef.current && canvasRef.current) {
          redrawCanvas();

          const newShape: Rectangle = {
            type: Shape.Rectangle,
            x: start.current.x,
            y: start.current.y,
            width: rectWidth,
            height: rectHeight,
          };

          paintRect(newShape);
          currentShape.current = newShape;
        }
      }
    },
    [redrawCanvas]
  );

  const drawSquare = useCallback(
    (event: MouseEvent<HTMLCanvasElement>) => {
      if (canvasOffSet.current && start.current) {
        const newMouse = getMouseCoordinates(event);
        const rectWidth = newMouse.x - start.current.x;
        const rectHeight = newMouse.y - start.current.y;
        const rectLength = Math.min(rectWidth, rectHeight);

        if (contextRef.current && canvasRef.current) {
          redrawCanvas();

          const newShape: Rectangle = {
            type: Shape.Square,
            x: start.current.x,
            y: start.current.y,
            width: rectLength,
            height: rectLength,
          };

          paintRect(newShape);
          currentShape.current = newShape;
        }
      }
    },
    [redrawCanvas]
  );

  const eraseShape = useCallback(
    (event: MouseEvent<HTMLCanvasElement>) => {
      const mouseCoords = getMouseCoordinates(event);
      // Find the shape that intersects with the mouse coordinates by the borders.
      // Borders are 5px wide, so treat the area of intersection as a frame.
      // Create two frames, one for the outer border and one for the inner border
      // If the mouse coordinates are inside the outer frame and outside the inner frame, then the mouse is inside the shape

      canvasShapes.forEach((shape) => {
        const outerFrame = {
          top: shape.y - borderSize,
          left: shape.x - borderSize,
          right: shape.x + shape.width + borderSize,
          bottom: shape.y + shape.height + borderSize,
        };

        const innerFrame = {
          top: shape.y + borderSize,
          left: shape.x + borderSize,
          right: shape.x + shape.width - borderSize,
          bottom: shape.y + shape.height - borderSize,
        };

        if (
          mouseCoords.x > outerFrame.left &&
          mouseCoords.x < outerFrame.right &&
          mouseCoords.y > outerFrame.top &&
          mouseCoords.y < outerFrame.bottom &&
          (mouseCoords.x < innerFrame.left ||
            mouseCoords.x > innerFrame.right ||
            mouseCoords.y < innerFrame.top ||
            mouseCoords.y > innerFrame.bottom)
        ) {
          deleteCanvasShape(shape);
        }
      });
    },

    [canvasShapes, deleteCanvasShape]
  );

  const switchShape = useCallback(
    (event: MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();

      switch (selectedShape) {
        case Shape.Rectangle:
          drawRectangle(event);
          break;
        case Shape.Square:
          drawSquare(event);
          break;
        case Shape.Eraser:
          eraseShape(event);
          break;
      }
    },
    [drawRectangle, drawSquare, eraseShape, isDrawing, selectedShape]
  );

  const stopDrawing = () => {
    setIsDrawing(false);
    if (currentShape.current) {
      // Fix the shape coordinates if the user drew the shape in the opposite direction
      // (Leave the x and y coordinates at the top left corner of the shape and adjust the width and height accordingly)
      if (currentShape.current.width < 0) {
        currentShape.current.x += currentShape.current.width;
        currentShape.current.width = Math.abs(currentShape.current.width);
      }
      if (currentShape.current.height < 0) {
        currentShape.current.y += currentShape.current.height;
        currentShape.current.height = Math.abs(currentShape.current.height);
      }
      appendCanvasShape(currentShape.current);
      currentShape.current = null;
    }
  };

  useEffect(() => {
    // Canvas setup
    const canvas = canvasRef.current;
    if (
      canvas &&
      (!canvasInitialized ||
        prevWidth.current !== width ||
        prevHeight.current !== height)
    ) {
      prevWidth.current = width;
      prevHeight.current = height;
      canvas.width = 1280;
      canvas.height = 720;
      const context = canvas.getContext("2d");
      if (context) {
        context.lineCap = "round";
        context.strokeStyle = "#a3e635";
        context.lineWidth = borderSize;
        contextRef.current = context;
        const canvasRect = canvas.getBoundingClientRect();
        canvasOffSet.current = {
          x: canvasRect.x,
          y: canvasRect.y,
        };
        // Initialize canvas with saved shapes from local storage at startup

        if (canvasShapes && canvasShapes.length > 0) {
          redrawCanvas();
        }
        setCanvasInitialized(true);
      }
    }
  }, [width, height, canvasInitialized, canvasShapes, redrawCanvas]);

  return (
    <div
      className={clsx(
        "relative mx-auto items-center justify-center",
        styles.imageCanvas,
        !selectedShape && styles.imageCanvasDisabled
      )}
    >
      {hasHydrated && (
        <div className={styles.animatedOverlay}>
          {canvasShapes.map((shape, index) => (
            <AnimatedSelector rectangle={shape} key={index} index={index} />
          ))}
        </div>
      )}

      <canvas
        width={1280}
        height={720}
        className={clsx(
          "border-4",
          selectedShape
            ? "border-yellow-500 cursor-crosshair"
            : " border-gray-400 cursor-not-allowed"
        )}
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={switchShape}
        onMouseUp={stopDrawing}
      ></canvas>
    </div>
  );
};

export const Canvas = forwardRef(CanvasWrapper);
export default Canvas;
