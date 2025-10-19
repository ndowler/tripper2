"use client";

import { useState } from "react";
import { useTripStore } from "@/lib/store/tripStore";
import { nanoid } from "nanoid";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, Sparkles } from "lucide-react";
import { format, addDays } from "date-fns";
import { AiDayPlanner } from "./AiDayPlanner";

interface AddDayButtonProps {
  tripId: string;
  activeDayId?: string | null;
}

export function AddDayButton({ tripId, activeDayId }: AddDayButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [showAiPlanner, setShowAiPlanner] = useState(false);
  const addDay = useTripStore((state) => state.addDay);
  const trip = useTripStore((state) => state.trips[tripId]);

  const handleAddDay = () => {
    setIsAdding(true);

    // Calculate next day's date
    const lastDay = trip.days[trip.days.length - 1];
    const nextDate = lastDay ? addDays(new Date(lastDay.date), 1) : new Date();

    addDay(tripId, {
      id: nanoid(),
      date: format(nextDate, "yyyy-MM-dd"),
      title: `Day ${trip.days.length + 1}`,
    });

    toast.success("Day added");
    setTimeout(() => setIsAdding(false), 200);
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

        {/* AI Option - smaller secondary button */}
        <button
          onClick={() => setShowAiPlanner(true)}
          className="w-full py-3 border border-dashed border-purple-300 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all flex items-center justify-center gap-2 text-purple-700"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">AI Plan Day</span>
        </button>
      </div>

      {/* AI Day Planner Modal */}
      {showAiPlanner && (
        <AiDayPlanner
          dayId={activeDayId || undefined}
          tripId={tripId}
          onClose={() => setShowAiPlanner(false)}
          // onDayAdded={() => setShowAiPlanner(false)}
        />
      )}
    </>
  );
}
