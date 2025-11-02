/**
 * Days Service - Supabase CRUD operations for days
 */

import { createClient } from '@/lib/supabase/client'
import type { Day } from '@/lib/types'

/**
 * Create a new day
 */
export async function createDay(
  tripId: string,
  day: Omit<Day, 'cards'>,
  order: number,
  userId: string
): Promise<Day> {
  const supabase = createClient()
  const now = new Date().toISOString()

  // Verify user owns the trip
  const { data: trip } = await supabase
    .from('trips')
    .select('id')
    .eq('id', tripId)
    .eq('user_id', userId)
    .single()

  if (!trip) {
    throw new Error('Trip not found or unauthorized')
  }

  const { data: newDay, error } = await supabase
    .from('days')
    .insert({
      id: day.id,
      trip_id: tripId,
      name: day.title || `Day ${order + 1}`,
      date: day.date,
      order,
      created_at: now,
      updated_at: now,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating day:', error)
    throw new Error('Failed to create day')
  }

  // Update trip's updated_at
  await supabase
    .from('trips')
    .update({ updated_at: now })
    .eq('id', tripId)

  return {
    id: newDay.id,
    date: newDay.date,
    title: newDay.name,
    cards: [],
  }
}

/**
 * Update a day
 */
export async function updateDay(
  dayId: string,
  updates: Partial<Pick<Day, 'title' | 'date'>>,
  userId: string
): Promise<void> {
  const supabase = createClient()
  const now = new Date().toISOString()

  // Verify user owns the day (via trip)
  const { data: day } = await supabase
    .from('days')
    .select('trip_id, trips!inner(user_id)')
    .eq('id', dayId)
    .single()

  if (!day || (day as any).trips.user_id !== userId) {
    throw new Error('Day not found or unauthorized')
  }

  const dbUpdates: any = {}
  if (updates.title !== undefined) dbUpdates.name = updates.title
  if (updates.date !== undefined) dbUpdates.date = updates.date
  dbUpdates.updated_at = now

  const { error } = await supabase
    .from('days')
    .update(dbUpdates)
    .eq('id', dayId)

  if (error) {
    console.error('Error updating day:', error)
    throw new Error('Failed to update day')
  }

  // Update trip's updated_at
  await supabase
    .from('trips')
    .update({ updated_at: now })
    .eq('id', day.trip_id)
}

/**
 * Delete a day (cascade deletes cards)
 */
export async function deleteDay(dayId: string, userId: string): Promise<void> {
  const supabase = createClient()

  // Verify user owns the day (via trip)
  const { data: day } = await supabase
    .from('days')
    .select('trip_id, trips!inner(user_id)')
    .eq('id', dayId)
    .single()

  if (!day || (day as any).trips.user_id !== userId) {
    throw new Error('Day not found or unauthorized')
  }

  const { error } = await supabase
    .from('days')
    .delete()
    .eq('id', dayId)

  if (error) {
    console.error('Error deleting day:', error)
    throw new Error('Failed to delete day')
  }

  // Update trip's updated_at
  const now = new Date().toISOString()
  await supabase
    .from('trips')
    .update({ updated_at: now })
    .eq('id', day.trip_id)
}

/**
 * Reorder days
 */
export async function reorderDays(
  tripId: string,
  dayIds: string[],
  userId: string
): Promise<void> {
  const supabase = createClient()

  // Verify user owns the trip
  const { data: trip } = await supabase
    .from('trips')
    .select('id')
    .eq('id', tripId)
    .eq('user_id', userId)
    .single()

  if (!trip) {
    throw new Error('Trip not found or unauthorized')
  }

  // Update order for each day
  const updates = dayIds.map(async (dayId, index) => {
    return supabase
      .from('days')
      .update({ order: index })
      .eq('id', dayId)
      .eq('trip_id', tripId)
  })

  await Promise.all(updates)

  // Update trip's updated_at
  const now = new Date().toISOString()
  await supabase
    .from('trips')
    .update({ updated_at: now })
    .eq('id', tripId)
}

