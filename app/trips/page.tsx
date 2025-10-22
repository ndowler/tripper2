"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import type { Trip } from "@/lib/types";
import { useTripStore } from "@/lib/store/tripStore";
import { PlusCircle, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TripGrid } from "@/components/trips/TripGrid";
import { DeleteTripDialog } from "@/components/trips/DeleteTripDialog";
import { EmptyTripsState } from "@/components/trips/EmptyTripsState";
import { NewTripModal } from "@/components/trips/NewTripModal";
import { EditTripModal } from "@/components/trips/EditTripModal";
import { ModeToggle } from "@/components/ui/theme-toggler";
import { CustomTooltip } from "@/components/ui/custom-tooltip";
import { LoadingSpinner } from "@/components/ui/page-loading-spinner";

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

  // Only render after hydration
  if (!isHydrated) return LoadingSpinner("Loading your trips...");

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
            <CustomTooltip content="Create a new trip" side="bottom">
              <Button
                onClick={() => setIsNewTripModalOpen(true)}
                className="gap-2"
              >
                <PlusCircle className="h-5 w-5" />
                New Trip
              </Button>
            </CustomTooltip>
            <CustomTooltip content="Discover more!" side="bottom">
              <Link href="/discover">
                <Button variant="outline" className="gap-2">
                  <Search className="h-5 w-5" />
                  <span className="hidden md:inline">Discover</span>
                </Button>
              </Link>
            </CustomTooltip>

            <CustomTooltip content="Theme" side="bottom">
              <ModeToggle />
            </CustomTooltip>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {trips.length === 0 ? (
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
