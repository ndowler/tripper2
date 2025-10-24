"use client";

import { useState, useEffect } from "react";
import { type Day } from "@/lib/types";
import { SortableCard } from "@/components/cards/SortableCard";
import { CardComposer } from "@/components/cards/CardComposer";
import { DayEditModal } from "./DayEditModal";
import { AiDayPlanner } from "./AiDayPlanner";
import { format } from "date-fns";
import { Calendar, MoreVertical, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

interface DayColumnProps {
  day: Day;
  tripId: string;
  index: number;
}

export function DayColumn({ day, tripId, index }: DayColumnProps) {
  const [mounted, setMounted] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAiPlannerOpen, setIsAiPlannerOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    morning: true,
    afternoon: true,
    evening: true,
  });

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate totals
  // const totalTimeBlocked = day.cards.reduce((sum, card) => {
  //   return sum + (card.duration || 0);
  // }, 0);

  const totalSpend = day.cards.reduce((sum, card) => {
    return sum + (card.cost?.amount || 0);
  }, 0);

  // Format time blocked (e.g., "6h 30m")
  // const formatTimeBlocked = (minutes: number) => {
  //   if (minutes === 0) return "";
  //   const hours = Math.floor(minutes / 60);
  //   const mins = minutes % 60;
  //   if (hours && mins) return `${hours}h ${mins}m`;
  //   if (hours) return `${hours}h`;
  //   return `${mins}m`;
  // };

  // Get primary currency from first card with cost
  const primaryCurrency =
    day.cards.find((c) => c.cost)?.cost?.currency || "EUR";
  const currencySymbol =
    primaryCurrency === "EUR"
      ? "€"
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
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <Badge className="select-none">
                  {day.title || `Day ${index + 1}`}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-xs mt-0.5">
                <span className="select-none">
                  {mounted
                    ? format(new Date(day.date), "EEEE, MMM d")
                    : day.date}
                </span>
                {totalSpend > 0 && (
                  <>
                    <span className="select-none">•</span>
                    <Badge className="select-none">
                      {currencySymbol}
                      {totalSpend}
                    </Badge>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsAiPlannerOpen(true)}
              title="AI Day Planner"
              aria-label="AI Day Planner"
            >
              <Sparkles className="w-4 h-4" />
            </Button>
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
                <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
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
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            {day.cards.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground text-sm text-center">
                No plans yet
                <br />
                <span className="text-xs">Add your first card</span>
              </div>
            ) : hasScheduledCards ? (
              <>
                {/* Morning Section */}
                {cardsByTimeOfDay.morning.length > 0 && (
                  <Collapsible
                    open={expandedSections.morning}
                    onOpenChange={(open) =>
                      setExpandedSections((prev) => ({
                        ...prev,
                        morning: open,
                      }))
                    }
                  >
                    <div className="space-y-3">
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          className="flex items-center gap-2 w-full hover:opacity-80 transition-opacity"
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              expandedSections.morning ? "" : "-rotate-90"
                            }`}
                          />
                          <div className="text-xs font-medium uppercase tracking-wide">
                            Morning
                          </div>
                          <Badge variant="secondary" className="select-none">
                            {cardsByTimeOfDay.morning.length}
                          </Badge>
                          <Separator className="flex-1" />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-3">
                        {cardsByTimeOfDay.morning.map((card) => (
                          <SortableCard
                            key={card.id}
                            card={card}
                            tripId={tripId}
                            dayId={day.id}
                          />
                        ))}
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                )}

                {/* Afternoon Section */}
                {cardsByTimeOfDay.afternoon.length > 0 && (
                  <Collapsible
                    open={expandedSections.afternoon}
                    onOpenChange={(open) =>
                      setExpandedSections((prev) => ({
                        ...prev,
                        afternoon: open,
                      }))
                    }
                  >
                    <div className="space-y-3">
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          className="flex items-center gap-2 w-full hover:opacity-70 transition-opacity"
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              expandedSections.afternoon ? "" : "-rotate-90"
                            }`}
                          />
                          <div className="text-xs font-medium uppercase tracking-wide">
                            Afternoon
                          </div>
                          <Badge variant="secondary" className="select-none">
                            {cardsByTimeOfDay.afternoon.length}
                          </Badge>
                          <Separator className="flex-1" />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-3">
                        {cardsByTimeOfDay.afternoon.map((card) => (
                          <SortableCard
                            key={card.id}
                            card={card}
                            tripId={tripId}
                            dayId={day.id}
                          />
                        ))}
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                )}

                {/* Evening Section */}
                {cardsByTimeOfDay.evening.length > 0 && (
                  <Collapsible
                    open={expandedSections.evening}
                    onOpenChange={(open) =>
                      setExpandedSections((prev) => ({
                        ...prev,
                        evening: open,
                      }))
                    }
                  >
                    <div className="space-y-3">
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          className="flex items-center gap-2 w-full hover:opacity-70 transition-opacity bg-transparent"
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              expandedSections.evening ? "" : "-rotate-90"
                            }`}
                          />
                          <div className="text-xs font-medium uppercase tracking-wide">
                            Evening
                          </div>
                          <Badge variant="secondary" className="select-none">
                            {cardsByTimeOfDay.evening.length}
                          </Badge>
                          <Separator className="flex-1" />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-3">
                        {cardsByTimeOfDay.evening.map((card) => (
                          <SortableCard
                            key={card.id}
                            card={card}
                            tripId={tripId}
                            dayId={day.id}
                          />
                        ))}
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
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
                />
              ))
            )}

            {/* Add card composer */}
            <CardComposer tripId={tripId} dayId={day.id} />
          </div>
        </ScrollArea>
      </SortableContext>

      {/* Edit Modal */}
      <DayEditModal
        day={day}
        tripId={tripId}
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      {/* AI Day Planner Modal */}
      {mounted && (
        <AiDayPlanner
          isOpen={isAiPlannerOpen}
          onClose={() => setIsAiPlannerOpen(false)}
          tripId={tripId}
          dayId={day.id}
          destination={day.title}
        />
      )}
    </div>
  );
}
