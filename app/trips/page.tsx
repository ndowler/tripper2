"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Trip } from "@/lib/types";
import { useTripStore } from "@/lib/store/tripStore";
import { User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TripGrid } from "@/components/trips/TripGrid";
import { DeleteTripDialog } from "@/components/trips/DeleteTripDialog";
import { EmptyTripsState } from "@/components/trips/EmptyTripsState";
import { NewTripModal } from "@/components/trips/NewTripModal";
import { EditTripModal } from "@/components/trips/EditTripModal";
import { LoadingSpinner } from "@/components/ui/page-loading-spinner";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { cn } from "@/lib/utils";

export default function TripsPage() {
  const router = useRouter();
  const getAllTrips = useTripStore((state) => state.getAllTrips);
  const loadTrips = useTripStore((state) => state.loadTrips);
  const duplicateTrip = useTripStore((state) => state.duplicateTrip);

  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewTripModalOpen, setIsNewTripModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [deletingTrip, setDeletingTrip] = useState<Trip | null>(null);
  const isMobile = useIsMobile();

  // Check auth and load trips
  useEffect(() => {
    async function init() {
      try {
        const supabase = createClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
          router.push('/login');
          return;
        }

        setUserId(user.id);
        await loadTrips(user.id);
      } catch (error) {
        console.error('Failed to initialize:', error);
        toast.error('Failed to load trips');
      } finally {
        setIsLoading(false);
      }
    }

    init();
  }, [router, loadTrips]);

  const trips = getAllTrips();

  const handleDuplicate = (trip: Trip) => {
    duplicateTrip(trip.id);
    toast.success(`"${trip.title}" duplicated`);
  };

  if (isLoading) {
    return <LoadingSpinner loadingText="Loading your trips..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background z-10">
        <div className={cn(
          "container mx-auto",
          isMobile ? "px-3 py-3" : "px-4 py-4"
        )}>
          <div className="flex justify-center">
            <div className="flex items-center gap-3">
              <img src="/Trailblazer.png" alt="Trailblazer" className="h-8 w-8" />
              <h1 className={cn(
                "font-bold select-none",
                isMobile ? "text-xl" : "text-2xl"
              )}>
                My Adventures
              </h1>
            </div>
          </div>
          <div className="flex justify-center mt-3">
            <Link href="/profile">
              <Button variant="outline" className={cn(
                "gap-2",
                isMobile && "h-11 px-3"
              )}>
                <User className="h-5 w-5" />
                <span>My Profile</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className={cn(
        "container mx-auto",
        isMobile ? "px-3 py-4" : "px-4 py-8"
      )}>
        {trips.length === 0 ? (
          <EmptyTripsState onCreateTrip={() => setIsNewTripModalOpen(true)} />
        ) : (
          <TripGrid
            trips={trips}
            onEdit={(trip) => setEditingTrip(trip)}
            onDuplicate={handleDuplicate}
            onDelete={(trip) => setDeletingTrip(trip)}
            onCreateNew={() => setIsNewTripModalOpen(true)}
          />
        )}
      </main>

      {/* Modals */}
      {userId && (
        <>
          <NewTripModal
            open={isNewTripModalOpen}
            onOpenChange={setIsNewTripModalOpen}
            userId={userId}
          />

          <EditTripModal
            trip={editingTrip}
            open={!!editingTrip}
            onOpenChange={(open) => !open && setEditingTrip(null)}
            userId={userId}
          />

          <DeleteTripDialog
            trip={deletingTrip}
            open={!!deletingTrip}
            onOpenChange={(open) => !open && setDeletingTrip(null)}
            userId={userId}
          />
        </>
      )}
    </div>
  );
}
