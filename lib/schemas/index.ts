/**
 * Zod schemas for runtime validation
 */
import { z } from 'zod'

export const LocationSchema = z.object({
  name: z.string(),
  address: z.string().optional(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
})

export const CostSchema = z.object({
  amount: z.number(),
  currency: z.string(),
})

export const CardSchema = z.object({
  id: z.string(),
  type: z.enum(['activity', 'meal', 'restaurant', 'transit', 'flight', 'hotel', 'note', 'shopping', 'entertainment']),
  title: z.string().min(1, 'Title is required'),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  duration: z.number().optional(),
  location: LocationSchema.optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).default([]),
  cost: CostSchema.optional(),
  links: z.array(z.string()).default([]),
  status: z.enum(['pending', 'confirmed', 'completed', 'booked', 'tentative', 'todo']).default('pending'),
  thumbnail: z.string().optional(),  // Optional image URL for landmarks/hotels
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const DaySchema = z.object({
  id: z.string(),
  date: z.string(),  // ISO date
  title: z.string().optional(),
  cards: z.array(CardSchema).default([]),
})

export const TripSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Trip title is required'),
  description: z.string().optional(),
  timezone: z.string(),
  days: z.array(DaySchema).default([]),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const ViewPrefsSchema = z.object({
  grouping: z.enum(['day', 'city']).default('day'),
  timeFormat: z.union([z.literal(12), z.literal(24)]).default(12),
  showTimes: z.boolean().default(true),
  compactMode: z.boolean().default(false),
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  density: z.enum(['compact', 'comfortable']).default('comfortable'),
})

export type Card = z.infer<typeof CardSchema>
export type Day = z.infer<typeof DaySchema>
export type Trip = z.infer<typeof TripSchema>
export type ViewPrefs = z.infer<typeof ViewPrefsSchema>
export type Location = z.infer<typeof LocationSchema>
export type Cost = z.infer<typeof CostSchema>
