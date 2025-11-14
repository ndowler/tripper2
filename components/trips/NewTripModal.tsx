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
          ? 'h-full w-full max-w-full rounded-none p-6 flex flex-col' // Full-screen with flex layout on mobile
          : view === 'slingshot' ? 'sm:max-w-[600px]' : 'sm:max-w-[500px]' // Wider for slingshot
        )}>
        {view === 'choice' && (
        <>
        <DialogHeader>
        <DialogTitle className={cn(isMobile && 'text-2xl')}>Create New Trip</DialogTitle>
        <DialogDescription className={cn(isMobile && 'text-base')}>
        Choose how you'd like to plan your trip
        </DialogDescription>
        </DialogHeader>
        
                <div className={cn(
                  "flex flex-col items-center space-y-4",
                  isMobile ? "mt-8 flex-1" : "mt-4"
                )}>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full max-w-md h-auto flex flex-col items-center gap-2 hover:bg-accent",
                      isMobile ? "py-8 min-h-[120px]" : "py-6"
                    )}
                    onClick={() => setView('manual')}
                  >
                    <div className="flex items-center gap-2">
                      <Edit3 className={cn(isMobile ? "h-6 w-6" : "h-5 w-5")} />
                      <span className={cn(
                        "font-semibold",
                        isMobile ? "text-xl" : "text-lg"
                      )}>Make my Own</span>
                    </div>
                    <span className={cn(
                      "text-muted-foreground text-center px-2",
                      isMobile ? "text-base" : "text-sm"
                    )}>
                      Start with a blank canvas and build your itinerary from scratch
                    </span>
                  </Button>
        
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full max-w-md h-auto flex flex-col items-center gap-2 hover:bg-accent hover:border-primary",
                      isMobile ? "py-8 min-h-[120px]" : "py-6"
                    )}
                    onClick={() => setView('slingshot')}
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className={cn(
                        "text-primary",
                        isMobile ? "h-6 w-6" : "h-5 w-5"
                      )} />
                      <span className={cn(
                        "font-semibold",
                        isMobile ? "text-xl" : "text-lg"
                      )}>Slingshot</span>
                    </div>
                    <span className={cn(
                      "text-muted-foreground text-center px-2",
                      isMobile ? "text-base" : "text-sm"
                    )}>
                      Answer a few questions and let AI generate a personalized itinerary
                    </span>
                  </Button>
        
                  <div className={cn(
                    "flex justify-center w-full",
                    isMobile ? "pt-8 mt-auto" : "pt-4"
                  )}>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => onOpenChange(false)}
                      className={cn(isMobile && "h-11 min-w-[120px]")}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </>
            )}

        {view === 'manual' && (
          <>
            <DialogHeader>
              <DialogTitle className={cn(isMobile && 'text-2xl')}>Create New Trip</DialogTitle>
              <DialogDescription className={cn(isMobile && 'text-base')}>
                Start planning your next adventure by creating a new trip
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className={cn(
              "space-y-4",
              isMobile ? "mt-6 flex-1 flex flex-col" : "mt-4"
            )}>
              <div className={cn(isMobile && "flex-1 space-y-4 overflow-y-auto")}>
                <div>
                  <label htmlFor="title" className={cn(
                    "block font-medium mb-2",
                    isMobile ? "text-base" : "text-sm"
                  )}>
                    Trip Title <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Summer in Italy"
                    required
                    autoFocus
                    className={cn(isMobile && "h-12 text-base")}
                  />
                </div>

                <div>
                  <label htmlFor="description" className={cn(
                    "block font-medium mb-2",
                    isMobile ? "text-base" : "text-sm"
                  )}>
                    Description
                  </label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., 2-week adventure through Tuscany"
                    rows={isMobile ? 4 : 3}
                    className={cn(isMobile && "text-base")}
                  />
                </div>

                <div>
                  <label htmlFor="destination" className={cn(
                    "block font-medium mb-2",
                    isMobile ? "text-base" : "text-sm"
                  )}>
                    Destination
                  </label>
                  <Input
                    id="destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g., Rome, Italy"
                    className={cn(isMobile && "h-12 text-base")}
                  />
                </div>

                <div>
                  <label htmlFor="startDate" className={cn(
                    "block font-medium mb-2",
                    isMobile ? "text-base" : "text-sm"
                  )}>
                    Start Date
                  </label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={cn(isMobile && "h-12 text-base")}
                  />
                </div>
              </div>

              <div className={cn(
                "flex gap-3 pt-4",
                isMobile ? "flex-col border-t pt-6" : "justify-between"
              )}>
                {!isMobile && (
                  <Button type="button" variant="ghost" onClick={handleBack} disabled={isSubmitting}>
                    Back
                  </Button>
                )}
                <div className={cn(
                  "flex gap-3",
                  isMobile && "flex-col-reverse"
                )}>
                  {isMobile && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={handleBack} 
                      disabled={isSubmitting}
                      className="h-11"
                    >
                      Back
                    </Button>
                  )}
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={cn(isMobile && "h-11")}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Trip'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCancel} 
                    disabled={isSubmitting}
                    className={cn(isMobile && "h-11")}
                  >
                    Cancel
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

