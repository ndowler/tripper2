import { z } from "zod";

export const SuggestionCardSchema = z.object({
  id: z.string().min(6),
  title: z.string().max(60),
  subtitle: z.string().optional(),
  description: z.string().max(160),
  category: z.enum([
    "food","culture","nature","shopping","wellness",
    "nightlife","tour","coffee","kids","other"
  ]),
  tags: z.array(z.string()).max(5),
  est_duration_min: z.number().int().min(15).max(480),
  best_time: z.enum(["morning","afternoon","evening","night","any"]),
  price_tier: z.union([
    z.literal(0),z.literal(1),z.literal(2),z.literal(3)
  ]),
  area: z.string().optional(),
  booking: z.object({
    url: z.string().url().optional(),
    requires: z.array(z.enum(["ticket","reservation"])).optional()
  }).optional(),
  media: z.object({ 
    emoji: z.string().optional() 
  }).optional(),
  confidence: z.number().min(0).max(1),
  reasons: z.array(z.string()).max(3).optional()
});

export const SuggestionArraySchema = z.array(SuggestionCardSchema).min(10).max(20);

