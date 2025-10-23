import { z } from "zod";

const categories = [
  "food",
  "culture",
  "nature",
  "shopping",
  "wellness",
  "nightlife",
  "tour",
  "coffee",
  "kids",
  "other",
] as const;

const suggestionTypes = [
  "activity",
  "restaurant",
  "meal",
  "hotel",
  "transit",
  "entertainment",
  "shopping",
] as const;

const bestTimes = ["morning", "afternoon", "evening", "night", "any"] as const;

export const SuggestionCardSchema = z.object({
  id: z.string().min(6),
  destination: z.string().min(1), // Ensure the desired destination is specified
  title: z.string().max(60),
  subtitle: z.string().optional().nullable(), // changed here
  description: z.string().max(160),
  category: z.enum(categories),
  tags: z.array(z.string()).max(5),
  est_duration_min: z.number().int().min(15).max(480),
  best_time: z.enum(bestTimes),
  cost: z
    .object({
      amount: z.number().min(0),
      currency: z.string().max(3),
    })
    .optional()
    .nullable(),
  price_tier: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
  area: z.string().optional().nullable(),
  booking: z
    .object({
      url: z.string().optional().nullable(),
      requires: z
        .array(z.enum(["ticket", "reservation"]))
        .optional()
        .nullable(),
    })
    .optional()
    .nullable(),
  media: z
    .object({
      emoji: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
  confidence: z.number().min(0).max(1),
  reasons: z.array(z.string()).max(3).optional().nullable(),
});

export const SuggestionResponseSchema = z.object({
  suggestions: z.array(SuggestionCardSchema).min(5).max(20),
});

export const AISuggestionsSchema = z.object({
  type: z.enum(suggestionTypes),
  title: z.string().max(60),
  description: z.string().max(160),
  duration: z.number().int().min(15).max(480),
  tags: z.array(z.string()).max(5),
  location: z.string().optional().nullable(),
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .optional()
    .nullable(), // HH:MM 24-hour format
});

export const AISuggestionsResponseSchema = z.object({
  suggestions: z.array(AISuggestionsSchema).max(3),
});

export const SwapCardSchema = z.object({
  title: z.string().max(60),
  description: z.string().max(160),
  location: z
    .object({
      name: z.string().max(100),
      address: z.string().max(200).optional().nullable(),
    })
    .optional()
    .nullable(),
  duration: z.number().int().min(15).max(480).optional().nullable(),
  cost: z
    .object({
      amount: z.number().min(0),
      currency: z.string().max(3),
    })
    .optional()
    .nullable(),
  tags: z.array(z.string()).max(5).optional().nullable(),
  confidence: z.number().min(0).max(1),
  reasoning: z.string().max(300),
});

export const SwapCardResponseSchema = z.object({
  suggestions: z.array(SwapCardSchema).min(2).max(3),
});
