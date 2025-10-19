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
