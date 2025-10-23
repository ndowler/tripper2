import { Sparkles } from "lucide-react";

export function DiscoverHeader() {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
        <Sparkles className="w-4 h-4" />
        <span className="text-sm font-medium select-none">AI Discovery</span>
      </div>
      <h1 className="text-4xl font-bold mb-2 select-none">
        Discover Things to Do
      </h1>
      <p className="text-muted-foreground text-lg select-none">
        Get personalized suggestions powered by AI
      </p>
    </div>
  );
}
