/**
 * Cards Service - Supabase CRUD operations for cards
 */

import { createClient } from '@/lib/supabase/client'
import type { Card } from '@/lib/types'
import { nanoid } from 'nanoid'

/**
 * Helper: Convert time string (HH:MM) to full ISO timestamp using day date
 */
function timeStringToTimestamp(timeStr: string | undefined, dayDate: string): string | null {
  if (!timeStr || !dayDate) return null;
  
  try {
    // timeStr = "09:00", dayDate = "2024-11-01"
    const [hours, minutes] = timeStr.split(':').map(Number);
    
    // Create date object from day date
    const date = new Date(dayDate + 'T00:00:00.000Z');
    date.setUTCHours(hours, minutes, 0, 0);
    
    return date.toISOString();
  } catch (error) {
    console.warn('Failed to convert time string to timestamp:', error);
    return null;
  }
}

/**
 * Helper: Extract time string (HH:MM) from ISO timestamp
 */
function timestampToTimeString(timestamp: string | null): string | undefined {
  if (!timestamp) return undefined;
  
  try {
    const date = new Date(timestamp);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch (error) {
    console.warn('Failed to extract time from timestamp:', error);
    return undefined;
  }
}

/**
 * Create a new card
 */
export async function createCard(
  tripId: string,
  dayId: string | null,
  card: Omit<Card, 'createdAt' | 'updatedAt'>,
  order: number,
  userId?: string,
  dayDate?: string
): Promise<Card> {
  // If no userId, return local-only card (localStorage mode)
  if (!userId) {
    return {
      ...card,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Card
  }

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

  // Convert time strings to full timestamps if dayDate provided
  const startTimeTimestamp = dayDate 
    ? timeStringToTimestamp(card.startTime, dayDate)
    : null;
  const endTimeTimestamp = dayDate 
    ? timeStringToTimestamp(card.endTime, dayDate)
    : null;

  const { data: newCard, error } = await supabase
    .from('cards')
    .insert({
      id: card.id,
      trip_id: tripId,
      day_id: dayId,
      type: card.type,
      title: card.title,
      start_time: startTimeTimestamp,
      end_time: endTimeTimestamp,
      location: card.location ? JSON.stringify(card.location) : null,
      cost: card.cost ? JSON.stringify(card.cost) : null,
      status: card.status,
      tags: card.tags,
      links: card.links,
      notes: card.notes || null,
      order,
      created_at: now,
      updated_at: now,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating card:', {
      error,
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    })
    throw new Error(`Failed to create card: ${error.message || 'Unknown error'}`)
  }

  // Update trip's updated_at
  await supabase
    .from('trips')
    .update({ updated_at: now })
    .eq('id', tripId)

  return transformCardFromDb(newCard)
}

/**
 * Update a card
 */
export async function updateCard(
  cardId: string,
  updates: Partial<Omit<Card, 'id' | 'createdAt' | 'updatedAt'>>,
  userId?: string,
  dayDate?: string
): Promise<void> {
  // If no userId, skip Supabase update (localStorage-only mode)
  if (!userId) {
    return
  }

  const supabase = createClient()
  const now = new Date().toISOString()

  // Verify user owns the card (via trip)
  const { data: card } = await supabase
    .from('cards')
    .select('trip_id, day_id, days(date), trips!inner(user_id)')
    .eq('id', cardId)
    .single()

  if (!card || (card as any).trips.user_id !== userId) {
    throw new Error('Card not found or unauthorized')
  }

  // Get day date from card's day if not provided
  // Note: days will be null for unassigned cards (day_id = null)
  const effectiveDayDate = dayDate || (card as any).days?.date;

  const dbUpdates: any = { updated_at: now }
  
  if (updates.title !== undefined) dbUpdates.title = updates.title
  if (updates.type !== undefined) dbUpdates.type = updates.type
  
  // Convert time strings to timestamps if day date is available
  if (updates.startTime !== undefined) {
    dbUpdates.start_time = effectiveDayDate 
      ? timeStringToTimestamp(updates.startTime, effectiveDayDate)
      : (updates.startTime || null);
  }
  if (updates.endTime !== undefined) {
    dbUpdates.end_time = effectiveDayDate 
      ? timeStringToTimestamp(updates.endTime, effectiveDayDate)
      : (updates.endTime || null);
  }
  if (updates.location !== undefined) {
    dbUpdates.location = updates.location ? JSON.stringify(updates.location) : null
  }
  if (updates.cost !== undefined) {
    dbUpdates.cost = updates.cost ? JSON.stringify(updates.cost) : null
  }
  if (updates.status !== undefined) dbUpdates.status = updates.status
  if (updates.tags !== undefined) dbUpdates.tags = updates.tags
  if (updates.links !== undefined) dbUpdates.links = updates.links
  if (updates.notes !== undefined) dbUpdates.notes = updates.notes || null

  const { error } = await supabase
    .from('cards')
    .update(dbUpdates)
    .eq('id', cardId)

  if (error) {
    console.error('Error updating card:', error)
    throw new Error('Failed to update card')
  }

  // Update trip's updated_at
  await supabase
    .from('trips')
    .update({ updated_at: now })
    .eq('id', card.trip_id)
}

/**
 * Delete a card
 */
export async function deleteCard(cardId: string, userId?: string): Promise<void> {
  // If no userId, skip Supabase delete (localStorage-only mode)
  if (!userId) {
    return
  }
  const supabase = createClient()

  // Verify user owns the card (via trip)
  const { data: card } = await supabase
    .from('cards')
    .select('trip_id, trips!inner(user_id)')
    .eq('id', cardId)
    .single()

  if (!card || (card as any).trips.user_id !== userId) {
    throw new Error('Card not found or unauthorized')
  }

  const { error } = await supabase
    .from('cards')
    .delete()
    .eq('id', cardId)

  if (error) {
    console.error('Error deleting card:', error)
    throw new Error('Failed to delete card')
  }

  // Update trip's updated_at
  const now = new Date().toISOString()
  await supabase
    .from('trips')
    .update({ updated_at: now })
    .eq('id', card.trip_id)
}

/**
 * Move a card to a different day
 */
export async function moveCard(
  cardId: string,
  toDayId: string | null,
  newOrder: number,
  userId?: string
): Promise<void> {
  // If no userId, skip Supabase update (localStorage-only mode)
  if (!userId) {
    return
  }

  const supabase = createClient()
  const now = new Date().toISOString()

  // Verify user owns the card (via trip)
  const { data: card } = await supabase
    .from('cards')
    .select('trip_id, trips!inner(user_id)')
    .eq('id', cardId)
    .single()

  if (!card || (card as any).trips.user_id !== userId) {
    throw new Error('Card not found or unauthorized')
  }

  const { error } = await supabase
    .from('cards')
    .update({
      day_id: toDayId,
      order: newOrder,
      updated_at: now,
    })
    .eq('id', cardId)

  if (error) {
    console.error('Error moving card:', error)
    throw new Error('Failed to move card')
  }

  // Update trip's updated_at
  await supabase
    .from('trips')
    .update({ updated_at: now })
    .eq('id', card.trip_id)
}

/**
 * Reorder cards within a day
 */
export async function reorderCards(
  dayId: string | null,
  cardIds: string[],
  userId?: string
): Promise<void> {
  // If no userId, skip Supabase update (localStorage-only mode)
  if (!userId) {
    return
  }

  const supabase = createClient()

  // Verify user owns at least one card (they all belong to same trip)
  if (cardIds.length === 0) return

  const { data: card } = await supabase
    .from('cards')
    .select('trip_id, trips!inner(user_id)')
    .eq('id', cardIds[0])
    .single()

  if (!card || (card as any).trips.user_id !== userId) {
    throw new Error('Unauthorized')
  }

  // Update order for each card
  const updates = cardIds.map(async (cardId, index) => {
    return supabase
      .from('cards')
      .update({ order: index })
      .eq('id', cardId)
  })

  await Promise.all(updates)

  // Update trip's updated_at
  const now = new Date().toISOString()
  await supabase
    .from('trips')
    .update({ updated_at: now })
    .eq('id', card.trip_id)
}

/**
 * Duplicate a card
 */
export async function duplicateCard(
  cardId: string,
  userId?: string
): Promise<Card> {
  // If no userId, we cannot duplicate from DB (localStorage-only mode would handle this locally)
  if (!userId) {
    throw new Error('Cannot duplicate card without userId')
  }

  const supabase = createClient()

  // Fetch original card
  const { data: originalCard, error: fetchError } = await supabase
    .from('cards')
    .select('*, trips!inner(user_id)')
    .eq('id', cardId)
    .single()

  if (fetchError || !originalCard || (originalCard as any).trips.user_id !== userId) {
    throw new Error('Card not found or unauthorized')
  }

  const now = new Date().toISOString()
  const newCardId = nanoid()

  // Create duplicate
  const { data: newCard, error: createError } = await supabase
    .from('cards')
    .insert({
      id: newCardId,
      trip_id: originalCard.trip_id,
      day_id: originalCard.day_id,
      type: originalCard.type,
      title: `${originalCard.title} (copy)`,
      start_time: originalCard.start_time,
      end_time: originalCard.end_time,
      location: originalCard.location,
      cost: originalCard.cost,
      status: originalCard.status,
      tags: originalCard.tags,
      links: originalCard.links,
      notes: originalCard.notes,
      order: originalCard.order + 1,
      created_at: now,
      updated_at: now,
    })
    .select()
    .single()

  if (createError) {
    console.error('Error duplicating card:', createError)
    throw new Error('Failed to duplicate card')
  }

  // Update trip's updated_at
  await supabase
    .from('trips')
    .update({ updated_at: now })
    .eq('id', originalCard.trip_id)

  return transformCardFromDb(newCard)
}

/**
 * Transform database card format to app Card type
 */
function transformCardFromDb(dbCard: any): Card {
  return {
    id: dbCard.id,
    type: dbCard.type,
    title: dbCard.title,
    startTime: timestampToTimeString(dbCard.start_time),
    endTime: timestampToTimeString(dbCard.end_time),
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

