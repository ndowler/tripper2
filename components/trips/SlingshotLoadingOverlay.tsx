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
  "Tuning into your flavor profile",
  "Finding the best coffee spots in your neighborhood",
  "Mapping out the perfect morning routine",
  "Checking the vibe... yep, still good",
  "Plotting your adventure route",
  "Learning your food preferences",
  "Finding local secret spots",
  "Discovering restaurants without tourist menus",
  "Testing every possible route (virtually)",
  "Syncing your schedule with the sunset",
  "Finding the perfect souvenir shops",
  "Negotiating with time zones",
  "Calculating optimal exploration times",
  "Adding just the right amount of spontaneity",
]

export function SlingshotLoadingOverlay({ currentDay, totalDays, onDayUpdate }: SlingshotLoadingOverlayProps) {
  const [messageIndex, setMessageIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  // Rotate messages every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % FUNNY_MESSAGES.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Calculate progress
  useEffect(() => {
    if (totalDays > 0) {
      const newProgress = Math.round((currentDay / totalDays) * 100)
      setProgress(newProgress)

      if (newProgress === 100 && !isComplete) {
        setIsComplete(true)
      }
    }
  }, [currentDay, totalDays, isComplete])

  const circumference = 2 * Math.PI * 52 // radius of 52px
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className={cn(
          "relative flex flex-col items-center gap-8 max-w-lg w-full mx-4 p-8 rounded-3xl",
          "bg-gradient-to-b from-background/95 to-background/98",
          "border border-transparent shadow-2xl",
          "animate-in slide-in-from-bottom-4 fade-in duration-500",
          // Gradient border effect
          "before:absolute before:inset-0 before:rounded-3xl before:p-[1px]",
          "before:bg-gradient-to-r before:from-teal-500 before:via-violet-500 before:to-teal-500",
          "before:-z-10 before:animate-border-glow"
        )}
      >
        {/* Glowing Orb with Circular Progress */}
        <div className="relative flex items-center justify-center">
          {/* Circular progress ring */}
          <svg className="absolute -inset-4 w-28 h-28 -rotate-90" viewBox="0 0 120 120">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-muted/20"
            />
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="url(#progress-gradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500 ease-out"
            />
            <defs>
              <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgb(20, 184, 166)" />
                <stop offset="100%" stopColor="rgb(139, 92, 246)" />
              </linearGradient>
            </defs>
          </svg>

          {/* Glowing teal orb */}
          <div className={cn(
            "relative flex items-center justify-center w-20 h-20 rounded-full",
            "bg-gradient-to-br from-teal-500/20 to-violet-500/20",
            "border border-teal-400/30",
            "shadow-lg shadow-teal-500/25",
            isComplete && "animate-pulse-once"
          )}>
            {/* Soft halo */}
            <div className="absolute inset-0 rounded-full bg-teal-400/10 blur-xl animate-pulse" />

            {/* Icon */}
            <Sparkles className="relative h-8 w-8 text-teal-400 z-10" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-1">
          <h3 className="text-2xl font-semibold tracking-tight">Designing Your Getaway</h3>
          <p className="text-xs uppercase tracking-widest text-muted-foreground/60">
            {currentDay > 0 && totalDays > 0
              ? `Day ${currentDay} of ${totalDays} · Creating magic`
              : 'Getting started · Step 1'}
          </p>
        </div>

        {/* Center Text Block */}
        <div className="min-h-[40px] flex items-center justify-center text-center px-4">
          <p
            key={messageIndex}
            className="text-base font-medium text-foreground/90 animate-in fade-in duration-700"
          >
            {FUNNY_MESSAGES[messageIndex]}
          </p>
        </div>

        {/* Floating Orb Dots */}
        <div className="flex gap-3 items-center justify-center h-8">
          <div
            className="w-2 h-2 rounded-full bg-teal-400 shadow-lg shadow-teal-400/50 animate-float"
            style={{ animationDelay: '0ms' }}
          />
          <div
            className="w-2 h-2 rounded-full bg-teal-400 shadow-lg shadow-teal-400/50 animate-float"
            style={{ animationDelay: '300ms' }}
          />
          <div
            className="w-2 h-2 rounded-full bg-teal-400 shadow-lg shadow-teal-400/50 animate-float"
            style={{ animationDelay: '600ms' }}
          />
        </div>

        {/* Bottom Reassurance */}
        <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground/70">
          <span>Creating your custom {totalDays}-day itinerary</span>
          <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 text-xs font-medium border border-teal-400/20">
            ~1 min
          </span>
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
            opacity: 0.6;
          }
          50% {
            transform: translateY(-8px);
            opacity: 1;
          }
        }

        @keyframes pulse-once {
          0% {
            box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.7);
          }
          50% {
            box-shadow: 0 0 0 20px rgba(20, 184, 166, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(20, 184, 166, 0);
          }
        }

        .animate-border-glow {
          animation: border-glow 2s ease-in-out infinite;
        }

        .animate-float {
          animation: float 2s ease-in-out infinite;
        }

        .animate-pulse-once {
          animation: pulse-once 1s ease-out;
        }
      `}</style>
    </div>
  )
}

