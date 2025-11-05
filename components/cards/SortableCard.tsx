"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TripCard } from "./TripCard";
import type { InfoCard } from "@/lib/types";

interface SortableCardProps {
  card: InfoCard;
  tripId: string;
  dayId: string;
  userId?: string; // Optional for demo/offline mode
  isMobile?: boolean; // Mobile detection flag
}

export function SortableCard({ card, tripId, dayId, userId, isMobile = false }: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: "card",
      card,
      dayId,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing touch-none"
    >
      <TripCard 
        card={card} 
        tripId={tripId} 
        dayId={dayId} 
        userId={userId}
        isMobile={isMobile}
      />
    </div>
  );
}
