"use client";

import { useState, useEffect } from "react";
import { useTripStore } from "@/lib/store/tripStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Trip } from "@/lib/types";
import { BasicInput } from "../basic/BasicInput";
import { BasicTextarea } from "../basic/BasicTextarea";

interface EditTripModalProps {
  trip: Trip | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTripModal({
  trip,
  open,
  onOpenChange,
}: EditTripModalProps) {
  const updateTrip = useTripStore((state) => state.updateTrip);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [destination, setDestination] = useState("");

  useEffect(() => {
    if (trip) {
      setTitle(trip.title);
      setDescription(trip.description || "");
      setDestination(trip.destination?.city || "");
    }
  }, [trip]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!trip) return;

    if (!title.trim()) {
      toast.error("Please enter a trip title");
      return;
    }

    updateTrip(trip.id, {
      title: title.trim(),
      description: description.trim() || undefined,
      destination: destination.trim()
        ? { city: destination.trim() }
        : undefined,
    });

    toast.success("Trip updated!");
    onOpenChange(false);
  };

  const handleCancel = () => {
    if (trip) {
      setTitle(trip.title);
      setDescription(trip.description || "");
      setDestination(trip.destination?.city || "");
    }
    onOpenChange(false);
  };

  if (!trip) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Trip</DialogTitle>
          <DialogDescription>Update your trip details</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <BasicInput
            id="edit-title"
            label="Trip Title"
            value={title}
            onChange={(value) => setTitle(value)}
            placeholder="e.g., Summer in Italy"
            required
            autoFocus
          />
          <BasicTextarea
            id="edit-description"
            label="Description"
            value={description}
            onChange={(value) => setDescription(value)}
            placeholder="e.g., 2-week adventure through Tuscany"
            rows={3}
          />

          <BasicInput
            id="edit-destination"
            label="Destination"
            value={destination}
            onChange={(value) => setDestination(value)}
            placeholder="e.g., Rome, Italy"
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
