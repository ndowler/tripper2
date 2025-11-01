"use client";

import { useState, useEffect } from "react";
import { Trip } from "@/lib/types";
import { useTripStore } from "@/lib/store/tripStore";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import { TripCard } from "@/components/cards/TripCard";
import { VibesCard } from "@/components/vibes/VibesCard";
import { Navbar } from "@/components/navbar/TripNavbar";
import { DayColumn } from "@/components/board/DayColumn";
import { AddDayButton } from "@/components/board/AddDayButton";
import { ThingsToDoDrawer } from "@/components/board/ThingsToDoDrawer";
import { toast } from "sonner";

interface BoardProps {
  trip: Trip;
  userId: string;
}

export function Board({ trip, userId }: BoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<"day" | "card" | null>(null);
  const [activeDayId, setActiveDayId] = useState<string | null>(null);
  const [thingsToDoOpen, setThingsToDoOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const reorderDays = useTripStore((state) => state.reorderDays);
  const reorderCards = useTripStore((state) => state.reorderCards);
  const moveCard = useTripStore((state) => state.moveCard);
  const loadTrips = useTripStore((state) => state.loadTrips);

  // Configure sensors for drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px movement before drag starts
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeData = active.data.current;

    setActiveId(active.id as string);

    if (activeData?.type === "card") {
      setActiveType("card");
      setActiveDayId(activeData.dayId);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    // Visual feedback only - no state changes needed
    // The drag overlay will continue showing the card from its original position
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      setActiveType(null);
      setActiveDayId(null);
      return;
    }

    const activeData = active.data.current;
    const overData = over.data.current;

    // Only handle card drags
    if (activeData?.type !== "card") {
      setActiveId(null);
      setActiveType(null);
      setActiveDayId(null);
      return;
    }

    const activeDayId = activeData.dayId;

    try {
      // Dropping on another card
      if (overData?.type === "card") {
        const overDayId = overData.dayId;

        if (activeDayId === overDayId) {
          // Reordering cards within same day
          const day = activeDayId === "unassigned" 
            ? null 
            : trip.days.find((d) => d.id === activeDayId);
          
          const cards = activeDayId === "unassigned"
            ? trip.unassignedCards || []
            : day?.cards || [];

          const oldIndex = cards.findIndex((c) => c.id === active.id);
          const newIndex = cards.findIndex((c) => c.id === over.id);

          if (oldIndex !== newIndex && oldIndex !== -1 && newIndex !== -1) {
            await reorderCards(trip.id, activeDayId, oldIndex, newIndex, userId);
          }
        } else {
          // Moving card to a different day
          const overDay =
            overDayId === "unassigned"
              ? null
              : trip.days.find((d) => d.id === overDayId);
          
          const overCards = overDayId === "unassigned"
            ? trip.unassignedCards || []
            : overDay?.cards || [];
          
          const overCardIndex = overCards.findIndex((c) => c.id === over.id);

          // Insert at the position of the card we're hovering over
          await moveCard(
            trip.id,
            activeDayId,
            overDayId,
            active.id as string,
            overCardIndex !== -1 ? overCardIndex : overCards.length,
            userId
          );
        }
      } 
      // Dropping on an empty day
      else if (overData?.type === "day") {
        const overDayId = overData.dayId;

        if (activeDayId !== overDayId) {
          // Move to end of the day (which is empty)
          await moveCard(
            trip.id,
            activeDayId,
            overDayId,
            active.id as string,
            0, // First position since day is empty
            userId
          );
        }
      }
    } catch (error) {
      console.error('Failed to move/reorder card:', error);
      toast.error('Failed to update card. Reloading...');
      // Reload trips to revert optimistic update
      await loadTrips(userId);
    }

    setActiveId(null);
    setActiveType(null);
    setActiveDayId(null);
  };

  // Get active card for drag overlay
  const activeCard =
    activeType === "card" && activeDayId
      ? activeDayId === "unassigned"
        ? trip.unassignedCards?.find((c) => c.id === activeId)
        : trip.days
            .find((d) => d.id === activeDayId)
            ?.cards.find((c) => c.id === activeId)
      : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Navbar
        trip={{
          id: trip.id,
          title: trip.title,
          description: trip.description,
          unassignedCards: trip.unassignedCards,
        }}
        thingsToDoOpen={thingsToDoOpen}
        setThingsToDoOpen={setThingsToDoOpen}
      />
      <div className="min-h-screen flex flex-col bg-background">
        {/* Board with Drawer */}
        <div className="flex-1 flex overflow-hidden">
          {/* Things to Do Drawer - Client-only to prevent hydration mismatch */}
          {mounted && (
            <ThingsToDoDrawer
              trip={trip}
              userId={userId}
              isOpen={thingsToDoOpen}
              onClose={() => setThingsToDoOpen(false)}
            />
          )}

          {/* Main Board Area */}
          <main className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-thin overflow-x-hidden p-4">
            <div className="px-4 py-6">
              {/* Vibes Card */}
              {mounted && <VibesCard userId={userId} />}

              <div className="flex gap-2 w-full justify-center grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
                {/* Day Columns - Horizontal Layout (No drag-drop, reorder via date change) */}
                {trip.days.map((day, index) => (
                  <DayColumn
                    key={day.id}
                    day={day}
                    tripId={trip.id}
                    userId={userId}
                    index={index}
                  />
                ))}

                {/* Add day button */}
                <div className="flex-shrink-0" style={{ minWidth: "360px" }}>
                  <AddDayButton tripId={trip.id} userId={userId} />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeCard && activeDayId ? (
          <div className="opacity-90 rotate-3 scale-105">
            <TripCard
              card={activeCard}
              tripId={trip.id}
              dayId={activeDayId}
              userId={userId}
              isDragging
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
