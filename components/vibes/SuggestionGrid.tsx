'use client';

import React, { useState, useMemo } from 'react';
import { SuggestionCard as SuggestionCardComponent } from '@/components/cards/SuggestionCard';
import { SuggestionDetailModal } from '@/components/cards/SuggestionDetailModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SuggestionCard, SuggestionCategory } from '@/lib/types/suggestions';
import { getCategoryEmoji } from '@/lib/utils/suggestions';

interface SuggestionGridProps {
  suggestions: SuggestionCard[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onSave: (suggestion: SuggestionCard) => void;
}

const CATEGORIES: { value: SuggestionCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'food', label: 'Food' },
  { value: 'culture', label: 'Culture' },
  { value: 'nature', label: 'Nature' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'wellness', label: 'Wellness' },
  { value: 'nightlife', label: 'Nightlife' },
  { value: 'tour', label: 'Tours' },
  { value: 'coffee', label: 'Coffee' },
  { value: 'kids', label: 'Kids' },
  { value: 'other', label: 'Other' },
];

export function SuggestionGrid({
  suggestions,
  selectedIds,
  onToggleSelect,
  onSave,
}: SuggestionGridProps) {
  const [activeCategory, setActiveCategory] = useState<SuggestionCategory | 'all'>('all');
  const [detailSuggestion, setDetailSuggestion] = useState<SuggestionCard | null>(null);

  // Filter suggestions by category
  const filteredSuggestions = useMemo(() => {
    if (activeCategory === 'all') return suggestions;
    return suggestions.filter(s => s.category === activeCategory);
  }, [suggestions, activeCategory]);

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: suggestions.length };
    suggestions.forEach(s => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return counts;
  }, [suggestions]);

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => {
          const count = categoryCounts[cat.value] || 0;
          if (count === 0 && cat.value !== 'all') return null;

          return (
            <Button
              key={cat.value}
              variant={activeCategory === cat.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(cat.value)}
              className="gap-2"
            >
              {cat.value !== 'all' && (
                <span>{getCategoryEmoji(cat.value as SuggestionCategory)}</span>
              )}
              <span>{cat.label}</span>
              <Badge variant="secondary" className="ml-1">
                {count}
              </Badge>
            </Button>
          );
        })}
      </div>

      {/* Grid */}
      {filteredSuggestions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSuggestions.map(suggestion => (
            <SuggestionCardComponent
              key={suggestion.id}
              suggestion={suggestion}
              isSelected={selectedIds.has(suggestion.id)}
              onToggleSelect={() => onToggleSelect(suggestion.id)}
              onClick={() => setDetailSuggestion(suggestion)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>No suggestions in this category</p>
        </div>
      )}

      {/* Detail Modal */}
      <SuggestionDetailModal
        suggestion={detailSuggestion}
        isOpen={!!detailSuggestion}
        onClose={() => setDetailSuggestion(null)}
        onSave={onSave}
      />
    </div>
  );
}

