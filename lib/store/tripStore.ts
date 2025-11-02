"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { TripStore, Trip, Day, Card, ViewPrefs } from "@/lib/types";
import type { UserVibes } from "@/lib/types/vibes";
import { track } from "@/lib/analytics";
import { 
  fetchTrips, 
  fetchTrip, 
  createTrip as createTripService,
  updateTrip as updateTripService,
  deleteTrip as deleteTripService,
  duplicateTrip as duplicateTripService,
} from "@/lib/services/trips-service";
import {
  createDay as createDayService,
  updateDay as updateDayService,
  deleteDay as deleteDayService,
  reorderDays as reorderDaysService,
} from "@/lib/services/days-service";
import {
  createCard as createCardService,
  updateCard as updateCardService,
  deleteCard as deleteCardService,
  moveCard as moveCardService,
  reorderCards as reorderCardsService,
  duplicateCard as duplicateCardService,
} from "@/lib/services/cards-service";
import {
  fetchPreferences,
  updateVibes as updateVibesService,
  clearVibes as clearVibesService,
  updateViewPrefs as updateViewPrefsService,
} from "@/lib/services/preferences-service";

export const useTripStore = create<TripStore>()(
  immer((set, get) => ({
    // State
    trips: {},
    currentTripId: null,
    viewPrefs: {
      grouping: "day",
      timeFormat: 12,
      showTimes: true,
      compactMode: false,
      theme: "system",
      density: "comfortable",
    },
    userVibes: null,

    // Trip actions
    addTrip: async (trip, userId) => {
      try {
        const createdTrip = await createTripService(trip, userId);
        set((state) => {
          state.trips[createdTrip.id] = createdTrip;
          state.currentTripId = createdTrip.id;
        });
        
        // Track trip creation
        track('Trip Created', {
          tripId: createdTrip.id,
          destination: createdTrip.destination,
          dayCount: createdTrip.days.length,
        });
      } catch (error) {
        console.error('Failed to add trip:', error);
        // Re-throw with more user-friendly message if it's an Error object
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw error;
      }
    },

    updateTrip: async (id, updates, userId) => {
      try {
        const updatedTrip = await updateTripService(id, updates, userId);
        set((state) => {
          state.trips[id] = updatedTrip;
        });
        
        // Track trip update
        track('Trip Updated', {
          tripId: id,
          fields: Object.keys(updates),
        });
      } catch (error) {
        console.error('Failed to update trip:', error);
        throw error;
      }
    },

    deleteTrip: async (id, userId) => {
      try {
        const trip = get().trips[id];
        await deleteTripService(id, userId);
        set((state) => {
          delete state.trips[id];
          if (state.currentTripId === id) {
            state.currentTripId = null;
          }
        });
        
        // Track trip deletion
        track('Trip Deleted', {
          tripId: id,
          dayCount: trip?.days.length || 0,
          cardCount: trip?.days.flatMap(d => d.cards).length || 0,
        });
      } catch (error) {
        console.error('Failed to delete trip:', error);
        throw error;
      }
    },

    duplicateTrip: async (id, userId) => {
      try {
        const duplicatedTrip = await duplicateTripService(id, userId);
        set((state) => {
          state.trips[duplicatedTrip.id] = duplicatedTrip;
        });
        
        // Track trip duplication
        track('Trip Duplicated', {
          originalTripId: id,
          newTripId: duplicatedTrip.id,
          dayCount: duplicatedTrip.days.length,
          cardCount: duplicatedTrip.days.flatMap(d => d.cards).length,
        });
        
        return duplicatedTrip.id;
      } catch (error) {
        console.error('Failed to duplicate trip:', error);
        throw error;
      }
    },

    setCurrentTrip: (id) => {
      set((state) => {
        state.currentTripId = id;
      });
    },

    getAllTrips: () => {
      const state = get();
      return Object.values(state.trips).sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    },

    loadTrips: async (userId) => {
      try {
        const trips = await fetchTrips(userId);
        set((state) => {
          state.trips = trips.reduce((acc, trip) => {
            acc[trip.id] = trip;
            return acc;
          }, {} as Record<string, Trip>);
        });
      } catch (error) {
        console.error('Failed to load trips:', error);
        throw error;
      }
    },

    // Day actions
    addDay: async (tripId, day, userId) => {
      try {
        const trip = get().trips[tripId];
        if (!trip) throw new Error('Trip not found');

        const order = trip.days.length;
        const createdDay = await createDayService(tripId, day, order, userId);
        
        set((state) => {
          const stateTrip = state.trips[tripId];
          if (stateTrip) {
            stateTrip.days.push({ ...createdDay, cards: [] });
            stateTrip.updatedAt = new Date();
          }
        });
      } catch (error) {
        console.error('Failed to add day:', error);
        throw error;
      }
    },

    updateDay: async (tripId, dayId, updates, userId) => {
      try {
        await updateDayService(dayId, updates, userId);
        
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
      } catch (error) {
        console.error('Failed to update day:', error);
        throw error;
      }
    },

    deleteDay: async (tripId, dayId, userId) => {
      try {
        const trip = get().trips[tripId];
        const day = trip?.days.find(d => d.id === dayId);
        
        await deleteDayService(dayId, userId);
        
        set((state) => {
          const trip = state.trips[tripId];
          if (trip) {
            trip.days = trip.days.filter((d) => d.id !== dayId);
            trip.updatedAt = new Date();
          }
        });
        
        // Track day deletion
        track('Day Deleted', {
          tripId,
          dayId,
          cardCount: day?.cards.length || 0,
        });
      } catch (error) {
        console.error('Failed to delete day:', error);
        throw error;
      }
    },

    reorderDays: async (tripId, oldIndex, newIndex, userId) => {
      try {
        const trip = get().trips[tripId];
        if (!trip) throw new Error('Trip not found');

        // Optimistic update
        set((state) => {
          const stateTrip = state.trips[tripId];
          if (stateTrip) {
            const [removed] = stateTrip.days.splice(oldIndex, 1);
            stateTrip.days.splice(newIndex, 0, removed);
          }
        });

        // Persist to database
        const dayIds = get().trips[tripId]?.days.map(d => d.id) || [];
        await reorderDaysService(tripId, dayIds, userId);
        
        // Track day reorder
        track('Day Reordered', {
          tripId,
          fromIndex: oldIndex,
          toIndex: newIndex,
        });
      } catch (error) {
        console.error('Failed to reorder days:', error);
        // Revert on error
        await get().loadTrips(userId);
        throw error;
      }
    },

    // Card actions
    addCard: async (tripId, dayId, card, userId) => {
      try {
        const trip = get().trips[tripId];
        if (!trip) throw new Error('Trip not found');

        let order = 0;
        let dayDate: string | undefined;
        
        if (dayId === "unassigned") {
          order = trip.unassignedCards?.length || 0;
        } else {
          const day = trip.days.find((d) => d.id === dayId);
          order = day?.cards.length || 0;
          dayDate = day?.date; // Get the day's date for timestamp conversion
        }

        const createdCard = await createCardService(
          tripId,
          dayId === "unassigned" ? null : dayId,
          card,
          order,
          userId,
          dayDate // Pass day date for time conversion
        );

        set((state) => {
          const stateTrip = state.trips[tripId];
          if (stateTrip) {
            if (dayId === "unassigned") {
              if (!stateTrip.unassignedCards) stateTrip.unassignedCards = [];
              stateTrip.unassignedCards.push(createdCard);
            } else {
              const day = stateTrip.days.find((d) => d.id === dayId);
              if (day) {
                day.cards.push(createdCard);
              }
            }
            stateTrip.updatedAt = new Date();
          }
        });
        
        // Track card creation
        track('Card Created', {
          tripId,
          cardId: createdCard.id,
          cardType: createdCard.type,
          dayId: dayId === "unassigned" ? null : dayId,
          location: dayId === "unassigned" ? 'things_to_do' : 'day',
          hasLocation: !!createdCard.location,
          hasCost: !!createdCard.cost,
          hasTime: !!createdCard.startTime,
        });
      } catch (error) {
        console.error('Failed to add card:', error);
        throw error;
      }
    },

    updateCard: async (tripId, dayId, cardId, updates, userId) => {
      try {
        const trip = get().trips[tripId];
        let dayDate: string | undefined;
        
        // Get day date for time conversion
        if (dayId !== "unassigned") {
          const day = trip?.days.find((d) => d.id === dayId);
          dayDate = day?.date;
        }
        
        await updateCardService(cardId, updates, userId, dayDate);

        set((state) => {
          const stateTrip = state.trips[tripId];
          if (stateTrip) {
            let card: Card | undefined;

            if (dayId === "unassigned") {
              card = stateTrip.unassignedCards?.find((c) => c.id === cardId);
            } else {
              const day = stateTrip.days.find((d) => d.id === dayId);
              if (day) {
                card = day.cards.find((c) => c.id === cardId);
              }
            }

            if (card) {
              Object.assign(card, updates, { updatedAt: new Date() });
              stateTrip.updatedAt = new Date();
            }
          }
        });
        
        // Track card update
        track('Card Updated', {
          tripId,
          cardId,
          dayId: dayId === "unassigned" ? null : dayId,
          fields: Object.keys(updates),
        });
      } catch (error) {
        console.error('Failed to update card:', error);
        throw error;
      }
    },

    deleteCard: async (tripId, dayId, cardId, userId) => {
      try {
        // Get card info before deletion
        const trip = get().trips[tripId];
        let card: Card | undefined;
        if (dayId === "unassigned") {
          card = trip?.unassignedCards?.find(c => c.id === cardId);
        } else {
          const day = trip?.days.find(d => d.id === dayId);
          card = day?.cards.find(c => c.id === cardId);
        }
        
        await deleteCardService(cardId, userId);

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
        
        // Track card deletion
        track('Card Deleted', {
          tripId,
          cardId,
          cardType: card?.type,
          dayId: dayId === "unassigned" ? null : dayId,
        });
      } catch (error) {
        console.error('Failed to delete card:', error);
        throw error;
      }
    },

    moveCard: async (tripId, fromDayId, toDayId, cardId, newIndex, userId) => {
      try {
        // Optimistic update
        set((state) => {
          const trip = state.trips[tripId];
          if (trip) {
            const fromDay =
              fromDayId === "unassigned"
                ? null
                : trip.days.find((d) => d.id === fromDayId);
            const toDay =
              toDayId === "unassigned"
                ? null
                : trip.days.find((d) => d.id === toDayId);

            let card: Card | undefined;
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

        // Persist to database
        await moveCardService(
          cardId,
          toDayId === "unassigned" ? null : toDayId,
          newIndex,
          userId
        );
      } catch (error) {
        console.error('Failed to move card:', error);
        // Revert on error
        await get().loadTrips(userId);
        throw error;
      }
    },

    reorderCards: async (tripId, dayId, oldIndex, newIndex, userId) => {
      try {
        // Optimistic update
        set((state) => {
          const trip = state.trips[tripId];
          if (trip) {
            if (dayId === "unassigned") {
              if (trip.unassignedCards) {
                const [removed] = trip.unassignedCards.splice(oldIndex, 1);
                trip.unassignedCards.splice(newIndex, 0, removed);
              }
            } else {
              const day = trip.days.find((d) => d.id === dayId);
              if (day) {
                const [removed] = day.cards.splice(oldIndex, 1);
                day.cards.splice(newIndex, 0, removed);
              }
            }
          }
        });

        // Persist to database
        const trip = get().trips[tripId];
        if (trip) {
          let cardIds: string[] = [];
          if (dayId === "unassigned") {
            cardIds = trip.unassignedCards?.map(c => c.id) || [];
          } else {
            const day = trip.days.find((d) => d.id === dayId);
            cardIds = day?.cards.map(c => c.id) || [];
          }
          await reorderCardsService(
            dayId === "unassigned" ? null : dayId,
            cardIds,
            userId
          );
        }
      } catch (error) {
        console.error('Failed to reorder cards:', error);
        // Revert on error
        await get().loadTrips(userId);
        throw error;
      }
    },

    duplicateCard: async (tripId, dayId, cardId, userId) => {
      try {
        const duplicatedCard = await duplicateCardService(cardId, userId);

        set((state) => {
          const trip = state.trips[tripId];
          if (trip) {
            if (dayId === "unassigned") {
              if (!trip.unassignedCards) trip.unassignedCards = [];
              const cardIndex = trip.unassignedCards.findIndex(
                (c) => c.id === cardId
              );
              trip.unassignedCards.splice(cardIndex + 1, 0, duplicatedCard);
            } else {
              const day = trip.days.find((d) => d.id === dayId);
              if (day) {
                const cardIndex = day.cards.findIndex((c) => c.id === cardId);
                day.cards.splice(cardIndex + 1, 0, duplicatedCard);
              }
            }
            trip.updatedAt = new Date();
          }
        });
      } catch (error) {
        console.error('Failed to duplicate card:', error);
        throw error;
      }
    },

    // View preferences
    updateViewPrefs: async (prefs, userId) => {
      try {
        await updateViewPrefsService(userId, prefs);
        set((state) => {
          Object.assign(state.viewPrefs, prefs);
        });
      } catch (error) {
        console.error('Failed to update view preferences:', error);
        throw error;
      }
    },

    loadPreferences: async (userId) => {
      try {
        const { vibes, viewPrefs } = await fetchPreferences(userId);
        set((state) => {
          if (vibes) state.userVibes = vibes;
          if (viewPrefs) state.viewPrefs = viewPrefs;
        });
      } catch (error) {
        console.error('Failed to load preferences:', error);
        throw error;
      }
    },

    // User vibes actions
    setUserVibes: async (vibes, userId) => {
      try {
        await updateVibesService(userId, vibes);
        set((state) => {
          state.userVibes = {
            ...vibes,
            updated_at: new Date().toISOString(),
          };
        });
      } catch (error) {
        console.error('Failed to set user vibes:', error);
        throw error;
      }
    },

    updateUserVibes: async (updates, userId) => {
      try {
        const currentVibes = get().userVibes;
        const updatedVibes = {
          ...(currentVibes || {}),
          ...updates,
          updated_at: new Date().toISOString(),
        } as UserVibes;

        await updateVibesService(userId, updatedVibes);
        
        set((state) => {
          state.userVibes = updatedVibes;
        });
      } catch (error) {
        console.error('Failed to update user vibes:', error);
        throw error;
      }
    },

    clearUserVibes: async (userId) => {
      try {
        await clearVibesService(userId);
        set((state) => {
          state.userVibes = null;
        });
      } catch (error) {
        console.error('Failed to clear user vibes:', error);
        throw error;
      }
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
      const day = get().getDayById(tripId, dayId);
      return day ? day.cards.find((c) => c.id === cardId) || null : null;
    },

    getUserVibes: () => {
      return get().userVibes;
    },
  }))
);
