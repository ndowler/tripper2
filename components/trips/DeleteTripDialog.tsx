'use client'

import { useTripStore } from '@/lib/store/tripStore'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import type { Trip } from '@/lib/types'

interface DeleteTripDialogProps {
  trip: Trip | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteTripDialog({ trip, open, onOpenChange }: DeleteTripDialogProps) {
  const deleteTrip = useTripStore((state) => state.deleteTrip)

  const handleDelete = () => {
    if (!trip) return

    deleteTrip(trip.id)
    toast.success(`"${trip.title}" deleted`)
    onOpenChange(false)
  }

  if (!trip) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Trip?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>&quot;{trip.title}&quot;</strong>?
            This will permanently remove the trip and all {trip.days.length} day{trip.days.length !== 1 ? 's' : ''} with their activities.
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
          >
            Delete Trip
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

