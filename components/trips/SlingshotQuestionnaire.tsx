'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format, differenceInDays } from 'date-fns'
import { useTripStore } from '@/lib/store/tripStore'
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useIsMobile } from '@/lib/hooks/useIsMobile'
import { cn } from '@/lib/utils'
import { DollarSign, Users, Calendar, MapPin, Target, FileText, Sparkles } from 'lucide-react'
import type { SlingshotRequest, BudgetLevel, TripPurpose } from '@/lib/types/slingshot'
import { SlingshotLoadingOverlay } from './SlingshotLoadingOverlay'

interface SlingshotQuestionnaireProps {
  userId: string
  onBack: () => void
  onCancel: () => void
  onComplete: (tripId: string) => void
}

export function SlingshotQuestionnaire({ userId, onBack, onCancel, onComplete }: SlingshotQuestionnaireProps) {
  const router = useRouter()
  const isMobile = useIsMobile()
  const userVibes = useTripStore((state) => state.getUserVibes())
  const loadPreferences = useTripStore((state) => state.loadPreferences)
  const generateSlingshotTrip = useTripStore((state) => state.generateSlingshotTrip)

  // Form state
  const [destination, setDestination] = useState('')
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState(format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'))
  const [budget, setBudget] = useState<BudgetLevel>('moderate')
  const [travelers, setTravelers] = useState(1)
  const [tripPurpose, setTripPurpose] = useState<TripPurpose>('solo_adventure')
  const [mustDos, setMustDos] = useState('')
  const [existingPlans, setExistingPlans] = useState('')
  
  // UI state
  const [isGenerating, setIsGenerating] = useState(false)
  const [showVibeCheck, setShowVibeCheck] = useState(false)
  const [isLoadingVibes, setIsLoadingVibes] = useState(true)
  const [currentDay, setCurrentDay] = useState(0)
  const [totalDays, setTotalDays] = useState(0)

  // Load user preferences and check if vibes exist
  useEffect(() => {
    async function checkVibes() {
      try {
        setIsLoadingVibes(true)
        await loadPreferences(userId)
        
        // Check again after loading
        const vibes = useTripStore.getState().getUserVibes()
        if (!vibes) {
          setShowVibeCheck(true)
        }
      } catch (error) {
        console.error('Failed to load preferences:', error)
        // If we can't load, assume vibes are missing
        setShowVibeCheck(true)
      } finally {
        setIsLoadingVibes(false)
      }
    }
    
    checkVibes()
  }, [userId, loadPreferences])

  const handleVibeRedirect = () => {
    // Store return path in localStorage
    localStorage.setItem('slingshot-return', 'true')
    router.push('/vibes')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!destination.trim()) {
      toast.error('Please enter a destination')
      return
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    const duration = differenceInDays(end, start) + 1

    if (duration < 1) {
      toast.error('End date must be after start date')
      return
    }

    if (duration > 30) {
      toast.error('Maximum trip duration is 30 days')
      return
    }

    if (travelers < 1) {
      toast.error('Number of travelers must be at least 1')
      return
    }

    // Check for vibes again before generation
    if (!userVibes) {
      setShowVibeCheck(true)
      return
    }

    setIsGenerating(true)
    setTotalDays(duration)
    setCurrentDay(0)

    try {
      const request: SlingshotRequest = {
        destination: destination.trim(),
        startDate,
        endDate,
        duration,
        budget,
        travelers,
        tripPurpose,
        mustDos: mustDos.trim() || undefined,
        existingPlans: existingPlans.trim() || undefined,
        vibes: userVibes,
      }

      const tripId = await generateSlingshotTrip(request, userId)
      
      toast.success('Trip generated successfully!')
      onComplete(tripId)
      
      // Navigate to the new trip
      router.push(`/trip/${tripId}`)
    } catch (error) {
      console.error('Failed to generate trip:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate trip. Please try again.'
      toast.error(errorMessage)
      setIsGenerating(false)
    }
  }

  const budgetOptions: Array<{ value: BudgetLevel; label: string; icon: string; description: string }> = [
    { value: 'budget', label: 'Budget', icon: '💰', description: 'Affordable eats, free activities' },
    { value: 'moderate', label: 'Moderate', icon: '💳', description: 'Mix of budget and splurge' },
    { value: 'comfortable', label: 'Comfortable', icon: '🏨', description: 'Nice restaurants, paid experiences' },
    { value: 'luxury', label: 'Luxury', icon: '👑', description: 'Premium everything' },
  ]

  const purposeOptions: Array<{ value: TripPurpose; label: string }> = [
    { value: 'honeymoon', label: 'Honeymoon' },
    { value: 'family_vacation', label: 'Family Vacation' },
    { value: 'solo_adventure', label: 'Solo Adventure' },
    { value: 'business_leisure', label: 'Business + Leisure' },
    { value: 'friend_getaway', label: 'Friend Getaway' },
    { value: 'other', label: 'Other' },
  ]

  // Show loading state while checking for vibes
  if (isLoadingVibes) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>Slingshot</DialogTitle>
          <DialogDescription>
            Loading your preferences...
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">Checking your travel vibes...</p>
          </div>
        </div>
      </>
    )
  }

  // Show vibe check modal if vibes are missing
  if (showVibeCheck) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>Complete Your Travel Vibes</DialogTitle>
          <DialogDescription>
            Slingshot needs your travel preferences to personalize your trip
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">
              We'll use your vibes to tailor everything — from activity pace to restaurant choices to when your day starts.
              Takes about 2 minutes.
            </p>
          </div>

          <div className="flex justify-between gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={onBack}>
              Back
            </Button>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="button" onClick={handleVibeRedirect}>
                Complete Vibes Quiz
              </Button>
            </div>
          </div>
        </div>
      </>
    )
  }

  // Show loading overlay during generation
  if (isGenerating) {
    return (
      <SlingshotLoadingOverlay
        currentDay={currentDay}
        totalDays={totalDays}
        onDayUpdate={setCurrentDay}
      />
    )
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Slingshot Trip Generator
        </DialogTitle>
        <DialogDescription>
          Answer a few questions and we'll create a personalized itinerary
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 mt-4 max-h-[70vh] overflow-y-auto px-1">
        {/* Destination */}
        <div>
          <Label htmlFor="destination" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Where are you going? <span className="text-destructive">*</span>
          </Label>
          <Input
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g., Tokyo, Japan"
            required
            autoFocus
            className="mt-2"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Start Date <span className="text-destructive">*</span>
            </Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="endDate">
              End Date <span className="text-destructive">*</span>
            </Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="mt-2"
              min={startDate}
            />
          </div>
        </div>

        {/* Budget */}
        <div>
          <Label className="flex items-center gap-2 mb-3">
            <DollarSign className="h-4 w-4" />
            Budget Level <span className="text-destructive">*</span>
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {budgetOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setBudget(option.value)}
                className={cn(
                  'flex flex-col items-start gap-1 rounded-lg border-2 p-3 text-left transition-colors',
                  budget === option.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{option.icon}</span>
                  <span className="font-medium text-sm">{option.label}</span>
                </div>
                <span className="text-xs text-muted-foreground">{option.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Travelers */}
        <div>
          <Label htmlFor="travelers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Number of Travelers <span className="text-destructive">*</span>
          </Label>
          <Input
            id="travelers"
            type="number"
            min="1"
            max="20"
            value={travelers}
            onChange={(e) => setTravelers(parseInt(e.target.value) || 1)}
            required
            className="mt-2"
          />
        </div>

        {/* Trip Purpose */}
        <div>
          <Label htmlFor="tripPurpose" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Trip Purpose <span className="text-destructive">*</span>
          </Label>
          <select
            id="tripPurpose"
            value={tripPurpose}
            onChange={(e) => setTripPurpose(e.target.value as TripPurpose)}
            required
            className={cn(
              'mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
            )}
          >
            {purposeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Must-dos (optional) */}
        <div>
          <Label htmlFor="mustDos" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Must-Do Activities (Optional)
          </Label>
          <Textarea
            id="mustDos"
            value={mustDos}
            onChange={(e) => setMustDos(e.target.value)}
            placeholder="e.g., Visit the Eiffel Tower, try authentic ramen, see cherry blossoms"
            rows={3}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Specific things you want to do or see
          </p>
        </div>

        {/* Existing Plans (optional) */}
        <div>
          <Label htmlFor="existingPlans" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Existing Plans (Optional)
          </Label>
          <Textarea
            id="existingPlans"
            value={existingPlans}
            onChange={(e) => setExistingPlans(e.target.value)}
            placeholder="e.g., Dinner reservation at 7pm on Day 2, flight arrives at 10am"
            rows={3}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Any reservations or fixed commitments
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-between gap-3 pt-4 sticky bottom-0 bg-background pb-2">
          <Button type="button" variant="ghost" onClick={onBack}>
            Back
          </Button>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Generate Trip
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}

