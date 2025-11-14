/**
 * Time manipulation utilities
 */

/**
 * Parse time string "09:30" to minutes since midnight
 */
export function parseTime(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number)
  return hours * 60 + minutes
}

/**
 * Convert minutes since midnight to time string "09:30"
 */
export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}

/**
 * Add minutes to a time string
 */
export function addMinutes(timeStr: string, minutesToAdd: number): string {
  const totalMinutes = parseTime(timeStr) + minutesToAdd
  return formatTime(totalMinutes % 1440) // Wrap at 24 hours
}

/**
 * Calculate duration between two times in minutes
 */
export function calculateDuration(startTime: string, endTime: string): number {
  const start = parseTime(startTime)
  const end = parseTime(endTime)
  
  if (end >= start) {
    return end - start
  } else {
    // Crosses midnight
    return (1440 - start) + end
  }
}

/**
 * Format time for display (12/24 hour)
 */
export function formatTimeDisplay(timeStr: string, format: 12 | 24 = 12): string {
  const [hours, minutes] = timeStr.split(':').map(Number)
  
  if (format === 24) {
    return timeStr
  }
  
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}

/**
 * Get current time as string "HH:MM"
 */
export function getCurrentTime(): string {
  const now = new Date()
  return formatTime(now.getHours() * 60 + now.getMinutes())
}

/**
 * Default durations by card type (in minutes)
 */
const DEFAULT_DURATIONS: Record<string, number> = {
  activity: 120,    // 2 hours
  meal: 90,         // 1.5 hours
  restaurant: 90,   // 1.5 hours
  transit: 30,      // 30 minutes
  flight: 180,      // 3 hours
  hotel: 0,         // Check-in/out, no duration
  shopping: 90,     // 1.5 hours
  entertainment: 150, // 2.5 hours
  note: 0,          // No duration
}

const DEFAULT_GAP_MINUTES = 15 // Default gap between activities

/**
 * Calculate appropriate time slot for a card being dropped at a position
 * based on surrounding cards
 */
export function calculateTimeSlot(
  prevCard: { endTime?: string; startTime?: string; duration?: number; type?: string } | null | undefined,
  nextCard: { startTime?: string; endTime?: string } | null | undefined,
  cardType: string = 'activity',
  cardDuration?: number
): { startTime: string; endTime: string; duration: number } | null {
  const duration = cardDuration || DEFAULT_DURATIONS[cardType] || 60

  // Case 1: Between two timed cards
  if (prevCard?.endTime && nextCard?.startTime) {
    const prevEndMinutes = parseTime(prevCard.endTime)
    const nextStartMinutes = parseTime(nextCard.startTime)
    const availableTime = nextStartMinutes - prevEndMinutes
    
    // If there's enough space, place after previous with gap
    if (availableTime >= duration + DEFAULT_GAP_MINUTES) {
      const startMinutes = prevEndMinutes + DEFAULT_GAP_MINUTES
      const startTime = formatTime(startMinutes)
      const endTime = formatTime(startMinutes + duration)
      return { startTime, endTime, duration }
    }
    
    // If tight fit, use midpoint
    const midpoint = prevEndMinutes + Math.floor(availableTime / 2)
    const startTime = formatTime(midpoint)
    const endTime = formatTime(midpoint + duration)
    return { startTime, endTime, duration }
  }

  // Case 2: Only previous card has time - continue after it
  if (prevCard?.endTime) {
    const prevEndMinutes = parseTime(prevCard.endTime)
    const startMinutes = prevEndMinutes + DEFAULT_GAP_MINUTES
    const startTime = formatTime(startMinutes)
    const endTime = formatTime(startMinutes + duration)
    return { startTime, endTime, duration }
  }

  // Case 3: Only next card has time - place before it
  if (nextCard?.startTime) {
    const nextStartMinutes = parseTime(nextCard.startTime)
    const startMinutes = Math.max(0, nextStartMinutes - duration - DEFAULT_GAP_MINUTES)
    const startTime = formatTime(startMinutes)
    const endTime = formatTime(startMinutes + duration)
    return { startTime, endTime, duration }
  }

  // Case 4: No surrounding times - default to morning start
  const defaultStartMinutes = 9 * 60 // 9:00 AM
  const startTime = formatTime(defaultStartMinutes)
  const endTime = formatTime(defaultStartMinutes + duration)
  return { startTime, endTime, duration }
}

/**
 * Check if a card should receive automatic time assignment
 * Returns true if the card is being placed in a scheduled section
 */
export function shouldAutoAssignTime(
  prevCard: { startTime?: string } | null | undefined,
  nextCard: { startTime?: string } | null | undefined
): boolean {
  // Auto-assign time if either neighbor has a time
  return !!(prevCard?.startTime || nextCard?.startTime)
}