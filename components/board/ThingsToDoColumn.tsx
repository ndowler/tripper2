'use client'

import { type Trip } from '@/lib/types'
import { SortableCard } from '@/components/cards/SortableCard'
import { CardComposer } from '@/components/cards/CardComposer'
import { Inbox } from 'lucide-react'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'

interface ThingsToDoColumnProps {
  trip: Trip
}

export function ThingsToDoColumn({ trip }: ThingsToDoColumnProps) {
  const unassignedCards = trip.unassignedCards || []
  
  const { setNodeRef } = useDroppable({
    id: 'unassigned',
    data: {
      type: 'unassigned',
    },
  })
  
  return (
    <div
      ref={setNodeRef}
      className="w-full bg-muted/30 rounded-lg border-2 border-dashed"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Inbox className="w-4 h-4 text-muted-foreground" />
            <h2 className="font-semibold text-lg">
              Things to Do
            </h2>
            <span className="text-xs text-muted-foreground">
              · Drag to a day when ready to schedule
            </span>
          </div>
        </div>
      </div>
      
      {/* Cards - Horizontal Scroll */}
      <SortableContext
        items={unassignedCards.map(c => c.id)}
        strategy={horizontalListSortingStrategy}
      >
        <div className="p-4 overflow-x-auto">
          <div className="flex gap-3 items-start min-h-[200px]">
            {unassignedCards.length === 0 ? (
              <div className="flex-1 flex items-center justify-center py-12 text-muted-foreground text-sm">
                All activities scheduled!
              </div>
            ) : (
              unassignedCards.map((card) => (
                <div key={card.id} className="flex-shrink-0 w-80">
                  <SortableCard
                    card={card}
                    tripId={trip.id}
                    dayId="unassigned"
                  />
                </div>
              ))
            )}
            
            {/* Add card composer */}
            <div className="flex-shrink-0 w-80">
              <CardComposer tripId={trip.id} dayId="unassigned" />
            </div>
          </div>
        </div>
      </SortableContext>
    </div>
  )
}
