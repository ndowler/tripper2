import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface LoadingSectionProps {
  destination: string;
  hasVibes: boolean;
  progress: number;
}

export function LoadingSection({
  destination,
  hasVibes,
  progress,
}: LoadingSectionProps) {
  return (
    <div className="max-w-xl mx-auto">
      <Card className="p-8">
        <CardContent className="text-center space-y-6">
          <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Generating your personalized suggestions...
            </h2>
            <p className="text-muted-foreground">
              Creating perfect picks for {destination}
              {hasVibes && " based on your travel style"}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">{progress}%</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
