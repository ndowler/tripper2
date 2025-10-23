"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, Clock, MoreVertical } from "lucide-react";
import { format, parseISO, differenceInDays } from "date-fns";
import type { Trip } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TripCardProps {
  trip: Trip;
  onEdit: (trip: Trip) => void;
  onDuplicate: (trip: Trip) => void;
  onDelete: (trip: Trip) => void;
}

export function TripCard({
  trip,
  onEdit,
  onDuplicate,
  onDelete,
}: TripCardProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate trip stats
  // const dayCount = trip.days.length;
  const totalCards =
    trip.days.reduce((sum, day) => sum + day.cards.length, 0) +
    (trip.unassignedCards?.length || 0);

  // Get date range
  const firstDay = trip.days[0]?.date;
  const lastDay = trip.days[trip.days.length - 1]?.date;
  let dateRangeText = "No dates set";

  if (isMounted) {
    if (firstDay && lastDay) {
      const start = parseISO(firstDay);
      const end = parseISO(lastDay);
      const duration = differenceInDays(end, start) + 1;
      dateRangeText = `${format(start, "MMM d")} - ${format(
        end,
        "MMM d, yyyy"
      )} • ${duration} day${duration !== 1 ? "s" : ""}`;
    } else if (firstDay) {
      dateRangeText = format(parseISO(firstDay), "MMM d, yyyy");
    }
  }

  // Format last updated
  const lastUpdated = isMounted ? format(trip.updatedAt, "MMM d, yyyy") : "";

  const handleCardClick = () => {
    // Don't navigate if clicking the menu
    if (isMenuOpen) return;
    router.push(`/trip/${trip.id}`);
  };

  const handleMenuAction = (action: () => void) => {
    setIsMenuOpen(false);
    action();
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
    >
      {/* Cover placeholder */}
      <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
        <span className="text-5xl opacity-30">✈️</span>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
            {trip.title}
          </h3>

          {/* Actions menu */}
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenuItem
                onClick={() =>
                  handleMenuAction(() => router.push(`/trip/${trip.id}`))
                }
              >
                Open Trip
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleMenuAction(() => onEdit(trip))}
              >
                Edit Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleMenuAction(() => onDuplicate(trip))}
              >
                Duplicate Trip
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleMenuAction(() => onDelete(trip))}
                className="text-destructive focus:text-destructive"
              >
                Delete Trip
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {trip.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {trip.description}
          </p>
        )}

        <div className="space-y-2">
          {trip.destination && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">
                {trip.destination.city && `City: ${trip.destination.city} `}
                {trip.destination.state && `State: ${trip.destination.state} `}
                {trip.destination.country &&
                  `Country: ${trip.destination.country}`}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="line-clamp-1">{dateRangeText}</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              {totalCards} {totalCards === 1 ? "activity" : "activities"}
            </span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{isMounted ? `Updated ${lastUpdated}` : "Updated"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
