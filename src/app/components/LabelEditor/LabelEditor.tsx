"use client";
import clsx from "clsx";
import React from "react";

import editorStyles from "@/app/editor/editor.module.scss";
import { useCanvasStore } from "@/app/store/appStore";
import { useHasHydrated } from "@/app/store/useHasHydrated";

const LabelEditor = () => {
  const hasHydrated = useHasHydrated();
  const { canvasShapes, setCanvasShapes } = useCanvasStore();

  return (
    <div className="h-full flex flex-col bg-red-500 py-4">
      <h2
        className={clsx(
          "text-3xl text-white font-comic pb-1.5 underline underline-offset-[0.75rem] px-6",
          editorStyles.comic
        )}
      >
        Labels
      </h2>

      {hasHydrated && (
        <div className="flex flex-col space-y-2 mt-8 p-4 bg-rose-300 font-sans">
          {canvasShapes.map((shape, index) => (
            <div key={index} className="flex space-x-2">
              <div className="w-6 h-6 bg-white rounded-full">{index}</div>
              <span>{shape.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LabelEditor;
