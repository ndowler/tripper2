/**
 * Slingshot AI trip generation types
 */

import type { UserVibes } from "./vibes";

export type BudgetLevel = "budget" | "moderate" | "comfortable" | "luxury";

export type TripPurpose =
  | "honeymoon"
  | "family_vacation"
  | "solo_adventure"
  | "business_leisure"
  | "friend_getaway"
  | "other";

export interface SlingshotRequest {
  destination: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  duration: number; // calculated from dates (number of days)
  budget: BudgetLevel;
  travelers: number;
  tripPurpose: TripPurpose;
  mustDos?: string; // free text
  existingPlans?: string; // free text
  vibes?: UserVibes;
}

export interface SlingshotMetadata {
  questionnaire: SlingshotRequest;
  generatedAt: string; // ISO timestamp
  explanation: string; // vibe explanation paragraph
}

export interface DayGenerationContext {
  dayNumber: number;
  totalDays: number;
  date: string;
  previousDays?: {
    activities: string[]; // card titles
    restaurants: string[]; // restaurant names
    locations: string[]; // unique locations visited
    totalActivityMinutes: number; // cumulative activity time
  };
  isFirstDay: boolean;
  isLastDay: boolean;
}

export interface GeneratedDayCard {
  type: string;
  title: string;
  description?: string;
  startTime?: string; // "HH:MM" format
  duration?: number; // minutes
  tags?: string[];
  location?: string;
  cost?: {
    amount: number;
    currency: string;
  };
}

export interface DayGenerationResult {
  dayNumber: number;
  cards: GeneratedDayCard[];
}

export interface SlingshotTripResponse {
  tripId: string;
  title: string;
  description: string;
  days: DayGenerationResult[];
  explanation: string;
}

