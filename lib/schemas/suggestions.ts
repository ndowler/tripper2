import { z } from "zod";

export const SuggestionCardSchema = z.object({
  id: z.string().min(6),
  title: z.string().max(60),
  subtitle: z.string().optional().nullable(), // changed here
  description: z.string().max(160),
  category: z.enum([
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
  ]),
  tags: z.array(z.string()).max(5),
  est_duration_min: z.number().int().min(15).max(480),
  best_time: z.enum(["morning", "afternoon", "evening", "night", "any"]),
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
  confidence: z.number().min(0).max(1).default(0.8),
  reasons: z.array(z.string()).max(3).optional().nullable(),
});

export const SuggestionArraySchema = z
  .array(SuggestionCardSchema)
  .min(10)
  .max(20);

export const SuggestionResponseSchema = z.object({
  suggestions: SuggestionArraySchema,
});

export const AISuggestionsSchema = z.object({
  type: z.enum([
    "activity",
    "restaurant",
    "hotel",
    "transit",
    "entertainment",
    "shopping",
  ]),
  title: z.string().max(60),
  description: z.string().max(160),
  duration: z.number().int().min(15).max(480),
  tags: z.array(z.string()).max(5),
  location: z.string().optional().nullable(),
});

export const AISuggestionsArraySchema = z.array(AISuggestionsSchema).max(3);

export const AISuggestionsResponseSchema = z.object({
  suggestions: AISuggestionsArraySchema,
});
