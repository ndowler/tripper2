'use client'

import { TripCard } from './TripCard'
import type { Trip } from '@/lib/types'

interface TripGridProps {
  trips: Trip[]
  onEdit: (trip: Trip) => void
  onDuplicate: (trip: Trip) => void
  onDelete: (trip: Trip) => void
}

export function TripGrid({ trips, onEdit, onDuplicate, onDelete }: TripGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trips.map((trip) => (
        <TripCard
          key={trip.id}
          trip={trip}
          onEdit={onEdit}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

