"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, Clock, MoreVertical } from "lucide-react";
import { format, parseISO, differenceInDays } from "date-fns";
import type { Trip } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  getTripStatus,
  getStatusConfig,
  getTripGradient,
  getDaysUntilTrip,
  getDestinationEmoji,
} from "@/lib/utils/trips";

interface TripCardProps {
  trip: Trip;
  onEdit: (trip: Trip) => void;
  onDuplicate: (trip: Trip) => void;
  onDelete: (trip: Trip) => void;
  index?: number;
}

export function TripCard({
  trip,
  onEdit,
  onDuplicate,
  onDelete,
  index = 0,
}: TripCardProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate trip stats and status
  const status = getTripStatus(trip);
  const statusConfig = getStatusConfig(status);
  const gradient = getTripGradient(trip.title);
  const daysUntil = getDaysUntilTrip(trip);
  
  // Format destination for emoji
  const destinationString = trip.destination
    ? [trip.destination.city, trip.destination.state, trip.destination.country]
        .filter(Boolean)
        .join(", ")
    : undefined;
  const destinationEmoji = getDestinationEmoji(destinationString);

  const dayCount = trip.days.length;
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

  const handleCardClick = (e: React.MouseEvent) => {
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
      style={{
        animationDelay: `${index * 50}ms`,
      }}
      className={cn(
        "group relative bg-card border rounded-xl overflow-hidden cursor-pointer",
        "hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1",
        "transition-all duration-300 ease-out",
        "animate-in fade-in slide-in-from-bottom-4"
      )}
    >
      {/* Dynamic gradient cover */}
      <div className={cn(
        "relative h-40 bg-gradient-to-br",
        gradient,
        "flex items-center justify-center overflow-hidden"
      )}>
        {/* Overlay pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent)]" />
        
        {/* Destination emoji */}
        <span className="relative text-7xl filter drop-shadow-lg opacity-80 group-hover:scale-110 transition-transform duration-300">
          {destinationEmoji}
        </span>

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <Badge 
            variant="secondary" 
            className={cn(
              "border backdrop-blur-sm font-medium",
              statusConfig.className
            )}
          >
            {statusConfig.emoji} {statusConfig.label}
          </Badge>
        </div>

        {/* Days until badge (for upcoming trips) */}
        {status === 'upcoming' && daysUntil !== null && daysUntil > 0 && (
          <div className="absolute top-3 right-3">
            <Badge 
              variant="secondary" 
              className="border backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 font-semibold"
            >
              {daysUntil} {daysUntil === 1 ? 'day' : 'days'}
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-xl leading-tight group-hover:text-primary transition-colors line-clamp-2 flex-1">
            {trip.title}
          </h3>

          {/* Actions menu */}
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
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
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {trip.description}
          </p>
        )}

        <div className="space-y-3">
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
            <Calendar className="h-4 w-4 flex-shrink-0" />
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
