'use client'

import { useState } from 'react'
import { PlusCircle } from 'lucide-react'
import { useTripStore } from '@/lib/store/tripStore'
import { TripGrid } from '@/components/trips/TripGrid'
import { EmptyTripsState } from '@/components/trips/EmptyTripsState'
import { NewTripModal } from '@/components/trips/NewTripModal'
import { EditTripModal } from '@/components/trips/EditTripModal'
import { DeleteTripDialog } from '@/components/trips/DeleteTripDialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import type { Trip } from '@/lib/types'

export default function TripsPage() {
  const getAllTrips = useTripStore((state) => state.getAllTrips)
  const duplicateTrip = useTripStore((state) => state.duplicateTrip)
  
  const trips = getAllTrips()

  const [isNewTripModalOpen, setIsNewTripModalOpen] = useState(false)
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null)
  const [deletingTrip, setDeletingTrip] = useState<Trip | null>(null)

  const handleDuplicate = (trip: Trip) => {
    duplicateTrip(trip.id)
    toast.success(`"${trip.title}" duplicated`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">✈️ My Trips</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {trips.length} {trips.length === 1 ? 'trip' : 'trips'}
              </p>
            </div>
            <Button onClick={() => setIsNewTripModalOpen(true)} className="gap-2">
              <PlusCircle className="h-5 w-5" />
              New Trip
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {trips.length === 0 ? (
          <EmptyTripsState onCreateTrip={() => setIsNewTripModalOpen(true)} />
        ) : (
          <TripGrid
            trips={trips}
            onEdit={(trip) => setEditingTrip(trip)}
            onDuplicate={handleDuplicate}
            onDelete={(trip) => setDeletingTrip(trip)}
          />
        )}
      </main>

      {/* Modals */}
      <NewTripModal
        open={isNewTripModalOpen}
        onOpenChange={setIsNewTripModalOpen}
      />

      <EditTripModal
        trip={editingTrip}
        open={!!editingTrip}
        onOpenChange={(open) => !open && setEditingTrip(null)}
      />

      <DeleteTripDialog
        trip={deletingTrip}
        open={!!deletingTrip}
        onOpenChange={(open) => !open && setDeletingTrip(null)}
      />
    </div>
  )
}

