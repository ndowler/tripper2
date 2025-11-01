'use client'

import { useState, useEffect } from 'react'
import { useTripStore } from '@/lib/store/tripStore'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import type { Trip } from '@/lib/types'

interface EditTripModalProps {
  trip: Trip | null
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
}

export function EditTripModal({ trip, open, onOpenChange, userId }: EditTripModalProps) {
  const updateTrip = useTripStore((state) => state.updateTrip)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [destination, setDestination] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (trip) {
      setTitle(trip.title)
      setDescription(trip.description || '')
      setDestination(trip.destination || '')
    }
  }, [trip])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!trip) return

    if (!title.trim()) {
      toast.error('Please enter a trip title')
      return
    }

    setIsSubmitting(true)

    try {
      await updateTrip(trip.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        destination: destination.trim() || undefined,
      }, userId)

      toast.success('Trip updated!')
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to update trip:', error)
      toast.error('Failed to update trip. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (trip) {
      setTitle(trip.title)
      setDescription(trip.description || '')
      setDestination(trip.destination || '')
    }
    onOpenChange(false)
  }

  if (!trip) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Trip</DialogTitle>
          <DialogDescription>
            Update your trip details
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label htmlFor="edit-title" className="block text-sm font-medium mb-2">
              Trip Title <span className="text-destructive">*</span>
            </label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Summer in Italy"
              required
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="edit-description" className="block text-sm font-medium mb-2">
              Description
            </label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., 2-week adventure through Tuscany"
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="edit-destination" className="block text-sm font-medium mb-2">
              Destination
            </label>
            <Input
              id="edit-destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g., Rome, Italy"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

