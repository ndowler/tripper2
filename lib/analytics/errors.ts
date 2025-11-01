/**
 * Error Tracking
 * 
 * Tracks JavaScript errors and API failures
 */

import { track } from './index'

/**
 * Track an error
 */
export function trackError(
  error: Error,
  context?: {
    type?: 'client' | 'api' | 'validation' | 'network'
    component?: string
    action?: string
    [key: string]: any
  }
) {
  track('Error Occurred', {
    message: error.message,
    stack: error.stack?.slice(0, 500), // Limit stack trace size
    page: typeof window !== 'undefined' ? window.location.pathname : undefined,
    type: context?.type || 'client',
    ...context,
  })
}

/**
 * Track API error
 */
export function trackApiError(endpoint: string, error: string, statusCode?: number) {
  track('API Error', {
    endpoint,
    error,
    statusCode,
  })
}

/**
 * Track validation error
 */
export function trackValidationError(schema: string, errors: any) {
  track('Validation Error', {
    schema,
    errorCount: Array.isArray(errors) ? errors.length : 1,
    errors: JSON.stringify(errors).slice(0, 500), // Limit size
  })
}

/**
 * Track sync conflict
 */
export function trackSyncConflict(
  entityType: 'trip' | 'card' | 'day',
  resolution: 'local' | 'remote' | 'merge' | 'manual'
) {
  track('Sync Conflict', {
    entityType,
    resolution,
  })
}

/**
 * Initialize global error handlers
 */
export function initErrorTracking() {
  if (typeof window === 'undefined') return

  // Unhandled errors
  window.addEventListener('error', (event) => {
    trackError(new Error(event.message), {
      type: 'client',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    })
  })

  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    trackError(
      event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
      {
        type: 'client',
        unhandledPromise: true,
      }
    )
  })
}

