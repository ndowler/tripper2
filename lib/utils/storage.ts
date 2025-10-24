/**
 * localStorage utilities with type safety
 */

import { Trip, ViewPrefs } from "../types";
import { UserVibes } from "../types/vibes";

const STORAGE_KEY = "tripper-data";

export interface StoredData {
  trips: Record<string, Trip>;
  currentTripId: string | null;
  viewPrefs: ViewPrefs;
  userVibes: UserVibes[];
}

export function loadFromStorage(): StoredData | null {
  if (typeof window === "undefined") return null;

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;

    const parsed = JSON.parse(data);

    // Hydrate dates
    Object.values(parsed.trips || {}).forEach((trip) => {
      const t = trip as Trip;
      t.createdAt = new Date(t.createdAt);
      t.updatedAt = new Date(t.updatedAt);

      t.days.forEach((day) => {
        day.cards.forEach((card) => {
          card.createdAt = new Date(card.createdAt);
          card.updatedAt = new Date(card.updatedAt);
        });
      });
    });

    return parsed;
  } catch (error) {
    console.error("Failed to load from localStorage:", error);
    return null;
  }
}

export function saveToStorage(data: StoredData): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
}

export function clearStorage(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
