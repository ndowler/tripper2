'use client'

import { useState } from 'react'
import { type Card } from '@/lib/types'
import { Card as UICard } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  CARD_TYPES, 
  getCardCategory, 
  CATEGORY_COLORS,
  CURRENCY_SYMBOLS,
} from '@/lib/constants'
import { formatTimeDisplay } from '@/lib/utils/time'
import { useTripStore } from '@/lib/store/tripStore'
import { CardDetailModal } from './CardDetailModal'
import { StatusDot } from './StatusDot'
import { toast } from 'sonner'
import { 
  Clock, 
  MapPin, 
  Copy, 
  Trash2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  GripVertical,
} from 'lucide-react'

interface TripCardProps {
  card: Card
  tripId: string
  dayId: string
  isDragging?: boolean
}

export function TripCard({ card, tripId, dayId, isDragging = false }: TripCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const deleteCard = useTripStore(state => state.deleteCard)
  const duplicateCard = useTripStore(state => state.duplicateCard)
  const viewPrefs = useTripStore(state => state.viewPrefs)
  
  const cardType = CARD_TYPES[card.type]
  const category = getCardCategory(card.type)
  const categoryBorderColor = CATEGORY_COLORS[category]
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Delete this card?')) {
      deleteCard(tripId, dayId, card.id)
      toast.success('Card deleted')
    }
  }
  
  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation()
    duplicateCard(tripId, dayId, card.id)
    toast.success('Card duplicated')
  }
  
  const handleCardClick = () => {
    setIsModalOpen(true)
  }
  
  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsExpanded(!isExpanded)
  }
  
  // Format currency with symbol
  const formatCurrency = (amount: number, currency: string) => {
    const symbol = CURRENCY_SYMBOLS[currency] || currency
    return `${symbol}${amount}`
  }
  
  // Format duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours && mins) return `${hours}h ${mins}m`
    if (hours) return `${hours}h`
    return `${mins}m`
  }
  
  // Has expandable content?
  const hasExpandableContent = card.notes || (card.tags && card.tags.length > 2) || (card.links && card.links.length > 0)
  
  return (
    <>
      <UICard 
        className={`
          group relative border-l-4 ${categoryBorderColor}
          hover:shadow-md transition-all cursor-pointer
          ${isDragging ? 'shadow-lg' : 'shadow-none'}
          ${card.status === 'completed' ? 'opacity-60' : ''}
        `}
        onClick={handleCardClick}
      >
        <div className="p-3 space-y-2">
          {/* Header Row 1: Drag Handle • Title • Status • Actions */}
          <div className="flex items-start gap-2">
            <button
              className="cursor-grab active:cursor-grabbing touch-none p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Drag to reorder"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="w-4 h-4 text-muted-foreground" />
            </button>
            
            <span className="text-base leading-none mt-0.5">{cardType.icon}</span>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base leading-tight text-gray-900">
                {card.title}
              </h3>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Status Dot */}
              {card.status && card.status !== 'pending' && (
                <StatusDot status={card.status} size="sm" showLabel={false} />
              )}
              
              {/* Actions (on hover) */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5">
                {hasExpandableContent && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={toggleExpand}
                    title={isExpanded ? "Collapse" : "Expand"}
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={handleDuplicate}
                  title="Duplicate"
                >
                  <Copy className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={handleDelete}
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Header Row 2: Time & Duration • Price */}
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-3">
              {/* Time */}
              {card.startTime && viewPrefs.showTimes && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>
                    {formatTimeDisplay(card.startTime, viewPrefs.timeFormat)}
                    {card.endTime && ` - ${formatTimeDisplay(card.endTime, viewPrefs.timeFormat)}`}
                    {card.duration && !card.endTime && ` (${formatDuration(card.duration)})`}
                  </span>
                </div>
              )}
            </div>
            
            {/* Price (right-aligned) */}
            {card.cost && (
              <div className="font-medium text-gray-900">
                {formatCurrency(card.cost.amount, card.cost.currency)}
              </div>
            )}
          </div>
          
          {/* Row 3: Location with thumbnail */}
          {card.location && (
            <div className="flex items-center gap-2">
              {card.thumbnail && (
                <img 
                  src={card.thumbnail} 
                  alt={card.title}
                  className="w-6 h-6 rounded object-cover"
                />
              )}
              <MapPin className="w-3 h-3 text-gray-600 flex-shrink-0" />
              <span className="truncate text-sm text-gray-600">{card.location.name}</span>
            </div>
          )}
          
          {/* Compact tags (max 2) */}
          {card.tags && card.tags.length > 0 && !isExpanded && (
            <div className="flex flex-wrap gap-1">
              {card.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs font-normal">
                  {tag}
                </Badge>
              ))}
              {card.tags.length > 2 && (
                <Badge 
                  variant="secondary" 
                  className="text-xs font-normal cursor-pointer"
                  onClick={toggleExpand}
                >
                  +{card.tags.length - 2}
                </Badge>
              )}
            </div>
          )}
          
          {/* Expanded details area */}
          {isExpanded && hasExpandableContent && (
            <div className="pt-2 border-t space-y-2">
              {/* All tags when expanded */}
              {card.tags && card.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {card.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs font-normal">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              {/* Notes */}
              {card.notes && (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {card.notes}
                </p>
              )}
              
              {/* Links */}
              {card.links && card.links.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {card.links.map((link, i) => (
                    <a
                      key={i}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Link {i + 1}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </UICard>
      
      <CardDetailModal
        card={card}
        tripId={tripId}
        dayId={dayId}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
