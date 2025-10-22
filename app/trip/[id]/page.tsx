"use client";

import { useEffect, use, useState } from "react";
import { useRouter } from "next/navigation";
import { useTripStore } from "@/lib/store/tripStore";
import { Board } from "@/components/board/Board";
import { LoadingSpinner } from "@/components/ui/page-loading-spinner";

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
    return <LoadingSpinner loadingText="Loading your trip..." />;
  }

  return <Board trip={trip} />;
}
