"use client";

import { useState } from "react";
import type { InfoCard } from "@/lib/types";
import { Card as UICard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CARD_TYPES,
  getCardCategory,
  CATEGORY_COLORS,
  CURRENCY_SYMBOLS,
} from "@/lib/constants";
import { formatTimeDisplay } from "@/lib/utils/time";
import { useTripStore } from "@/lib/store/tripStore";
import { CardDetailModal } from "./CardDetailModal";
import { StatusDot } from "./StatusDot";
import { toast } from "sonner";
import {
  Clock,
  MapPin,
  Copy,
  Trash2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  GripVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TripCardProps {
  card: InfoCard;
  tripId: string;
  dayId: string;
  userId?: string; // Optional for demo/offline mode
  isDragging?: boolean;
  isMobile?: boolean; // Mobile detection flag
}

export function TripCard({
  card,
  tripId,
  dayId,
  userId,
  isDragging = false,
  isMobile = false,
}: TripCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const deleteCard = useTripStore((state) => state.deleteCard);
  const duplicateCard = useTripStore((state) => state.duplicateCard);
  const viewPrefs = useTripStore((state) => state.viewPrefs);

  const cardType = CARD_TYPES[card.type];
  const category = getCardCategory(card.type);
  const categoryBorderColor = CATEGORY_COLORS[category];

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this card?")) {
      try {
        await deleteCard(tripId, dayId, card.id, userId);
        toast.success("Card deleted");
      } catch (error) {
        console.error('Failed to delete card:', error);
        toast.error('Failed to delete card');
      }
    }
  };

  const handleDuplicate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await duplicateCard(tripId, dayId, card.id, userId);
      toast.success("Card duplicated");
    } catch (error) {
      console.error('Failed to duplicate card:', error);
      toast.error('Failed to duplicate card');
    }
  };

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  // Format currency with symbol
  const formatCurrency = (amount: number, currency: string) => {
    const symbol = CURRENCY_SYMBOLS[currency] || currency;
    return `${symbol}${amount}`;
  };

  // Format duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours && mins) return `${hours}h ${mins}m`;
    if (hours) return `${hours}h`;
    return `${mins}m`;
  };

  // Has expandable content?
  const hasExpandableContent =
    card.notes ||
    (card.tags && card.tags.length > 2) ||
    (card.links && card.links.length > 0);

  return (
    <>
      <UICard
        className={`
          group relative border-l-4 ${categoryBorderColor}
          hover:shadow-md transition-all cursor-pointer
          ${isDragging ? "shadow-lg" : "shadow-none"}
        `}
        onClick={handleCardClick}
      >
        <div className={cn(
          "space-y-2",
          isMobile ? "p-2.5" : "p-3" // Slightly reduced padding on mobile
        )}>
          {/* Header Row 1: Drag Handle • Title • Status • Actions */}
          <div className="flex items-start gap-2">
            <button
              className={cn(
                "cursor-grab active:cursor-grabbing touch-none p-0.5 transition-opacity",
                isMobile 
                  ? "opacity-100" // Always visible on mobile
                  : "opacity-0 group-hover:opacity-100" // Hover on desktop
              )}
              aria-label="Drag to reorder"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className={cn(
                "text-muted-foreground",
                isMobile ? "w-5 h-5" : "w-4 h-4" // Larger on mobile
              )} />
            </button>

            <span className="text-base leading-none mt-0.5">
              {cardType.icon}
            </span>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base leading-tight">
                {card.title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {/* Status Dot */}
              {card.status && (
                <StatusDot status={card.status} size="sm" showLabel={false} />
              )}

              {/* Actions */}
              <div className={cn(
                "transition-opacity flex",
                isMobile 
                  ? "opacity-100 gap-1" // Always visible on mobile with tighter spacing
                  : "opacity-0 group-hover:opacity-100 gap-0.5" // Hover on desktop
              )}>
                {hasExpandableContent && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      isMobile ? "h-9 w-9" : "h-6 w-6" // 36px on mobile (44px with padding)
                    )}
                    onClick={toggleExpand}
                    title={isExpanded ? "Collapse" : "Expand"}
                  >
                    {isExpanded ? (
                      <ChevronUp className={cn(isMobile ? "w-4 h-4" : "w-3 h-3")} />
                    ) : (
                      <ChevronDown className={cn(isMobile ? "w-4 h-4" : "w-3 h-3")} />
                    )}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    isMobile ? "h-9 w-9" : "h-6 w-6"
                  )}
                  onClick={handleDuplicate}
                  title="Duplicate"
                >
                  <Copy className={cn(isMobile ? "w-4 h-4" : "w-3 h-3")} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    isMobile ? "h-9 w-9" : "h-6 w-6"
                  )}
                  onClick={handleDelete}
                  title="Delete"
                >
                  <Trash2 className={cn(isMobile ? "w-4 h-4" : "w-3 h-3")} />
                </Button>
              </div>
            </div>
          </div>

          {/* Header Row 2: Time & Duration • Price */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              {/* Time */}
              {card.startTime && viewPrefs.showTimes && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>
                    {formatTimeDisplay(card.startTime, viewPrefs.timeFormat)}
                    {card.endTime &&
                      ` - ${formatTimeDisplay(
                        card.endTime,
                        viewPrefs.timeFormat
                      )}`}
                    {card.duration &&
                      !card.endTime &&
                      ` (${formatDuration(card.duration)})`}
                  </span>
                </div>
              )}
            </div>

            {/* Price (right-aligned) */}
            {card.cost && (
              <div className="font-medium">
                {formatCurrency(card.cost.amount, card.cost.currency)}
              </div>
            )}
          </div>

          {/* Row 3: Location with thumbnail */}
          {card.location && (
            <div className="flex items-center gap-2">
              {card.thumbnail && (
                <img
                  src={card.thumbnail}
                  alt={card.title}
                  className="w-6 h-6 rounded object-cover"
                />
              )}
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate text-sm">{card.location.name}</span>
            </div>
          )}

          {/* Compact tags (max 2) */}
          {card.tags && card.tags.length > 0 && !isExpanded && (
            <div className="flex flex-wrap gap-1">
              {card.tags.slice(0, 2).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs font-normal"
                >
                  {tag}
                </Badge>
              ))}
              {card.tags.length > 2 && (
                <Badge
                  variant="secondary"
                  className="text-xs font-normal cursor-pointer"
                  onClick={toggleExpand}
                >
                  +{card.tags.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Expanded details area */}
          {isExpanded && hasExpandableContent && (
            <div className="pt-2 border-t space-y-2">
              {/* All tags when expanded */}
              {card.tags && card.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {card.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs font-normal"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Notes */}
              {card.notes && (
                <p className="text-sm leading-relaxed">{card.notes}</p>
              )}

              {/* Links */}
              {card.links && card.links.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {card.links.map((link, i) => (
                    <a
                      key={i}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Link {i + 1}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </UICard>

      <CardDetailModal
        card={card}
        tripId={tripId}
        dayId={dayId}
        userId={userId}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isMobile={isMobile}
      />
    </>
  );
}
