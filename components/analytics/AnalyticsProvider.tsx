'use client'

/**
 * Analytics Provider
 * 
 * Initializes analytics and performance tracking
 */

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackPageView } from '@/lib/analytics'
import { trackWebVitals, trackPageLoad } from '@/lib/analytics/performance'
import { initErrorTracking } from '@/lib/analytics/errors'
import { useSessionTracking } from '@/lib/hooks/useSessionTracking'

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Track sessions
  useSessionTracking()

  // Initialize performance tracking
  useEffect(() => {
    trackWebVitals()
    trackPageLoad()
    initErrorTracking()
  }, [])

  // Track page views on route change
  useEffect(() => {
    trackPageView(pathname)
  }, [pathname])

  return <>{children}</>
}

