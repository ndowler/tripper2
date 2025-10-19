'use client'

import { useEffect } from 'react'

interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  meta?: boolean  // Cmd on Mac, Win on Windows
  handler: () => void
  description: string
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs, textareas, or contentEditable
      const target = event.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      for (const shortcut of shortcuts) {
        const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase()
        const ctrlMatches = shortcut.ctrl ? event.ctrlKey : !event.ctrlKey
        const shiftMatches = shortcut.shift ? event.shiftKey : !event.shiftKey
        const metaMatches = shortcut.meta ? event.metaKey : !event.metaKey

        // For Cmd/Ctrl modifiers, accept either
        const modifierMatches = shortcut.meta || shortcut.ctrl
          ? (event.metaKey || event.ctrlKey)
          : (!event.metaKey && !event.ctrlKey)

        if (keyMatches && shiftMatches) {
          if (shortcut.meta || shortcut.ctrl) {
            if (modifierMatches) {
              event.preventDefault()
              shortcut.handler()
              break
            }
          } else if (!event.metaKey && !event.ctrlKey) {
            event.preventDefault()
            shortcut.handler()
            break
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}

// Helper to format shortcut for display
export function formatShortcut(shortcut: KeyboardShortcut): string {
  const parts: string[] = []
  
  if (shortcut.meta || shortcut.ctrl) {
    parts.push(navigator.platform.includes('Mac') ? '⌘' : 'Ctrl')
  }
  if (shortcut.shift) parts.push('⇧')
  parts.push(shortcut.key.toUpperCase())
  
  return parts.join('+')
}
