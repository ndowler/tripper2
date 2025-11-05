/**
 * Performance Monitoring
 * 
 * Tracks Web Vitals and performance metrics
 */

import { track } from './index'

// Track Web Vitals
export function trackWebVitals() {
  if (typeof window === 'undefined') return

  // Core Web Vitals
  try {
    // Largest Contentful Paint (LCP)
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1] as any
      
      track('Web Vital: LCP', {
        value: lastEntry.renderTime || lastEntry.loadTime,
        rating: lastEntry.renderTime < 2500 ? 'good' : lastEntry.renderTime < 4000 ? 'needs-improvement' : 'poor',
      })
    })
    
    observer.observe({ entryTypes: ['largest-contentful-paint'] })
  } catch (error) {
    console.error('[Performance] LCP tracking failed:', error)
  }

  // First Input Delay (FID)
  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        track('Web Vital: FID', {
          value: entry.processingStart - entry.startTime,
          rating: entry.processingStart - entry.startTime < 100 ? 'good' : 
                  entry.processingStart - entry.startTime < 300 ? 'needs-improvement' : 'poor',
        })
      })
    })
    
    observer.observe({ entryTypes: ['first-input'] })
  } catch (error) {
    console.error('[Performance] FID tracking failed:', error)
  }

  // Cumulative Layout Shift (CLS)
  try {
    let clsValue = 0
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      })
      
      track('Web Vital: CLS', {
        value: clsValue,
        rating: clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs-improvement' : 'poor',
      })
    })
    
    observer.observe({ entryTypes: ['layout-shift'] })
  } catch (error) {
    console.error('[Performance] CLS tracking failed:', error)
  }
}

/**
 * Track page load performance
 */
export function trackPageLoad() {
  if (typeof window === 'undefined') return

  window.addEventListener('load', () => {
    // Wait for navigation timing to be available
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      if (!perfData) return

      track('Page Loaded', {
        page: window.location.pathname,
        loadTime: Math.round(perfData.loadEventEnd - perfData.fetchStart),
        domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart),
        domInteractive: Math.round(perfData.domInteractive - perfData.fetchStart),
        firstByte: Math.round(perfData.responseStart - perfData.requestStart),
      })
    }, 0)
  })
}

/**
 * Track API performance
 */
export function trackApiCall(endpoint: string, duration: number, success: boolean, error?: string) {
  track('API Call', {
    endpoint,
    duration: Math.round(duration),
    success,
    error,
    rating: duration < 1000 ? 'good' : duration < 3000 ? 'needs-improvement' : 'poor',
  })
}

/**
 * Track command palette performance
 */
export function trackCommandPalettePerformance(openTime: number) {
  track('Command Palette Performance', {
    openTime: Math.round(openTime),
    rating: openTime < 50 ? 'good' : openTime < 100 ? 'needs-improvement' : 'poor',
  })
}

/**
 * Track AI generation performance
 */
export function trackAiGenerationPerformance(
  type: 'discover' | 'day-plan' | 'regenerate' | 'swap',
  duration: number,
  success: boolean,
  itemsGenerated?: number
) {
  track('AI Generation Performance', {
    type,
    duration: Math.round(duration),
    success,
    itemsGenerated,
    rating: duration < 5000 ? 'good' : duration < 10000 ? 'needs-improvement' : 'poor',
  })
}

