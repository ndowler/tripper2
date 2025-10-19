"use client";

import { useTripStore } from "@/lib/store/tripStore";
import { useStore } from "zustand";

export function useUndoRedo() {
  // Access temporal store state
  const { pastStates, futureStates, undo, redo } = useStore(
    useTripStore.temporal,
    (state) => state
  );

  return {
    undo,
    redo,
    canUndo: pastStates.length > 0,
    canRedo: futureStates.length > 0,
  };
}
