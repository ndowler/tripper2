'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Sparkles, Loader2, Check, X } from 'lucide-react'
import { useTripStore } from '@/lib/store/tripStore'
import { nanoid } from 'nanoid'
import { toast } from 'sonner'
import type { CardType, Card, Day } from '@/lib/types'
import { SuggestionDetailModal } from './SuggestionDetailModal'

interface AISuggestion {
  type: CardType
  title: string
  description: string
  duration?: number
  tags: string[]
  location?: string
}

interface AiCardSuggestionProps {
  tripId: string
  dayId: string
  onClose: () => void
}

export function AiCardSuggestion({ tripId, dayId, onClose }: AiCardSuggestionProps) {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [customPrompt, setCustomPrompt] = useState('')
  const [hasGenerated, setHasGenerated] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState<AISuggestion | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  
  const trip = useTripStore(state => state.trips[tripId])
  const addCard = useTripStore(state => state.addCard)
  
  const currentDay = dayId === 'unassigned' 
    ? null 
    : trip?.days.find(d => d.id === dayId)
  
  const existingCards = dayId === 'unassigned'
    ? trip?.unassignedCards || []
    : currentDay?.cards || []

  const generateSuggestions = async (prompt?: string) => {
    const promptToUse = prompt || customPrompt || (
      currentDay 
        ? `activities for ${currentDay.title || 'this day'}` 
        : 'activities to add to the trip'
    )
    
    setIsLoading(true)
    setSuggestions([])
    setSelectedIndex(null)
    setHasGenerated(true)
    
    try {
      // Build context from the itinerary
      const context = {
        dayInfo: currentDay ? {
          title: currentDay.title,
          date: currentDay.date,
        } : null,
        existingCards: existingCards.map(card => ({
          title: card.title,
          type: card.type,
          startTime: card.startTime,
          duration: card.duration,
          location: card.location,
        })),
        otherDays: trip?.days
          .filter(d => d.id !== dayId)
          .map(d => ({
            title: d.title,
            date: d.date,
            cardCount: d.cards.length,
            highlights: d.cards.slice(0, 3).map(c => c.title),
          })) || [],
      }
      
      const response = await fetch('/api/ai-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: promptToUse,
          destination: trip?.title || 'the destination',
          category: 'contextual',
          context,
        }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to fetch suggestions')
      }
      
      const data = await response.json()
      setSuggestions(data.suggestions || [])
      toast.success('AI suggestions ready!')
    } catch (error: any) {
      console.error('AI suggestion error:', error)
      toast.error(error.message || 'Failed to get AI suggestions')
      onClose()
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (customPrompt.trim()) {
      generateSuggestions(customPrompt.trim())
    }
  }
  
  const handleQuickPrompt = (prompt: string) => {
    setCustomPrompt(prompt)
    generateSuggestions(prompt)
  }
  
  const handleClickSuggestion = (suggestion: AISuggestion, index: number) => {
    setSelectedSuggestion(suggestion)
    setShowDetailModal(true)
  }
  
  const handleAddFromModal = () => {
    if (!selectedSuggestion) return
    
    addCard(tripId, dayId, {
      id: nanoid(),
      type: selectedSuggestion.type,
      title: selectedSuggestion.title,
      duration: selectedSuggestion.duration,
      location: selectedSuggestion.location ? { name: selectedSuggestion.location } : undefined,
      notes: selectedSuggestion.description,
      tags: selectedSuggestion.tags,
      links: [],
      status: 'pending',
    })
    
    toast.success(`Added: ${selectedSuggestion.title}`)
    setShowDetailModal(false)
    setSelectedSuggestion(null)
    
    // Close after a brief delay
    setTimeout(() => {
      onClose()
    }, 500)
  }
  
  const handleBackToSuggestions = () => {
    setShowDetailModal(false)
    setSelectedSuggestion(null)
  }
  
  // Quick prompt suggestions
  const quickPrompts = [
    'dinner spot nearby',
    'morning activity',
    'coffee break',
    'evening entertainment',
  ]
  
  return (
    <div className="bg-card rounded-lg border p-3 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-sm">AI Suggestions</h3>
            <p className="text-xs text-muted-foreground">Tell me what you need</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Custom Prompt Input */}
      {!hasGenerated && (
        <>
          <form onSubmit={handleSubmit} className="space-y-2">
            <Input
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g., find me a spot for dinner by St. Peter's Basilica"
              className="text-sm"
              autoFocus
            />
            <Button type="submit" size="sm" className="w-full">
              <Sparkles className="w-3 h-3 mr-2" />
              Generate Suggestions
            </Button>
          </form>
          
          {/* Quick Prompts */}
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">Quick suggestions:</p>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleQuickPrompt(prompt)}
                  className="text-xs px-2 py-1 rounded-md bg-muted hover:bg-muted/80 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
      
      {/* Loading State */}
      {isLoading && (
        <div className="py-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
          <p className="text-sm text-muted-foreground">Generating smart suggestions...</p>
        </div>
      )}
      
      {/* Suggestions */}
      {!isLoading && suggestions.length > 0 && (
        <div className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleClickSuggestion(suggestion, index)}
              className="w-full text-left p-3 rounded-lg border transition-all hover:bg-muted/50 hover:border-primary/50 hover:shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary/10">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{suggestion.title}</div>
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {suggestion.description}
                  </div>
                  {suggestion.tags && suggestion.tags.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {suggestion.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                {suggestion.duration && (
                  <div className="text-xs text-muted-foreground flex-shrink-0">
                    {suggestion.duration}m
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
      
      {/* Action Buttons */}
      {!isLoading && suggestions.length > 0 && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => {
              setHasGenerated(false)
              setSuggestions([])
              setCustomPrompt('')
            }}
          >
            ← New Search
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => generateSuggestions()}
          >
            <Sparkles className="w-3 h-3 mr-2" />
            Regenerate
          </Button>
        </div>
      )}
      
      {/* Detail Modal */}
      <SuggestionDetailModal
        suggestion={selectedSuggestion}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onAdd={handleAddFromModal}
        onBack={handleBackToSuggestions}
      />
    </div>
  )
}
