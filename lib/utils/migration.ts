import { createClient } from '@/lib/supabase/client'
import { Trip } from '@/lib/types'
import { toast } from 'sonner'

interface MigrationResult {
  success: boolean
  tripsCreated: number
  daysCreated: number
  cardsCreated: number
  errors: string[]
}

/**
 * Migrate trips from localStorage to Supabase
 * This runs once when a user first logs in with existing local data
 */
export async function migrateLocalStorageToSupabase(userId: string): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: false,
    tripsCreated: 0,
    daysCreated: 0,
    cardsCreated: 0,
    errors: [],
  }

  try {
    // Get data from localStorage
    const storedData = localStorage.getItem('trailblazer-store')
    if (!storedData) {
      result.success = true // No data to migrate
      return result
    }

    const parsedData = JSON.parse(storedData)
    const trips = parsedData.state?.trips || {}

    if (Object.keys(trips).length === 0) {
      result.success = true // No trips to migrate
      return result
    }

    const supabase = createClient()

    // Migrate each trip
    for (const tripId of Object.keys(trips)) {
      const trip: Trip = trips[tripId]

      try {
        // Insert trip
      const { error: tripError } = await supabase
        .from('trips')
        .insert({
          id: trip.id,
          user_id: userId,
          title: trip.title,
          description: trip.description,
          destination: trip.destination,
          start_date: trip.days[0]?.date || null,
          end_date: trip.days[trip.days.length - 1]?.date || null,
          travelers: 1, // Default value
          currency: 'USD', // Default value
          created_at: trip.createdAt,
          updated_at: trip.updatedAt,
        })

        if (tripError) {
          result.errors.push(`Trip ${trip.title}: ${tripError.message}`)
          continue
        }

        result.tripsCreated++

        // Migrate days
        for (const day of trip.days) {
          const { error: dayError } = await supabase
            .from('days')
            .insert({
              id: day.id,
              trip_id: trip.id,
              name: day.title || `Day ${trip.days.indexOf(day) + 1}`,
              date: day.date,
              order: trip.days.indexOf(day),
            })

          if (dayError) {
            result.errors.push(`Day ${day.title || 'Unnamed Day'}: ${dayError.message}`)
            continue
          }

          result.daysCreated++

          // Migrate cards in this day
          for (const card of day.cards) {
            const { error: cardError } = await supabase
              .from('cards')
              .insert({
                id: card.id,
                trip_id: trip.id,
                day_id: day.id,
                type: card.type,
                title: card.title,
                start_time: card.startTime,
                end_time: card.endTime,
                location: card.location,
                cost: card.cost,
                status: card.status,
                tags: card.tags,
                links: card.links,
                notes: card.notes,
                order: day.cards.indexOf(card),
              })

            if (cardError) {
              result.errors.push(`Card ${card.title}: ${cardError.message}`)
              continue
            }

            result.cardsCreated++
          }
        }

        // Migrate unassigned cards (Things to Do)
        if (trip.unassignedCards && trip.unassignedCards.length > 0) {
          for (const card of trip.unassignedCards) {
            const { error: cardError } = await supabase
              .from('cards')
              .insert({
                id: card.id,
                trip_id: trip.id,
                day_id: null, // No day ID for unassigned cards
                type: card.type,
                title: card.title,
                start_time: card.startTime,
                end_time: card.endTime,
                location: card.location,
                cost: card.cost,
                status: card.status,
                tags: card.tags,
                links: card.links,
                notes: card.notes,
                order: trip.unassignedCards.indexOf(card),
              })

            if (cardError) {
              result.errors.push(`Unassigned card ${card.title}: ${cardError.message}`)
              continue
            }

            result.cardsCreated++
          }
        }
      } catch (error: any) {
        result.errors.push(`Trip ${trip.title}: ${error.message}`)
      }
    }

    // Migrate user preferences
    if (parsedData.state?.userVibes || parsedData.state?.viewPrefs) {
      try {
        await supabase
          .from('user_preferences')
          .upsert({
            user_id: userId,
            vibes: parsedData.state?.userVibes || null,
            view_preferences: parsedData.state?.viewPrefs || null,
          })
      } catch (error: any) {
        result.errors.push(`Preferences: ${error.message}`)
      }
    }

    result.success = result.errors.length === 0 || result.tripsCreated > 0

    return result
  } catch (error: any) {
    result.errors.push(`Migration failed: ${error.message}`)
    return result
  }
}

/**
 * Check if user has local data that needs migration
 */
export function hasLocalData(): boolean {
  try {
    const storedData = localStorage.getItem('trailblazer-store')
    if (!storedData) return false

    const parsedData = JSON.parse(storedData)
    const trips = parsedData.state?.trips || {}
    return Object.keys(trips).length > 0
  } catch {
    return false
  }
}

/**
 * Clear localStorage after successful migration
 */
export function clearLocalStorage() {
  try {
    localStorage.removeItem('trailblazer-store')
    localStorage.removeItem('trailblazer-store-temporal')
  } catch (error) {
    console.error('Failed to clear localStorage:', error)
  }
}

/**
 * Show migration dialog to user
 */
export function showMigrationPrompt(onMigrate: () => Promise<void>, onSkip: () => void) {
  // This is called from a component that can show a dialog
  return {
    title: 'Import Your Local Trips?',
    description: `We found ${getLocalTripCount()} ${getLocalTripCount() === 1 ? 'trip' : 'trips'} saved locally. Would you like to import them to your account?`,
    onMigrate,
    onSkip,
  }
}

function getLocalTripCount(): number {
  try {
    const storedData = localStorage.getItem('trailblazer-store')
    if (!storedData) return 0

    const parsedData = JSON.parse(storedData)
    const trips = parsedData.state?.trips || {}
    return Object.keys(trips).length
  } catch {
    return 0
  }
}

