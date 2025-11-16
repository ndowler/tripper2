/**
 * Application constants
 */

export const CARD_TYPES = {
  activity: {
    label: "Activity",
    icon: "🎯",
    color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  },
  meal: {
    label: "Meal",
    icon: "🍽️",
    color:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  },
  restaurant: {
    label: "Restaurant",
    icon: "🍴",
    color: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
  },
  transit: {
    label: "Transit",
    icon: "🚗",
    color: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300",
  },
  flight: {
    label: "Flight",
    icon: "✈️",
    color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300",
  },
  hotel: {
    label: "Hotel",
    icon: "🏨",
    color:
      "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
  },
  shopping: {
    label: "Shopping",
    icon: "🛍️",
    color: "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/40 dark:text-fuchsia-300",
  },
  entertainment: {
    label: "Entertainment",
    icon: "🎭",
    color:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
  },
  note: {
    label: "Note",
    icon: "📝",
    color: "bg-slate-100 text-slate-800 dark:bg-slate-900/40 dark:text-slate-300",
  },
} as const;

export const CARD_TEMPLATES = {
  activity: {
    title: "Visit...",
    duration: 120, // 2 hours
  },
  meal: {
    title: "Lunch at...",
    duration: 90, // 1.5 hours
  },
  restaurant: {
    title: "Dinner at...",
    duration: 120, // 2 hours
  },
  transit: {
    title: "Travel to...",
    duration: 60, // 1 hour
  },
  flight: {
    title: "Flight to...",
    duration: 180, // 3 hours
  },
  hotel: {
    title: "Check-in at...",
    duration: 30, // 30 minutes
  },
  shopping: {
    title: "Shopping at...",
    duration: 90, // 1.5 hours
  },
  entertainment: {
    title: "Show at...",
    duration: 150, // 2.5 hours
  },
  note: {
    title: "Remember to...",
  },
} as const;

export const KEYBOARD_SHORTCUTS = {
  ADD_CARD: "Enter",
  MOVE_UP: "ArrowUp",
  MOVE_DOWN: "ArrowDown",
  NUDGE_TIME_BACK: ",",
  NUDGE_TIME_FORWARD: ".",
  DELETE: "Backspace",
  DUPLICATE: "Mod+D",
  UNDO: "Mod+Z",
  REDO: "Mod+Shift+Z",
  COMMAND_PALETTE: "Mod+K",
} as const;

export const TIME_NUDGE_MINUTES = 15;

export const DEFAULT_TIMEZONE = "America/New_York";

// Card category groupings for visual styling
export const CARD_CATEGORIES: {
  transport: Array<keyof typeof CARD_TYPES>;
  food: Array<keyof typeof CARD_TYPES>;
  activity: Array<keyof typeof CARD_TYPES>;
  lodging: Array<keyof typeof CARD_TYPES>;
  note: Array<keyof typeof CARD_TYPES>;
} = {
  transport: ["transit", "flight"],
  food: ["meal", "restaurant"],
  activity: ["activity", "entertainment", "shopping"],
  lodging: ["hotel"],
  note: ["note"],
};

// Category border colors (4px left border)
export const CATEGORY_COLORS = {
  transport: "border-l-sky-400",
  food: "border-l-amber-400",
  activity: "border-l-emerald-400",
  lodging: "border-l-violet-400",
  note: "border-l-slate-300",
} as const;

// Get category for a card type
export function getCardCategory(
  cardType: string
): keyof typeof CATEGORY_COLORS {
  for (const [category, types] of Object.entries(CARD_CATEGORIES)) {
    if (types.includes(cardType as any)) {
      return category as keyof typeof CATEGORY_COLORS;
    }
  }
  return "note";
}

// Currency symbols
export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "$",
  GBP: "£",
  JPY: "¥",
  CAD: "$",
  AUD: "$",
  CHF: "Fr",
  CNY: "¥",
  INR: "₹",
};

// 8-point spacing system (in px)
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
} as const;

// Status indicators
export const STATUS_CONFIG = {
  todo: {
    label: "To Do",
    color: "bg-slate-400",
    textColor: "text-slate-700",
  },
  tentative: {
    label: "Tentative",
    color: "bg-amber-400",
    textColor: "text-amber-700",
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-emerald-400",
    textColor: "text-emerald-700",
  },
} as const;
