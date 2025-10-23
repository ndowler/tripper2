import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import type { Trip } from "@/lib/types";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface DayNavHeaderProps {
  currentDayIndex: number;
  currentTrip: Trip;
  setCurrentDayIndex: React.Dispatch<React.SetStateAction<number>>;
  canGoPrev: boolean;
  canGoNext: boolean;
}

export function DayNavHeader({
  currentDayIndex,
  currentTrip,
  setCurrentDayIndex,
  canGoPrev,
  canGoNext,
}: DayNavHeaderProps) {
  const day = currentTrip.days[currentDayIndex];
  return (
    <div className="px-4 pb-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentDayIndex((prev) => Math.max(0, prev - 1))}
          disabled={!canGoPrev}
          className="flex-shrink-0"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div id="day-view-header" className="flex-1 text-center px-2">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              Day {currentDayIndex + 1} of {currentTrip.days.length}
            </span>
          </div>
          <h2 className="text-xl font-bold">{day.title}</h2>
          {day.date && (
            <p className="text-sm text-muted-foreground">
              {format(new Date(day.date), "EEEE, MMMM d, yyyy")}
            </p>
          )}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentDayIndex((prev) =>
              Math.min(currentTrip.days.length - 1, prev + 1)
            )
          }
          disabled={!canGoNext}
          className="flex-shrink-0"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
