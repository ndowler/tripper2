"use client";

import { useState, useEffect } from "react";
import { type Day } from "@/lib/types";
import { SortableCard } from "@/components/cards/SortableCard";
import { CardComposer } from "@/components/cards/CardComposer";
import { DayEditModal } from "./DayEditModal";
import { MakeDayModal } from "./MakeDayModal";
import { format } from "date-fns";
import { Calendar, MoreVertical, Wand2, Edit, X } from "lucide-react";
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
  isFullscreen?: boolean; // Is this day in fullscreen mode?
  onToggleFullscreen?: () => void; // Toggle fullscreen mode
  scrollMode?: "trip" | "day"; // Scroll mode for mobile
}

export function DayColumn({
  day,
  tripId,
  userId,
  index,
  isMobile = false,
  isFullscreen = false,
  onToggleFullscreen,
  scrollMode = "trip",
}: DayColumnProps) {
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
    <div
      className={cn(
        "rounded-2xl flex flex-col transition-all duration-300",
        "bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-gray-800/95",
        "border border-amber-400/20 shadow-lg shadow-black/50",
        "hover:shadow-xl hover:shadow-black/60 hover:border-amber-400/30",
        isMobile
          ? scrollMode === "day"
            ? "w-full h-[70vh] max-h-[70vh]" // Day scroll mode: fixed height, scrollable
            : "w-full min-h-[400px]" // Trip scroll mode: natural height
          : "w-full min-h-[500px] max-h-[calc(100vh-8rem)]", // Desktop: responsive width via grid, constrained height
        isFullscreen && "!h-[calc(100vh-10rem)] !max-h-[calc(100vh-10rem)]" // Fullscreen: fill available height
      )}
    >
      {/* Day header - Sticky */}
      <div
        className={cn(
          "sticky top-0 z-20 rounded-t-2xl",
          "border-b border-amber-400/20",
          "bg-gradient-to-r from-gray-900/98 via-gray-800/98 to-gray-900/98",
          "backdrop-blur-xl",
          isMobile ? "px-3 py-3" : "px-5 py-4" // Slightly increased padding
        )}
        onDoubleClick={() => onToggleFullscreen?.()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div className={cn(
                  "relative w-8 h-8 rounded-full flex items-center justify-center",
                  "bg-gradient-to-br from-pink-500/30 via-purple-500/30 to-violet-500/30",
                  "border border-pink-400/30",
                  "shadow-lg shadow-pink-500/20"
                )}>
                  <Calendar className="w-4 h-4 text-pink-200" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-400/10 to-purple-400/10 blur-sm" />
                </div>
                <h2 className="font-bold text-base text-white">
                  {day.title || `Day ${index + 1}`}
                </h2>
                {isFullscreen && (
                  <span className="text-xs text-gray-400">
                    (Double-click to exit)
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-400 mt-1 ml-10">
                <span>
                  {mounted
                    ? format(new Date(day.date), "EEEE, MMM d")
                    : day.date}
                </span>
                {totalSpend > 0 && (
                  <>
                    <span>•</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-semibold",
                      "bg-gradient-to-br from-amber-500/20 via-yellow-500/20 to-amber-500/20",
                      "border border-amber-400/30 text-amber-100",
                      "shadow-md shadow-amber-500/10"
                    )}>
                      {currencySymbol}
                      {totalSpend}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {isFullscreen && (
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  isMobile ? "h-11 w-11" : "h-8 w-8",
                  "hover:bg-gray-800/60 text-gray-300 hover:text-white"
                )}
                onClick={() => onToggleFullscreen?.()}
                aria-label="Exit fullscreen"
              >
                <X className={cn(isMobile ? "w-5 h-5" : "w-4 h-4")} />
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    isMobile ? "h-11 w-11" : "h-8 w-8",
                    "hover:bg-gray-800/60 text-gray-300 hover:text-white"
                  )}
                  aria-label="Day options"
                >
                  <MoreVertical
                    className={cn(isMobile ? "w-5 h-5" : "w-4 h-4")}
                  />
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
            isMobile
              ? scrollMode === "day"
                ? "overflow-y-auto p-3 space-y-2.5 flex-1" // Day scroll mode: scrollable, fills available space
                : "overflow-y-visible p-3 space-y-2.5" // Trip scroll mode: no scroll, natural height
              : "overflow-y-auto p-4 space-y-3 max-h-[calc(100vh-12rem)]" // Desktop: original
          )}
        >
          {day.cards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 text-sm text-center gap-1">
              <span>No plans yet</span>
              <span className="text-xs text-gray-500">Add your first card</span>
            </div>
          ) : hasScheduledCards ? (
            <>
              {/* Morning Section */}
              {cardsByTimeOfDay.morning.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="text-xs font-semibold uppercase tracking-widest text-amber-400/90">
                      Morning
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-amber-400/40 to-transparent" />
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
                    <div className="text-xs font-semibold uppercase tracking-widest text-amber-400/90">
                      Afternoon
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-amber-400/40 to-transparent" />
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
                    <div className="text-xs font-semibold uppercase tracking-widest text-amber-400/90">
                      Evening
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-amber-400/40 to-transparent" />
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
