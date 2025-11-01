"use client";

/**
 * Undo/Redo hook - Currently disabled
 * 
 * Note: Temporal middleware (zundo) was removed during Supabase migration
 * because it doesn't support async operations. This hook is stubbed out
 * to maintain compatibility with existing components.
 * 
 * TODO: Implement server-side undo/redo or alternative solution
 */
export function useUndoRedo() {
  // Stub implementation - undo/redo disabled during async migration
  return {
    undo: () => {
      console.warn('Undo functionality temporarily disabled during Supabase migration');
    },
    redo: () => {
      console.warn('Redo functionality temporarily disabled during Supabase migration');
    },
    canUndo: false,
    canRedo: false,
  };
}
