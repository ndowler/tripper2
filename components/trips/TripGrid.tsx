'use client'

import { TripCard } from './TripCard'
import { NewTripCard } from './NewTripCard'
import type { Trip } from '@/lib/types'
import { cn } from '@/lib/utils'

type ViewMode = 'grid' | 'list'

interface TripGridProps {
  trips: Trip[]
  onEdit: (trip: Trip) => void
  onDuplicate: (trip: Trip) => void
  onDelete: (trip: Trip) => void
  onCreateNew: () => void
  viewMode?: ViewMode
}

export function TripGrid({ trips, onEdit, onDuplicate, onDelete, onCreateNew, viewMode = 'grid' }: TripGridProps) {
  return (
    <div className={cn(
      "gap-6",
      viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
        : "flex flex-col max-w-3xl mx-auto"
    )}>
      {/* Existing trips */}
      {trips.map((trip, index) => (
        <TripCard
          key={trip.id}
          trip={trip}
          onEdit={onEdit}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          index={index}
        />
      ))}
      
      {/* New Trip Card - Always last */}
      <NewTripCard onClick={onCreateNew} />
    </div>
  )
}

