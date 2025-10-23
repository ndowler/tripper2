interface DayStatsProps {
  cardsLength: number;
  totalDuration: number;
  totalCost: number;
  currencySymbol: string;
  formatDuration: (duration: number) => string;
}

export function DayStats({
  cardsLength,
  totalDuration,
  totalCost,
  currencySymbol,
  formatDuration,
}: DayStatsProps) {
  return (
    <div className="px-4 pb-4">
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {/* Activities Stat */}
        <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
            Activities
          </div>
          <div className="text-2xl font-bold text-foreground">
            {cardsLength}
          </div>
        </div>

        {/* Duration Stat */}
        <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10 transition-colors">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
            Duration
          </div>
          <div className="text-2xl font-bold text-foreground">
            {formatDuration(totalDuration)}
          </div>
        </div>

        {/* Cost Stat */}
        <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-green-500/5 border border-green-500/10 hover:bg-green-500/10 transition-colors max-w-[250px]">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
            Cost
          </div>
          <div className="text-2xl font-bold text-foreground">
            {currencySymbol}
            {totalCost}
          </div>
        </div>
      </div>
    </div>
  );
}
