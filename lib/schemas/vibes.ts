import { z } from 'zod';

export const profilePreferencesSchema = z.object({
  home_airport: z.string().optional(),
  language_prefs: z.array(z.string()).default(['EN']),
  carry_on_only: z.boolean().default(false),
  loyalty_programs: z.array(z.string()).optional(),
});

export const comfortPreferencesSchema = z.object({
  pace_score: z.number().min(0).max(100).default(50),
  walking_steps_per_day: z.number().min(0).max(30).default(8),
  daypart_bias: z.enum(['early', 'balanced', 'late']).default('balanced'),
  rest_ratio: z.number().min(0).max(1).default(0.25),
});

export const tastePreferencesSchema = z.object({
  food_adventurousness: z.number().min(1).max(5).default(3),
  dietary_constraints: z.array(z.string()).default([]),
  theme_weights: z.record(z.string(), z.number().min(0).max(1)).default({}),
});

export const logisticsPreferencesSchema = z.object({
  transit_modes_allowed: z.array(z.string()).default(['metro', 'tram', 'train', 'rideshare']),
  crowd_tolerance: z.number().min(1).max(5).default(3),
  budget_ppd: z.number().min(0).default(100),
  surprise_level: z.union([z.literal(0), z.literal(1), z.literal(2)]).default(1),
});

export const accessibilityPreferencesSchema = z.object({
  wheelchair: z.boolean().default(false),
  low_steps: z.boolean().default(false),
  seating_frequency: z.boolean().default(false),
  motion_sickness: z.boolean().default(false),
  medical_notes: z.string().optional(),
});

export const fixedReservationSchema = z.object({
  dt: z.string(),
  name: z.string(),
  location: z.string().optional(),
});

export const hardConstraintsSchema = z.object({
  fixed_reservations: z.array(fixedReservationSchema).optional(),
  calendar_blocks: z.array(z.object({
    start: z.string(),
    end: z.string(),
  })).optional(),
  family_windows: z.string().optional(),
});

export const userVibesSchema = z.object({
  profile: profilePreferencesSchema,
  comfort: comfortPreferencesSchema,
  taste: tastePreferencesSchema,
  logistics: logisticsPreferencesSchema,
  access: accessibilityPreferencesSchema,
  vibe_packs: z.array(z.string()).default([]),
  trip_overrides: z.record(z.string(), z.any()).optional(),
  hard_constraints: hardConstraintsSchema.optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type UserVibesInput = z.infer<typeof userVibesSchema>;
