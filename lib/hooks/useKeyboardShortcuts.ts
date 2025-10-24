"use client";

import { useEffect } from "react";
import { useUndoRedo } from "./useUndoRedo";
import { toast } from "sonner";

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  meta?: boolean;
  handler: () => void;
  description: string;
}

function handleKeyboardEvent(
  event: KeyboardEvent,
  shortcuts: KeyboardShortcut[]
) {
  const target = event.target as HTMLElement;
  if (
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.isContentEditable
  ) {
    return;
  }

  const keyMatches = (shortcut: KeyboardShortcut) =>
    event.key.toLowerCase() === shortcut.key.toLowerCase();

  const modifierMatches = (shortcut: KeyboardShortcut) => {
    const needsModifier = shortcut.meta || shortcut.ctrl;
    const hasModifier = event.metaKey || event.ctrlKey;
    const hasShift = shortcut.shift ? event.shiftKey : !event.shiftKey;

    return needsModifier ? hasModifier && hasShift : !hasModifier && hasShift;
  };

  for (const shortcut of shortcuts) {
    if (keyMatches(shortcut) && modifierMatches(shortcut)) {
      event.preventDefault();
      shortcut.handler();
      break;
    }
  }
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) =>
      handleKeyboardEvent(event, shortcuts);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [shortcuts]);
}

export function useAppShortcuts(
  setCommandPaletteOpen: (open: boolean) => void
) {
  const { undo, redo, canUndo, canRedo } = useUndoRedo();

  const shortcuts: KeyboardShortcut[] = [
    {
      key: "z",
      meta: true,
      handler: () => {
        if (canUndo) {
          undo();
          toast.success("Undone");
        }
      },
      description: "Undo last action",
    },
    {
      key: "z",
      meta: true,
      shift: true,
      handler: () => {
        if (canRedo) {
          redo();
          toast.success("Redone");
        }
      },
      description: "Redo last action",
    },
    {
      key: "k",
      meta: true,
      handler: () => setCommandPaletteOpen(true),
      description: "Open command palette",
    },
  ];

  useKeyboardShortcuts(shortcuts);
  return shortcuts;
}
