/**
 * Preferences Service - Supabase CRUD operations for user preferences
 */

import { createClient } from '@/lib/supabase/client'
import type { ViewPrefs } from '@/lib/types'
import type { UserVibes } from '@/lib/types/vibes'

/**
 * Fetch user preferences
 */
export async function fetchPreferences(userId: string): Promise<{
  vibes: UserVibes | null
  viewPrefs: ViewPrefs | null
}> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('user_preferences')
    .select('vibes, view_preferences')
    .eq('user_id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No preferences yet, create default
      await supabase
        .from('user_preferences')
        .insert({
          user_id: userId,
          vibes: null,
          view_preferences: {
            grouping: 'day',
            timeFormat: 12,
            showTimes: true,
            compactMode: false,
            theme: 'system',
            density: 'comfortable',
          },
        })

      return {
        vibes: null,
        viewPrefs: {
          grouping: 'day',
          timeFormat: 12,
          showTimes: true,
          compactMode: false,
          theme: 'system',
          density: 'comfortable',
        },
      }
    }

    console.error('Error fetching preferences:', error)
    throw new Error('Failed to fetch preferences')
  }

  return {
    vibes: data?.vibes || null,
    viewPrefs: data?.view_preferences || null,
  }
}

/**
 * Update user vibes
 */
export async function updateVibes(userId: string | undefined, vibes: UserVibes): Promise<void> {
  // If no userId, skip Supabase (localStorage-only mode)
  if (!userId) {
    return
  }
  
  const supabase = createClient()

  const { error } = await supabase
    .from('user_preferences')
    .upsert({
      user_id: userId,
      vibes: vibes,
      updated_at: new Date().toISOString(),
    })

  if (error) {
    console.error('Error updating vibes:', error)
    throw new Error('Failed to update vibes')
  }
}

/**
 * Clear user vibes
 */
export async function clearVibes(userId?: string): Promise<void> {
  // If no userId, skip Supabase (localStorage-only mode)
  if (!userId) {
    return
  }
  
  const supabase = createClient()

  const { error } = await supabase
    .from('user_preferences')
    .update({
      vibes: null,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)

  if (error) {
    console.error('Error clearing vibes:', error)
    throw new Error('Failed to clear vibes')
  }
}

/**
 * Update view preferences
 */
export async function updateViewPrefs(userId: string, viewPrefs: Partial<ViewPrefs>): Promise<void> {
  const supabase = createClient()

  // Fetch current preferences
  const { data: current } = await supabase
    .from('user_preferences')
    .select('view_preferences')
    .eq('user_id', userId)
    .single()

  const updatedPrefs = {
    ...(current?.view_preferences || {}),
    ...viewPrefs,
  }

  const { error } = await supabase
    .from('user_preferences')
    .upsert({
      user_id: userId,
      view_preferences: updatedPrefs,
      updated_at: new Date().toISOString(),
    })

  if (error) {
    console.error('Error updating view preferences:', error)
    throw new Error('Failed to update view preferences')
  }
}

