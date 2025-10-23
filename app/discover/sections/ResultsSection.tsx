import { Button } from "@/components/ui/button";

interface ResultsSectionProps {
  destination: {
    city: string;
    state?: string;
    country?: string;
  };
  suggestions: string;
  setStep: React.Dispatch<
    React.SetStateAction<"input" | "loading" | "results" | "error">
  >;
}

export function ResultsSection({
  destination,
  suggestions,
  setStep,
}: ResultsSectionProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold">
          Things to Do — {destination.city}
          {destination.state && `, ${destination.state}`}
          {destination.country && `, ${destination.country}`}
        </h2>
        <p className="text-muted-foreground mt-1">{suggestions}</p>
      </div>
      <Button variant="outline" onClick={() => setStep("input")}>
        New Search
      </Button>
    </div>
  );
}
