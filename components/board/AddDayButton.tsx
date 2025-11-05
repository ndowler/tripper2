"use client";

import { useState } from "react";
import { useTripStore } from "@/lib/store/tripStore";
import { nanoid } from "nanoid";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { format, addDays } from "date-fns";

interface AddDayButtonProps {
  tripId: string;
  userId?: string; // Optional for demo/offline mode
  activeDayId?: string | null;
}

export function AddDayButton({ tripId, userId }: AddDayButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
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
    <>
      {/* Full-width dashed card style */}
      <div className="h-full flex flex-col gap-3">
        <button
          onClick={handleAddDay}
          disabled={isAdding}
          className="w-full h-full min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg bg-transparent hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center hover:text-gray-900"
        >
          <div className="flex flex-col items-center gap-2">
            <Plus className="w-6 h-6" />
            <span className="text-base font-medium">Add Day</span>
          </div>
        </button>
      </div>
    </>
  );
}
