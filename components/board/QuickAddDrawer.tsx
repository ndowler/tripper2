'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Sparkles } from 'lucide-react'
import { useTripStore } from '@/lib/store/tripStore'
import { SuggestionCard } from '@/lib/types/suggestions'
import { suggestionToCard } from '@/lib/utils/suggestions'
import { toast } from 'sonner'

interface QuickAddDrawerProps {
  isOpen: boolean
  onClose: () => void
  timeSlot: 'morning' | 'afternoon' | 'evening'
  dayId: string
  tripId: string
  destination?: string
}

export function QuickAddDrawer({ isOpen, onClose, timeSlot, dayId, tripId, destination }: QuickAddDrawerProps) {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<SuggestionCard[]>([])
  const addCard = useTripStore(state => state.addCard)
  const userVibes = useTripStore(state => state.userVibes)
  
  const timeSlotLabels = {
    morning: '🌅 Morning',
    afternoon: '☀️ Afternoon',
    evening: '🌆 Evening',
  }
  
  const handleGenerate = async () => {
    if (!query.trim()) {
      toast.error('Please enter what you want to do')
      return
    }
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/vibe-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: destination || 'the destination',
          vibes: userVibes,
          query: query,
          timeSlot: timeSlot,
          limit: 5,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to generate suggestions')
      }
      
      const data = await response.json()
      setSuggestions(data.suggestions || [])
      
      if (data.suggestions?.length === 0) {
        toast.error('No suggestions found. Try a different query.')
      }
    } catch (error) {
      console.error('Error generating suggestions:', error)
      toast.error('Failed to generate suggestions')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleAddSuggestion = (suggestion: SuggestionCard) => {
    const card = suggestionToCard(suggestion)
    addCard(tripId, dayId, card)
    toast.success(`Added ${suggestion.title}`)
    
    // Remove from suggestions
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id))
    
    // Close if no more suggestions
    if (suggestions.length <= 1) {
      handleClose()
    }
  }
  
  const handleClose = () => {
    setQuery('')
    setSuggestions([])
    onClose()
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Add to {timeSlotLabels[timeSlot]}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {suggestions.length === 0 ? (
            <>
              <div>
                <Input
                  placeholder="What do you want to do? (e.g., 'coffee shop with wifi')"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  disabled={isLoading}
                  autoFocus
                />
              </div>
              
              <Button
                onClick={handleGenerate}
                disabled={isLoading || !query.trim()}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Get Suggestions
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <div className="text-sm text-muted-foreground mb-2">
                Found {suggestions.length} suggestion{suggestions.length !== 1 ? 's' : ''} for "{query}"
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h4 className="font-semibold">{suggestion.title}</h4>
                        {suggestion.subtitle && (
                          <p className="text-sm text-muted-foreground">{suggestion.subtitle}</p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAddSuggestion(suggestion)}
                      >
                        Add
                      </Button>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {suggestion.description}
                    </p>
                    
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {suggestion.est_duration_min && (
                        <span>⏱ {suggestion.est_duration_min}min</span>
                      )}
                      {suggestion.price_tier > 0 && (
                        <span>💵 {'$'.repeat(suggestion.price_tier)}</span>
                      )}
                      {suggestion.area && (
                        <span>📍 {suggestion.area}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <Button
                variant="outline"
                onClick={() => setSuggestions([])}
                className="w-full"
              >
                New Search
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

