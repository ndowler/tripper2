'use client'

import { useState, useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SlingshotLoadingOverlayProps {
  currentDay: number
  totalDays: number
  onDayUpdate?: (day: number) => void
}

const FUNNY_MESSAGES = [
  "Putting gas in the tank ⛽",
  "Packing your digital bags 🎒",
  "Finding the best coffee spots ☕",
  "Checking the vibe... yep, still good ✨",
  "Plotting world domination... I mean, your route 🗺️",
  "Teaching AI about your food preferences 🍕",
  "Bribing local tour guides (with data) 💰",
  "Convincing museums to open early for you 🏛️",
  "Calculating optimal nap times 😴",
  "Adding spontaneity (ironically) 🎲",
  "Asking locals for the secret spots 🤫",
  "Finding restaurants that don't have tourist menus 🍽️",
  "Booking imaginary helicopter rides 🚁",
  "Testing every possible route (virtually) 🛣️",
  "Making sure you get the window seat 🪟",
  "Syncing your schedule with the sunset 🌅",
  "Organizing your memories before they happen 📸",
  "Finding the perfect souvenir shops 🎁",
  "Negotiating with time zones ⏰",
  "Charging the adventure batteries 🔋",
]

export function SlingshotLoadingOverlay({ currentDay, totalDays, onDayUpdate }: SlingshotLoadingOverlayProps) {
  const [messageIndex, setMessageIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  // Rotate messages every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % FUNNY_MESSAGES.length)
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  // Calculate progress
  useEffect(() => {
    if (totalDays > 0) {
      const newProgress = Math.round((currentDay / totalDays) * 100)
      setProgress(newProgress)
    }
  }, [currentDay, totalDays])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] py-8">
      <div className="flex flex-col items-center gap-6 max-w-md w-full px-4">
        {/* Animated Icon */}
        <div className="relative">
          <Sparkles className="h-16 w-16 text-primary animate-pulse" />
          <div className="absolute inset-0 h-16 w-16 rounded-full bg-primary/20 animate-ping" />
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold">Generating Your Trip</h3>
          <p className="text-sm text-muted-foreground">
            {currentDay > 0 && totalDays > 0
              ? `Planning Day ${currentDay} of ${totalDays}...`
              : 'Getting started...'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full space-y-2">
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500 ease-out",
                progress === 0 ? "animate-pulse" : ""
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{progress}%</span>
            <span>
              {currentDay} / {totalDays} days
            </span>
          </div>
        </div>

        {/* Funny Message */}
        <div className="min-h-[60px] flex items-center justify-center">
          <p
            key={messageIndex}
            className="text-center text-sm text-muted-foreground animate-in fade-in duration-500"
          >
            {FUNNY_MESSAGES[messageIndex]}
          </p>
        </div>

        {/* Loading Dots */}
        <div className="flex gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-center text-muted-foreground/70 max-w-sm">
          This usually takes 30-60 seconds. Hang tight!
        </p>
      </div>
    </div>
  )
}

