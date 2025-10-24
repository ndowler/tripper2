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
import { type Trip, EditTripData } from "@/lib/types";
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

  const [formData, setFormData] = useState<EditTripData>({
    title: "",
    description: "",
    destination: { city: "" },
  });

  useEffect(() => {
    if (trip) {
      setFormData({
        title: trip.title,
        description: trip.description || "",
        destination: trip.destination || { city: "" },
      });
    }
  }, [trip]);

  const handleInputChange = (field: keyof EditTripData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!trip) return;

    if (!formData.title.trim()) {
      toast.error("Please enter a trip title");
      return;
    }

    updateTrip(trip.id, {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      destination: formData.destination.city.trim()
        ? { city: formData.destination.city.trim() }
        : undefined,
    });

    toast.success("Trip updated!");
    onOpenChange(false);
  };

  const handleCancel = () => {
    if (trip) {
      setFormData({
        title: trip.title,
        description: trip.description || "",
        destination: trip.destination || { city: "" },
      });
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
            value={formData.title}
            onChange={(value) => handleInputChange("title", value)}
            placeholder="e.g., Summer in Italy"
            required
            autoFocus
          />
          <BasicTextarea
            id="edit-description"
            label="Description"
            value={formData.description}
            onChange={(value) => handleInputChange("description", value)}
            placeholder="e.g., 2-week adventure through Tuscany"
            rows={3}
          />

          <BasicInput
            id="edit-destination"
            label="Destination"
            value={formData.destination.city}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                destination: { ...prev.destination, city: value },
              }))
            }
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
