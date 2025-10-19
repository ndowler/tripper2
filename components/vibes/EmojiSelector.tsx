'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface EmojiOption {
  value: string | number;
  emoji: string;
  label: string;
}

interface EmojiSelectorProps {
  options: EmojiOption[];
  value: string | number | null;
  onChange: (value: string | number) => void;
  className?: string;
}

export function EmojiSelector({ options, value, onChange, className }: EmojiSelectorProps) {
  return (
    <div className={cn('grid gap-3', className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'flex items-center gap-3 p-4 rounded-lg border-2 transition-all',
            'hover:border-primary hover:bg-primary/5',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            value === option.value
              ? 'border-primary bg-primary/10'
              : 'border-border'
          )}
        >
          <span className="text-3xl flex-shrink-0">{option.emoji}</span>
          <span className="text-left font-medium">{option.label}</span>
        </button>
      ))}
    </div>
  );
}
