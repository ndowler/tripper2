import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Settings, Sparkles } from "lucide-react";
import { UserVibes } from "@/lib/types/vibes";

interface VibesPreviewSectionProps {
  hasVibes?: boolean;
  getVibesSummary: (vibes: UserVibes) => string;
  userVibes?: UserVibes | null;
}

function FilledVibesCard({ summary }: { summary: string }) {
  return (
    <div className="bg-secondary/50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-sm">Your Travel Style</h3>
        <Button variant="ghost" size="sm">
          <Link href="/preferences?from=/discover">
            <Settings className="w-4 h-4 mr-1" />
            Edit
          </Link>
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">{summary}</p>
    </div>
  );
}

function EmptyVibesCard() {
  return (
    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex flex-col justify-center w-full">
      <p className="text-sm text-amber-900 dark:text-amber-100 mb-4 select-none">
        Get better suggestions by completing your travel preferences!
      </p>
      <div className="flex flex-row items-center justify-center">
        <Link href="/vibes" passHref>
          <Button variant="outline" size="sm" asChild>
            <Sparkles className="w-4 h-4" />
            Take Vibes Quiz
          </Button>
        </Link>
      </div>
    </div>
  );
}

export function VibesPreviewSection({
  hasVibes,
  getVibesSummary,
  userVibes,
}: VibesPreviewSectionProps) {
  return hasVibes ? (
    <FilledVibesCard summary={getVibesSummary(userVibes!)} />
  ) : (
    <EmptyVibesCard />
  );
}
