"use client";

import { useState } from "react";
import { useTripStore } from "@/lib/store/tripStore";
import { nanoid } from "nanoid";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";

interface AddDayButtonProps {
  tripId: string;
  userId?: string; // Optional for demo/offline mode
  activeDayId?: string | null;
}

export function AddDayButton({ tripId, userId }: AddDayButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const addDay = useTripStore((state) => state.addDay);
  const trip = useTripStore((state) => state.trips[tripId]);

  const handleAddDay = async () => {
    setIsAdding(true);

    try {
      // Calculate next day's date - find the latest date across all days
      let nextDate: Date;

      if (trip.days.length === 0) {
        // No days yet, use today
        nextDate = new Date();
      } else {
        // Find the maximum date across all days (not just last by order)
        const latestDate = trip.days.reduce((max, day) => {
          const dayDate = new Date(day.date);
          return dayDate > max ? dayDate : max;
        }, new Date(trip.days[0].date));

        // Add one day to the latest date
        nextDate = addDays(latestDate, 1);
      }

      await addDay(tripId, {
        id: nanoid(),
        date: format(nextDate, "yyyy-MM-dd"),
        title: `Day ${trip.days.length + 1}`,
      }, userId);

      toast.success("Day added");
    } catch (error) {
      console.error('Failed to add day:', error);
      toast.error('Failed to add day');
    } finally {
      setTimeout(() => setIsAdding(false), 200);
    }
  };

  return (
    <div className="h-full flex flex-col gap-3">
      <button
        onClick={handleAddDay}
        disabled={isAdding}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "relative w-full h-full min-h-[200px] rounded-2xl transition-all duration-300",
          "bg-gradient-to-b from-background/50 to-background/80",
          "border border-transparent shadow-md",
          "flex items-center justify-center group",
          // Gradient border effect
          "before:absolute before:inset-0 before:rounded-2xl before:p-[1px]",
          "before:bg-gradient-to-r before:from-teal-500/30 before:via-violet-500/30 before:to-teal-500/30",
          "before:-z-10 before:transition-all before:duration-300",
          isHovered && "before:from-teal-500/60 before:via-violet-500/60 before:to-teal-500/60",
          isHovered && "shadow-lg",
          isAdding && "opacity-50 cursor-not-allowed"
        )}
        data-tour="add-day-button"
      >
        {/* Dashed border overlay */}
        <div className="absolute inset-[1px] rounded-2xl border-2 border-dashed border-teal-400/20 group-hover:border-teal-400/40 transition-colors" />

        <div className="flex flex-col items-center gap-3 relative z-10">
          <div className={cn(
            "relative flex items-center justify-center w-14 h-14 rounded-full",
            "bg-gradient-to-br from-teal-500/10 to-violet-500/10",
            "border border-teal-400/20",
            "transition-all duration-300",
            isHovered && "scale-110 border-teal-400/40 shadow-lg shadow-teal-500/20"
          )}>
            <Plus className={cn(
              "w-7 h-7 text-teal-400 transition-transform duration-300",
              isHovered && "rotate-90"
            )} />
          </div>
          <span className={cn(
            "text-base font-medium transition-colors",
            isHovered ? "text-teal-400" : "text-muted-foreground"
          )}>
            Add Day
          </span>
        </div>
      </button>
    </div>
  );
}
