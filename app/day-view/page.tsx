'use client'

import { useState, useEffect } from 'react'
import { useTripStore } from '@/lib/store/tripStore'
import { createDemoTrip } from '@/lib/seed-data'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar, MapPin, DollarSign, Clock, Navigation, RefreshCw, Plus } from 'lucide-react'
import Link from 'next/link'
import { CardDetailModal } from '@/components/cards/CardDetailModal'
import { Card } from '@/lib/types'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { QuickAddDrawer } from '@/components/board/QuickAddDrawer'
import { SwapCardModal } from '@/components/cards/SwapCardModal'

export default function DayViewPage() {
  const addTrip = useTripStore(state => state.addTrip)
  const setCurrentTrip = useTripStore(state => state.setCurrentTrip)
  const currentTripId = useTripStore(state => state.currentTripId)
  const currentTrip = useTripStore(state => state.getCurrentTrip())
  const [currentDayIndex, setCurrentDayIndex] = useState(0)
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [swappingCard, setSwappingCard] = useState<Card | null>(null)
  const [quickAddTimeSlot, setQuickAddTimeSlot] = useState<'morning' | 'afternoon' | 'evening' | null>(null)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  useEffect(() => {
    // If no current trip, create demo trip
    if (!currentTripId || !currentTrip) {
      const demoTrip = createDemoTrip()
      addTrip(demoTrip)
      setCurrentTrip(demoTrip.id)
    }
  }, [currentTripId, currentTrip, addTrip, setCurrentTrip])
  
  if (!currentTrip || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading trip...</p>
        </div>
      </div>
    )
  }
  
  const day = currentTrip.days[currentDayIndex]
  const canGoPrev = currentDayIndex > 0
  const canGoNext = currentDayIndex < currentTrip.days.length - 1
  
  // Group cards by time of day
  const getTimeOfDay = (startTime?: string): 'morning' | 'afternoon' | 'evening' | 'unscheduled' => {
    if (!startTime) return 'unscheduled'
    const [hours] = startTime.split(':').map(Number)
    if (hours >= 5 && hours < 12) return 'morning'
    if (hours >= 12 && hours < 17) return 'afternoon'
    return 'evening'
  }
  
  const groupedCards = {
    morning: day.cards.filter(c => getTimeOfDay(c.startTime) === 'morning'),
    afternoon: day.cards.filter(c => getTimeOfDay(c.startTime) === 'afternoon'),
    evening: day.cards.filter(c => getTimeOfDay(c.startTime) === 'evening'),
    unscheduled: day.cards.filter(c => getTimeOfDay(c.startTime) === 'unscheduled'),
  }
  
  // Calculate day stats
  const totalCost = day.cards.reduce((sum, card) => sum + (card.cost?.amount || 0), 0)
  const totalDuration = day.cards.reduce((sum, card) => sum + (card.duration || 0), 0)
  const primaryCurrency = day.cards.find(c => c.cost)?.cost?.currency || 'USD'
  const currencySymbol = primaryCurrency === 'USD' ? '$' : primaryCurrency === 'EUR' ? '$' : '£'
  
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours && mins) return `${hours}h ${mins}m`
    if (hours) return `${hours}h`
    return `${mins}m`
  }
  
  const formatTimeAMPM = (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number)
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`
  }
  
  const handleNavigate = (location: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const destination = encodeURIComponent(location)
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank')
  }
  
  const handleSwap = (card: Card, e: React.MouseEvent) => {
    e.stopPropagation()
    setSwappingCard(card)
  }
  
  const getCardIcon = (type: string): string => {
    const icons: Record<string, string> = {
      activity: '🎯',
      meal: '🍽️',
      restaurant: '🍴',
      transit: '🚗',
      flight: '✈️',
      hotel: '🏨',
      shopping: '🛍️',
      entertainment: '🎭',
      note: '📝',
    }
    return icons[type] || '📍'
  }
  
  const getCategoryColor = (type: string): string => {
    const colors: Record<string, string> = {
      activity: 'border-l-green-500',
      meal: 'border-l-orange-500',
      restaurant: 'border-l-red-500',
      transit: 'border-l-blue-500',
      flight: 'border-l-sky-500',
      hotel: 'border-l-purple-500',
      shopping: 'border-l-pink-500',
      entertainment: 'border-l-indigo-500',
      note: 'border-l-gray-400',
    }
    return colors[type] || 'border-l-gray-400'
  }
  
  const TimeSection = ({ 
    title, 
    emoji, 
    cards,
    timeSlot 
  }: { 
    title: string
    emoji: string
    cards: Card[]
    timeSlot: 'morning' | 'afternoon' | 'evening'
  }) => {
    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3 px-4">
          <span className="text-2xl">{emoji}</span>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {title}
          </h3>
          <div className="flex-1 h-px bg-border"></div>
        </div>
        
        <div className="space-y-3 px-4">
          {cards.map((card) => (
            <div
              key={card.id}
              className={cn(
                "relative rounded-lg border-l-4 bg-card shadow-sm",
                "hover:shadow-md transition-shadow",
                getCategoryColor(card.type)
              )}
            >
              {/* Swap button - top right */}
              <button
                onClick={(e) => handleSwap(card, e)}
                className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-muted/80 transition-colors z-10"
                title="Swap for similar"
              >
                <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
              
              {/* Main card content - clickable */}
              <button
                onClick={() => setSelectedCard(card)}
                className="w-full text-left p-4 active:scale-[0.98] transition-transform"
              >
                <div className="flex items-start gap-3">
                  {/* Time on left */}
                  {card.startTime && (
                    <div className="flex-shrink-0 w-16 pt-0.5">
                      <span className="text-xs font-medium text-muted-foreground">
                        {formatTimeAMPM(card.startTime)}
                      </span>
                    </div>
                  )}
                  
                  {/* Icon */}
                  <span className="text-2xl flex-shrink-0 mt-0.5">{getCardIcon(card.type)}</span>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-base leading-tight mb-1 pr-6">{card.title}</h4>
                    
                    {card.location?.name && (
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{card.location.name}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                      {card.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDuration(card.duration)}</span>
                        </div>
                      )}
                      
                      {card.cost && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          <span>{currencySymbol}{card.cost.amount}</span>
                        </div>
                      )}
                      
                      {card.tags.length > 0 && (
                        <div className="flex gap-1">
                          {card.tags.slice(0, 2).map((tag, idx) => (
                            <span 
                              key={idx}
                              className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Navigate button on right - only if has location */}
                  {card.location?.name && (
                    <button
                      onClick={(e) => handleNavigate(card.location!.name + (card.location!.address ? ', ' + card.location!.address : ''), e)}
                      className="flex-shrink-0 p-2 rounded-lg hover:bg-primary/10 transition-colors"
                      title="Navigate"
                    >
                      <Navigation className="w-4 h-4 text-primary" />
                    </button>
                  )}
                </div>
              </button>
            </div>
          ))}
          
          {/* Add button */}
          <button
            onClick={() => setQuickAddTimeSlot(timeSlot)}
            className="w-full py-3 rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 group"
          >
            <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
              Add activity
            </span>
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <Link href="/trips">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            </Link>
            <h1 className="text-sm font-semibold text-muted-foreground truncate px-2">
              {currentTrip.title}
            </h1>
            <div className="w-20"></div>
          </div>
        </div>
        
        {/* Day Navigation */}
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentDayIndex(prev => Math.max(0, prev - 1))}
              disabled={!canGoPrev}
              className="flex-shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex-1 text-center px-2">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  Day {currentDayIndex + 1} of {currentTrip.days.length}
                </span>
              </div>
              <h2 className="text-xl font-bold">{day.title}</h2>
              {day.date && (
                <p className="text-sm text-muted-foreground">
                  {format(new Date(day.date), 'EEEE, MMMM d, yyyy')}
                </p>
              )}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentDayIndex(prev => Math.min(currentTrip.days.length - 1, prev + 1))}
              disabled={!canGoNext}
              className="flex-shrink-0"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {/* Day Stats */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-around gap-4 p-3 rounded-lg bg-muted/50">
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Activities</div>
              <div className="text-lg font-bold">{day.cards.length}</div>
            </div>
            <div className="w-px h-8 bg-border"></div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Duration</div>
              <div className="text-lg font-bold">{formatDuration(totalDuration)}</div>
            </div>
            <div className="w-px h-8 bg-border"></div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Cost</div>
              <div className="text-lg font-bold">{currencySymbol}{totalCost}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Timeline Sections */}
      <div className="py-6">
        {day.cards.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-lg font-semibold mb-2">No activities yet</h3>
            <p className="text-sm text-muted-foreground">
              Add cards to this day to start planning
            </p>
          </div>
        ) : (
          <>
            <TimeSection title="Morning" emoji="🌅" cards={groupedCards.morning} timeSlot="morning" />
            <TimeSection title="Afternoon" emoji="☀️" cards={groupedCards.afternoon} timeSlot="afternoon" />
            <TimeSection title="Evening" emoji="🌆" cards={groupedCards.evening} timeSlot="evening" />
            {groupedCards.unscheduled.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3 px-4">
                  <span className="text-2xl">📋</span>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Unscheduled
                  </h3>
                  <div className="flex-1 h-px bg-border"></div>
                </div>
                <div className="space-y-3 px-4">
                  {groupedCards.unscheduled.map((card) => (
                    <div
                      key={card.id}
                      className={cn(
                        "relative rounded-lg border-l-4 bg-card shadow-sm hover:shadow-md transition-shadow",
                        getCategoryColor(card.type)
                      )}
                    >
                      <button
                        onClick={(e) => handleSwap(card, e)}
                        className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-muted/80 transition-colors z-10"
                        title="Swap for similar"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                      
                      <button
                        onClick={() => setSelectedCard(card)}
                        className="w-full text-left p-4 active:scale-[0.98] transition-transform"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl flex-shrink-0 mt-0.5">{getCardIcon(card.type)}</span>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-base leading-tight mb-1 pr-6">{card.title}</h4>
                            {card.location?.name && (
                              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
                                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                <span className="truncate">{card.location.name}</span>
                              </div>
                            )}
                          </div>
                          {card.location?.name && (
                            <button
                              onClick={(e) => handleNavigate(card.location!.name + (card.location!.address ? ', ' + card.location!.address : ''), e)}
                              className="flex-shrink-0 p-2 rounded-lg hover:bg-primary/10 transition-colors"
                              title="Navigate"
                            >
                              <Navigation className="w-4 h-4 text-primary" />
                            </button>
                          )}
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Card Detail Modal */}
      {selectedCard && (
        <CardDetailModal
          card={selectedCard}
          isOpen={!!selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
      
      {/* Quick Add Drawer */}
      {quickAddTimeSlot && (
        <QuickAddDrawer
          isOpen={!!quickAddTimeSlot}
          onClose={() => setQuickAddTimeSlot(null)}
          timeSlot={quickAddTimeSlot}
          dayId={day.id}
          tripId={currentTrip.id}
          destination={currentTrip.destination}
        />
      )}
      
      {/* Swap Card Modal */}
      {swappingCard && (
        <SwapCardModal
          card={swappingCard}
          isOpen={!!swappingCard}
          onClose={() => setSwappingCard(null)}
          tripId={currentTrip.id}
          dayId={day.id}
          destination={currentTrip.destination}
        />
      )}
    </div>
  )
}

