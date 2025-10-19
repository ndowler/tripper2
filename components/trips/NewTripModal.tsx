'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { nanoid } from 'nanoid'
import { format } from 'date-fns'
import { useTripStore } from '@/lib/store/tripStore'
import { DEFAULT_TIMEZONE } from '@/lib/constants'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

interface NewTripModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewTripModal({ open, onOpenChange }: NewTripModalProps) {
  const router = useRouter()
  const addTrip = useTripStore((state) => state.addTrip)
  const setCurrentTrip = useTripStore((state) => state.setCurrentTrip)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [destination, setDestination] = useState('')
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error('Please enter a trip title')
      return
    }

    const tripId = nanoid()
    const dayId = nanoid()

    addTrip({
      id: tripId,
      title: title.trim(),
      description: description.trim() || undefined,
      destination: destination.trim() || undefined,
      timezone: DEFAULT_TIMEZONE,
      days: [
        {
          id: dayId,
          date: startDate,
          title: 'Day 1',
          cards: [],
        },
      ],
      unassignedCards: [],
    })

    setCurrentTrip(tripId)
    toast.success('Trip created!')
    
    // Reset form
    setTitle('')
    setDescription('')
    setDestination('')
    setStartDate(format(new Date(), 'yyyy-MM-dd'))
    
    onOpenChange(false)
    
    // Navigate to the new trip
    router.push(`/trip/${tripId}`)
  }

  const handleCancel = () => {
    setTitle('')
    setDescription('')
    setDestination('')
    setStartDate(format(new Date(), 'yyyy-MM-dd'))
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Trip</DialogTitle>
          <DialogDescription>
            Start planning your next adventure by creating a new trip
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Trip Title <span className="text-destructive">*</span>
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Summer in Italy"
              required
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., 2-week adventure through Tuscany"
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="destination" className="block text-sm font-medium mb-2">
              Destination
            </label>
            <Input
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g., Rome, Italy"
            />
          </div>

          <div>
            <label htmlFor="startDate" className="block text-sm font-medium mb-2">
              Start Date
            </label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">Create Trip</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

