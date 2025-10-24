"use client";

import { useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";
import { toast } from "sonner";

import { useTripStore } from "@/lib/store/tripStore";
import { CARD_TEMPLATES } from "@/lib/constants";
import type { CardType } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Car,
  FileText,
  Hotel,
  MapPin,
  Plane,
  Plus,
  ShoppingBag,
  Sparkles,
  Ticket,
  Utensils,
} from "lucide-react";

import { AiCardSuggestion } from "./AiCardSuggestion";

interface CardComposerProps {
  tripId: string;
  dayId: string;
}

const CARD_TYPE_BUTTONS: Array<{
  type: CardType;
  icon: React.ReactNode;
  label: string;
}> = [
  { type: "activity", icon: <MapPin className="w-4 h-4" />, label: "Activity" },
  { type: "meal", icon: <Utensils className="w-4 h-4" />, label: "Meal" },
  {
    type: "restaurant",
    icon: <Utensils className="w-4 h-4" />,
    label: "Restaurant",
  },
  { type: "transit", icon: <Car className="w-4 h-4" />, label: "Transit" },
  { type: "flight", icon: <Plane className="w-4 h-4" />, label: "Flight" },
  { type: "hotel", icon: <Hotel className="w-4 h-4" />, label: "Hotel" },
  {
    type: "shopping",
    icon: <ShoppingBag className="w-4 h-4" />,
    label: "Shopping",
  },
  {
    type: "entertainment",
    icon: <Ticket className="w-4 h-4" />,
    label: "Entertainment",
  },
  { type: "note", icon: <FileText className="w-4 h-4" />, label: "Note" },
];

export function CardComposer({ tripId, dayId }: CardComposerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAi, setShowAi] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedType, setSelectedType] = useState<CardType>("activity");
  const inputRef = useRef<HTMLInputElement>(null);

  const addCard = useTripStore((state) => state.addCard);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    const template = CARD_TEMPLATES[selectedType];

    addCard(tripId, dayId, {
      id: nanoid(),
      type: selectedType,
      title: title.trim(),
      duration: "duration" in template ? template.duration : 60,
      tags: [],
      links: [],
      status: "pending",
    });

    toast.success("Card added");
    setTitle("");
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTitle("");
    setIsOpen(false);
  };

  if (!isOpen && !showAi) {
    return (
      <div className="flex gap-2">
        <Button
          variant="ghost"
          className="flex-1 justify-start text-muted-foreground hover:text-foreground"
          onClick={() => setIsOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add card
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => setShowAi(true)}
          title="AI Suggestions"
        >
          <Sparkles className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  if (showAi) {
    return (
      <AiCardSuggestion
        tripId={tripId}
        dayId={dayId}
        onClose={() => setShowAi(false)}
      />
    );
  }

  return (
    <div className="bg-card rounded-lg border p-3 space-y-2">
      {/* Type selector */}
      <div className="flex gap-1 flex-wrap">
        {CARD_TYPE_BUTTONS.map(({ type, icon, label }) => (
          <Button
            key={type}
            type="button"
            variant={selectedType === type ? "default" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setSelectedType(type)}
            title={label}
          >
            {icon}
          </Button>
        ))}
      </div>

      {/* Title input */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <Input
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={CARD_TEMPLATES[selectedType].title}
          className="text-sm"
        />

        <div className="flex gap-2">
          <Button type="submit" size="sm" className="flex-1">
            Add
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
