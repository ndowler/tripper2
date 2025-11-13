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
import { useIsMobile } from '@/lib/hooks/useIsMobile'
import { cn } from '@/lib/utils'
import { Sparkles, Edit3 } from 'lucide-react'
import { SlingshotQuestionnaire } from './SlingshotQuestionnaire'

interface NewTripModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
}

type ModalView = 'choice' | 'manual' | 'slingshot'

export function NewTripModal({ open, onOpenChange, userId }: NewTripModalProps) {
  const router = useRouter()
  const addTrip = useTripStore((state) => state.addTrip)
  const isMobile = useIsMobile()
  const setCurrentTrip = useTripStore((state) => state.setCurrentTrip)
  const getAllTrips = useTripStore((state) => state.getAllTrips)

  const [view, setView] = useState<ModalView>('choice')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [destination, setDestination] = useState('')
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error('Please enter a trip title')
      return
    }

    setIsSubmitting(true)

    try {
      const tripId = nanoid()
      const dayId = nanoid()

      await addTrip({
        id: tripId,
        title: title.trim(),
        description: description.trim() || undefined,
        destination: destination.trim() ? { city: destination.trim() } : undefined,
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
      }, userId)

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
    } catch (error) {
      console.error('Failed to create trip:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to create trip. Please try again.'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setTitle('')
    setDescription('')
    setDestination('')
    setStartDate(format(new Date(), 'yyyy-MM-dd'))
    setView('choice')
    onOpenChange(false)
  }

  const handleBack = () => {
    setView('choice')
  }

  const handleSlingshotComplete = (tripId: string) => {
    // Reset form and close modal
    setTitle('')
    setDescription('')
    setDestination('')
    setStartDate(format(new Date(), 'yyyy-MM-dd'))
    setView('choice')
    onOpenChange(false)
    
    // Navigate to the new trip (handled by SlingshotQuestionnaire)
  }

  // Reset view when modal closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setView('choice')
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={cn(
        isMobile 
          ? 'h-full w-full max-w-full rounded-none' // Full-screen on mobile
          : view === 'slingshot' ? 'sm:max-w-[600px]' : 'sm:max-w-[500px]' // Wider for slingshot
        )}>
        {view === 'choice' && (
        <>
        <DialogHeader>
        <DialogTitle>Create New Trip</DialogTitle>
        <DialogDescription>
        Choose how you'd like to plan your trip
        </DialogDescription>
        </DialogHeader>
        
                <div className="mt-4 flex flex-col items-center space-y-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full max-w-md h-auto py-6 flex flex-col items-center gap-2 hover:bg-accent"
                    onClick={() => setView('manual')}
                  >
                    <div className="flex items-center gap-2">
                      <Edit3 className="h-5 w-5" />
                      <span className="font-semibold text-lg">Make my Own</span>
                    </div>
                    <span className="text-sm text-muted-foreground text-center">
                      Start with a blank canvas and build your itinerary from scratch
                    </span>
                  </Button>
        
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full max-w-md h-auto py-6 flex flex-col items-center gap-2 hover:bg-accent hover:border-primary"
                    onClick={() => setView('slingshot')}
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <span className="font-semibold text-lg">Slingshot</span>
                    </div>
                    <span className="text-sm text-muted-foreground text-center">
                      Answer a few questions and let AI generate a personalized itinerary
                    </span>
                  </Button>
        
                  <div className="flex justify-center pt-4 w-full">
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </>
            )}

        {view === 'manual' && (
          <>
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

              <div className="flex justify-between gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={handleBack} disabled={isSubmitting}>
                  Back
                </Button>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create Trip'}
                  </Button>
                </div>
              </div>
            </form>
          </>
        )}

        {view === 'slingshot' && (
          <SlingshotQuestionnaire
            userId={userId}
            onBack={handleBack}
            onCancel={handleCancel}
            onComplete={handleSlingshotComplete}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

