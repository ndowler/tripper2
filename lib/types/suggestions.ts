/**
 * Types for AI-generated travel suggestions (Vibe Planner)
 */

import { CardType } from ".";

export type Daypart = "morning" | "afternoon" | "evening" | "night" | "any";

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
  subtitle?: string; // Neighborhood/area
  description: string; // Max 160 chars
  category: SuggestionCategory;
  tags: string[]; // Max 5 tags
  est_duration_min: number; // 15-480 minutes
  best_time: Daypart;
  price_tier: PriceTier;
  area?: string; // Neighborhood (e.g., "Trastevere")
  booking?: {
    url?: string;
    requires?: ("ticket" | "reservation")[];
  };
  media?: {
    emoji?: string; // Single emoji for icon
  };
  confidence: number; // 0-1 (model's self-score)
  reasons?: string[]; // Max 3 short bullets explaining match
}

export interface AISuggestion extends SuggestionCard {
  type: CardType;
  duration?: number;
  location?: string;
}

export interface DiscoveryRequest {
  destination: {
    city: string;
    state?: string;
    country?: string;
    start?: string; // ISO date
    end?: string; // ISO date
  };
  vibes?: any; // UserVibes (optional for LLM)
  vibe_profile?: any; // UserVibes (optional for LLM)
  limit?: number; // Number of suggestions to generate
}

export interface DiscoveryResponse {
  suggestions: SuggestionCard[];
  model?: string;
  usage?: any;
}
