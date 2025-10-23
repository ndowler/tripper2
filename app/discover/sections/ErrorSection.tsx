import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ErrorSectionProps {
  error: string | null;
  setStep: React.Dispatch<
    React.SetStateAction<"input" | "loading" | "results" | "error">
  >;
}

export function ErrorSection({ error, setStep }: ErrorSectionProps) {
  return (
    <div className="max-w-xl mx-auto">
      <Card className="p-8">
        <div className="text-center space-y-4">
          <div className="text-4xl">⚠️</div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
          <Button onClick={() => setStep("input")}>Try Again</Button>
        </div>
      </Card>
    </div>
  );
}
