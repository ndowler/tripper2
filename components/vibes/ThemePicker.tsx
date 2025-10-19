'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { AVAILABLE_THEMES } from '@/lib/types/vibes';

interface ThemePickerProps {
  selectedThemes: string[];
  onChange: (themes: string[]) => void;
  maxSelections?: number;
  className?: string;
}

export function ThemePicker({
  selectedThemes,
  onChange,
  maxSelections = 3,
  className,
}: ThemePickerProps) {
  const handleToggle = (themeId: string) => {
    if (selectedThemes.includes(themeId)) {
      onChange(selectedThemes.filter(id => id !== themeId));
    } else if (selectedThemes.length < maxSelections) {
      onChange([...selectedThemes, themeId]);
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      <p className="text-sm text-muted-foreground">
        Pick {maxSelections} themes • {selectedThemes.length}/{maxSelections} selected
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {AVAILABLE_THEMES.map((theme) => {
          const isSelected = selectedThemes.includes(theme.id);
          const isDisabled = !isSelected && selectedThemes.length >= maxSelections;
          
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => handleToggle(theme.id)}
              disabled={isDisabled}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
                'hover:border-primary hover:bg-primary/5',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isSelected && 'border-primary bg-primary/10',
                !isSelected && 'border-border',
                isDisabled && 'opacity-50 cursor-not-allowed hover:border-border hover:bg-transparent'
              )}
            >
              <span className="text-2xl">{theme.icon}</span>
              <span className="text-sm font-medium text-center">{theme.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
