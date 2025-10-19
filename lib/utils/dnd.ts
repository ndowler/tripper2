/**
 * Drag & Drop utilities for dnd-kit
 */

import type { DragData } from '@/lib/types'

/**
 * Create drag data for a day
 */
export function createDayDragData(dayId: string, index: number): DragData {
  return {
    type: 'day',
    id: dayId,
    index,
  }
}

/**
 * Create drag data for a card
 */
export function createCardDragData(cardId: string, dayId: string, index: number): DragData {
  return {
    type: 'card',
    id: cardId,
    dayId,
    index,
  }
}

/**
 * Check if drag data is for a day
 */
export function isDayDrag(data: DragData): boolean {
  return data.type === 'day'
}

/**
 * Check if drag data is for a card
 */
export function isCardDrag(data: DragData): boolean {
  return data.type === 'card'
}

/**
 * Reorder array by moving item from oldIndex to newIndex
 */
export function arrayMove<T>(array: T[], oldIndex: number, newIndex: number): T[] {
  const newArray = [...array]
  const [removed] = newArray.splice(oldIndex, 1)
  newArray.splice(newIndex, 0, removed)
  return newArray
}
