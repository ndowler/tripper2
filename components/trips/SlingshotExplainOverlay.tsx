'use client'

import { useState, useEffect } from 'react'
import { X, Sparkles, Heart } from 'lucide-react'
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
            "relative flex flex-col items-center gap-8 max-w-xl w-full mx-4 p-10 rounded-3xl",
            "bg-gradient-to-b from-background/95 to-background/98",
            "border border-transparent shadow-2xl",
            "animate-in slide-in-from-bottom-4 fade-in duration-500",
            // Gradient border effect
            "before:absolute before:inset-0 before:rounded-3xl before:p-[1px]",
            "before:bg-gradient-to-r before:from-teal-500 before:via-violet-500 before:to-teal-500",
            "before:-z-10 before:animate-border-glow"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="absolute right-5 top-5 rounded-full p-2 opacity-60 ring-offset-background transition-all hover:opacity-100 hover:bg-teal-500/10 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>

          {/* Glowing Orb with Success Icon */}
          <div className="relative flex items-center justify-center">
            {/* Static completion ring */}
            <svg className="absolute -inset-4 w-28 h-28 -rotate-90" viewBox="0 0 120 120">
              {/* Completed circle */}
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="url(#success-gradient)"
                strokeWidth="2"
                strokeLinecap="round"
                className="animate-draw-circle"
              />
              <defs>
                <linearGradient id="success-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgb(20, 184, 166)" />
                  <stop offset="100%" stopColor="rgb(139, 92, 246)" />
                </linearGradient>
              </defs>
            </svg>

            {/* Glowing teal orb */}
            <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-teal-500/20 to-violet-500/20 border border-teal-400/30 shadow-lg shadow-teal-500/25 animate-success-pulse">
              {/* Soft halo */}
              <div className="absolute inset-0 rounded-full bg-teal-400/10 blur-xl animate-pulse" />

              {/* Icon */}
              <Sparkles className="relative h-8 w-8 text-teal-400 z-10" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-semibold tracking-tight">Your Personalized Trip</h3>
            <p className="text-xs uppercase tracking-widest text-muted-foreground/60">
              Crafted just for you
            </p>
          </div>

          {/* Explanation */}
          <div className="w-full rounded-2xl bg-gradient-to-br from-teal-500/5 to-violet-500/5 border border-teal-400/10 p-6 backdrop-blur-sm">
            <p className="text-base leading-relaxed whitespace-pre-wrap text-foreground/90 text-center">
              {explanation}
            </p>
          </div>

          {/* Decorative floating hearts/sparkles */}
          <div className="flex gap-3 items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-400/60 animate-float" style={{ animationDelay: '0ms' }} />
            <Heart className="h-4 w-4 text-teal-400/40 animate-float" style={{ animationDelay: '200ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400/60 animate-float" style={{ animationDelay: '400ms' }} />
            <Sparkles className="h-4 w-4 text-violet-400/40 animate-float" style={{ animationDelay: '600ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-teal-400/60 animate-float" style={{ animationDelay: '800ms' }} />
          </div>

          {/* Action Button */}
          <Button
            onClick={handleDismiss}
            className="px-8 py-6 text-base font-medium rounded-xl bg-gradient-to-r from-teal-500 to-violet-500 hover:from-teal-600 hover:to-violet-600 shadow-lg shadow-teal-500/25 transition-all hover:shadow-xl hover:shadow-teal-500/30 hover:scale-105"
          >
            Let's Go!
          </Button>

          {/* Bottom hint */}
          <p className="text-xs text-muted-foreground/50">
            Tap anywhere to start exploring
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes border-glow {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-6px);
            opacity: 1;
          }
        }

        @keyframes success-pulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(20, 184, 166, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(20, 184, 166, 0.5);
          }
        }

        @keyframes draw-circle {
          from {
            stroke-dasharray: 0 330;
          }
          to {
            stroke-dasharray: 330 0;
          }
        }

        .animate-border-glow {
          animation: border-glow 2s ease-in-out infinite;
        }

        .animate-float {
          animation: float 2.5s ease-in-out infinite;
        }

        .animate-success-pulse {
          animation: success-pulse 2s ease-in-out infinite;
        }

        .animate-draw-circle {
          stroke-dasharray: 330;
          animation: draw-circle 1s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

