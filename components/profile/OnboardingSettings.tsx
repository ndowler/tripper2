"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { checkOnboardingStatus, resetOnboarding } from "@/lib/services/onboarding-service";
import { toast } from "sonner";
import { CheckCircle2, PlayCircle, Calendar } from "lucide-react";
import { format } from "date-fns";

interface OnboardingSettingsProps {
  userId: string;
}

export function OnboardingSettings({ userId }: OnboardingSettingsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [completedAt, setCompletedAt] = useState<string | null>(null);
  const [isRestarting, setIsRestarting] = useState(false);

  useEffect(() => {
    loadStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loadStatus = async () => {
    try {
      const status = await checkOnboardingStatus(userId);
      setHasCompleted(status.hasCompleted);
      setCompletedAt(status.completedAt);
    } catch (error) {
      console.error("Failed to load onboarding status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestartTutorial = async () => {
    setIsRestarting(true);

    try {
      await resetOnboarding(userId);
      toast.success("Tutorial reset! Redirecting to trips...");
      
      // Redirect to trips page where they can create a new trip to start the tour
      setTimeout(() => {
        router.push("/trips");
      }, 1000);
    } catch (error) {
      console.error("Failed to reset onboarding:", error);
      toast.error("Failed to reset tutorial. Please try again.");
    } finally {
      setIsRestarting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Onboarding Tutorial</h2>
      
      <div className="space-y-4">
        {hasCompleted ? (
          <>
            <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-900 dark:text-green-100">
                  Tutorial Completed
                </p>
                {completedAt && (
                  <div className="flex items-center gap-2 mt-1 text-xs text-green-700 dark:text-green-300">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(completedAt), "MMM d, yyyy 'at' h:mm a")}
                  </div>
                )}
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              You've completed the interactive tutorial that introduces Triplio's features.
              Want to see it again? You can restart the tutorial anytime.
            </p>
          </>
        ) : (
          <>
            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <PlayCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Tutorial Not Started
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  The tutorial will automatically start when you create your first trip
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Our interactive tutorial walks you through all the key features of Triplio,
              including drag & drop, command palette, AI discover, and more.
            </p>
          </>
        )}

        <div className="pt-2">
          <Button
            variant="outline"
            onClick={handleRestartTutorial}
            disabled={isRestarting}
            className="w-full sm:w-auto"
          >
            <PlayCircle className="w-4 h-4 mr-2" />
            {isRestarting ? "Resetting..." : hasCompleted ? "Restart Tutorial" : "Start Tutorial Now"}
          </Button>
        </div>

        {hasCompleted && (
          <p className="text-xs text-muted-foreground">
            Note: Restarting will reset your tutorial progress. The tour will begin when you create a new trip.
          </p>
        )}
      </div>
    </div>
  );
}

