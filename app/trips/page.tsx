"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Search } from "lucide-react";
import { useTripStore } from "@/lib/store/tripStore";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Trip } from "@/lib/types";
import Link from "next/link";
import { TripGrid } from "@/components/trips/TripGrid";
import { DeleteTripDialog } from "@/components/trips/DeleteTripDialog";
import { EmptyTripsState } from "@/components/trips/EmptyTripsState";
import { NewTripModal } from "@/components/trips/NewTripModal";
import { EditTripModal } from "@/components/trips/EditTripModal";
import { ModeToggle } from "@/components/ui/theme-toggler";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function TripsPage() {
  const getAllTrips = useTripStore((state) => state.getAllTrips);
  const duplicateTrip = useTripStore((state) => state.duplicateTrip);

  const trips = getAllTrips();

  const [isNewTripModalOpen, setIsNewTripModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [deletingTrip, setDeletingTrip] = useState<Trip | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleDuplicate = (trip: Trip) => {
    duplicateTrip(trip.id);
    toast.success(`"${trip.title}" duplicated`);
  };
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* <Link href="/">
              <Button variant="ghost" title="Home">
                Home
              </Button>
            </Link> */}
            <div>
              <h1 className="text-2xl font-bold select-none text-start">
                ✈️ My Trips
              </h1>
              {isHydrated && (
                <p className="text-sm text-muted-foreground mt-1 select-none text-start">
                  {trips.length} {trips.length === 1 ? "Trip" : "Trips"}
                </p>
              )}
            </div>
            <Button
              onClick={() => setIsNewTripModalOpen(true)}
              className="gap-2"
            >
              <PlusCircle className="h-5 w-5" />
              New Trip
            </Button>
            <Tooltip>
              <TooltipTrigger>
                <Link href="/discover">
                  <Button variant="outline" className="gap-2">
                    <Search className="h-5 w-5" />
                    <span className="hidden md:inline">Discover</span>
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom">Discover Trips</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <ModeToggle />
              </TooltipTrigger>
              <TooltipContent side="bottom">Theme</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isHydrated && trips.length === 0 ? (
          <EmptyTripsState onCreateTrip={() => setIsNewTripModalOpen(true)} />
        ) : (
          <TripGrid
            trips={trips}
            onEdit={(trip) => setEditingTrip(trip)}
            onDuplicate={handleDuplicate}
            onDelete={(trip) => setDeletingTrip(trip)}
          />
        )}
      </main>

      {/* Modals */}
      <NewTripModal
        open={isNewTripModalOpen}
        onOpenChange={setIsNewTripModalOpen}
      />

      <EditTripModal
        trip={editingTrip}
        open={!!editingTrip}
        onOpenChange={(open) => !open && setEditingTrip(null)}
      />

      <DeleteTripDialog
        trip={deletingTrip}
        open={!!deletingTrip}
        onOpenChange={(open) => !open && setDeletingTrip(null)}
      />
    </div>
  );
}
