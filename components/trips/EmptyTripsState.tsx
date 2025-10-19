'use client'

import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyTripsStateProps {
  onCreateTrip: () => void
}

export function EmptyTripsState({ onCreateTrip }: EmptyTripsStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="text-7xl mb-6 opacity-30">🗺️</div>
      <h2 className="text-2xl font-semibold mb-2">No trips yet</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        Start planning your next adventure! Create your first trip to begin organizing your itinerary.
      </p>
      <Button onClick={onCreateTrip} size="lg" className="gap-2">
        <PlusCircle className="h-5 w-5" />
        Create Your First Trip
      </Button>
    </div>
  )
}

