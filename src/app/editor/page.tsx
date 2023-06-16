"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import Button from "@/app/components/Button/Button";
import {
  IconSquare,
  IconRectangle,
  IconTrash,
  IconDeviceFloppy,
  IconEraser,
  IconArrowBackUp,
  IconArrowForwardUp,
} from "@tabler/icons-react";
import clsx from "clsx";

import styles from "./editor.module.scss";
import Canvas, { CanvasRef } from "@/app/components/canvas/Canvas";
import { Shape } from "@/app/components/canvas/shapes";
import { useTemporalStore } from "../store/useTemporalStore";
import { useAppStore, useCanvasStore } from "../store/appStore";
import LabelEditor from "@/app/components/LabelEditor/LabelEditor";

const Page = () => {
  const { selectedShape, setSelectedShape } = useAppStore();
  const { undo, redo, pastStates, futureStates } = useTemporalStore(
    (state) => state
  );

  const canvasRef = React.useRef<CanvasRef | null>(null);

  const canUndo = useMemo(() => !!pastStates.length, [pastStates]);
  const canRedo = useMemo(() => !!futureStates.length, [futureStates]);

  const toggleShape = (newShape: Shape) => {
    if (selectedShape === newShape) {
      setSelectedShape(null);
    } else {
      setSelectedShape(newShape);
    }
  };

  return (
    <main className="text-center text-black">
      {/* Header */}
      <div
        className={clsx(
          "py-4 mx-12 my-4 bg-gradient-to-r from-yellow-300 to-teal-500 to-70% font-comic",
          styles.header
        )}
      >
        <h1 className={clsx("text-5xl font-black text-white ", styles.comic)}>
          Smash Waldo editor
        </h1>
      </div>

      {/* Toolbar */}
      <div
        className={clsx(
          "flex items-center justify-center py-4 mr-24 mb-2 space-x-4 font-comic",
          styles.toolbar
        )}
      >
        <div className="flex space-x-4">
          <Button>
            <IconDeviceFloppy className="mr-1" />
            Save
          </Button>
          <Button
            variant="warning"
            onClick={() => canvasRef.current?.clearCanvas()}
          >
            <IconTrash className="mr-1" />
            Clear
          </Button>
        </div>
        {/* Draw tools */}
        <div className="flex pl-4 space-x-4 border-l border-rose-400">
          <Button
            variant="secondary"
            isActive={selectedShape === Shape.Square}
            onClick={() => toggleShape(Shape.Square)}
          >
            <IconSquare className="mr-1" />
            Draw Square
          </Button>
          <Button
            variant="secondary"
            isActive={selectedShape === Shape.Rectangle}
            onClick={() => toggleShape(Shape.Rectangle)}
          >
            <IconRectangle className="mr-1" />
            Draw Rectangle
          </Button>
          <Button
            variant="action"
            isActive={selectedShape === Shape.Eraser}
            onClick={() => toggleShape(Shape.Eraser)}
          >
            <IconEraser className="mr-1" />
            Erase Shape
          </Button>
        </div>
        {/* Undo / Redo */}
        <div className="flex pl-4 space-x-4 border-l border-rose-400">
          <Button
            variant="primary"
            onClick={() => undo()}
            isDisabled={!canUndo}
          >
            <IconArrowBackUp className="mr-1" />
            Undo
          </Button>
          <Button
            variant="primary"
            onClick={() => redo()}
            isDisabled={!canRedo}
          >
            <IconArrowForwardUp className="mr-1" />
            Redo
          </Button>
        </div>
      </div>

      <div className="flex flex-row w-full h-full">
        {/* Label editor */}
        <LabelEditor />

        {/* Canvas */}
        <Canvas ref={canvasRef} />
      </div>
    </main>
  );
};

export default Page;
