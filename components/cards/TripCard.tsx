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
  dragHandleListeners?: any; // Drag handle listeners from useSortable
}

export function TripCard({
  card,
  tripId,
  dayId,
  userId,
  isDragging = false,
  isMobile = false,
  dragHandleListeners,
}: TripCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const deleteCard = useTripStore((state) => state.deleteCard);
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
      <div
        className={cn(
          "group relative rounded-2xl cursor-pointer transition-all duration-300",
          "bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-gray-800/95",
          "border border-amber-400/20 shadow-lg shadow-black/50",
          "hover:shadow-xl hover:shadow-black/60 hover:-translate-y-1",
          "hover:border-amber-400/40",
          isDragging && "shadow-2xl shadow-black/70 scale-105"
        )}
        onClick={handleCardClick}
      >
        <div className={cn("p-4", isMobile && "p-3")}>
          {/* Top Row: Icon Badge & Price */}
          <div className="flex items-start justify-between mb-3">
            {/* Glowing Icon Badge */}
            <div className={cn(
              "relative w-10 h-10 rounded-full flex items-center justify-center",
              "bg-gradient-to-br from-pink-500/30 via-purple-500/30 to-violet-500/30",
              "border border-pink-400/30",
              "shadow-lg shadow-pink-500/20",
              "group-hover:shadow-pink-500/40 transition-shadow duration-300"
            )}>
              <span className="text-xl">{cardType.icon}</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-400/10 to-purple-400/10 blur-sm" />
            </div>

            {/* Price Pill */}
            {card.cost && (
              <div className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold",
                "bg-gradient-to-br from-amber-500/20 via-yellow-500/20 to-amber-500/20",
                "border border-amber-400/30 text-amber-100",
                "shadow-md shadow-amber-500/10",
                "group-hover:shadow-amber-500/30 transition-shadow duration-300"
              )}>
                {formatCurrency(card.cost.amount, card.cost.currency)}
              </div>
            )}
          </div>

          {/* Title Section with Drag Handle */}
          <div className="mb-3 relative">
            {/* Drag Handle - Absolute positioned on left */}
            <button
              {...dragHandleListeners}
              className={cn(
                "cursor-grab active:cursor-grabbing touch-none p-1.5 rounded-lg",
                "bg-gray-800/60 hover:bg-gray-700/80 transition-all duration-200",
                "absolute left-0 top-0",
                isMobile
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100"
              )}
              aria-label="Drag to reorder"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="w-4 h-4 text-gray-400" />
            </button>

            {/* Centered Title and Type */}
            <div className="text-center px-8">
              <h3 className="font-bold text-base text-white leading-tight mb-1.5 break-words">
                {card.title}
              </h3>
              <div className="text-[10px] uppercase tracking-widest text-gray-400">
                {cardType.label}
              </div>
            </div>
          </div>

          {/* Status Dot - Top Right Corner */}
          {card.status && (
            <div className="absolute top-4 right-4">
              <StatusDot status={card.status} size="sm" showLabel={false} />
            </div>
          )}

          {/* Bottom Row: Time Pill & Details Link */}
          <div className="flex items-center justify-between">
            {/* Time Pill */}
            {card.startTime && viewPrefs.showTimes ? (
              <div className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium",
                "border border-gray-600/50 text-gray-300",
                "flex items-center gap-1.5",
                "hover:border-gray-500/70 transition-colors duration-200"
              )}>
                <Clock className="w-3 h-3" />
                <span>{formatTimeDisplay(card.startTime, viewPrefs.timeFormat)}</span>
              </div>
            ) : (
              <div /> // Spacer
            )}

            {/* Details Link */}
            <button
              className="text-xs text-white/70 hover:text-white/90 transition-colors duration-200 flex items-center gap-1"
              onClick={handleCardClick}
            >
              <span>Details</span>
              <ChevronDown className="w-3 h-3 rotate-[-90deg]" />
            </button>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && hasExpandableContent && (
          <div className="px-4 pb-4 pt-0 border-t border-gray-700/50 mt-2">
            <div className="pt-3 space-y-2">
              {/* Tags */}
              {card.tags && card.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {card.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs font-normal bg-gray-800/50 border-gray-700/50 text-gray-300"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Notes */}
              {card.notes && (
                <p className="text-sm leading-relaxed text-gray-300">{card.notes}</p>
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
                      className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Link {i + 1}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

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
