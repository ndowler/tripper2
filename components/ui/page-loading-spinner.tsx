import { Spinner } from "@/components/ui/spinner";

interface LoadingSpinnerProps {
  loadingText?: string;
}

export function LoadingSpinner({
  loadingText = "Loading your trips...",
}: LoadingSpinnerProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex items-center gap-2">
        <p className="text-muted-foreground select-none">{loadingText}</p>
        <Spinner className="size-8" />
      </div>
    </div>
  );
}
