"use client";

import { useEffect, use, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useTripStore } from "@/lib/store/tripStore";
import { Board } from "@/components/board/Board";
import { LoadingSpinner } from "@/components/ui/page-loading-spinner";
import { fetchTrip } from "@/lib/services/trips-service";
import { toast } from "sonner";
import { SlingshotExplainOverlay } from "@/components/trips/SlingshotExplainOverlay";

export default function TripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const trips = useTripStore((state) => state.trips);
  const setCurrentTrip = useTripStore((state) => state.setCurrentTrip);
  const loadPreferences = useTripStore((state) => state.loadPreferences);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const isLoadingRef = useRef(false);

  const { id } = use(params);
  const trip = trips[id];

  useEffect(() => {
    async function init() {
      try {
        // Check authentication
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          router.push('/login');
          return;
        }

        setUserId(user.id);

        // Load user preferences (vibes) - non-blocking
        try {
          await loadPreferences(user.id);
        } catch (error) {
          console.error('Failed to load preferences:', error);
          // Don't block the page load for this
        }

        // If trip not in store, fetch it (with race condition prevention)
        if (!trips[id] && !isLoadingRef.current) {
          isLoadingRef.current = true;
          
          try {
            const fetchedTrip = await fetchTrip(id, user.id);
            
            if (!fetchedTrip) {
              setError('Trip not found');
              toast.error('Trip not found');
              setTimeout(() => router.push('/trips'), 2000);
              return;
            }

            // Add to store
            useTripStore.setState((state) => {
              state.trips[fetchedTrip.id] = fetchedTrip;
            });
          } finally {
            isLoadingRef.current = false;
          }
        }

        setCurrentTrip(id);
      } catch (err) {
        console.error('Failed to load trip:', err);
        setError('Failed to load trip');
        toast.error('Failed to load trip');
        isLoadingRef.current = false;
      } finally {
        setIsLoading(false);
      }
    }

    init();
  }, [id, trips, router, setCurrentTrip, loadPreferences]);

  if (isLoading) {
    return <LoadingSpinner loadingText="Loading your trip..." />;
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-2">{error || 'Trip not found'}</h2>
          <p className="text-muted-foreground mb-6">
            {error === 'Trip not found' 
              ? "This trip doesn't exist or you don't have access to it."
              : "Something went wrong loading your trip."}
          </p>
          <button
            onClick={() => router.push('/trips')}
            className="text-primary hover:underline"
          >
            ← Back to trips
          </button>
        </div>
      </div>
    );
  }

  if (!userId) {
    return null;
  }

  return (
    <>
      <Board trip={trip} userId={userId} />
      {trip.isSlingshotGenerated && trip.slingshotMetadata?.explanation && (
        <SlingshotExplainOverlay
          tripId={trip.id}
          explanation={trip.slingshotMetadata.explanation}
          onDismiss={() => setShowExplanation(false)}
        />
      )}
    </>
  );
}
