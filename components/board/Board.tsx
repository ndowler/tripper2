'use client'

import { useState, useEffect } from 'react'
import { type Trip } from '@/lib/types'
import { DayColumn } from './DayColumn'
import { AddDayButton } from './AddDayButton'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Download, Share2, Undo2, Redo2, Inbox, Compass } from 'lucide-react'
import Link from 'next/link'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useTripStore } from '@/lib/store/tripStore'
import { TripCard } from '@/components/cards/TripCard'
import { ThingsToDoDrawer } from './ThingsToDoDrawer'
import { EditableHeader } from './EditableHeader'
import { useUndoRedo } from '@/lib/hooks/useUndoRedo'
import { useKeyboardShortcuts } from '@/lib/hooks/useKeyboardShortcuts'
import { toast } from 'sonner'
import { CommandPalette } from '@/components/command-palette/CommandPalette'
import { VibesCard } from '@/components/vibes/VibesCard'

interface BoardProps {
  trip: Trip
}

export function Board({ trip }: BoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeType, setActiveType] = useState<'day' | 'card' | null>(null)
  const [activeDayId, setActiveDayId] = useState<string | null>(null)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [thingsToDoOpen, setThingsToDoOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const reorderDays = useTripStore(state => state.reorderDays)
  const reorderCards = useTripStore(state => state.reorderCards)
  const moveCard = useTripStore(state => state.moveCard)
  
  const { undo, redo, canUndo, canRedo } = useUndoRedo()
  
  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'z',
      meta: true,
      shift: false,
      handler: () => {
        if (canUndo) {
          undo()
          toast.success('Undone')
        }
      },
      description: 'Undo last action',
    },
    {
      key: 'z',
      meta: true,
      shift: true,
      handler: () => {
        if (canRedo) {
          redo()
          toast.success('Redone')
        }
      },
      description: 'Redo last action',
    },
    {
      key: 'k',
      meta: true,
      shift: false,
      handler: () => {
        setCommandPaletteOpen(true)
      },
      description: 'Open command palette',
    },
  ])
  
  // Configure sensors for drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px movement before drag starts
      },
    }),
    useSensor(KeyboardSensor)
  )
  
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const activeData = active.data.current
    
    setActiveId(active.id as string)
    
    if (activeData?.type === 'card') {
      setActiveType('card')
      setActiveDayId(activeData.dayId)
    }
  }
  
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return
    
    const activeData = active.data.current
    const overData = over.data.current
    
    // Handle card moves (including from/to unassigned)
    if (activeData?.type === 'card') {
      const activeDayId = activeData.dayId
      
      // Moving to a card in another column
      if (overData?.type === 'card') {
        const overDayId = overData.dayId
        
        if (activeDayId !== overDayId) {
          // Find the source and destination
          const overDay = overDayId === 'unassigned' 
            ? null 
            : trip.days.find(d => d.id === overDayId)
          const overCardIndex = overDay 
            ? overDay.cards.findIndex(c => c.id === over.id)
            : trip.unassignedCards?.findIndex(c => c.id === over.id) || 0
          
          moveCard(trip.id, activeDayId, overDayId, active.id as string, overCardIndex)
          setActiveDayId(overDayId)
        }
      }
    }
  }
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (!over) {
      setActiveId(null)
      setActiveType(null)
      setActiveDayId(null)
      return
    }
    
    const activeData = active.data.current
    const overData = over.data.current
    
    if (activeData?.type === 'card' && overData?.type === 'card') {
      // Reordering cards within same day
      const activeDayId = activeData.dayId
      const overDayId = overData.dayId
      
      if (activeDayId === overDayId) {
        const day = trip.days.find(d => d.id === activeDayId)
        if (day) {
          const oldIndex = day.cards.findIndex(c => c.id === active.id)
          const newIndex = day.cards.findIndex(c => c.id === over.id)
          
          if (oldIndex !== newIndex) {
            reorderCards(trip.id, activeDayId, oldIndex, newIndex)
          }
        }
      }
    }
    
    setActiveId(null)
    setActiveType(null)
    setActiveDayId(null)
  }
  
  // Get active card for drag overlay
  const activeCard = activeType === 'card' && activeDayId
    ? activeDayId === 'unassigned'
      ? trip.unassignedCards?.find(c => c.id === activeId)
      : trip.days
          .find(d => d.id === activeDayId)
          ?.cards.find(c => c.id === activeId)
    : null
  
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen flex flex-col bg-background">
        {/* Header */}
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <Link href="/trips">
                  <Button variant="ghost" size="icon" title="Back to all trips">
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                </Link>
                <EditableHeader
                  tripId={trip.id}
                  title={trip.title}
                  description={trip.description}
                />
              </div>
              
              <div className="flex items-center gap-2">
                {/* Things to Do Toggle */}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setThingsToDoOpen(!thingsToDoOpen)}
                  className="lg:hidden"
                  title="Things to Do"
                >
                  <Inbox className="w-4 h-4 mr-2" />
                  <span>Things to Do</span>
                  {trip.unassignedCards && trip.unassignedCards.length > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                      {trip.unassignedCards.length}
                    </span>
                  )}
                </Button>
                
                {/* Undo/Redo */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  title="Undo (Cmd+Z)"
                  onClick={() => {
                    undo()
                    toast.success('Undone')
                  }}
                  disabled={!canUndo}
                >
                  <Undo2 className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  title="Redo (Cmd+Shift+Z)"
                  onClick={() => {
                    redo()
                    toast.success('Redone')
                  }}
                  disabled={!canRedo}
                >
                  <Redo2 className="w-4 h-4" />
                </Button>
                
                <div className="w-px h-6 bg-border mx-2" />
                
                {/* Actions */}
                <Link href="/discover">
                  <Button variant="ghost" size="sm" title="Discover things to do">
                    <Compass className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Discover</span>
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" title="Export JSON">
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" title="Share">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Board with Drawer */}
        <div className="flex-1 flex overflow-hidden">
          {/* Things to Do Drawer - Client-only to prevent hydration mismatch */}
          {mounted && (
            <ThingsToDoDrawer 
              trip={trip} 
              isOpen={thingsToDoOpen}
              onClose={() => setThingsToDoOpen(false)}
            />
          )}
          
          {/* Main Board Area */}
          <main className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-thin">
            <div className="px-4 py-6 h-full">
              {/* Vibes Card */}
              {mounted && <VibesCard />}
              
              <div className="flex gap-6 h-full">
                {/* Day Columns - Horizontal Layout (No drag-drop, reorder via date change) */}
                {trip.days.map((day, index) => (
                  <DayColumn
                    key={day.id}
                    day={day}
                    tripId={trip.id}
                    index={index}
                  />
                ))}
                
                {/* Add day button */}
                <div className="flex-shrink-0" style={{ minWidth: '360px' }}>
                  <AddDayButton tripId={trip.id} />
                </div>
              </div>
            </div>
          </main>
        </div>
        
        {/* Command Palette */}
        <CommandPalette
          isOpen={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
          tripId={trip.id}
          defaultDayId="unassigned"
        />
      </div>
      
      {/* Drag Overlay */}
      <DragOverlay>
        {activeCard && activeDayId ? (
          <div className="opacity-90 rotate-3 scale-105">
            <TripCard card={activeCard} tripId={trip.id} dayId={activeDayId} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
