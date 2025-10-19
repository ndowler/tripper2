'use client';

import React, { useState, useEffect } from 'react';
import { useTripStore } from '@/lib/store/tripStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2, MapPin, Clock, DollarSign, X } from 'lucide-react';
import { toast } from 'sonner';
import { nanoid } from 'nanoid';
import type { Card, CardType } from '@/lib/types';

interface AiDayPlannerProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  dayId: string;
  destination?: string;
}

interface GeneratedCard {
  type: CardType;
  title: string;
  description: string;
  startTime?: string;
  duration?: number;
  tags: string[];
  location?: string;
  cost?: {
    amount: number;
    currency: string;
  };
}

export function AiDayPlanner({ isOpen, onClose, tripId, dayId, destination }: AiDayPlannerProps) {
  const [location, setLocation] = useState(destination || '');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('22:00');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCards, setGeneratedCards] = useState<GeneratedCard[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const userVibes = useTripStore((state) => state.userVibes);
  const addCard = useTripStore((state) => state.addCard);

  const handleGenerate = async () => {
    if (!location.trim()) {
      toast.error('Please enter a location');
      return;
    }

    setIsLoading(true);
    setGeneratedCards([]);

    try {
      const response = await fetch('/api/ai-day-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location,
          startTime,
          endTime,
          notes,
          vibesContext: userVibes,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate day plan');
      }

      const data = await response.json();
      console.log('AI Day Plan response:', data);
      const cards = data.cards || [];
      console.log('Extracted cards:', cards);
      
      if (cards.length === 0) {
        throw new Error('AI returned no activities. Please try again with different inputs.');
      }
      
      setGeneratedCards(cards);
      setShowPreview(true);
      toast.success(`Day plan generated! ${cards.length} activities 🎉`);
    } catch (error: any) {
      console.error('AI day plan error:', error);
      toast.error(error.message || 'Failed to generate day plan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAll = () => {
    let addedCount = 0;
    
    generatedCards.forEach((card, index) => {
      setTimeout(() => {
        addCard(tripId, dayId, {
          id: nanoid(),
          type: card.type,
          title: card.title,
          notes: card.description,
          startTime: card.startTime,
          duration: card.duration || 120,
          tags: card.tags,
          location: card.location ? { name: card.location } : undefined,
          cost: card.cost,
          links: [],
          status: 'pending',
        } as Omit<Card, 'createdAt' | 'updatedAt'>);
        addedCount++;
        
        if (addedCount === generatedCards.length) {
          toast.success(`Added ${addedCount} activities!`);
          onClose();
          resetForm();
        }
      }, index * 100);
    });
  };

  const resetForm = () => {
    setLocation(destination || '');
    setStartTime('09:00');
    setEndTime('22:00');
    setNotes('');
    setGeneratedCards([]);
    setShowPreview(false);
  };

  const handleClose = () => {
    if (!isLoading) {
      resetForm();
      onClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        resetForm();
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => !isLoading && handleClose()}
      />
      
      {/* Modal */}
      <div className="relative bg-background rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">AI Day Planner</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              disabled={isLoading}
              className="h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Generate a complete day itinerary based on your preferences
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
            {!showPreview ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Location <span className="text-destructive">*</span>
                  </label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Rome, Italy"
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Start Time</label>
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">End Time</label>
                    <Input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Additional Notes (Optional)
                  </label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any specific requests? (e.g., must see Colosseum, prefer vegetarian food)"
                    rows={3}
                    disabled={isLoading}
                  />
                </div>

                {userVibes && (
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-sm text-muted-foreground">
                      ✨ Using your travel preferences: {userVibes.comfort.pace_score <= 40 ? 'Relaxed pace' : 
                      userVibes.comfort.pace_score <= 60 ? 'Moderate pace' : 'Active pace'}, 
                      €{userVibes.logistics.budget_ppd}/day budget, {userVibes.comfort.walking_km_per_day}km walking
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Preview ({generatedCards.length} activities)</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPreview(false)}
                  >
                    Edit Inputs
                  </Button>
                </div>

                {generatedCards.map((card, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border bg-card hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{card.title}</h4>
                      <span className="text-xs px-2 py-1 rounded-md bg-secondary">
                        {card.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{card.description}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      {card.startTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {card.startTime} ({card.duration}min)
                        </div>
                      )}
                      {card.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {card.location}
                        </div>
                      )}
                      {card.cost && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {card.cost.currency === 'EUR' ? '€' : '$'}{card.cost.amount}
                        </div>
                      )}
                    </div>
                    {card.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {card.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex justify-between">
            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            
            {!showPreview ? (
              <Button onClick={handleGenerate} disabled={isLoading || !location.trim()}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Day Plan
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={handleAddAll}>
                Add All {generatedCards.length} Activities
              </Button>
            )}
        </div>
      </div>
    </div>
  );
}