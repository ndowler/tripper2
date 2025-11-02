'use client'

import { useState } from 'react'
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
  userId: string
}

export function DeleteTripDialog({ trip, open, onOpenChange, userId }: DeleteTripDialogProps) {
  const deleteTrip = useTripStore((state) => state.deleteTrip)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!trip) return

    setIsDeleting(true)

    try {
      await deleteTrip(trip.id, userId)
      toast.success(`"${trip.title}" deleted`)
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to delete trip:', error)
      toast.error('Failed to delete trip. Please try again.')
    } finally {
      setIsDeleting(false)
    }
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
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Trip'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

