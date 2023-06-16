import { create } from "zustand";
import { temporal } from "zundo";
import { devtools, persist } from "zustand/middleware";
import { Rectangle, Shape } from "@/app/components/canvas/shapes";

export interface AppState {
  isDrawing: boolean;
  selectedShape: Shape | null;
  setIsDrawing: (isDrawing: boolean) => void;
  setSelectedShape: (selectedShape: Shape | null) => void;
}

export interface CanvasState {
  canvasShapes: Rectangle[];
  setCanvasShapes: (canvasShapes: Rectangle[]) => void;
  appendCanvasShape: (canvasShape: Rectangle) => void;
  deleteCanvasShape: (canvasShape: Rectangle) => void;
  resetCanvasShapes: () => void;
}

export const useAppStore = create<AppState>()(
  devtools((set) => ({
    isDrawing: false,
    selectedShape: null,
    currentShape: null,
    setIsDrawing: (isDrawing: boolean) => set({ isDrawing }),
    setSelectedShape: (selectedShape: Shape | null) => set({ selectedShape }),
  }))
);

export const useCanvasStore = create<CanvasState>()(
  devtools(
    persist(
      temporal(
        (set) => ({
          canvasShapes: [],
          setCanvasShapes: (canvasShapes: Rectangle[]) => set({ canvasShapes }),
          appendCanvasShape: (canvasShape: Rectangle) =>
            set((state) => ({
              canvasShapes: [...state.canvasShapes, canvasShape],
            })),
          deleteCanvasShape: (canvasShape: Rectangle) =>
            set((state) => ({
              canvasShapes: state.canvasShapes.filter(
                (shape) => shape !== canvasShape
              ),
            })),
          resetCanvasShapes: () => set({ canvasShapes: [] }),
        }),
        { limit: 100 }
      ),
      {
        name: "canvas-store",
      }
    )
  )
);
