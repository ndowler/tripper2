'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SuggestionCard as SuggestionCardType } from '@/lib/types/suggestions';
import {
  getCategoryColor,
  formatDuration,
  formatPriceTier,
  getDaypartInfo,
  getGoogleSearchUrl,
} from '@/lib/utils/suggestions';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface SuggestionCardProps {
  suggestion: SuggestionCardType;
  isSelected: boolean;
  onToggleSelect: () => void;
  onClick: () => void;
}

export function SuggestionCard({
  suggestion,
  isSelected,
  onToggleSelect,
  onClick,
}: SuggestionCardProps) {
  const daypartInfo = getDaypartInfo(suggestion.best_time);
  const categoryColor = getCategoryColor(suggestion.category);
  
  // Calculate visible tags
  const maxVisibleTags = 2;
  const visibleTags = suggestion.tags.slice(0, maxVisibleTags);
  const hiddenCount = suggestion.tags.length - maxVisibleTags;

  // Render confidence dots (out of 5)
  const confidenceDots = suggestion.confidence !== undefined && !isNaN(suggestion.confidence)
    ? Math.round(suggestion.confidence * 5)
    : 4; // Default to 4/5 if confidence is not available

  return (
    <Card
      className={cn(
        'relative overflow-hidden cursor-pointer transition-all hover:shadow-md border-l-4',
        categoryColor,
        isSelected && 'ring-2 ring-primary'
      )}
    >
      {/* Selection Checkbox */}
      <div
        className="absolute top-3 right-3 z-10"
        onClick={(e) => {
          e.stopPropagation();
          onToggleSelect();
        }}
      >
        <Checkbox checked={isSelected} />
      </div>

      {/* Card Content */}
      <div className="p-4" onClick={onClick}>
        {/* Header */}
        <div className="flex items-start gap-3 mb-2">
          {suggestion.media?.emoji && (
            <div className="text-3xl flex-shrink-0">{suggestion.media.emoji}</div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base leading-tight line-clamp-2">
              {suggestion.title}
            </h3>
            {suggestion.subtitle && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {suggestion.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-foreground/80 line-clamp-3 mb-3">
          {suggestion.description}
        </p>

        {/* Tags */}
        {suggestion.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {visibleTags.map((tag, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {hiddenCount > 0 && (
              <Badge variant="outline" className="text-xs">
                +{hiddenCount}
              </Badge>
            )}
          </div>
        )}

        {/* Footer - Metadata */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {/* Duration */}
          <div className="flex items-center gap-1">
            <span>⏱️</span>
            <span>{formatDuration(suggestion.est_duration_min)}</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-1">
            <span>{formatPriceTier(suggestion.price_tier)}</span>
          </div>

          {/* Best Time */}
          <div className="flex items-center gap-1">
            <span>{daypartInfo.emoji}</span>
            <span>{daypartInfo.label}</span>
          </div>

          {/* Confidence */}
          <div className="flex items-center gap-0.5 ml-auto">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  'w-1.5 h-1.5 rounded-full',
                  idx < confidenceDots ? 'bg-primary' : 'bg-secondary'
                )}
              />
            ))}
          </div>
        </div>

        {/* Area */}
        {suggestion.area && (
          <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <span>📍</span>
            <span>{suggestion.area}</span>
          </div>
        )}

        {/* Learn More Link */}
        <div className="mt-3 pt-3 border-t border-border">
          <a
            href={getGoogleSearchUrl(suggestion)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            <span>🔍</span>
            <span>Learn More on Google</span>
          </a>
        </div>
      </div>
    </Card>
  );
}

