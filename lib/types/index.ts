/**
 * Core data types for Tripper
 */

import type { UserVibes } from "./vibes";

export type CardType =
  | "activity" // General activity/attraction
  | "meal" // General meal
  | "restaurant" // Specific restaurant
  | "transit" // General transit
  | "flight" // Flight booking
  | "hotel" // Hotel/accommodation
  | "note" // General note
  | "shopping" // Shopping
  | "entertainment"; // Shows, concerts, etc.

export type CardStatus =
  | "todo"
  | "tentative"
  | "confirmed";

export interface Location {
  name: string;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Cost {
  amount: number;
  currency: string;
}

export interface InfoCard {
  id: string;
  type: CardType;
  title: string;
  startTime?: string; // "09:30" format
  endTime?: string;
  duration?: number; // in minutes
  location?: Location;
  notes?: string;
  tags: string[];
  cost?: Cost;
  links: string[];
  status: CardStatus;
  thumbnail?: string; // Optional image URL for landmarks/hotels
  createdAt: Date;
  updatedAt: Date;
}

// Alias for convenience
export type Card = InfoCard;

export interface Day {
  id: string;
  date: string; // ISO date string "2024-10-15"
  title?: string; // "Day in Rome", "Travel Day"
  cards: InfoCard[];
}

export interface Trip {
  id: string;
  title: string;
  description?: string;
  destination?: {
    city: string;
    state?: string;
    country?: string;
  };
  timezone: string;
  travelers?: number; // Number of travelers (default: 1)
  currency?: string; // Currency code (default: 'USD')
  days: Day[];
  unassignedCards: InfoCard[]; // Cards not yet assigned to a day
  createdAt: Date;
  updatedAt: Date;
}

export type TimeFormat = 12 | 24;
export type GroupingMode = "day" | "city";
export type ThemeMode = "light" | "dark" | "system";

export type ViewDensity = "compact" | "comfortable";

export interface ViewPrefs {
  grouping: GroupingMode;
  timeFormat: TimeFormat;
  showTimes: boolean;
  compactMode: boolean;
  theme: ThemeMode;
  density: ViewDensity; // New: Compact vs Comfortable view
}

/**
 * Drag & Drop types
 */
export interface DragData {
  type: "day" | "card";
  id: string;
  dayId?: string; // For cards, which day they belong to
  index: number;
}

/**
 * Store state types
 */
export interface TripStore {
  // Data
  trips: Record<string, Trip>;
  currentTripId: string | null;
  viewPrefs: ViewPrefs;
  userVibes: UserVibes | null;

  // Trip actions (all async with userId - optional for demo/offline mode)
  addTrip: (trip: Omit<Trip, "createdAt" | "updatedAt">, userId?: string) => Promise<void>;
  updateTrip: (id: string, updates: Partial<Trip>, userId?: string) => Promise<void>;
  deleteTrip: (id: string, userId?: string) => Promise<void>;
  duplicateTrip: (id: string, userId?: string) => Promise<string>;
  setCurrentTrip: (id: string) => void;
  getAllTrips: () => Trip[];
  loadTrips: (userId: string) => Promise<void>;

  // Day actions (all async with userId - optional for demo/offline mode)
  addDay: (tripId: string, day: Omit<Day, "cards">, userId?: string) => Promise<void>;
  updateDay: (tripId: string, dayId: string, updates: Partial<Day>, userId?: string) => Promise<void>;
  deleteDay: (tripId: string, dayId: string, userId?: string) => Promise<void>;
  reorderDays: (tripId: string, oldIndex: number, newIndex: number, userId?: string) => Promise<void>;

  // Card actions (all async with userId - optional for demo/offline mode)
  addCard: (
    tripId: string,
    dayId: string | undefined,
    card: Omit<InfoCard, "createdAt" | "updatedAt">,
    userId?: string
  ) => Promise<void>;
  updateCard: (
    tripId: string,
    dayId: string | undefined,
    cardId: string,
    updates: Partial<InfoCard>,
    userId?: string
  ) => Promise<void>;
  deleteCard: (
    tripId: string,
    dayId: string | undefined,
    cardId: string,
    userId?: string
  ) => Promise<void>;
  moveCard: (
    tripId: string,
    fromDayId: string | undefined,
    toDayId: string | undefined,
    cardId: string,
    newIndex: number,
    userId?: string
  ) => Promise<void>;
  reorderCards: (
    tripId: string,
    dayId: string | undefined,
    oldIndex: number,
    newIndex: number,
    userId?: string
  ) => Promise<void>;
  duplicateCard: (
    tripId: string,
    dayId: string | undefined,
    cardId: string,
    userId?: string
  ) => Promise<void>;

  // View preferences (async with userId)
  updateViewPrefs: (prefs: Partial<ViewPrefs>, userId: string) => Promise<void>;
  loadPreferences: (userId: string) => Promise<void>;

  // User vibes actions (async with userId - optional for demo/offline mode)
  setUserVibes: (vibes: UserVibes, userId?: string) => Promise<void>;
  updateUserVibes: (updates: Partial<UserVibes>, userId?: string) => Promise<void>;
  clearUserVibes: (userId?: string) => Promise<void>;
  getUserVibes: () => UserVibes | null;

  // Utility (synchronous getters)
  getCurrentTrip: () => Trip | null;
  getDayById: (tripId: string, dayId: string) => Day | null;
  getCardById: (
    tripId: string,
    dayId: string,
    cardId: string
  ) => InfoCard | null;
}
