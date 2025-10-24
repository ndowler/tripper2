"use client";

import { useState, useEffect } from "react";
import { useTripStore } from "@/lib/store/tripStore";
import type { Day } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldGroup,
  FieldSet,
  FieldDescription,
} from "@/components/ui/field";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Calendar } from "lucide-react";
import { DeleteDialog } from "./DeleteDialog";

interface DayEditModalProps {
  day: Day;
  tripId: string;
  open: boolean;
  onClose: () => void;
}

export function DayEditModal({
  day,
  tripId,
  open,
  onClose,
}: DayEditModalProps) {
  const [title, setTitle] = useState(day.title || "");
  const [date, setDate] = useState(day.date);

  const updateDay = useTripStore((state) => state.updateDay);
  const deleteDay = useTripStore((state) => state.deleteDay);
  const reorderDays = useTripStore((state) => state.reorderDays);
  const trip = useTripStore((state) => state.trips[tripId]);

  useEffect(() => {
    setTitle(day.title || "");
    setDate(day.date);
  }, [day]);

  const handleSave = () => {
    const dateChanged = date !== day.date;

    // Update day details
    updateDay(tripId, day.id, {
      title: title.trim() || undefined,
      date,
    });

    // If date changed, reorder days chronologically
    if (dateChanged && trip) {
      const currentIndex = trip.days.findIndex((d) => d.id === day.id);

      // Find correct position based on new date
      let newIndex = trip.days.findIndex((d, i) => {
        if (i === currentIndex) return false; // Skip the current day
        return new Date(d.id === day.id ? date : d.date) > new Date(date);
      });

      // If no day is later, put at end
      if (newIndex === -1) {
        newIndex = trip.days.length - 1;
      }

      // Reorder if position changed
      if (currentIndex !== newIndex) {
        reorderDays(tripId, currentIndex, newIndex);
        toast.success("Day updated and reordered");
      } else {
        toast.success("Day updated");
      }
    } else {
      toast.success("Day updated");
    }

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 justify-center select-none">
            <Calendar className="w-5 h-5" />
            Edit Day
          </DialogTitle>
        </DialogHeader>

        <FieldSet>
          {/* Title */}
          <FieldGroup>
            <Field>
              <FieldLabel className="text-sm font-medium">
                Title (optional)
              </FieldLabel>
              <FieldContent>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Arrival Day, Day in Rome"
                />
              </FieldContent>
            </Field>
            {/* Date */}
            <Field>
              <FieldLabel className="text-sm font-medium">Date</FieldLabel>
              <FieldContent>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </FieldContent>
              <FieldDescription className="text-xs text-muted-foreground select-none">
                💡 Days will automatically reorder chronologically when you
                change the date
              </FieldDescription>
              {/* Stats */}
              <div className="text-sm text-muted-foreground text-center">
                {day.cards.length} card{day.cards.length !== 1 ? "s" : ""} in
                this day
              </div>
            </Field>
          </FieldGroup>

          <FieldGroup className="flex justify-between sm:justify-between">
            <DeleteDialog
              trigger={<Button variant="destructive">Delete Day</Button>}
              description="Are you sure you want to delete this day and all its cards? This action cannot be undone."
              onConfirm={() => {
                deleteDay(tripId, day.id);
                toast.success("Day deleted");
                onClose();
              }}
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </FieldGroup>
        </FieldSet>
      </DialogContent>
    </Dialog>
  );
}
