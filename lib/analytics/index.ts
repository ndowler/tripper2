/**
 * Analytics Wrapper for Tripper
 * 
 * Centralizes all analytics tracking to PostHog.
 * Supports privacy-first tracking with user consent.
 */

import posthog from 'posthog-js'

// Initialize flag
let isInitialized = false

/**
 * Initialize PostHog analytics
 * Should be called once on app start (after consent)
 */
export function initAnalytics() {
  if (typeof window === 'undefined') return
  if (isInitialized) return
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    console.warn('[Analytics] PostHog key not found')
    return
  }

  try {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      loaded: (ph) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('[Analytics] PostHog initialized')
          ph.debug()
        }
      },
      capture_pageview: false, // Manual page tracking
      persistence: 'localStorage',
      autocapture: false, // Manual events only for control
      session_recording: {
        maskAllInputs: true, // Privacy: mask all input fields
        maskTextSelector: '*', // Mask all text by default
      },
    })

    isInitialized = true
    console.log('[Analytics] PostHog ready')
  } catch (error) {
    console.error('[Analytics] Failed to initialize PostHog:', error)
  }
}

/**
 * Check if user has given analytics consent
 */
export function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false
  const consent = localStorage.getItem('analytics_consent')
  return consent === 'true'
}

/**
 * Set analytics consent
 */
export function setAnalyticsConsent(consent: boolean) {
  if (typeof window === 'undefined') return
  localStorage.setItem('analytics_consent', consent.toString())
  
  if (consent) {
    initAnalytics()
  } else {
    // Opt out
    if (isInitialized) {
      posthog.opt_out_capturing()
      posthog.reset()
    }
  }
}

/**
 * Identify a user with PostHog
 * Call this after login/signup
 */
export function identifyUser(userId: string, traits?: Record<string, any>) {
  if (!isInitialized || !hasAnalyticsConsent()) return

  try {
    posthog.identify(userId, {
      ...traits,
      identified_at: new Date().toISOString(),
    })
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] User identified:', userId, traits)
    }
  } catch (error) {
    console.error('[Analytics] Failed to identify user:', error)
  }
}

/**
 * Track a custom event
 */
export function track(event: string, properties?: Record<string, any>) {
  if (!isInitialized || !hasAnalyticsConsent()) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] (not tracked):', event, properties)
    }
    return
  }

  try {
    posthog.capture(event, {
      ...properties,
      timestamp: new Date().toISOString(),
    })
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', event, properties)
    }
  } catch (error) {
    console.error('[Analytics] Failed to track event:', error)
  }
}

/**
 * Track a page view
 */
export function trackPageView(page: string, properties?: Record<string, any>) {
  track('$pageview', {
    page,
    ...properties,
  })
}

/**
 * Reset user identity (call on logout)
 */
export function resetUser() {
  if (!isInitialized) return

  try {
    posthog.reset()
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] User reset')
    }
  } catch (error) {
    console.error('[Analytics] Failed to reset user:', error)
  }
}

/**
 * Set user properties (for profile updates)
 */
export function setUserProperties(properties: Record<string, any>) {
  if (!isInitialized || !hasAnalyticsConsent()) return

  try {
    posthog.people?.set(properties)
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] User properties updated:', properties)
    }
  } catch (error) {
    console.error('[Analytics] Failed to set user properties:', error)
  }
}

// Export PostHog instance for advanced usage
export { posthog }

