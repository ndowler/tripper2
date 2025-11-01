'use client'

import { PlusCircle, Sparkles, Map } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface EmptyTripsStateProps {
  onCreateTrip: () => void
}

export function EmptyTripsState({ onCreateTrip }: EmptyTripsStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Large animated icon */}
      <div className="relative mb-8">
        <div className="text-8xl animate-bounce-slow">🗺️</div>
        <div className="absolute -top-2 -right-2 text-3xl animate-pulse">✨</div>
      </div>

      {/* Heading */}
      <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
        Your adventure starts here
      </h2>
      <p className="text-muted-foreground mb-8 max-w-md text-lg">
        Create your first trip and start planning an unforgettable journey with AI-powered suggestions and beautiful organization.
      </p>

      {/* Primary CTA */}
      <div className="flex flex-col sm:flex-row gap-3 mb-12">
        <Button 
          onClick={onCreateTrip} 
          size="lg" 
          className="gap-2 text-base px-8"
        >
          <PlusCircle className="h-5 w-5" />
          Create Your First Trip
        </Button>
        <Link href="/demo">
          <Button 
            variant="outline" 
            size="lg" 
            className="gap-2 text-base px-8"
          >
            <Map className="h-5 w-5" />
            Try Demo Trip
          </Button>
        </Link>
      </div>

      {/* Feature highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl">
        <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50">
          <div className="text-3xl mb-1">🎯</div>
          <h3 className="font-semibold text-sm">Smart Planning</h3>
          <p className="text-xs text-muted-foreground">AI-powered suggestions for activities</p>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50">
          <div className="text-3xl mb-1">✨</div>
          <h3 className="font-semibold text-sm">Beautiful Design</h3>
          <p className="text-xs text-muted-foreground">Drag & drop interface that's a joy to use</p>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50">
          <div className="text-3xl mb-1">⚡</div>
          <h3 className="font-semibold text-sm">Offline First</h3>
          <p className="text-xs text-muted-foreground">Works instantly, no loading screens</p>
        </div>
      </div>
    </div>
  )
}

