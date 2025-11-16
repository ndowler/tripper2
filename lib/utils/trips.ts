/**
 * Utility functions for trip management and display
 */

import { parseISO, isBefore, isAfter, differenceInDays, addDays } from 'date-fns'
import type { Trip } from '@/lib/types'

export type TripStatus = 'upcoming' | 'in-progress' | 'completed' | 'draft'

/**
 * Determine trip status based on dates
 */
export function getTripStatus(trip: Trip): TripStatus {
  if (!trip.days.length || !trip.days[0]?.date) {
    return 'draft'
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const firstDay = parseISO(trip.days[0].date)
  const lastDay = trip.days[trip.days.length - 1]?.date
    ? parseISO(trip.days[trip.days.length - 1].date)
    : firstDay

  // Add one day to last day to include it in the range
  const lastDayEnd = addDays(lastDay, 1)

  if (isBefore(lastDayEnd, today)) {
    return 'completed'
  } else if (isBefore(firstDay, today) && isAfter(lastDayEnd, today)) {
    return 'in-progress'
  } else {
    return 'upcoming'
  }
}

/**
 * Get status badge configuration
 */
export function getStatusConfig(status: TripStatus) {
  const configs = {
    upcoming: {
      label: 'Upcoming',
      className: 'bg-sky-400/15 text-sky-700 dark:text-sky-300 border-sky-400/30',
      emoji: '📅',
    },
    'in-progress': {
      label: 'In Progress',
      className: 'bg-emerald-400/15 text-emerald-700 dark:text-emerald-300 border-emerald-400/30',
      emoji: '✈️',
    },
    completed: {
      label: 'Completed',
      className: 'bg-slate-400/15 text-slate-700 dark:text-slate-300 border-slate-400/30',
      emoji: '✓',
    },
    draft: {
      label: 'Draft',
      className: 'bg-amber-400/15 text-amber-700 dark:text-amber-300 border-amber-400/30',
      emoji: '📝',
    },
  }

  return configs[status]
}

/**
 * Generate dynamic gradient based on trip title (consistent across renders)
 */
export function getTripGradient(tripTitle: string): string {
  // Hash the title to get consistent colors
  let hash = 0
  for (let i = 0; i < tripTitle.length; i++) {
    hash = tripTitle.charCodeAt(i) + ((hash << 5) - hash)
  }

  // Generate gradient colors from hash - softer, more elegant gradients
  const gradients = [
    'from-blue-400/80 via-indigo-400/70 to-purple-400/80',
    'from-teal-400/80 via-cyan-400/70 to-sky-400/80',
    'from-violet-400/80 via-purple-400/70 to-fuchsia-400/80',
    'from-emerald-400/80 via-teal-400/70 to-cyan-400/80',
    'from-amber-400/80 via-orange-400/70 to-rose-400/80',
    'from-sky-400/80 via-blue-400/70 to-indigo-400/80',
    'from-pink-400/80 via-rose-400/70 to-red-400/80',
    'from-lime-400/80 via-emerald-400/70 to-teal-400/80',
    'from-fuchsia-400/80 via-pink-400/70 to-rose-400/80',
    'from-cyan-400/80 via-teal-400/70 to-emerald-400/80',
  ]

  const index = Math.abs(hash) % gradients.length
  return gradients[index]
}

/**
 * Calculate trip progress (% of activities scheduled)
 */
export function getTripProgress(trip: Trip): number {
  const totalCards = trip.days.reduce((sum, day) => sum + day.cards.length, 0) + 
                     (trip.unassignedCards?.length || 0)
  
  if (totalCards === 0) return 0
  
  const scheduledCards = trip.days.reduce((sum, day) => sum + day.cards.length, 0)
  return Math.round((scheduledCards / totalCards) * 100)
}

/**
 * Get days until trip starts
 */
export function getDaysUntilTrip(trip: Trip): number | null {
  if (!trip.days.length || !trip.days[0]?.date) {
    return null
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const firstDay = parseISO(trip.days[0].date)

  return differenceInDays(firstDay, today)
}

/**
 * Get trip stats for overview
 */
export function getTripStats(trips: Trip[]) {
  const total = trips.length
  const upcoming = trips.filter(t => getTripStatus(t) === 'upcoming').length
  const inProgress = trips.filter(t => getTripStatus(t) === 'in-progress').length
  const completed = trips.filter(t => getTripStatus(t) === 'completed').length
  
  const totalDays = trips.reduce((sum, trip) => sum + trip.days.length, 0)
  const totalActivities = trips.reduce((sum, trip) => 
    sum + trip.days.reduce((daySum, day) => daySum + day.cards.length, 0) + 
    (trip.unassignedCards?.length || 0), 0
  )

  return {
    total,
    upcoming,
    inProgress,
    completed,
    totalDays,
    totalActivities,
  }
}

/**
 * Get destination emoji based on trip destination
 */
export function getDestinationEmoji(destination?: string): string {
  if (!destination) return '🗺️'
  
  const dest = destination.toLowerCase()
  
  // Cities/Countries
  if (dest.includes('paris') || dest.includes('france')) return '🗼'
  if (dest.includes('rome') || dest.includes('italy')) return '🏛️'
  if (dest.includes('tokyo') || dest.includes('japan')) return '🗾'
  if (dest.includes('london') || dest.includes('uk') || dest.includes('england')) return '🎡'
  if (dest.includes('new york') || dest.includes('nyc')) return '🗽'
  if (dest.includes('dubai')) return '🕌'
  if (dest.includes('sydney') || dest.includes('australia')) return '🦘'
  if (dest.includes('egypt')) return '🏜️'
  if (dest.includes('greece')) return '🏛️'
  if (dest.includes('spain')) return '💃'
  if (dest.includes('thailand')) return '🏖️'
  if (dest.includes('iceland')) return '🌋'
  if (dest.includes('norway')) return '🏔️'
  
  // Generic categories
  if (dest.includes('beach') || dest.includes('island')) return '🏖️'
  if (dest.includes('mountain')) return '⛰️'
  if (dest.includes('desert')) return '🏜️'
  if (dest.includes('safari')) return '🦁'
  
  return '✈️'
}

/**
 * Get destination image URL from Unsplash Source
 */
export function getDestinationImageUrl(trip: Trip): string | null {
  const destination = trip.destination
  if (!destination) return null
  
  // Build search query from destination components
  const queryParts = [
    destination.city,
    destination.country
  ].filter(Boolean)
  
  if (queryParts.length === 0) return null
  
  // Create comma-separated query for better results
  const query = queryParts.join(',')
  
  // Use Unsplash Source API with destination + travel keywords
  // Size optimized for card display (800x400 = 2:1 aspect ratio)
  return `https://source.unsplash.com/800x400/?${encodeURIComponent(query)},travel,landscape,cityscape`
}

