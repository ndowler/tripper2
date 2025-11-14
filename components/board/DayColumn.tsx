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
import { cn } from "@/lib/utils";

interface DayColumnProps {
  day: Day;
  tripId: string;
  userId?: string; // Optional for demo/offline mode
  index: number;
  isMobile?: boolean; // Mobile detection flag
}

export function DayColumn({ day, tripId, userId, index, isMobile = false }: DayColumnProps) {
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
    <div className={cn(
      "bg-glass backdrop-blur-glass rounded-xl border border-white/20 flex flex-col shadow-glass hover:shadow-glass-hover transition-all duration-300",
      isMobile
        ? "w-full min-h-[400px]" // Mobile: full width, minimum height
        : "h-full flex-shrink-0 day-column" // Desktop: fixed width
    )}>
      {/* Day header - Sticky */}
      <div className={cn(
        "sticky top-0 z-20 border-b border-white/20 bg-glass-light backdrop-blur-strong rounded-t-xl",
        isMobile ? "px-3 py-3" : "px-5 py-4" // Slightly increased padding
      )}>
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
                  className={cn(
                    isMobile ? "h-11 w-11" : "h-8 w-8" // Larger touch target on mobile
                  )}
                  aria-label="Day options"
                >
                  <MoreVertical className={cn(
                    isMobile ? "w-5 h-5" : "w-4 h-4"
                  )} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className={cn(
                isMobile && "min-w-[200px]" // Wider menu on mobile
              )}>
                <DropdownMenuItem 
                  onClick={() => setIsMakeDayModalOpen(true)}
                  className={cn(isMobile && "min-h-[44px] text-base")} // Larger touch targets
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Make My Day
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setIsEditModalOpen(true)}
                  className={cn(isMobile && "min-h-[44px] text-base")}
                >
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
          className={cn(
            "overflow-y-auto",
            isMobile 
              ? "p-3 space-y-2.5 max-h-[500px]" // Mobile: less padding, max height for scrolling
              : "p-4 space-y-3 max-h-[calc(100vh-12rem)]" // Desktop: original
          )}
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
                      isMobile={isMobile}
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
                      isMobile={isMobile}
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
                      isMobile={isMobile}
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
                      isMobile={isMobile}
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
                isMobile={isMobile}
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
