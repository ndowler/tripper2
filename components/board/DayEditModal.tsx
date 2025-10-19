'use client'

import { useState, useEffect } from 'react'
import { useTripStore } from '@/lib/store/tripStore'
import type { Day } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Calendar } from 'lucide-react'

interface DayEditModalProps {
  day: Day
  tripId: string
  open: boolean
  onClose: () => void
}

export function DayEditModal({ day, tripId, open, onClose }: DayEditModalProps) {
  const [title, setTitle] = useState(day.title || '')
  const [date, setDate] = useState(day.date)
  
  const updateDay = useTripStore(state => state.updateDay)
  const deleteDay = useTripStore(state => state.deleteDay)
  const reorderDays = useTripStore(state => state.reorderDays)
  const trip = useTripStore(state => state.trips[tripId])
  
  useEffect(() => {
    setTitle(day.title || '')
    setDate(day.date)
  }, [day])
  
  const handleSave = () => {
    const dateChanged = date !== day.date
    
    // Update day details
    updateDay(tripId, day.id, {
      title: title.trim() || undefined,
      date,
    })
    
    // If date changed, reorder days chronologically
    if (dateChanged && trip) {
      const currentIndex = trip.days.findIndex(d => d.id === day.id)
      
      // Find correct position based on new date
      let newIndex = trip.days.findIndex((d, i) => {
        if (i === currentIndex) return false // Skip the current day
        return new Date(d.id === day.id ? date : d.date) > new Date(date)
      })
      
      // If no day is later, put at end
      if (newIndex === -1) {
        newIndex = trip.days.length - 1
      }
      
      // Reorder if position changed
      if (currentIndex !== newIndex) {
        reorderDays(tripId, currentIndex, newIndex)
        toast.success('Day updated and reordered')
      } else {
        toast.success('Day updated')
      }
    } else {
      toast.success('Day updated')
    }
    
    onClose()
  }
  
  const handleDelete = () => {
    if (confirm('Delete this day and all its cards?')) {
      deleteDay(tripId, day.id)
      toast.success('Day deleted')
      onClose()
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Edit Day
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Title (optional)</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Arrival Day, Day in Rome"
            />
          </div>
          
          {/* Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              💡 Days will automatically reorder chronologically when you change the date
            </p>
          </div>
          
          {/* Stats */}
          <div className="text-sm text-muted-foreground">
            {day.cards.length} card{day.cards.length !== 1 ? 's' : ''} in this day
          </div>
        </div>
        
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            variant="destructive"
            onClick={handleDelete}
          >
            Delete Day
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
