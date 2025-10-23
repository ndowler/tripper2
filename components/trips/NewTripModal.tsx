"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { format } from "date-fns";
import { useTripStore } from "@/lib/store/tripStore";
import { DEFAULT_TIMEZONE } from "@/lib/constants";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BasicInput } from "../basic/BasicInput";
import { BasicTextarea } from "../basic/BasicTextarea";

interface NewTripModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DEFAULT_START_DATE = () => format(new Date(), "yyyy-MM-dd");

export function NewTripModal({ open, onOpenChange }: NewTripModalProps) {
  const router = useRouter();
  const addTrip = useTripStore((state) => state.addTrip);
  const setCurrentTrip = useTripStore((state) => state.setCurrentTrip);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState(DEFAULT_START_DATE());

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDestination("");
    setStartDate(DEFAULT_START_DATE());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a trip title");
      return;
    }

    const tripId = nanoid();
    const dayId = nanoid();

    addTrip({
      id: tripId,
      title: title.trim(),
      description: description.trim() || undefined,
      destination: destination.trim()
        ? { city: destination.trim() }
        : undefined,
      timezone: DEFAULT_TIMEZONE,
      days: [
        {
          id: dayId,
          date: startDate,
          title: "Day 1",
          cards: [],
        },
      ],
      unassignedCards: [],
    });

    setCurrentTrip(tripId);
    toast.success("Trip created!");

    resetForm();
    onOpenChange(false);
    router.push(`/trip/${tripId}`);
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Trip</DialogTitle>
          <DialogDescription>
            Start planning your next adventure by creating a new trip
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <BasicInput
            id="title"
            label="Trip Title"
            value={title}
            onChange={(value) => setTitle(value)}
            placeholder="e.g., Summer in Italy"
            required
            autoFocus
          />
          <BasicTextarea
            id="description"
            label="Description"
            value={description}
            onChange={(value) => setDescription(value)}
            placeholder="e.g., 2-week adventure through Tuscany"
            rows={3}
          />

          <BasicInput
            id="destination"
            label="Destination"
            value={destination}
            onChange={(value) => setDestination(value)}
            placeholder="e.g., Rome, Italy"
          />

          <BasicInput
            id="startDate"
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(value) => setStartDate(value)}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">Create Trip</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
