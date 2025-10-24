/**
 * Types for AI-generated travel suggestions (Vibe Planner)
 */

import { CardType, Daypart, Destination } from ".";
import { UserVibes } from "./vibes";

export type SuggestionCategory =
  | "food"
  | "culture"
  | "nature"
  | "shopping"
  | "wellness"
  | "nightlife"
  | "tour"
  | "coffee"
  | "kids"
  | "other";

export type PriceTier = 0 | 1 | 2 | 3; // 0=free, 1=budget, 2=mid, 3=premium

export interface SuggestionCard {
  id: string; // LLM generates stable IDs like "rom-001"
  title: string; // Max 60 chars
  description: string; // Max 160 chars
  category: SuggestionCategory;
  best_time: Daypart;
  price_tier: PriceTier;
  confidence: number; // 0-1 (model's self-score)
  est_duration_min: number; // 15-480 minutes
  tags: string[]; // Max 5 tags
  reasons?: string[]; // Max 3 short bullets explaining match
  subtitle?: string; // Neighborhood/area
  area?: string; // Neighborhood (e.g., "Trastevere")
  cost?: string | number;
  startTime?: string;
  endTime?: string;
  location?: string;
  duration?: number;
  type?: CardType;
  media?: {
    emoji?: string; // Single emoji for icon
  };
  booking?: {
    url?: string;
    requires?: ("ticket" | "reservation")[];
  };
}

export interface AiSuggestionContext {
  dayInfo: {
    title?: string;
    date?: string;
  } | null;
  existingCards: {
    title: string;
    type: string;
    startTime?: string;
    duration?: number;
    location?: { name?: string } | string | undefined;
  }[];
  otherDays: {
    title?: string;
    date?: string;
    cardCount: number;
    highlights: string[];
  }[];
}

export interface DiscoveryRequest {
  destination: Destination;
  vibes?: UserVibes; // UserVibes (optional for LLM)
  vibe_profile?: UserVibes; // UserVibes (optional for LLM)
  limit?: number; // Number of suggestions to generate
}

export interface DiscoveryResponse {
  suggestions: SuggestionCard[];
  model?: string;
  usage?: number;
}
