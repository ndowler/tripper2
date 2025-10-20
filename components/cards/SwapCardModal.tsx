'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2, RefreshCw, MapPin, Clock, DollarSign } from 'lucide-react'
import { Card } from '@/lib/types'
import { useTripStore } from '@/lib/store/tripStore'
import { toast } from 'sonner'

interface SwapCardModalProps {
  card: Card | null
  isOpen: boolean
  onClose: () => void
  tripId: string
  dayId: string
  destination?: string
}

interface SwapSuggestion {
  title: string
  description: string
  location?: { name: string; address?: string }
  duration?: number
  cost?: { amount: number; currency: string }
  tags: string[]
  confidence: number
  reasoning: string
}

export function SwapCardModal({ card, isOpen, onClose, tripId, dayId, destination }: SwapCardModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<SwapSuggestion[]>([])
  const updateCard = useTripStore(state => state.updateCard)
  const userVibes = useTripStore(state => state.userVibes)
  
  useEffect(() => {
    if (isOpen && card) {
      loadSuggestions()
    }
  }, [isOpen, card])
  
  const loadSuggestions = async () => {
    if (!card) return
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/ai-swap-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          card,
          destination: destination || 'the destination',
          vibes: userVibes,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to generate alternatives')
      }
      
      const data = await response.json()
      setSuggestions(data.suggestions || [])
    } catch (error) {
      console.error('Error generating alternatives:', error)
      toast.error('Failed to generate alternatives')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleSwap = (suggestion: SwapSuggestion) => {
    if (!card) return
    
    // Update the card with new data
    updateCard(tripId, dayId, card.id, {
      title: suggestion.title,
      notes: suggestion.description,
      location: suggestion.location,
      duration: suggestion.duration,
      cost: suggestion.cost,
      tags: suggestion.tags,
    })
    
    toast.success(`Swapped to ${suggestion.title}`)
    handleClose()
  }
  
  const handleClose = () => {
    setSuggestions([])
    onClose()
  }
  
  if (!card) return null
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Swap "{card.title}"
          </DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-sm text-muted-foreground">Finding similar alternatives...</p>
          </div>
        ) : suggestions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No alternatives found</p>
            <Button onClick={loadSuggestions}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Found {suggestions.length} similar alternative{suggestions.length !== 1 ? 's' : ''}
            </p>
            
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-1">{suggestion.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {suggestion.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
                      {suggestion.location?.name && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{suggestion.location.name}</span>
                        </div>
                      )}
                      {suggestion.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{Math.floor(suggestion.duration / 60)}h {suggestion.duration % 60}m</span>
                        </div>
                      )}
                      {suggestion.cost && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          <span>${suggestion.cost.amount}</span>
                        </div>
                      )}
                    </div>
                    
                    {suggestion.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {suggestion.tags.map((tag, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="text-xs text-muted-foreground italic">
                      💡 {suggestion.reasoning}
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleSwap(suggestion)}
                    size="sm"
                  >
                    Swap
                  </Button>
                </div>
              </div>
            ))}
            
            <Button
              variant="outline"
              onClick={handleClose}
              className="w-full"
            >
              Keep Original
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

