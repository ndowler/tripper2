"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useTripStore } from "@/lib/store/tripStore";
import { createDemoTrip } from "@/lib/seed-data";
import { Board } from "@/components/board/Board";
import { toast } from "sonner";

export default function DemoPage() {
  const router = useRouter();
  const addTrip = useTripStore((state) => state.addTrip);
  const setCurrentTrip = useTripStore((state) => state.setCurrentTrip);
  const loadPreferences = useTripStore((state) => state.loadPreferences);
  const currentTripId = useTripStore((state) => state.currentTripId);
  const currentTrip = useTripStore((state) => state.getCurrentTrip());
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check authentication and load preferences
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

        // Load user preferences (vibes)
        await loadPreferences(user.id);

        // Load or create demo trip if needed
        if (!currentTripId || !currentTrip) {
          const demoTrip = createDemoTrip();
          await addTrip(demoTrip, user.id);
          setCurrentTrip(demoTrip.id);
        }
      } catch (error) {
        console.error('Failed to initialize demo:', error);
        toast.error('Failed to load demo');
      } finally {
        setIsLoading(false);
      }
    }

    if (mounted) {
      init();
    }
  }, [mounted, router, currentTripId, currentTrip, addTrip, setCurrentTrip, loadPreferences]);

  if (!mounted || isLoading || !currentTrip || !userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading trip...</p>
        </div>
      </div>
    );
  }

  return <Board trip={currentTrip} userId={userId} />;
}
