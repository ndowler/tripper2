/**
 * localStorage utilities with type safety
 */

const STORAGE_KEY = "tripper-data";

export interface StoredData {
  trips: Record<string, any>;
  currentTripId: string | null;
  viewPrefs: any;
  userVibes: any[];
}

export function loadFromStorage(): StoredData | null {
  if (typeof window === "undefined") return null;

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;

    const parsed = JSON.parse(data);

    // Hydrate dates
    Object.values(parsed.trips || {}).forEach((trip: any) => {
      trip.createdAt = new Date(trip.createdAt);
      trip.updatedAt = new Date(trip.updatedAt);

      trip.days.forEach((day: any) => {
        day.cards.forEach((card: any) => {
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
