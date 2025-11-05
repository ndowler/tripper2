"use client";

import { useState, useEffect } from "react";
import { useTripStore } from "@/lib/store/tripStore";
import { createDemoTrip } from "@/lib/seed-data";
import { CardDetailModal } from "@/components/cards/CardDetailModal";
import type { InfoCard } from "@/lib/types";
import { QuickAddDrawer } from "@/components/board/QuickAddDrawer";
import { SwapCardModal } from "@/components/cards/SwapCardModal";
import { LoadingSpinner } from "@/components/ui/page-loading-spinner";
import { BackNavbar } from "@/components/navbar/BackNavbar";
import { DayNavHeader } from "./components/Header";
import { DayStats } from "./components/DayStats";
import { TimelineStats } from "./components/TimelineStats";

export default function DayViewPage() {
  const setCurrentTrip = useTripStore((state) => state.setCurrentTrip);
  const currentTripId = useTripStore((state) => state.currentTripId);
  const currentTrip = useTripStore((state) => state.getCurrentTrip());
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [selectedCard, setSelectedCard] = useState<InfoCard | null>(null);
  const [swappingCard, setSwappingCard] = useState<InfoCard | null>(null);
  const [quickAddTimeSlot, setQuickAddTimeSlot] = useState<
    "morning" | "afternoon" | "evening" | null
  >(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // If no current trip, create demo trip
    if (!currentTripId || !currentTrip) {
      const demoTrip = createDemoTrip();
      // For demo page, directly set in store without auth
      useTripStore.setState((state) => {
        state.trips[demoTrip.id] = demoTrip;
        state.currentTripId = demoTrip.id;
      });
    }
  }, [currentTripId, currentTrip]);

  if (!currentTrip || !mounted) {
    return <LoadingSpinner loadingText="Loading your Day View..." />;
  }

  const day = currentTrip.days[currentDayIndex];
  const canGoPrev = currentDayIndex > 0;
  const canGoNext = currentDayIndex < currentTrip.days.length - 1;

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

  const groupedCards = {
    morning: day.cards.filter((c) => getTimeOfDay(c.startTime) === "morning"),
    afternoon: day.cards.filter(
      (c) => getTimeOfDay(c.startTime) === "afternoon"
    ),
    evening: day.cards.filter((c) => getTimeOfDay(c.startTime) === "evening"),
    unscheduled: day.cards.filter(
      (c) => getTimeOfDay(c.startTime) === "unscheduled"
    ),
  };

  // Calculate day stats
  const totalCost = day.cards.reduce(
    (sum, card) => sum + (card.cost?.amount || 0),
    0
  );
  const totalDuration = day.cards.reduce(
    (sum, card) => sum + (card.duration || 0),
    0
  );
  const primaryCurrency =
    day.cards.find((c) => c.cost)?.cost?.currency || "USD";
  const currencySymbol =
    primaryCurrency === "USD" ? "$" : primaryCurrency === "EUR" ? "$" : "£";

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours && mins) return `${hours}h ${mins}m`;
    if (hours) return `${hours}h`;
    return `${mins}m`;
  };

  const handleSwap = (card: InfoCard, e: React.MouseEvent) => {
    e.stopPropagation();
    setSwappingCard(card);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <BackNavbar trip={currentTrip} />
      <div className="sticky top-0 z-10 bg-background border-b">
        {/* Day Navigation */}
        <DayNavHeader
          currentDayIndex={currentDayIndex}
          currentTrip={currentTrip}
          setCurrentDayIndex={setCurrentDayIndex}
          canGoPrev={canGoPrev}
          canGoNext={canGoNext}
        />

        {/* Day Stats */}
        <DayStats
          cardsLength={day.cards.length}
          totalDuration={totalDuration}
          totalCost={totalCost}
          currencySymbol={currencySymbol}
          formatDuration={formatDuration}
        />
      </div>

      {/* Timeline Sections */}
      <TimelineStats
        cardsLength={day.cards.length}
        groupedCards={groupedCards}
        totalDuration={totalDuration}
        totalCost={totalCost}
        currencySymbol={currencySymbol}
        formatDuration={formatDuration}
        handleSwap={handleSwap}
        setQuickAddTimeSlot={setQuickAddTimeSlot}
        setSelectedCard={setSelectedCard}
      />

      {/* Card Detail Modal */}
      {selectedCard && (
        <CardDetailModal
          tripId={currentTrip.id}
          dayId={day.id}
          card={selectedCard}
          open={!!selectedCard}
          onClose={() => setSelectedCard(null)}
          userId="demo"
        />
      )}

      {/* Quick Add Drawer */}
      {quickAddTimeSlot && (
        <QuickAddDrawer
          isOpen={!!quickAddTimeSlot}
          onClose={() => setQuickAddTimeSlot(null)}
          timeSlot={quickAddTimeSlot}
          dayId={day.id}
          tripId={currentTrip.id}
          destination={typeof currentTrip.destination === 'string' ? currentTrip.destination : currentTrip.destination?.city || ''}
        />
      )}

      {/* Swap Card Modal */}
      {swappingCard && (
        <SwapCardModal
          card={swappingCard}
          isOpen={!!swappingCard}
          onClose={() => setSwappingCard(null)}
          tripId={currentTrip.id}
          dayId={day.id}
          destination={typeof currentTrip.destination === 'string' ? currentTrip.destination : currentTrip.destination?.city || ''}
        />
      )}
    </div>
  );
}
