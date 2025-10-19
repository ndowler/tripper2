'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTripStore } from '@/lib/store/tripStore';
import { SuggestionGrid } from '@/components/vibes/SuggestionGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { SuggestionCard } from '@/lib/types/suggestions';
import { saveSuggestionsToTrip } from '@/lib/utils/suggestions';
import { getVibesSummary, hasCompletedVibes } from '@/lib/utils/vibes';
import { Sparkles, Loader2, ArrowRight, Settings } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

type PageStep = 'input' | 'loading' | 'results' | 'error';

export default function DiscoverPage() {
  const router = useRouter();
  const currentTripId = useTripStore(state => state.currentTripId);
  const currentTrip = useTripStore(state => state.getCurrentTrip());
  const userVibes = useTripStore(state => state.userVibes);
  const addCard = useTripStore(state => state.addCard);

  const [step, setStep] = useState<PageStep>('input');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestionCard[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const hasVibes = hasCompletedVibes(userVibes);

  const handleGenerate = async () => {
    if (!city.trim()) {
      toast.error('Please enter a city name');
      return;
    }

    setStep('loading');
    setError(null);
    setProgress(0);

    // Fake progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 5;
      });
    }, 400);

    try {
      const response = await fetch('/api/vibe-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: {
            city: city.trim(),
            country: country.trim() || undefined,
            start: startDate || undefined,
            end: endDate || undefined,
          },
          vibe_profile: userVibes,
        }),
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate suggestions');
      }

      const data = await response.json();
      setSuggestions(data.suggestions);
      
      // Pre-select all suggestions
      const allIds = new Set(data.suggestions.map((s: SuggestionCard) => s.id));
      setSelectedIds(allIds);
      
      setStep('results');
      toast.success(`Generated ${data.suggestions.length} personalized suggestions!`);
    } catch (err: any) {
      clearInterval(progressInterval);
      setError(err.message || 'Something went wrong. Please try again.');
      setStep('error');
      toast.error(err.message || 'Failed to generate suggestions');
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    const allIds = new Set(suggestions.map(s => s.id));
    setSelectedIds(allIds);
  };

  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleSaveSelected = () => {
    if (!currentTripId) {
      toast.error('No active trip. Please create a trip first.');
      return;
    }

    const selectedSuggestions = suggestions.filter(s => selectedIds.has(s.id));
    
    if (selectedSuggestions.length === 0) {
      toast.error('Please select at least one suggestion');
      return;
    }

    saveSuggestionsToTrip(selectedSuggestions, currentTripId, addCard);
    
    toast.success(`Saved ${selectedSuggestions.length} suggestions to Things to Do!`);
    
    // Navigate to board after short delay
    setTimeout(() => {
      router.push('/demo');
    }, 1000);
  };

  const handleSaveSingle = (suggestion: SuggestionCard) => {
    if (!currentTripId) {
      toast.error('No active trip. Please create a trip first.');
      return;
    }

    saveSuggestionsToTrip([suggestion], currentTripId, addCard);
    toast.success('Saved to Things to Do!');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI Discovery</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">Discover Things to Do</h1>
          <p className="text-muted-foreground text-lg">
            Get 20 personalized suggestions powered by AI
          </p>
        </div>

        {/* Input Section */}
        {step === 'input' && (
          <div className="max-w-2xl mx-auto">
            <Card className="p-6 space-y-6">
              {/* Destination Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    City <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Rome, Tokyo, Paris"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Country (optional)
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Italy, Japan, France"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Start Date (optional)
                    </label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      End Date (optional)
                    </label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Vibes Preview */}
              {hasVibes ? (
                <div className="bg-secondary/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm">Your Travel Style</h3>
                    <Link href="/preferences">
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {getVibesSummary(userVibes!)}
                  </p>
                </div>
              ) : (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                  <p className="text-sm text-amber-900 dark:text-amber-100 mb-2">
                    Get better suggestions by completing your travel preferences!
                  </p>
                  <Link href="/vibes">
                    <Button variant="outline" size="sm">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Take Vibes Quiz
                    </Button>
                  </Link>
                </div>
              )}

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={!city.trim()}
                className="w-full"
                size="lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Generate 20 Suggestions
              </Button>
            </Card>
          </div>
        )}

        {/* Loading Section */}
        {step === 'loading' && (
          <div className="max-w-xl mx-auto">
            <Card className="p-8">
              <div className="text-center space-y-6">
                <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    Generating your personalized suggestions...
                  </h2>
                  <p className="text-muted-foreground">
                    Creating 20 perfect picks for {city}
                    {hasVibes && ' based on your travel style'}
                  </p>
                </div>
                
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{progress}%</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Error Section */}
        {step === 'error' && (
          <div className="max-w-xl mx-auto">
            <Card className="p-8">
              <div className="text-center space-y-4">
                <div className="text-4xl">⚠️</div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
                  <p className="text-muted-foreground">{error}</p>
                </div>
                <Button onClick={() => setStep('input')}>
                  Try Again
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Results Section */}
        {step === 'results' && (
          <div className="space-y-6">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  Things to Do — {city}
                  {country && `, ${country}`}
                </h2>
                <p className="text-muted-foreground mt-1">
                  {suggestions.length} suggestions • {selectedIds.size} selected
                </p>
              </div>
              <Button variant="outline" onClick={() => setStep('input')}>
                New Search
              </Button>
            </div>

            {/* Bulk Actions Bar */}
            {selectedIds.size > 0 && (
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{selectedIds.size} selected</span>
                    <Button variant="ghost" size="sm" onClick={handleDeselectAll}>
                      Deselect All
                    </Button>
                    {selectedIds.size < suggestions.length && (
                      <Button variant="ghost" size="sm" onClick={handleSelectAll}>
                        Select All
                      </Button>
                    )}
                  </div>
                  <Button onClick={handleSaveSelected}>
                    Save {selectedIds.size} to Things to Do
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            )}

            {/* Suggestion Grid */}
            <SuggestionGrid
              suggestions={suggestions}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onSave={handleSaveSingle}
            />

            {/* Bottom Actions */}
            {selectedIds.size > 0 && (
              <div className="flex justify-center pt-6 pb-12">
                <Button onClick={handleSaveSelected} size="lg">
                  Save {selectedIds.size} to Things to Do
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

