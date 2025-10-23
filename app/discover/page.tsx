"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTripStore } from "@/lib/store/tripStore";
import { Button } from "@/components/ui/button";
import { BackNavbar } from "@/components/navbar/BackNavbar";
import { SuggestionGrid } from "@/components/vibes/SuggestionGrid";
import { SuggestionCard } from "@/lib/types/suggestions";
import { saveSuggestionsToTrip } from "@/lib/utils/suggestions";
import { hasCompletedVibes } from "@/lib/utils/vibes";
import { ArrowRight } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/page-loading-spinner";
import { InputSection } from "./sections/InputSection";
import { DiscoverHeader } from "./sections/DiscoverHeader";
import { LoadingSection } from "./sections/LoadingSection";
import { ErrorSection } from "./sections/ErrorSection";
import { ResultsSection } from "./sections/ResultsSection";
import { BulkActionsBar } from "./components/BulkActionsBar";

type PageStep = "input" | "loading" | "results" | "error";

export default function DiscoverPage() {
  const router = useRouter();
  const currentTripId = useTripStore((state) => state.currentTripId);
  const currentTrip = useTripStore((state) => state.getCurrentTrip());
  const userVibes = useTripStore((state) => state.userVibes);
  const addCard = useTripStore((state) => state.addCard);
  const [step, setStep] = useState<PageStep>("input");
  const [destination, setDestination] = useState({
    city: "",
    state: "",
    country: "",
    startDate: "",
    endDate: "",
  });
  const [suggestions, setSuggestions] = useState<SuggestionCard[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const hasVibes = hasCompletedVibes(userVibes);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleGenerate = async () => {
    if (!destination.city.trim()) {
      toast.error("Please enter a city name");
      return;
    }

    setStep("loading");
    setError(null);
    setProgress(0);

    // Fake progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 5;
      });
    }, 400);

    try {
      const response = await fetch("/api/vibe-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: {
            city: destination.city.trim(),
            state: destination.state.trim() || undefined,
            country: destination.country.trim() || undefined,
            start: destination.startDate || undefined,
            end: destination.endDate || undefined,
          },
          vibe_profile: userVibes,
        }),
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate suggestions");
      }

      const data = await response.json();
      setSuggestions(data.suggestions);

      // Pre-select all suggestions
      const allIds = new Set(
        data.suggestions.map((s: SuggestionCard) => s.id) as string[]
      );
      setSelectedIds(allIds);

      setStep("results");
      toast.success(
        `Generated ${data.suggestions.length} personalized suggestions!`
      );
    } catch (err: unknown) {
      clearInterval(progressInterval);
      const errorMessage =
        typeof err === "object" && err !== null && "message" in err
          ? String((err as { message?: unknown }).message)
          : "Something went wrong. Please try again.";
      setError(errorMessage);
      setStep("error");
      toast.error(errorMessage || "Failed to generate suggestions");
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    const allIds = new Set(suggestions.map((s) => s.id));
    setSelectedIds(allIds);
  };

  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleSaveSelected = () => {
    if (!currentTripId) {
      toast.error("No active trip. Please create a trip first.");
      return;
    }

    const selectedSuggestions = suggestions.filter((s) =>
      selectedIds.has(s.id)
    );

    if (selectedSuggestions.length === 0) {
      toast.error("Please select at least one suggestion");
      return;
    }

    saveSuggestionsToTrip(selectedSuggestions, currentTripId, addCard);

    toast.success(
      `Saved ${selectedSuggestions.length} suggestions to Things to Do!`
    );

    // Navigate to board after short delay
    setTimeout(() => {
      router.push("/demo");
    }, 1000);
  };

  const handleSaveSingle = (suggestion: SuggestionCard) => {
    if (!currentTripId) {
      toast.error("No active trip. Please create a trip first.");
      return;
    }

    saveSuggestionsToTrip([suggestion], currentTripId, addCard);
    toast.success("Saved to Things to Do!");
  };

  if (!isHydrated) {
    return <LoadingSpinner loadingText="Loading Discover page..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      <BackNavbar trip={currentTrip} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <DiscoverHeader />

        {/* Input Section */}
        {step === "input" && (
          <InputSection
            destination={destination}
            setDestination={setDestination}
            hasVibes={hasVibes}
            userVibes={userVibes}
            handleGenerate={handleGenerate}
          />
        )}

        {/* Loading Section */}
        {step === "loading" && (
          <LoadingSection
            destination={destination.city}
            hasVibes={hasVibes}
            progress={progress}
          />
        )}

        {/* Error Section */}
        {step === "error" && <ErrorSection error={error} setStep={setStep} />}

        {/* Results Section */}
        {step === "results" && (
          <div className="space-y-6">
            <ResultsSection
              destination={destination}
              suggestions={`${suggestions.length} suggestions • ${selectedIds.size} selected`}
              setStep={setStep}
            />
            {/* Bulk Actions Bar */}
            <BulkActionsBar
              selectedIds={selectedIds}
              suggestions={suggestions}
              handleDeselectAll={handleDeselectAll}
              handleSelectAll={handleSelectAll}
              handleSaveSelected={handleSaveSelected}
            />
            {/* Suggestion Grid */}
            <SuggestionGrid
              suggestions={suggestions}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onSave={handleSaveSingle}
            />
            {/* Bottom Actions */}
            {selectedIds.size > 0 && (
              <div className="flex justify-center pt-6 pb-12">
                <Button onClick={handleSaveSelected} size="lg">
                  Save {selectedIds.size} to Things to Do
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
