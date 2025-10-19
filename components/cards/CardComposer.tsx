'use client'

import { useState, useRef, useEffect } from 'react'
import { useTripStore } from '@/lib/store/tripStore'
import { nanoid } from 'nanoid'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Plus, MapPin, Utensils, Car, FileText, Plane, Hotel, ShoppingBag, Ticket, Sparkles } from 'lucide-react'
import type { CardType } from '@/lib/types'
import { CARD_TEMPLATES } from '@/lib/constants'
import { AiCardSuggestion } from './AiCardSuggestion'

interface CardComposerProps {
  tripId: string
  dayId: string
}

export function CardComposer({ tripId, dayId }: CardComposerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showAi, setShowAi] = useState(false)
  const [title, setTitle] = useState('')
  const [selectedType, setSelectedType] = useState<CardType>('activity')
  const inputRef = useRef<HTMLInputElement>(null)
  
  const addCard = useTripStore(state => state.addCard)
  
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) return
    
    const template = CARD_TEMPLATES[selectedType]
    
    addCard(tripId, dayId, {
      id: nanoid(),
      type: selectedType,
      title: title.trim(),
      duration: template.duration,
      tags: [],
      links: [],
      status: 'pending',
    })
    
    toast.success('Card added')
    setTitle('')
    setIsOpen(false)
  }
  
  const handleCancel = () => {
    setTitle('')
    setIsOpen(false)
  }
  
  if (!isOpen && !showAi) {
    return (
      <div className="flex gap-2">
        <Button
          variant="ghost"
          className="flex-1 justify-start text-muted-foreground hover:text-foreground"
          onClick={() => setIsOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add card
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => setShowAi(true)}
          title="AI Suggestions"
        >
          <Sparkles className="w-4 h-4" />
        </Button>
      </div>
    )
  }
  
  if (showAi) {
    return (
      <AiCardSuggestion
        tripId={tripId}
        dayId={dayId}
        onClose={() => setShowAi(false)}
      />
    )
  }
  
  return (
    <div className="bg-card rounded-lg border p-3 space-y-2">
      {/* Type selector */}
      <div className="flex gap-1 flex-wrap">
        <Button
          type="button"
          variant={selectedType === 'activity' ? 'default' : 'ghost'}
          size="icon"
          className="h-8 w-8"
          onClick={() => setSelectedType('activity')}
          title="Activity"
        >
          <MapPin className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant={selectedType === 'meal' ? 'default' : 'ghost'}
          size="icon"
          className="h-8 w-8"
          onClick={() => setSelectedType('meal')}
          title="Meal"
        >
          <Utensils className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant={selectedType === 'restaurant' ? 'default' : 'ghost'}
          size="icon"
          className="h-8 w-8"
          onClick={() => setSelectedType('restaurant')}
          title="Restaurant"
        >
          <Utensils className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant={selectedType === 'transit' ? 'default' : 'ghost'}
          size="icon"
          className="h-8 w-8"
          onClick={() => setSelectedType('transit')}
          title="Transit"
        >
          <Car className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant={selectedType === 'flight' ? 'default' : 'ghost'}
          size="icon"
          className="h-8 w-8"
          onClick={() => setSelectedType('flight')}
          title="Flight"
        >
          <Plane className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant={selectedType === 'hotel' ? 'default' : 'ghost'}
          size="icon"
          className="h-8 w-8"
          onClick={() => setSelectedType('hotel')}
          title="Hotel"
        >
          <Hotel className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant={selectedType === 'shopping' ? 'default' : 'ghost'}
          size="icon"
          className="h-8 w-8"
          onClick={() => setSelectedType('shopping')}
          title="Shopping"
        >
          <ShoppingBag className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant={selectedType === 'entertainment' ? 'default' : 'ghost'}
          size="icon"
          className="h-8 w-8"
          onClick={() => setSelectedType('entertainment')}
          title="Entertainment"
        >
          <Ticket className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant={selectedType === 'note' ? 'default' : 'ghost'}
          size="icon"
          className="h-8 w-8"
          onClick={() => setSelectedType('note')}
          title="Note"
        >
          <FileText className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Title input */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <Input
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={CARD_TEMPLATES[selectedType].title}
          className="text-sm"
        />
        
        <div className="flex gap-2">
          <Button type="submit" size="sm" className="flex-1">
            Add
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
