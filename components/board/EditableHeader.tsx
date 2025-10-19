'use client'

import { useState } from 'react'
import { useTripStore } from '@/lib/store/tripStore'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

interface EditableHeaderProps {
  tripId: string
  title: string
  description?: string
}

export function EditableHeader({ tripId, title, description }: EditableHeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [titleValue, setTitleValue] = useState(title)
  const [descriptionValue, setDescriptionValue] = useState(description || '')
  
  const updateTrip = useTripStore(state => state.updateTrip)
  
  const handleTitleSave = () => {
    if (titleValue.trim()) {
      updateTrip(tripId, { title: titleValue.trim() })
      toast.success('Trip name updated')
      setIsEditingTitle(false)
    }
  }
  
  const handleDescriptionSave = () => {
    updateTrip(tripId, { description: descriptionValue.trim() || undefined })
    toast.success('Description updated')
    setIsEditingDescription(false)
  }
  
  if (isEditingTitle) {
    return (
      <div className="flex-1">
        <Input
          value={titleValue}
          onChange={(e) => setTitleValue(e.target.value)}
          onBlur={handleTitleSave}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleTitleSave()
            if (e.key === 'Escape') setIsEditingTitle(false)
          }}
          autoFocus
          className="text-xl font-bold"
        />
      </div>
    )
  }
  
  if (isEditingDescription) {
    return (
      <div className="flex-1">
        <h1 className="text-xl font-bold">{title}</h1>
        <Textarea
          value={descriptionValue}
          onChange={(e) => setDescriptionValue(e.target.value)}
          onBlur={handleDescriptionSave}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setIsEditingDescription(false)
          }}
          placeholder="Add a description..."
          className="text-sm mt-1"
          rows={2}
          autoFocus
        />
      </div>
    )
  }
  
  return (
    <div className="flex-1">
      <h1 
        className="text-xl font-bold cursor-pointer hover:text-primary transition-colors"
        onClick={() => setIsEditingTitle(true)}
        title="Click to edit"
      >
        {title}
      </h1>
      {description ? (
        <p 
          className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
          onClick={() => setIsEditingDescription(true)}
          title="Click to edit"
        >
          {description}
        </p>
      ) : (
        <p 
          className="text-sm text-muted-foreground italic cursor-pointer hover:text-foreground transition-colors"
          onClick={() => setIsEditingDescription(true)}
          title="Click to add description"
        >
          Add description...
        </p>
      )}
    </div>
  )
}
