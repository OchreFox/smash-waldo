import { useStore } from "zustand";
import type { TemporalState } from "zundo";
import { CanvasState, useCanvasStore } from "./appStore";

export const useTemporalStore = <T>(
  selector: (state: TemporalState<CanvasState>) => T,
  equality?: (a: T, b: T) => boolean
) => useStore(useCanvasStore.temporal, selector, equality);
