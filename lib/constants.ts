/**
 * Application constants
 */

export const CARD_TYPES = {
  activity: {
    label: "Activity",
    icon: "🎯",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  meal: {
    label: "Meal",
    icon: "🍽️",
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  },
  restaurant: {
    label: "Restaurant",
    icon: "🍴",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
  transit: {
    label: "Transit",
    icon: "🚗",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  flight: {
    label: "Flight",
    icon: "✈️",
    color: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200",
  },
  hotel: {
    label: "Hotel",
    icon: "🏨",
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  },
  shopping: {
    label: "Shopping",
    icon: "🛍️",
    color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  },
  entertainment: {
    label: "Entertainment",
    icon: "🎭",
    color:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  },
  note: {
    label: "Note",
    icon: "📝",
    color: "bg-gray-100 dark:bg-gray-900 dark:text-gray-200",
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
  transport: "border-l-blue-500",
  food: "border-l-orange-500",
  activity: "border-l-green-500",
  lodging: "border-l-purple-500",
  note: "border-l-gray-400",
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
    color: "bg-gray-400",
    textColor: "text-gray-700",
  },
  tentative: {
    label: "Tentative",
    color: "bg-amber-500",
    textColor: "text-amber-700",
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-green-500",
    textColor: "text-green-700",
  },
} as const;
