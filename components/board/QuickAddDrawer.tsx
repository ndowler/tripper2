'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Sparkles, Edit3 } from 'lucide-react'
import { useTripStore } from '@/lib/store/tripStore'
import { SuggestionCard } from '@/lib/types/suggestions'
import { suggestionToCard } from '@/lib/utils/suggestions'
import { toast } from 'sonner'
import { Card } from '@/lib/types'
import { v4 as uuidv4 } from 'uuid'

interface QuickAddDrawerProps {
  isOpen: boolean
  onClose: () => void
  timeSlot: 'morning' | 'afternoon' | 'evening'
  dayId: string
  tripId: string
  destination?: string
}

export function QuickAddDrawer({ isOpen, onClose, timeSlot, dayId, tripId, destination }: QuickAddDrawerProps) {
  const [mode, setMode] = useState<'choice' | 'manual' | 'ai'>('choice')
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<SuggestionCard[]>([])
  
  // Manual entry state
  const [manualTitle, setManualTitle] = useState('')
  const [manualDescription, setManualDescription] = useState('')
  const [manualLocation, setManualLocation] = useState('')
  
  const addCard = useTripStore(state => state.addCard)
  const userVibes = useTripStore(state => state.userVibes)
  
  const timeSlotLabels = {
    morning: '🌅 Morning',
    afternoon: '☀️ Afternoon',
    evening: '🌆 Evening',
  }
  
  // Get suggested time for the time slot
  const getSuggestedTime = (slot: 'morning' | 'afternoon' | 'evening'): string => {
    if (slot === 'morning') return '09:00'
    if (slot === 'afternoon') return '14:00'
    return '19:00'
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
  
  const handleManualAdd = () => {
    if (!manualTitle.trim()) {
      toast.error('Please enter an activity title')
      return
    }
    
    const card: Card = {
      id: uuidv4(),
      title: manualTitle.trim(),
      description: manualDescription.trim() || undefined,
      type: 'activity',
      status: 'planned',
      location: manualLocation.trim() ? {
        name: manualLocation.trim()
      } : undefined,
      startTime: getSuggestedTime(timeSlot),
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    addCard(tripId, dayId, card)
    toast.success(`Added ${manualTitle}`)
    handleClose()
  }
  
  const handleClose = () => {
    setMode('choice')
    setQuery('')
    setSuggestions([])
    setManualTitle('')
    setManualDescription('')
    setManualLocation('')
    onClose()
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === 'manual' ? <Edit3 className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            Add to {timeSlotLabels[timeSlot]}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {mode === 'choice' && (
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-24 flex flex-col gap-2"
                onClick={() => setMode('manual')}
              >
                <Edit3 className="w-6 h-6" />
                <div className="text-sm font-medium">Manual Entry</div>
                <div className="text-xs text-muted-foreground">Create your own</div>
              </Button>
              
              <Button
                variant="outline"
                className="h-24 flex flex-col gap-2"
                onClick={() => setMode('ai')}
              >
                <Sparkles className="w-6 h-6" />
                <div className="text-sm font-medium">AI Suggest</div>
                <div className="text-xs text-muted-foreground">Get ideas</div>
              </Button>
            </div>
          )}
          
          {mode === 'manual' && (
            <>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Activity Title *</label>
                  <Input
                    placeholder="e.g., Visit the Louvre"
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleManualAdd()}
                    autoFocus
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Location (optional)</label>
                  <Input
                    placeholder="e.g., Rue de Rivoli, Paris"
                    value={manualLocation}
                    onChange={(e) => setManualLocation(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Description (optional)</label>
                  <Textarea
                    placeholder="Add any notes or details..."
                    value={manualDescription}
                    onChange={(e) => setManualDescription(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setMode('choice')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleManualAdd}
                  disabled={!manualTitle.trim()}
                  className="flex-1"
                >
                  Add Activity
                </Button>
              </div>
            </>
          )}
          
          {mode === 'ai' && (
            <>
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
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setMode('choice')}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleGenerate}
                      disabled={isLoading || !query.trim()}
                      className="flex-1"
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
                  </div>
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
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

