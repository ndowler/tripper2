'use client'

import { useState, useEffect, useMemo } from 'react'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Command, 
  Search, 
  Sparkles,
  MapPin,
  Utensils,
  Plane,
  Hotel,
  Train,
  StickyNote,
  ShoppingBag,
  Ticket,
  Plus,
  Loader2,
  Check
} from 'lucide-react'
import { CARD_TEMPLATES, AI_SUGGESTION_CATEGORIES, type CardTemplate } from '@/lib/templates'
import { useTripStore } from '@/lib/store/tripStore'
import { nanoid } from 'nanoid'
import { toast } from 'sonner'
import type { CardType } from '@/lib/types'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  tripId: string
  defaultDayId?: string // If opened from a specific day
}

const CARD_TYPE_ICONS = {
  activity: MapPin,
  meal: Utensils,
  restaurant: Utensils,
  transit: Train,
  flight: Plane,
  hotel: Hotel,
  note: StickyNote,
  shopping: ShoppingBag,
  entertainment: Ticket,
}

interface AISuggestion {
  type: CardType
  title: string
  description: string
  duration?: number
  tags: string[]
  location?: string
}

export function CommandPalette({ isOpen, onClose, tripId, defaultDayId = 'unassigned' }: CommandPaletteProps) {
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [view, setView] = useState<'templates' | 'ai'>('templates')
  const [aiCategory, setAiCategory] = useState<string | null>(null)
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([])
  const [isLoadingAi, setIsLoadingAi] = useState(false)
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<number>>(new Set())
  
  const addCard = useTripStore(state => state.addCard)
  const trip = useTripStore(state => state.trips[tripId])
  const userVibes = useTripStore(state => state.userVibes)
  
  // Filter templates based on search
  const filteredTemplates = useMemo(() => {
    if (!search) return CARD_TEMPLATES
    
    const query = search.toLowerCase()
    return CARD_TEMPLATES.filter(template => 
      template.title.toLowerCase().includes(query) ||
      template.description.toLowerCase().includes(query) ||
      template.suggestedTags?.some(tag => tag.toLowerCase().includes(query))
    )
  }, [search])
  
  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [search, view])
  
  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const items = view === 'templates' ? filteredTemplates : AI_SUGGESTION_CATEGORIES
      
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => Math.min(prev + 1, items.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (view === 'templates') {
          const template = filteredTemplates[selectedIndex]
          if (template) handleSelectTemplate(template)
        } else {
          const category = AI_SUGGESTION_CATEGORIES[selectedIndex]
          if (category) handleSelectAiCategory(category.id)
        }
      } else if (e.key === 'Escape') {
        e.preventDefault()
        if (aiCategory) {
          setAiCategory(null)
        } else {
          onClose()
        }
      } else if (e.key === 'Tab') {
        e.preventDefault()
        setView(prev => prev === 'templates' ? 'ai' : 'templates')
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, filteredTemplates, view, aiCategory])
  
  const handleSelectTemplate = (template: CardTemplate) => {
    const newCard = {
      id: nanoid(),
      type: template.type,
      title: template.placeholder.title,
      duration: template.defaultDuration,
      location: template.placeholder.location ? {
        name: template.placeholder.location,
      } : undefined,
      notes: template.placeholder.notes,
      tags: template.suggestedTags || [],
      links: [],
      status: 'pending' as const,
    }
    
    addCard(tripId, defaultDayId, newCard)
    toast.success(`Added ${template.title}`)
    onClose()
    setSearch('')
  }
  
  const handleSelectAiCategory = (categoryId: string) => {
    setAiCategory(categoryId)
    setSelectedIndex(0)
    setAiSuggestions([])
    setSelectedSuggestions(new Set())
  }
  
  const handleAiSuggestion = async (prompt: string) => {
    setIsLoadingAi(true)
    setAiSuggestions([])
    setSelectedSuggestions(new Set())
    
    try {
      const response = await fetch('/api/ai-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          destination: trip?.title || 'the destination',
          category: aiCategory,
          vibesContext: userVibes,
        }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to fetch suggestions')
      }
      
      const data = await response.json()
      setAiSuggestions(data.suggestions || [])
      // Pre-select all suggestions
      setSelectedSuggestions(new Set([0, 1, 2]))
      toast.success('AI suggestions ready!')
    } catch (error: any) {
      console.error('AI suggestion error:', error)
      toast.error(error.message || 'Failed to get AI suggestions')
      // Fall back to category selection
      setAiCategory(null)
    } finally {
      setIsLoadingAi(false)
    }
  }
  
  const handleToggleSuggestion = (index: number) => {
    const newSelected = new Set(selectedSuggestions)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedSuggestions(newSelected)
  }
  
  const handleAddSelectedSuggestions = () => {
    const suggestionsToAdd = aiSuggestions.filter((_, index) => selectedSuggestions.has(index))
    
    suggestionsToAdd.forEach((suggestion, index) => {
      setTimeout(() => {
        addCard(tripId, defaultDayId, {
          id: nanoid(),
          type: suggestion.type,
          title: suggestion.title,
          duration: suggestion.duration,
          location: suggestion.location ? { name: suggestion.location } : undefined,
          notes: suggestion.description,
          tags: suggestion.tags,
          links: [],
          status: 'pending',
        })
      }, index * 50)
    })
    
    toast.success(`Added ${suggestionsToAdd.length} suggestion${suggestionsToAdd.length !== 1 ? 's' : ''}`)
    onClose()
    setSearch('')
    setAiCategory(null)
    setAiSuggestions([])
    setSelectedSuggestions(new Set())
  }
  
  const handleClose = () => {
    onClose()
    setSearch('')
    setAiCategory(null)
    setView('templates')
    setAiSuggestions([])
    setSelectedSuggestions(new Set())
    setIsLoadingAi(false)
  }
  
  if (!isOpen) return null
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={handleClose} />
      <div className="fixed left-[50%] top-[50%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-50%]">
        <div className="bg-card border rounded-lg shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="border-b px-4 py-3 flex items-center gap-3 bg-muted/30">
            <Command className="w-5 h-5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={view === 'templates' ? 'Search templates...' : 'Search AI suggestions...'}
              className="border-0 focus-visible:ring-0 shadow-none px-0 text-base"
              autoFocus
            />
            <div className="flex gap-1">
              <Button
                variant={view === 'templates' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('templates')}
              >
                <Plus className="w-4 h-4 mr-1" />
                Templates
              </Button>
              <Button
                variant={view === 'ai' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('ai')}
              >
                <Sparkles className="w-4 h-4 mr-1" />
                AI
              </Button>
            </div>
          </div>
          
          {/* Content */}
          <div className="max-h-[60vh] overflow-y-auto">
            {view === 'templates' ? (
              <div className="py-2">
                {filteredTemplates.length === 0 ? (
                  <div className="px-4 py-8 text-center text-muted-foreground">
                    No templates found
                  </div>
                ) : (
                  filteredTemplates.map((template, index) => {
                    const Icon = CARD_TYPE_ICONS[template.type]
                    return (
                      <button
                        key={template.id}
                        onClick={() => handleSelectTemplate(template)}
                        className={`w-full px-4 py-3 flex items-start gap-3 hover:bg-muted/50 transition-colors ${
                          index === selectedIndex ? 'bg-muted/70' : ''
                        }`}
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium">{template.title}</div>
                          <div className="text-sm text-muted-foreground">{template.description}</div>
                          {template.suggestedTags && template.suggestedTags.length > 0 && (
                            <div className="flex gap-1 mt-1.5">
                              {template.suggestedTags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        {template.defaultDuration && (
                          <div className="text-xs text-muted-foreground">
                            {template.defaultDuration}m
                          </div>
                        )}
                      </button>
                    )
                  })
                )}
              </div>
            ) : aiCategory ? (
              <div className="py-2">
                {!isLoadingAi && aiSuggestions.length === 0 ? (
                  <>
                    <div className="px-4 py-2 border-b bg-muted/30">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAiCategory(null)}
                        className="mb-2"
                      >
                        ← Back to categories
                      </Button>
                      <h3 className="font-medium">
                        {AI_SUGGESTION_CATEGORIES.find(c => c.id === aiCategory)?.name}
                      </h3>
                    </div>
                    {AI_SUGGESTION_CATEGORIES.find(c => c.id === aiCategory)?.prompts.map((prompt, index) => (
                      <button
                        key={prompt}
                        onClick={() => handleAiSuggestion(prompt)}
                        className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors ${
                          index === selectedIndex ? 'bg-muted/70' : ''
                        }`}
                      >
                        <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
                        <div className="flex-1 text-left">
                          <div className="font-medium capitalize">{prompt}</div>
                          <div className="text-sm text-muted-foreground">
                            Get AI suggestions for {prompt}
                          </div>
                        </div>
                      </button>
                    ))}
                  </>
                ) : isLoadingAi ? (
                  <div className="px-4 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-primary" />
                    <p className="text-sm text-muted-foreground">Generating AI suggestions...</p>
                  </div>
                ) : (
                  <>
                    <div className="px-4 py-2 border-b bg-muted/30">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setAiSuggestions([])
                          setSelectedSuggestions(new Set())
                        }}
                        className="mb-2"
                      >
                        ← Back to prompts
                      </Button>
                      <h3 className="font-medium">AI Suggestions</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Select suggestions to add (click to toggle)
                      </p>
                    </div>
                    {aiSuggestions.map((suggestion, index) => {
                      const Icon = CARD_TYPE_ICONS[suggestion.type]
                      const isSelected = selectedSuggestions.has(index)
                      return (
                        <button
                          key={index}
                          onClick={() => handleToggleSuggestion(index)}
                          className={`w-full px-4 py-3 flex items-start gap-3 hover:bg-muted/50 transition-colors ${
                            isSelected ? 'bg-primary/10 border-l-2 border-primary' : ''
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-lg ${isSelected ? 'bg-primary' : 'bg-primary/10'} flex items-center justify-center flex-shrink-0`}>
                            {isSelected ? (
                              <Check className="w-5 h-5 text-primary-foreground" />
                            ) : (
                              <Icon className="w-5 h-5 text-primary" />
                            )}
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-medium">{suggestion.title}</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {suggestion.description}
                            </div>
                            {suggestion.tags && suggestion.tags.length > 0 && (
                              <div className="flex gap-1 mt-2">
                                {suggestion.tags.map(tag => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          {suggestion.duration && (
                            <div className="text-xs text-muted-foreground">
                              {suggestion.duration}m
                            </div>
                          )}
                        </button>
                      )
                    })}
                    <div className="px-4 py-3 border-t bg-muted/30">
                      <Button
                        onClick={handleAddSelectedSuggestions}
                        disabled={selectedSuggestions.size === 0}
                        className="w-full"
                      >
                        Add {selectedSuggestions.size} Selected Suggestion{selectedSuggestions.size !== 1 ? 's' : ''}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="py-2">
                {AI_SUGGESTION_CATEGORIES.map((category, index) => (
                  <button
                    key={category.id}
                    onClick={() => handleSelectAiCategory(category.id)}
                    className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors ${
                      index === selectedIndex ? 'bg-muted/70' : ''
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">{category.name}</div>
                      <div className="text-sm text-muted-foreground">{category.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="border-t px-4 py-2 bg-muted/30 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex gap-4">
              <span><kbd className="px-1.5 py-0.5 bg-background rounded">↑↓</kbd> Navigate</span>
              <span><kbd className="px-1.5 py-0.5 bg-background rounded">Enter</kbd> Select</span>
              <span><kbd className="px-1.5 py-0.5 bg-background rounded">Tab</kbd> Switch view</span>
            </div>
            <span><kbd className="px-1.5 py-0.5 bg-background rounded">Esc</kbd> Close</span>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
