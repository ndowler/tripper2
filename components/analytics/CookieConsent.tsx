'use client'

/**
 * Cookie Consent Banner
 * 
 * GDPR-compliant consent banner for analytics
 */

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { initAnalytics, setAnalyticsConsent, hasAnalyticsConsent } from '@/lib/analytics'

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const hasConsent = hasAnalyticsConsent()
    const hasDeclined = localStorage.getItem('analytics_consent') === 'false'
    
    if (hasConsent) {
      // User has consented, initialize analytics
      initAnalytics()
      setShowBanner(false)
    } else if (hasDeclined) {
      // User has declined, don't show banner
      setShowBanner(false)
    } else {
      // No choice made yet, show banner
      setShowBanner(true)
    }
  }, [])

  const handleAccept = () => {
    setAnalyticsConsent(true)
    setShowBanner(false)
    
    // Track consent acceptance (will only work after init)
    setTimeout(() => {
      const { track } = require('@/lib/analytics')
      track('Analytics Consent Given')
    }, 100)
  }

  const handleDecline = () => {
    setAnalyticsConsent(false)
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-md">
      <Card className="border-2 border-border bg-background/95 p-6 shadow-2xl backdrop-blur-sm">
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">🍪 Analytics & Cookies</h3>
            <p className="text-sm text-muted-foreground">
              We use PostHog analytics to understand how you use Trailblazer and improve your experience. 
              We don't sell your data or track you across other websites.
            </p>
            <p className="text-xs text-muted-foreground">
              <a 
                href="/privacy" 
                target="_blank" 
                className="underline hover:text-foreground"
              >
                Learn more in our Privacy Policy
              </a>
            </p>
          </div>
          
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button 
              onClick={handleAccept} 
              className="flex-1"
              size="sm"
            >
              Accept
            </Button>
            <Button 
              onClick={handleDecline} 
              variant="outline"
              className="flex-1"
              size="sm"
            >
              Decline
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

