"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { temporal } from "zundo";
import { nanoid } from "nanoid";
import type { TripStore, Trip, InfoCard, ViewPrefs } from "@/lib/types";
import type { UserVibes } from "@/lib/types/vibes";
import { saveToStorage, loadFromStorage } from "@/lib/utils/storage";
import { getDefaultVibes } from "@/lib/utils/vibes";
import { AUTOSAVE_DEBOUNCE_MS } from "@/lib/constants";

// Debounce helper
let saveTimeout: NodeJS.Timeout | null = null;
function debouncedSave(state: TripStore) {
  if (saveTimeout) clearTimeout(saveTimeout);

  saveTimeout = setTimeout(() => {
    saveToStorage({
      trips: state.trips,
      currentTripId: state.currentTripId,
      viewPrefs: state.viewPrefs,
      userVibes: Array.isArray(state.userVibes) ? state.userVibes : [],
    });
  }, AUTOSAVE_DEBOUNCE_MS);
}

// Initial state
const getInitialState = () => {
  const saved = loadFromStorage();

  if (saved) {
    return {
      trips: saved.trips,
      currentTripId: saved.currentTripId,
      viewPrefs: saved.viewPrefs,
      userVibes: Array.isArray(saved.userVibes)
        ? null
        : saved.userVibes || null,
    };
  }

  return {
    trips: {} as Record<string, Trip>,
    currentTripId: null as string | null,
    viewPrefs: {
      grouping: "day" as const,
      timeFormat: 12 as const,
      showTimes: true,
      compactMode: false,
      theme: "system" as const,
      density: "comfortable" as const,
    } as ViewPrefs,
    userVibes: null as UserVibes | null,
  };
};

export const useTripStore = create<TripStore>()(
  temporal(
    immer((set, get) => ({
      ...getInitialState(),

      // Trip actions
      addTrip: (trip) => {
        set((state) => {
          const now = new Date();
          const newTrip: Trip = {
            ...trip,
            createdAt: now,
            updatedAt: now,
          };
          state.trips[trip.id] = newTrip;
          state.currentTripId = trip.id;
        });
        debouncedSave(get());
      },

      updateTrip: (id, updates) => {
        set((state) => {
          if (state.trips[id]) {
            Object.assign(state.trips[id], updates, { updatedAt: new Date() });
          }
        });
        debouncedSave(get());
      },

      deleteTrip: (id) => {
        set((state) => {
          delete state.trips[id];
          if (state.currentTripId === id) {
            state.currentTripId = null;
          }
        });
        debouncedSave(get());
      },

      duplicateTrip: (id) => {
        set((state) => {
          const originalTrip = state.trips[id];
          if (originalTrip) {
            const now = new Date();
            const newTripId = nanoid();
            const newTrip: Trip = {
              ...originalTrip,
              id: newTripId,
              title: `${originalTrip.title} (copy)`,
              createdAt: now,
              updatedAt: now,
              days: originalTrip.days.map((day) => ({
                ...day,
                id: nanoid(),
                cards: day.cards.map((card) => ({
                  ...card,
                  id: nanoid(),
                  createdAt: now,
                  updatedAt: now,
                })),
              })),
              unassignedCards:
                originalTrip.unassignedCards?.map((card) => ({
                  ...card,
                  id: nanoid(),
                  createdAt: now,
                  updatedAt: now,
                })) || [],
            };
            state.trips[newTripId] = newTrip;
          }
        });
        debouncedSave(get());
      },

      setCurrentTrip: (id) => {
        set((state) => {
          state.currentTripId = id;
        });
        debouncedSave(get());
      },

      getAllTrips: () => {
        const state = get();
        return Object.values(state.trips).sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      },

      // Day actions
      addDay: (tripId, day) => {
        set((state) => {
          const trip = state.trips[tripId];
          if (trip) {
            trip.days.push({ ...day, cards: [] });
            trip.updatedAt = new Date();
          }
        });
        debouncedSave(get());
      },

      updateDay: (tripId, dayId, updates) => {
        set((state) => {
          const trip = state.trips[tripId];
          if (trip) {
            const day = trip.days.find((d) => d.id === dayId);
            if (day) {
              Object.assign(day, updates);
              trip.updatedAt = new Date();
            }
          }
        });
        debouncedSave(get());
      },

      deleteDay: (tripId, dayId) => {
        set((state) => {
          const trip = state.trips[tripId];
          if (trip) {
            trip.days = trip.days.filter((d) => d.id !== dayId);
            trip.updatedAt = new Date();
          }
        });
        debouncedSave(get());
      },

      reorderDays: (tripId, oldIndex, newIndex) => {
        set((state) => {
          const trip = state.trips[tripId];
          if (trip) {
            const [removed] = trip.days.splice(oldIndex, 1);
            trip.days.splice(newIndex, 0, removed);
            trip.updatedAt = new Date();
          }
        });
        debouncedSave(get());
      },

      // Card actions
      addCard: (tripId, dayId, card) => {
        set((state) => {
          const trip = state.trips[tripId];
          if (trip) {
            const now = new Date();
            const newCard: InfoCard = {
              ...card,
              createdAt: now,
              updatedAt: now,
            };

            if (dayId === "unassigned") {
              if (!trip.unassignedCards) trip.unassignedCards = [];
              trip.unassignedCards.push(newCard);
            } else {
              const day = trip.days.find((d) => d.id === dayId);
              if (day) {
                day.cards.push(newCard);
              }
            }
            trip.updatedAt = new Date();
          }
        });
        debouncedSave(get());
      },

      updateCard: (tripId, dayId, cardId, updates) => {
        set((state) => {
          const trip = state.trips[tripId];
          if (trip) {
            let card: InfoCard | undefined;

            if (dayId === "unassigned") {
              card = trip.unassignedCards?.find((c) => c.id === cardId);
            } else {
              const day = trip.days.find((d) => d.id === dayId);
              if (day) {
                card = day.cards.find((c) => c.id === cardId);
              }
            }

            if (card) {
              Object.assign(card, updates, { updatedAt: new Date() });
              trip.updatedAt = new Date();
            }
          }
        });
        debouncedSave(get());
      },

      deleteCard: (tripId, dayId, cardId) => {
        set((state) => {
          const trip = state.trips[tripId];
          if (trip) {
            if (dayId === "unassigned") {
              if (trip.unassignedCards) {
                trip.unassignedCards = trip.unassignedCards.filter(
                  (c) => c.id !== cardId
                );
              }
            } else {
              const day = trip.days.find((d) => d.id === dayId);
              if (day) {
                day.cards = day.cards.filter((c) => c.id !== cardId);
              }
            }
            trip.updatedAt = new Date();
          }
        });
        debouncedSave(get());
      },

      moveCard: (tripId, fromDayId, toDayId, cardId, newIndex) => {
        set((state) => {
          const trip = state.trips[tripId];
          if (trip) {
            // Handle unassigned cards
            const fromDay =
              fromDayId === "unassigned"
                ? null
                : trip.days.find((d) => d.id === fromDayId);
            const toDay =
              toDayId === "unassigned"
                ? null
                : trip.days.find((d) => d.id === toDayId);

            // Get the card from source
            let card: InfoCard | undefined;
            let cardIndex: number;

            if (fromDayId === "unassigned") {
              if (!trip.unassignedCards) trip.unassignedCards = [];
              cardIndex = trip.unassignedCards.findIndex(
                (c) => c.id === cardId
              );
              if (cardIndex !== -1) {
                [card] = trip.unassignedCards.splice(cardIndex, 1);
              }
            } else if (fromDay) {
              cardIndex = fromDay.cards.findIndex((c) => c.id === cardId);
              if (cardIndex !== -1) {
                [card] = fromDay.cards.splice(cardIndex, 1);
              }
            }

            // Add to destination
            if (card) {
              if (toDayId === "unassigned") {
                if (!trip.unassignedCards) trip.unassignedCards = [];
                trip.unassignedCards.splice(newIndex, 0, card);
              } else if (toDay) {
                toDay.cards.splice(newIndex, 0, card);
              }
              trip.updatedAt = new Date();
            }
          }
        });
        debouncedSave(get());
      },

      reorderCards: (tripId, dayId, oldIndex, newIndex) => {
        set((state) => {
          const trip = state.trips[tripId];
          if (trip) {
            const day = trip.days.find((d) => d.id === dayId);
            if (day) {
              const [removed] = day.cards.splice(oldIndex, 1);
              day.cards.splice(newIndex, 0, removed);
              trip.updatedAt = new Date();
            }
          }
        });
        debouncedSave(get());
      },

      duplicateCard: (tripId, dayId, cardId) => {
        set((state) => {
          const trip = state.trips[tripId];
          if (trip) {
            let card: InfoCard | undefined;
            let cardIndex: number;

            if (dayId === "unassigned") {
              if (!trip.unassignedCards) trip.unassignedCards = [];
              card = trip.unassignedCards.find((c) => c.id === cardId);
              cardIndex = trip.unassignedCards.findIndex(
                (c) => c.id === cardId
              );

              if (card) {
                const now = new Date();
                const duplicate: InfoCard = {
                  ...card,
                  id: nanoid(),
                  title: `${card.title} (copy)`,
                  createdAt: now,
                  updatedAt: now,
                };
                trip.unassignedCards.splice(cardIndex + 1, 0, duplicate);
                trip.updatedAt = new Date();
              }
            } else {
              const day = trip.days.find((d) => d.id === dayId);
              if (day) {
                card = day.cards.find((c) => c.id === cardId);
                if (card) {
                  const now = new Date();
                  const duplicate: InfoCard = {
                    ...card,
                    id: nanoid(),
                    title: `${card.title} (copy)`,
                    createdAt: now,
                    updatedAt: now,
                  };
                  cardIndex = day.cards.findIndex((c) => c.id === cardId);
                  day.cards.splice(cardIndex + 1, 0, duplicate);
                  trip.updatedAt = new Date();
                }
              }
            }
          }
        });
        debouncedSave(get());
      },

      // View preferences
      updateViewPrefs: (prefs) => {
        set((state) => {
          Object.assign(state.viewPrefs, prefs);
        });
        debouncedSave(get());
      },

      // User vibes actions
      setUserVibes: (vibes) => {
        set((state) => {
          state.userVibes = {
            ...vibes,
            updated_at: new Date().toISOString(),
          };
        });
        debouncedSave(get());
      },

      updateUserVibes: (updates) => {
        set((state) => {
          if (state.userVibes) {
            Object.assign(state.userVibes, updates, {
              updated_at: new Date().toISOString(),
            });
          } else {
            state.userVibes = {
              ...getDefaultVibes(),
              ...updates,
              updated_at: new Date().toISOString(),
            };
          }
        });
        debouncedSave(get());
      },

      clearUserVibes: () => {
        set((state) => {
          state.userVibes = null;
        });
        debouncedSave(get());
      },

      // Utility getters
      getCurrentTrip: () => {
        const state = get();
        return state.currentTripId ? state.trips[state.currentTripId] : null;
      },

      getDayById: (tripId, dayId) => {
        const state = get();
        const trip = state.trips[tripId];
        return trip ? trip.days.find((d) => d.id === dayId) || null : null;
      },

      getCardById: (tripId, dayId, cardId) => {
        // const state = get();
        const day = get().getDayById(tripId, dayId);
        return day ? day.cards.find((c) => c.id === cardId) || null : null;
      },

      getUserVibes: () => {
        return get().userVibes;
      },
    })),
    {
      limit: 50,
      partialize: (state) => ({
        trips: state.trips,
        currentTripId: state.currentTripId,
      }),
    }
  )
);
