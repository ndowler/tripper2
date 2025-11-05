/**
 * Trips Service - Supabase CRUD operations for trips
 */

import { createClient } from '@/lib/supabase/client'
import type { Trip, Day, Card } from '@/lib/types'
import { nanoid } from 'nanoid'

/**
 * Fetch all trips for a user
 */
export async function fetchTrips(userId: string): Promise<Trip[]> {
  const supabase = createClient()

  // Fetch trips with related days and cards (both assigned and unassigned)
  const { data: trips, error } = await supabase
    .from('trips')
    .select(`
      *,
      days:days(
        *,
        cards:cards!cards_day_id_fkey(*)
      ),
      unassigned_cards:cards!cards_trip_id_fkey(*)
    `)
    .eq('user_id', userId)
    .is('unassigned_cards.day_id', null)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching trips:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    })
    throw new Error(`Failed to fetch trips: ${error.message}`)
  }

  // Transform database format to app format
  return trips.map(trip => transformTripFromDb(trip))
}

/**
 * Fetch a single trip by ID
 */
export async function fetchTrip(tripId: string, userId: string): Promise<Trip | null> {
  const supabase = createClient()

  const { data: trip, error } = await supabase
    .from('trips')
    .select(`
      *,
      days:days(
        *,
        cards:cards!cards_day_id_fkey(*)
      ),
      unassigned_cards:cards!cards_trip_id_fkey(*)
    `)
    .eq('id', tripId)
    .eq('user_id', userId)
    .is('unassigned_cards.day_id', null)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    console.error('Error fetching trip:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    })
    throw new Error(`Failed to fetch trip: ${error.message}`)
  }

  return transformTripFromDb(trip)
}

/**
 * Create a new trip
 */
export async function createTrip(trip: Omit<Trip, 'createdAt' | 'updatedAt'>, userId?: string): Promise<Trip> {
  const now = new Date().toISOString()
  
  // If no userId, return trip for localStorage-only mode (demo/offline)
  if (!userId) {
    return {
      ...trip,
      createdAt: new Date(now),
      updatedAt: new Date(now),
    }
  }
  
  const supabase = createClient()
  
  // Verify authentication
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    throw new Error('User not authenticated')
  }
  
  if (session.user.id !== userId) {
    throw new Error('User ID mismatch')
  }

  // Insert trip
  const { data: newTrip, error: tripError } = await supabase
    .from('trips')
    .insert({
      id: trip.id,
      user_id: userId,
      title: trip.title,
      description: trip.description || null,
      destination: trip.destination || null,
      start_date: trip.days[0]?.date || null,
      end_date: trip.days[trip.days.length - 1]?.date || null,
      created_at: now,
      updated_at: now,
    })
    .select()
    .single()

  if (tripError) {
    console.error('Error creating trip:', {
      message: tripError.message,
      details: tripError.details,
      hint: tripError.hint,
      code: tripError.code,
    })
    throw new Error(`Failed to create trip: ${tripError.message}`)
  }

  // Insert days
  if (trip.days.length > 0) {
    const daysToInsert = trip.days.map((day, index) => ({
      id: day.id,
      trip_id: trip.id,
      name: day.title || `Day ${index + 1}`,
      date: day.date,
      order: index,
      created_at: now,
      updated_at: now,
    }))

    const { error: daysError } = await supabase
      .from('days')
      .insert(daysToInsert)

    if (daysError) {
      console.error('Error creating days:', {
        message: daysError.message,
        details: daysError.details,
        hint: daysError.hint,
        code: daysError.code,
      })
      // Rollback trip creation
      await supabase.from('trips').delete().eq('id', trip.id)
      throw new Error(`Failed to create trip days: ${daysError.message}`)
    }

    // Insert cards for each day
    for (const day of trip.days) {
      if (day.cards.length > 0) {
        const cardsToInsert = day.cards.map((card, index) => ({
          id: card.id,
          trip_id: trip.id,
          day_id: day.id,
          type: card.type,
          title: card.title,
          start_time: card.startTime || null,
          end_time: card.endTime || null,
          location: card.location ? JSON.stringify(card.location) : null,
          cost: card.cost ? JSON.stringify(card.cost) : null,
          status: card.status,
          tags: card.tags,
          links: card.links,
          notes: card.notes || null,
          order: index,
          created_at: now,
          updated_at: now,
        }))

        const { error: cardsError } = await supabase
          .from('cards')
          .insert(cardsToInsert)

        if (cardsError) {
          console.error('Error creating cards:', {
            message: cardsError.message,
            details: cardsError.details,
            hint: cardsError.hint,
            code: cardsError.code,
          })
        }
      }
    }
  }

  // Insert unassigned cards
  if (trip.unassignedCards && trip.unassignedCards.length > 0) {
    const unassignedToInsert = trip.unassignedCards.map((card, index) => ({
      id: card.id,
      trip_id: trip.id,
      day_id: null,
      type: card.type,
      title: card.title,
      start_time: card.startTime || null,
      end_time: card.endTime || null,
      location: card.location ? JSON.stringify(card.location) : null,
      cost: card.cost ? JSON.stringify(card.cost) : null,
      status: card.status,
      tags: card.tags,
      links: card.links,
      notes: card.notes || null,
      order: index,
      created_at: now,
      updated_at: now,
    }))

    const { error: unassignedError } = await supabase
      .from('cards')
      .insert(unassignedToInsert)

    if (unassignedError) {
      console.error('Error creating unassigned cards:', {
        message: unassignedError.message,
        details: unassignedError.details,
        hint: unassignedError.hint,
        code: unassignedError.code,
      })
    }
  }

  // Fetch the complete trip
  return fetchTrip(trip.id, userId) as Promise<Trip>
}

/**
 * Update a trip
 */
export async function updateTrip(
  tripId: string, 
  updates: Partial<Pick<Trip, 'title' | 'description' | 'destination'>>,
  userId?: string
): Promise<Trip> {
  // If no userId, return null for localStorage-only mode (handled by store)
  if (!userId) {
    throw new Error('Cannot update trip without userId in Supabase mode')
  }
  
  const supabase = createClient()

  const { error } = await supabase
    .from('trips')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', tripId)
    .eq('user_id', userId)

  if (error) {
    console.error('Error updating trip:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    })
    throw new Error(`Failed to update trip: ${error.message}`)
  }

  return fetchTrip(tripId, userId) as Promise<Trip>
}

/**
 * Delete a trip (cascade deletes days and cards)
 */
export async function deleteTrip(tripId: string, userId?: string): Promise<void> {
  // If no userId, skip Supabase delete (localStorage-only mode)
  if (!userId) {
    return
  }
  
  const supabase = createClient()

  const { error } = await supabase
    .from('trips')
    .delete()
    .eq('id', tripId)
    .eq('user_id', userId)

  if (error) {
    console.error('Error deleting trip:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    })
    throw new Error(`Failed to delete trip: ${error.message}`)
  }
}

/**
 * Duplicate a trip
 */
export async function duplicateTrip(tripId: string, userId?: string): Promise<Trip> {
  // For localStorage-only mode, this will be handled by the store
  // Since fetchTrip requires userId, this function requires it too
  if (!userId) {
    throw new Error('Cannot duplicate trip without userId')
  }
  
  const supabase = createClient()

  // Fetch original trip
  const originalTrip = await fetchTrip(tripId, userId)
  if (!originalTrip) {
    throw new Error('Trip not found')
  }

  const now = new Date().toISOString()
  const newTripId = nanoid()

  // Create new trip with duplicated data
  const newTrip: Omit<Trip, 'createdAt' | 'updatedAt'> = {
    id: newTripId,
    title: `${originalTrip.title} (copy)`,
    description: originalTrip.description,
    destination: originalTrip.destination,
    timezone: originalTrip.timezone,
    days: originalTrip.days.map(day => ({
      id: nanoid(),
      date: day.date,
      title: day.title,
      cards: day.cards.map(card => ({
        ...card,
        id: nanoid(),
      })),
    })),
    unassignedCards: originalTrip.unassignedCards.map(card => ({
      ...card,
      id: nanoid(),
    })),
  }

  return createTrip(newTrip, userId)
}

/**
 * Transform database trip format to app Trip type
 */
function transformTripFromDb(dbTrip: any): Trip {
  // Sort days by order
  const sortedDays = (dbTrip.days || []).sort((a: any, b: any) => a.order - b.order)

  return {
    id: dbTrip.id,
    title: dbTrip.title,
    description: dbTrip.description || undefined,
    destination: dbTrip.destination || undefined,
    timezone: dbTrip.timezone || 'UTC',
    travelers: dbTrip.travelers || undefined,
    currency: dbTrip.currency || undefined,
    days: sortedDays.map((day: any) => {
      // Sort cards by order
      const assignedCards = (day.cards || [])
        .filter((card: any) => card.day_id === day.id)
        .sort((a: any, b: any) => a.order - b.order)

      return {
        id: day.id,
        date: day.date,
        title: day.name,
        cards: assignedCards.map((card: any) => transformCardFromDb(card)),
      }
    }),
    unassignedCards: (dbTrip.unassigned_cards || [])
      .sort((a: any, b: any) => a.order - b.order)
      .map((card: any) => transformCardFromDb(card)),
    createdAt: new Date(dbTrip.created_at),
    updatedAt: new Date(dbTrip.updated_at),
  }
}

/**
 * Transform database card format to app Card type
 */
function transformCardFromDb(dbCard: any): Card {
  return {
    id: dbCard.id,
    type: dbCard.type,
    title: dbCard.title,
    startTime: dbCard.start_time || undefined,
    endTime: dbCard.end_time || undefined,
    duration: dbCard.duration || undefined,
    location: dbCard.location ? JSON.parse(dbCard.location) : undefined,
    cost: dbCard.cost ? JSON.parse(dbCard.cost) : undefined,
    status: dbCard.status,
    tags: dbCard.tags || [],
    links: dbCard.links || [],
    notes: dbCard.notes || undefined,
    thumbnail: dbCard.thumbnail || undefined,
    createdAt: new Date(dbCard.created_at),
    updatedAt: new Date(dbCard.updated_at),
  }
}

