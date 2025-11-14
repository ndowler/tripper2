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
      className: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
      emoji: '📅',
    },
    'in-progress': {
      label: 'In Progress',
      className: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
      emoji: '✈️',
    },
    completed: {
      label: 'Completed',
      className: 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20',
      emoji: '✓',
    },
    draft: {
      label: 'Draft',
      className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
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

  // Generate gradient colors from hash
  const gradients = [
    'from-blue-500 via-purple-500 to-pink-500',
    'from-green-500 via-teal-500 to-cyan-500',
    'from-orange-500 via-red-500 to-pink-500',
    'from-purple-500 via-indigo-500 to-blue-500',
    'from-yellow-500 via-orange-500 to-red-500',
    'from-teal-500 via-green-500 to-emerald-500',
    'from-pink-500 via-rose-500 to-red-500',
    'from-indigo-500 via-blue-500 to-cyan-500',
    'from-rose-500 via-pink-500 to-purple-500',
    'from-emerald-500 via-teal-500 to-blue-500',
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

