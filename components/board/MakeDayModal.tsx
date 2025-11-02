'use client'

import { useState } from 'react'
import { useTripStore } from '@/lib/store/tripStore'
import type { Day, CardType } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Sparkles, Loader2, MapPin, Wand2 } from 'lucide-react'
import { nanoid } from 'nanoid'
import type { Card } from '@/lib/types'

interface MakeDayModalProps {
  day: Day
  tripId: string
  userId: string
  open: boolean
  onClose: () => void
}

interface GeneratedCard {
  type: CardType
  title: string
  description: string
  startTime?: string
  duration?: number
  tags: string[]
  location?: string
  cost?: {
    amount: number
    currency: string
  }
}

export function MakeDayModal({ day, tripId, userId, open, onClose }: MakeDayModalProps) {
  const [city, setCity] = useState('')
  const [context, setContext] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  
  const userVibes = useTripStore(state => state.userVibes)
  const addCard = useTripStore(state => state.addCard)
  const trip = useTripStore(state => state.trips[tripId])
  
  const handleGenerate = async () => {
    if (!city.trim()) {
      toast.error('Please enter a city')
      return
    }
    
    setIsGenerating(true)
    
    try {
      // Build context from other days
      const otherDaysContext = trip?.days
        .filter(d => d.id !== day.id)
        .map((d, idx) => {
          const dayTitle = d.title || `Day ${idx + 1}`
          const activities = d.cards.map(c => c.title).join(', ')
          return `${dayTitle}: ${activities || 'No activities yet'}`
        })
        .join('\n')
      
      // Combine user context with other days context
      const fullContext = [
        context.trim(),
        otherDaysContext && `\n\nOther days in trip:\n${otherDaysContext}`,
      ]
        .filter(Boolean)
        .join('\n')
      
      const response = await fetch('/api/ai-day-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: city,
          startTime: '09:00',
          endTime: '22:00',
          notes: fullContext,
          vibesContext: userVibes,
        }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to generate day plan')
      }
      
      const data = await response.json()
      const cards = data.cards || []
      
      if (cards.length === 0) {
        throw new Error('AI returned no activities. Please try again.')
      }
      
      // Add all generated cards to the day
      for (const generatedCard of cards) {
        const card: Omit<Card, 'createdAt' | 'updatedAt'> = {
          id: nanoid(),
          type: generatedCard.type,
          title: generatedCard.title,
          startTime: generatedCard.startTime,
          endTime: undefined,
          duration: generatedCard.duration,
          location: generatedCard.location
            ? { name: generatedCard.location }
            : undefined,
          cost: generatedCard.cost,
          tags: generatedCard.tags || [],
          notes: generatedCard.description || '',
          status: 'todo',
          links: [],
        }
        
        await addCard(tripId, day.id, card, userId)
      }
      
      toast.success(`Day made! Added ${cards.length} activities 🎉`)
      onClose()
      setCity('')
      setContext('')
    } catch (error: any) {
      console.error('Make my day error:', error)
      toast.error(error.message || 'Failed to make your day')
    } finally {
      setIsGenerating(false)
    }
  }
  
  const handleClose = () => {
    if (!isGenerating) {
      onClose()
      setCity('')
      setContext('')
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-primary" />
            Make My Day
          </DialogTitle>
          <DialogDescription>
            Let AI create a complete itinerary for {day.title || 'this day'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* City Input (Required) */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              What city? <span className="text-destructive">*</span>
            </label>
            <Input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g., Paris, Tokyo, New York"
              disabled={isGenerating}
            />
          </div>
          
          {/* Optional Context */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              What I want to do (optional)
            </label>
            <Textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g., Visit museums, try local food, explore historic sites..."
              rows={3}
              disabled={isGenerating}
            />
            <p className="text-xs text-muted-foreground">
              💡 AI will consider your travel vibes and other days in your trip
            </p>
          </div>
          
          {/* Show vibes if available */}
          {userVibes && (
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-xs text-muted-foreground mb-1">Using your vibes:</p>
              <p className="text-sm">
                {userVibes.comfort.pace_score <= 40 ? 'Relaxed pace' :
                 userVibes.comfort.pace_score <= 60 ? 'Moderate pace' : 'Active pace'}
                , ${userVibes.logistics.budget_ppd}/day budget, {userVibes.comfort.walking_km_per_day}km walking
              </p>
            </div>
          )}
        </div>
        
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={handleClose} disabled={isGenerating}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Making your day...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Make My Day
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

