/**
 * Session Tracking Hook
 * 
 * Tracks user sessions and engagement metrics
 */

import { useEffect, useRef } from 'react'
import { track } from '@/lib/analytics'

export function useSessionTracking() {
  const sessionStartRef = useRef<number | null>(null)
  const lastVisitRef = useRef<string | null>(null)

  useEffect(() => {
    // Track session start
    sessionStartRef.current = Date.now()
    lastVisitRef.current = localStorage.getItem('tripper_last_visit')
    
    const daysSinceLastVisit = lastVisitRef.current 
      ? Math.floor((sessionStartRef.current - parseInt(lastVisitRef.current)) / (1000 * 60 * 60 * 24))
      : null

    track('Session Started', {
      returning: !!lastVisitRef.current,
      daysSinceLastVisit,
      device: getDeviceType(),
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
    })

    // Track session end on unmount or page unload
    const handleSessionEnd = () => {
      if (!sessionStartRef.current) return
      
      const duration = Date.now() - sessionStartRef.current
      
      track('Session Ended', {
        duration: Math.round(duration),
        durationMinutes: Math.round(duration / 60000),
      })
      
      // Update last visit timestamp
      localStorage.setItem('tripper_last_visit', String(sessionStartRef.current))
    }

    // Listen for page unload
    window.addEventListener('beforeunload', handleSessionEnd)
    
    // Also track on unmount (for SPA navigation)
    return () => {
      handleSessionEnd()
      window.removeEventListener('beforeunload', handleSessionEnd)
    }
  }, [])
}

/**
 * Get device type from user agent
 */
function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const ua = navigator.userAgent
  
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet'
  }
  
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile'
  }
  
  return 'desktop'
}

/**
 * Track user returned after being inactive
 */
export function trackUserReturn() {
  const lastVisit = localStorage.getItem('tripper_last_visit')
  
  if (!lastVisit) return
  
  const daysSinceLastVisit = Math.floor((Date.now() - parseInt(lastVisit)) / (1000 * 60 * 60 * 24))
  
  // Only track if user was away for at least 1 day
  if (daysSinceLastVisit >= 1) {
    track('User Returned', {
      daysSinceLastVisit,
      returning: true,
    })
  }
}

