"use client";

import { useEffect, use, useState } from "react";
import { useRouter } from "next/navigation";
import { useTripStore } from "@/lib/store/tripStore";
import { Board } from "@/components/board/Board";

export default function TripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const trips = useTripStore((state) => state.trips);
  const setCurrentTrip = useTripStore((state) => state.setCurrentTrip);
  const [isHydrated, setIsHydrated] = useState(false);

  const { id } = use(params);
  const trip = trips[id];

  useEffect(() => {
    setIsHydrated(true);
    if (trip) {
      setCurrentTrip(trip.id);
    }
  }, [trip, setCurrentTrip]);

  useEffect(() => {
    // If trip doesn't exist after hydration, redirect to trips page
    if (isHydrated && !trip) {
      router.push("/trips");
    }
  }, [trip, router, isHydrated]);

  if (!isHydrated || !trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading trip...</p>
        </div>
      </div>
    );
  }

  return <Board trip={trip} />;
}
