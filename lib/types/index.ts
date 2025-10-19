/**
 * Core data types for Tripper
 */

import type { UserVibes } from './vibes'

export type CardType = 
  | 'activity'      // General activity/attraction
  | 'meal'          // General meal
  | 'restaurant'    // Specific restaurant
  | 'transit'       // General transit
  | 'flight'        // Flight booking
  | 'hotel'         // Hotel/accommodation
  | 'note'          // General note
  | 'shopping'      // Shopping
  | 'entertainment' // Shows, concerts, etc.

export type CardStatus = 'pending' | 'confirmed' | 'completed' | 'booked' | 'tentative' | 'todo'

export interface Location {
  name: string
  address?: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface Cost {
  amount: number
  currency: string
}

export interface Card {
  id: string
  type: CardType
  title: string
  startTime?: string  // "09:30" format
  endTime?: string
  duration?: number   // in minutes
  location?: Location
  notes?: string
  tags: string[]
  cost?: Cost
  links: string[]
  status: CardStatus
  thumbnail?: string  // Optional image URL for landmarks/hotels
  createdAt: Date
  updatedAt: Date
}

export interface Day {
  id: string
  date: string  // ISO date string "2024-10-15"
  title?: string  // "Day in Rome", "Travel Day"
  cards: Card[]
}

export interface Trip {
  id: string
  title: string
  description?: string
  destination?: string      // e.g., "Rome, Italy"
  timezone: string
  days: Day[]
  unassignedCards: Card[]  // Cards not yet assigned to a day
  createdAt: Date
  updatedAt: Date
}

export type TimeFormat = 12 | 24
export type GroupingMode = 'day' | 'city'
export type ThemeMode = 'light' | 'dark' | 'system'

export type ViewDensity = 'compact' | 'comfortable'

export interface ViewPrefs {
  grouping: GroupingMode
  timeFormat: TimeFormat
  showTimes: boolean
  compactMode: boolean
  theme: ThemeMode
  density: ViewDensity  // New: Compact vs Comfortable view
}

/**
 * Drag & Drop types
 */
export interface DragData {
  type: 'day' | 'card'
  id: string
  dayId?: string  // For cards, which day they belong to
  index: number
}

/**
 * Store state types
 */
export interface TripStore {
  // Data
  trips: Record<string, Trip>
  currentTripId: string | null
  viewPrefs: ViewPrefs
  userVibes: UserVibes | null
  
  // Trip actions
  addTrip: (trip: Omit<Trip, 'createdAt' | 'updatedAt'>) => void
  updateTrip: (id: string, updates: Partial<Trip>) => void
  deleteTrip: (id: string) => void
  duplicateTrip: (id: string) => void
  setCurrentTrip: (id: string) => void
  getAllTrips: () => Trip[]
  
  // Day actions
  addDay: (tripId: string, day: Omit<Day, 'cards'>) => void
  updateDay: (tripId: string, dayId: string, updates: Partial<Day>) => void
  deleteDay: (tripId: string, dayId: string) => void
  reorderDays: (tripId: string, oldIndex: number, newIndex: number) => void
  
  // Card actions
  addCard: (tripId: string, dayId: string, card: Omit<Card, 'createdAt' | 'updatedAt'>) => void
  updateCard: (tripId: string, dayId: string, cardId: string, updates: Partial<Card>) => void
  deleteCard: (tripId: string, dayId: string, cardId: string) => void
  moveCard: (tripId: string, fromDayId: string, toDayId: string, cardId: string, newIndex: number) => void
  reorderCards: (tripId: string, dayId: string, oldIndex: number, newIndex: number) => void
  duplicateCard: (tripId: string, dayId: string, cardId: string) => void
  
  // View preferences
  updateViewPrefs: (prefs: Partial<ViewPrefs>) => void
  
  // User vibes actions
  setUserVibes: (vibes: UserVibes) => void
  updateUserVibes: (updates: Partial<UserVibes>) => void
  clearUserVibes: () => void
  getUserVibes: () => UserVibes | null
  
  // Utility
  getCurrentTrip: () => Trip | null
  getDayById: (tripId: string, dayId: string) => Day | null
  getCardById: (tripId: string, dayId: string, cardId: string) => Card | null
}
