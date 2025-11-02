{
  /* Timeline Sections */
}
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InfoCard } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  CircleEllipsis,
  Clock,
  DollarSign,
  MapPin,
  Navigation,
  Plus,
  RefreshCw,
} from "lucide-react";

const formatTimeAMPM = (time: string): string => {
  const [hours, minutes] = time.split(":").map(Number);
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
};

const handleNavigate = (location: string, e: React.MouseEvent) => {
  e.stopPropagation();
  const destination = encodeURIComponent(location);
  window.open(
    `https://www.google.com/maps/dir/?api=1&destination=${destination}`,
    "_blank"
  );
};

const getCardIcon = (type: string): string => {
  const icons: Record<string, string> = {
    activity: "🎯",
    meal: "🍽️",
    restaurant: "🍴",
    transit: "🚗",
    flight: "✈️",
    hotel: "🏨",
    shopping: "🛍️",
    entertainment: "🎭",
    note: "📝",
  };
  return icons[type] || "📍";
};

const getCategoryColor = (type: string): string => {
  const colors: Record<string, string> = {
    activity: "border-l-green-500",
    meal: "border-l-orange-500",
    restaurant: "border-l-red-500",
    transit: "border-l-blue-500",
    flight: "border-l-sky-500",
    hotel: "border-l-purple-500",
    shopping: "border-l-pink-500",
    entertainment: "border-l-indigo-500",
    note: "border-l-gray-400",
  };
  return colors[type] || "border-l-gray-400";
};


interface CardItemProps {
  card: InfoCard;
  handleSwap: (card: InfoCard, e: React.MouseEvent) => void;
  formatDuration: (minutes: number) => string;
  currencySymbol: string;
  setSelectedCard: React.Dispatch<React.SetStateAction<InfoCard | null>>;
  showTime?: boolean;
}

const CardItem = ({
  card,
  handleSwap,
  formatDuration,
  currencySymbol,
  setSelectedCard,
  showTime = true,
}: CardItemProps) => (
  <Card
    className={cn(
      "group relative border-l-4 bg-card shadow-sm",
      "hover:shadow-md transition-all hover:bg-muted/50 cursor-pointer",
      getCategoryColor(card.type)
    )}
    onClick={() => setSelectedCard(card)}
  >
    <div className="p-3 flex flex-col h-full">
      {/* Header row with title and swap button */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <CardTitle className="font-semibold text-sm leading-tight flex-1 pr-2">
          {card.title}
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger className="relative hover:z-10 hover:cursor-pointer">
            <CircleEllipsis className="text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <Button
              onClick={(e) => handleSwap(card, e)}
              className="flex hover:bg-primary/10 transition-colors"
              title="Swap for similar"
            >
              <RefreshCw className="text-white h-4 w-4" />
              <span className="text-white">Swap for Similar</span>
            </Button>
            {card.location?.name && <DropdownMenuSeparator />}
            {card.location?.name && (
              <Button
                onClick={(e) =>
                  handleNavigate(
                    card.location!.name +
                      (card.location!.address
                        ? ", " + card.location!.address
                        : ""),
                    e
                  )
                }
                className="rounded hover:bg-primary/10 transition-colors"
                title="Navigate"
              >
                <Navigation className="text-white w-4 h-4" />
                <span className="text-white">Navigate</span>
              </Button>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main content row */}
      <CardContent className="flex items-start gap-2">
        <span className="text-xl flex-shrink-0 mt-0.5">
          {getCardIcon(card.type)}
        </span>
        <div className="flex-1 min-w-0">
          {showTime && card.startTime && (
            <div className="text-xs text-muted-foreground font-medium mb-1">
              {formatTimeAMPM(card.startTime)}
            </div>
          )}
          {card.location?.name && (
            <div className="flex items-center gap-1 text-xs mb-1">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{card.location.name}</span>
            </div>
          )}
        </div>
      </CardContent>

      {/* Meta info and actions row */}
      <div className="flex items-center gap-2 text-xs flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          {card.duration && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{formatDuration(card.duration)}</span>
            </div>
          )}
          {card.cost && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <DollarSign className="w-3 h-3" />
              <span>
                {currencySymbol}
                {card.cost.amount}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1"></div>
      </div>

      {/* Tags */}
      {card.tags.length > 0 && (
        <div className="flex gap-1 mt-2 flex-wrap">
          {card.tags.slice(0, 2).map((tag, idx) => (
            <span
              key={idx}
              className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  </Card>
);

interface TimelineStatsProps {
  cardsLength: number;
  groupedCards: {
    morning: InfoCard[];
    afternoon: InfoCard[];
    evening: InfoCard[];
    unscheduled: InfoCard[];
  };
  totalDuration: number;
  totalCost: number;
  currencySymbol: string;
  formatDuration: (minutes: number) => string;
  handleSwap: (card: InfoCard, e: React.MouseEvent) => void;
  setQuickAddTimeSlot: React.Dispatch<
    React.SetStateAction<"morning" | "afternoon" | "evening" | null>
  >;
  setSelectedCard: React.Dispatch<React.SetStateAction<InfoCard | null>>;
}

export function TimelineStats({
  cardsLength,
  groupedCards,
  currencySymbol,
  formatDuration,
  handleSwap,
  setQuickAddTimeSlot,
  setSelectedCard,
}: TimelineStatsProps) {
  const TimeSection = ({
    title,
    emoji,
    cards,
    timeSlot,
  }: {
    title: string;
    emoji: string;
    cards: InfoCard[];
    timeSlot: "morning" | "afternoon" | "evening";
  }) => {
    return (
      <div id="time-section-header" className="mb-6">
        <div className="flex items-center gap-2 mb-3 px-4">
          <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider select-none">
            <span className="text-2xl">{emoji}</span>
            {title}
          </div>
          <div className="flex-1 h-px bg-border"></div>
        </div>

        <div className="grid gap-3 px-4 sm:grid-cols-2">
          {cards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              handleSwap={handleSwap}
              formatDuration={formatDuration}
              currencySymbol={currencySymbol}
              setSelectedCard={setSelectedCard}
              showTime={true}
            />
          ))}
        </div>

        {/* Add button */}
        <div className="mt-4 px-4 flex justify-center">
          <Button
            onClick={() => setQuickAddTimeSlot(timeSlot)}
            className="w-full py-3 rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 group max-w-[320px]"
          >
            <Plus className="w-4 h-4 group-hover:text-primary transition-colors" />
            <span className="text-sm group-hover:text-primary transition-colors">
              Add activity
            </span>
          </Button>
        </div>
      </div>
    );
  };
  return (
    <div className="py-6">
      {cardsLength === 0 ? (
        <div className="text-center py-12 px-4">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-lg font-semibold mb-2">No activities yet</h3>
          <p className="text-sm text-muted-foreground">
            Add cards to this day to start planning
          </p>
        </div>
      ) : (
        <>
          <TimeSection
            title="Morning"
            emoji="🌅"
            cards={groupedCards.morning}
            timeSlot="morning"
          />
          <TimeSection
            title="Afternoon"
            emoji="☀️"
            cards={groupedCards.afternoon}
            timeSlot="afternoon"
          />
          <TimeSection
            title="Evening"
            emoji="🌆"
            cards={groupedCards.evening}
            timeSlot="evening"
          />
          {groupedCards.unscheduled.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3 px-4 select-none">
                <span className="text-2xl">📋</span>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Unscheduled
                </h3>
                <div className="flex-1 h-px bg-border"></div>
              </div>
              <div className="grid gap-3 px-4 sm:grid-cols-2">
                {groupedCards.unscheduled.map((card) => (
                  <CardItem
                    key={card.id}
                    card={card}
                    handleSwap={handleSwap}
                    formatDuration={formatDuration}
                    currencySymbol={currencySymbol}
                    setSelectedCard={setSelectedCard}
                    showTime={false}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
