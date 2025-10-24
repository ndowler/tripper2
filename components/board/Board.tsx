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

interface BoardProps {
  trip: Trip;
}

export function Board({ trip }: BoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<"day" | "card" | null>(null);
  const [activeDayId, setActiveDayId] = useState<string | null>(null);
  const [thingsToDoOpen, setThingsToDoOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // const reorderDays = useTripStore((state) => state.reorderDays);
  const reorderCards = useTripStore((state) => state.reorderCards);
  const moveCard = useTripStore((state) => state.moveCard);

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

    const activeData = active.data.current;
    const overData = over.data.current;

    // Handle card moves (including from/to unassigned)
    if (activeData?.type === "card") {
      const activeDayId = activeData.dayId;

      // Moving to a card in another column
      if (overData?.type === "card") {
        const overDayId = overData.dayId;

        if (activeDayId !== overDayId) {
          // Find the source and destination
          const overDay =
            overDayId === "unassigned"
              ? null
              : trip.days.find((d) => d.id === overDayId);
          const overCardIndex = overDay
            ? overDay.cards.findIndex((c) => c.id === over.id)
            : trip.unassignedCards?.findIndex((c) => c.id === over.id) || 0;

          moveCard(
            trip.id,
            activeDayId,
            overDayId,
            active.id as string,
            overCardIndex
          );
          setActiveDayId(overDayId);
        }
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      setActiveType(null);
      setActiveDayId(null);
      return;
    }

    const activeData = active.data.current;
    const overData = over.data.current;

    if (activeData?.type === "card" && overData?.type === "card") {
      // Reordering cards within same day
      const activeDayId = activeData.dayId;
      const overDayId = overData.dayId;

      if (activeDayId === overDayId) {
        const day = trip.days.find((d) => d.id === activeDayId);
        if (day) {
          const oldIndex = day.cards.findIndex((c) => c.id === active.id);
          const newIndex = day.cards.findIndex((c) => c.id === over.id);

          if (oldIndex !== newIndex) {
            reorderCards(trip.id, activeDayId, oldIndex, newIndex);
          }
        }
      }
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
              isOpen={thingsToDoOpen}
              onClose={() => setThingsToDoOpen(false)}
            />
          )}

          {/* Main Board Area */}
          <main className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-thin overflow-x-hidden p-4">
            <div className="px-4 py-6">
              {/* Vibes Card */}
              {mounted && <VibesCard />}

              <div className="flex gap-6 w-full justify-center grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                {/* Day Columns - Horizontal Layout (No drag-drop, reorder via date change) */}
                {trip.days.map((day, index) => (
                  <DayColumn
                    key={day.id}
                    day={day}
                    tripId={trip.id}
                    index={index}
                  />
                ))}

                {/* Add day button */}
                <div className="flex-shrink-0 w-[360px]">
                  <AddDayButton tripId={trip.id} activeDayId={activeDayId} />
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
              isDragging
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
