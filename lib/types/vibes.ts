// User Vibes & Preferences Types

export type DaypartBias = "early" | "balanced" | "late";
// export type SurpriseLevel = 0 | 1 | 2;

export interface ProfilePreferences {
  home_airport?: string;
  language_prefs: string[];
  carry_on_only: boolean;
  loyalty_programs?: string[];
}

export interface ComfortPreferences {
  pace_score: number; // 0-100: 0=slow, 100=intense
  walking_km_per_day: number; // e.g., 5 for 5km
  daypart_bias: DaypartBias;
  rest_ratio: number; // e.g., 0.33 = 1 rest hour per 3 activity hours
}

export interface TastePreferences {
  food_adventurousness: number; // 1-5: 1=familiar, 5=wild/experimental
  dietary_constraints: string[];
  theme_weights: Record<string, number>; // art: 0.6, history: 0.7, coffee: 1.0
}

export interface LogisticsPreferences {
  transit_modes_allowed: string[]; // metro, tram, train, bus, rideshare, taxi
  crowd_tolerance: number; // 1-5: 1=avoid lines, 5=big sights fine
  budget_ppd: number; // per person per day (excluding hotel)
  surprise_level: number; // 0=no surprises, 1=few twists, 2=surprise daily
}

export interface AccessibilityPreferences {
  wheelchair: boolean;
  low_steps: boolean;
  seating_frequency: boolean;
  motion_sickness: boolean;
  medical_notes?: string;
}

export interface FixedReservation {
  dt: string; // ISO datetime
  name: string;
  location?: string;
}

export interface HardConstraints {
  fixed_reservations?: FixedReservation[];
  calendar_blocks?: Array<{ start: string; end: string }>;
  family_windows?: string; // e.g., "Nap: 2-4pm daily"
}

export interface UserVibes {
  profile: ProfilePreferences;
  comfort: ComfortPreferences;
  taste: TastePreferences;
  logistics: LogisticsPreferences;
  access: AccessibilityPreferences;
  vibe_packs: string[]; // ["Foodie Quest", "Design & Coffee"]
  trip_overrides?: Record<string, Partial<UserVibes>>; // Per-trip adjustments by tripId
  hard_constraints?: HardConstraints;
  created_at?: string;
  updated_at?: string;
}

// Available vibe packs
export const VIBE_PACKS = {
  "Culture Crawl": {
    icon: "🏛️",
    description: "Museums, historic walks, early starts, timed tickets",
    themes: { history: 0.9, art: 0.8, museums: 1.0 },
    daypart: "early" as DaypartBias,
    pace: 65,
  },
  "Foodie Quest": {
    icon: "🍜",
    description: "Markets, tastings, chef tables, late dinners, café hops",
    themes: { food: 1.0, markets: 0.9, restaurants: 0.9, cafes: 0.8 },
    daypart: "late" as DaypartBias,
    pace: 55,
  },
  "Slow & Serene": {
    icon: "🧘",
    description: "Gardens, spas, scenic trams, long lunches, siesta time",
    themes: { nature: 0.9, wellness: 1.0, gardens: 0.8 },
    daypart: "balanced" as DaypartBias,
    pace: 30,
  },
  "Hidden Gems": {
    icon: "🧩",
    description: "Neighborhoods, indie shops, local recs, minimal lines",
    themes: { local: 1.0, shopping: 0.6, neighborhoods: 0.9 },
    daypart: "balanced" as DaypartBias,
    pace: 50,
  },
  "Luxe Leisure": {
    icon: "👑",
    description: "Top hotels, concierge dining, car transfers, fewer stops",
    themes: { luxury: 1.0, dining: 0.9 },
    daypart: "late" as DaypartBias,
    pace: 40,
  },
  "Nature & Views": {
    icon: "🌿",
    description: "Parks, overlooks, sunrise/sunset, light hikes",
    themes: { nature: 1.0, hiking: 0.7, views: 0.9 },
    daypart: "early" as DaypartBias,
    pace: 55,
  },
  "Night Owl": {
    icon: "🌙",
    description: "Bars, live music, late entries, brunch starts",
    themes: { nightlife: 1.0, music: 0.8, bars: 0.9 },
    daypart: "late" as DaypartBias,
    pace: 60,
  },
  "Family Flow": {
    icon: "👨‍👩‍👧‍👦",
    description:
      "Playground stops, short blocks, near-restrooms, stroller paths",
    themes: { family: 1.0, parks: 0.8 },
    daypart: "early" as DaypartBias,
    pace: 40,
  },
  "Design & Coffee": {
    icon: "☕",
    description: "Architecture trails, ateliers, café map, blue-hour photos",
    themes: { design: 1.0, architecture: 0.9, coffee: 1.0, photo: 0.8 },
    daypart: "balanced" as DaypartBias,
    pace: 50,
  },
  "Wine & Dine": {
    icon: "🍷",
    description: "Tastings, vineyards, long dinners, safe transport",
    themes: { wine: 1.0, food: 0.9, restaurants: 0.8 },
    daypart: "late" as DaypartBias,
    pace: 45,
  },
} as const;

export type VibePackName = keyof typeof VIBE_PACKS;

// Available themes for theme picker
export const AVAILABLE_THEMES = [
  { id: "history", label: "History", icon: "🏛️" },
  { id: "art", label: "Art/Design", icon: "🎨" },
  { id: "wine", label: "Wine/Bars", icon: "🍷" },
  { id: "food", label: "Street Food", icon: "🍜" },
  { id: "coffee", label: "Cafés", icon: "☕" },
  { id: "markets", label: "Markets", icon: "🛍️" },
  { id: "nature", label: "Nature", icon: "🌿" },
  { id: "wellness", label: "Wellness", icon: "🧖" },
  { id: "sports", label: "Sports", icon: "⚽" },
  { id: "shows", label: "Live Shows", icon: "🎭" },
  { id: "photo", label: "Iconic Shots", icon: "📷" },
  { id: "local", label: "Hidden Gems", icon: "🧩" },
] as const;

// Quiz questions responses
export type TripEnergyLevel =
  | "recharged"
  | "content"
  | "accomplished"
  | "epic"
  | "spent";
export type WalkingLevel =
  | "minimal"
  | "light"
  | "moderate"
  | "active"
  | "intense";
export type FoodMood = "familiar" | "regional" | "adventurous" | "experimental";
export type SpendStyle = "budget" | "moderate" | "comfortable" | "luxury";
export type CrowdTolerance = "avoid" | "some" | "fine";
export type TransitComfort =
  | "rides-only"
  | "metro-ok"
  | "trains-ok"
  | "buses-ok"
  | "all";
export type PhotoVibe =
  | "story-first"
  | "landmarks"
  | "colorful-streets"
  | "golden-hour";
