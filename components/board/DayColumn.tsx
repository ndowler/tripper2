"use client";

import { useState, useEffect } from "react";
import { type Day } from "@/lib/types";
import { SortableCard } from "@/components/cards/SortableCard";
import { CardComposer } from "@/components/cards/CardComposer";
import { DayEditModal } from "./DayEditModal";
import { MakeDayModal } from "./MakeDayModal";
import { format } from "date-fns";
import { Calendar, MoreVertical, Wand2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";

interface DayColumnProps {
  day: Day;
  tripId: string;
  userId?: string; // Optional for demo/offline mode
  index: number;
}

export function DayColumn({ day, tripId, userId, index }: DayColumnProps) {
  const [mounted, setMounted] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMakeDayModalOpen, setIsMakeDayModalOpen] = useState(false);

  // Make the day column droppable (for empty days)
  const { setNodeRef, isOver } = useDroppable({
    id: `day-${day.id}`,
    data: {
      type: "day",
      dayId: day.id,
    },
  });

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate totals
  const totalTimeBlocked = day.cards.reduce((sum, card) => {
    return sum + (card.duration || 0);
  }, 0);

  const totalSpend = day.cards.reduce((sum, card) => {
    return sum + (card.cost?.amount || 0);
  }, 0);

  // Format time blocked (e.g., "6h 30m")
  const formatTimeBlocked = (minutes: number) => {
    if (minutes === 0) return "";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours && mins) return `${hours}h ${mins}m`;
    if (hours) return `${hours}h`;
    return `${mins}m`;
  };

  // Get primary currency from first card with cost
  const primaryCurrency =
    day.cards.find((c) => c.cost)?.cost?.currency || "EUR";
  const currencySymbol =
    primaryCurrency === "EUR"
      ? "$"
      : primaryCurrency === "USD"
      ? "$"
      : primaryCurrency === "GBP"
      ? "£"
      : primaryCurrency;

  // Group cards by time of day
  const getTimeOfDay = (
    startTime?: string
  ): "morning" | "afternoon" | "evening" | "unscheduled" => {
    if (!startTime) return "unscheduled";
    const [hours] = startTime.split(":").map(Number);
    if (hours >= 5 && hours < 12) return "morning";
    if (hours >= 12 && hours < 17) return "afternoon";
    return "evening";
  };

  const cardsByTimeOfDay = {
    morning: day.cards.filter((c) => getTimeOfDay(c.startTime) === "morning"),
    afternoon: day.cards.filter(
      (c) => getTimeOfDay(c.startTime) === "afternoon"
    ),
    evening: day.cards.filter((c) => getTimeOfDay(c.startTime) === "evening"),
    unscheduled: day.cards.filter(
      (c) => getTimeOfDay(c.startTime) === "unscheduled"
    ),
  };

  const hasScheduledCards =
    cardsByTimeOfDay.morning.length > 0 ||
    cardsByTimeOfDay.afternoon.length > 0 ||
    cardsByTimeOfDay.evening.length > 0;

  return (
    <div className="h-full bg-card/30 rounded-lg border flex flex-col flex-shrink-0 day-column">
      {/* Day header - Sticky */}
      <div className="sticky top-0 z-20 px-4 py-3 border-b bg-card/95 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <h2 className="font-semibold text-base">
                  {day.title || `Day ${index + 1}`}
                </h2>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                <span>
                  {mounted
                    ? format(new Date(day.date), "EEEE, MMM d")
                    : day.date}
                </span>
                {totalSpend > 0 && (
                  <>
                    <span>•</span>
                    <span>
                      {currencySymbol}
                      {totalSpend}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label="Day options"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsMakeDayModalOpen(true)}>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Make My Day
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Day
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Cards - Vertical Stack with Time Sections */}
      <SortableContext
        items={day.cards.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div 
          ref={setNodeRef}
          className="p-4 space-y-3 overflow-y-auto max-h-[calc(100vh-12rem)]"
        >
          {day.cards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground text-sm text-center gap-1">
              <span>No plans yet</span>
              <span className="text-xs">Add your first card</span>
            </div>
          ) : hasScheduledCards ? (
            <>
              {/* Morning Section */}
              {cardsByTimeOfDay.morning.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="text-xs font-medium uppercase tracking-wide">
                      Morning
                    </div>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>
                  {cardsByTimeOfDay.morning.map((card) => (
                    <SortableCard
                      key={card.id}
                      card={card}
                      tripId={tripId}
                      dayId={day.id}
                      userId={userId}
                    />
                  ))}
                </div>
              )}

              {/* Afternoon Section */}
              {cardsByTimeOfDay.afternoon.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="text-xs font-medium uppercase tracking-wide">
                      Afternoon
                    </div>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>
                  {cardsByTimeOfDay.afternoon.map((card) => (
                    <SortableCard
                      key={card.id}
                      card={card}
                      tripId={tripId}
                      dayId={day.id}
                      userId={userId}
                    />
                  ))}
                </div>
              )}

              {/* Evening Section */}
              {cardsByTimeOfDay.evening.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="text-xs font-medium uppercase tracking-wide">
                      Evening
                    </div>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>
                  {cardsByTimeOfDay.evening.map((card) => (
                    <SortableCard
                      key={card.id}
                      card={card}
                      tripId={tripId}
                      dayId={day.id}
                      userId={userId}
                    />
                  ))}
                </div>
              )}

              {/* Unscheduled Cards */}
              {cardsByTimeOfDay.unscheduled.length > 0 && (
                <div className="space-y-3">
                  {cardsByTimeOfDay.unscheduled.map((card) => (
                    <SortableCard
                      key={card.id}
                      card={card}
                      tripId={tripId}
                      dayId={day.id}
                      userId={userId}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            // All cards unscheduled - no time sections
            day.cards.map((card) => (
              <SortableCard
                key={card.id}
                card={card}
                tripId={tripId}
                dayId={day.id}
                userId={userId}
              />
            ))
          )}

          {/* Add card composer */}
          <CardComposer tripId={tripId} dayId={day.id} userId={userId} />
        </div>
      </SortableContext>

      {/* Edit Modal */}
      <DayEditModal
        day={day}
        tripId={tripId}
        userId={userId}
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      {/* Make Day Modal */}
      <MakeDayModal
        day={day}
        tripId={tripId}
        userId={userId}
        open={isMakeDayModalOpen}
        onClose={() => setIsMakeDayModalOpen(false)}
      />
    </div>
  );
}
