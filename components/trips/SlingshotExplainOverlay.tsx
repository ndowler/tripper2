'use client'

import { useState, useEffect } from 'react'
import { X, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SlingshotExplainOverlayProps {
  tripId: string
  explanation: string
  onDismiss: () => void
}

export function SlingshotExplainOverlay({ tripId, explanation, onDismiss }: SlingshotExplainOverlayProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if we've already shown this overlay for this trip
    const seenKey = `slingshot-overlay-seen-${tripId}`
    const hasSeenOverlay = localStorage.getItem(seenKey)

    if (!hasSeenOverlay) {
      // Small delay for animation
      setTimeout(() => setIsVisible(true), 300)
    } else {
      // Already seen, dismiss immediately
      onDismiss()
    }
  }, [tripId, onDismiss])

  const handleDismiss = () => {
    // Mark as seen in localStorage
    const seenKey = `slingshot-overlay-seen-${tripId}`
    localStorage.setItem(seenKey, 'true')
    
    setIsVisible(false)
    
    // Call onDismiss after animation
    setTimeout(onDismiss, 300)
  }

  if (!isVisible) {
    return null
  }

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm",
        "animate-in fade-in duration-300"
      )}
      onClick={handleDismiss}
    >
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div
          className={cn(
            "relative w-full max-w-lg rounded-lg border bg-card p-6 shadow-lg",
            "animate-in zoom-in-95 duration-300"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>

          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <div className="rounded-full bg-primary/10 p-2">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-1">Your Personalized Trip</h3>
              <p className="text-sm text-muted-foreground">
                Here's how we tailored this itinerary to your vibe
              </p>
            </div>
          </div>

          {/* Explanation */}
          <div className="rounded-lg bg-muted/50 p-4 mb-6">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {explanation}
            </p>
          </div>

          {/* Action */}
          <div className="flex justify-end">
            <Button onClick={handleDismiss}>
              Got it, let's go!
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

