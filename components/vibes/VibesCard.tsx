'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTripStore } from '@/lib/store/tripStore';
import { getVibesSummary, hasCompletedVibes } from '@/lib/utils/vibes';
import { Button } from '@/components/ui/button';
import { Sparkles, ChevronDown, ChevronUp, Settings, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VibesCardProps {
  userId?: string; // Optional for demo/offline mode
}

export function VibesCard({ userId }: VibesCardProps) {
  const userVibes = useTripStore((state) => state.userVibes);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the vibes CTA
    const dismissed = localStorage.getItem('vibesCtaDismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('vibesCtaDismissed', 'true');
    setIsDismissed(true);
  };

  if (!userVibes || !hasCompletedVibes(userVibes)) {
    // Don't show if dismissed
    if (isDismissed) return null;

    // Show CTA to take quiz
    return (
      <div className={cn(
        "relative p-6 mb-6 rounded-2xl",
        "bg-gradient-to-b from-background/95 to-background/98",
        "border border-transparent shadow-lg",
        // Gradient border effect
        "before:absolute before:inset-0 before:rounded-2xl before:p-[1px]",
        "before:bg-gradient-to-r before:from-teal-500 before:via-violet-500 before:to-teal-500",
        "before:-z-10"
      )}>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 h-8 w-8 rounded-full hover:bg-teal-500/10"
          onClick={handleDismiss}
          title="Don't show again"
        >
          <X className="h-4 w-4" />
        </Button>
        <div className="flex flex-col items-center text-center gap-4 pt-2">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-teal-500/20 to-violet-500/20 border border-teal-400/30">
            <div className="absolute inset-0 rounded-full bg-teal-400/10 blur-lg" />
            <Sparkles className="relative w-6 h-6 text-teal-400 z-10" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Get personalized AI suggestions</h3>
            <p className="text-sm text-muted-foreground/80">
              Take our quick vibes quiz to help AI suggest activities that match your style
            </p>
          </div>
          <Link href="/vibes">
            <Button size="default" className="gap-2 bg-gradient-to-r from-teal-500 to-violet-500 hover:from-teal-600 hover:to-violet-600 shadow-lg shadow-teal-500/25">
              <Sparkles className="w-4 h-4" />
              Take Quiz (2 min)
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const summary = getVibesSummary(userVibes);

  return (
    <div className={cn(
      "relative p-5 mb-6 rounded-2xl",
      "bg-gradient-to-b from-background/95 to-background/98",
      "border border-transparent shadow-lg",
      // Gradient border effect
      "before:absolute before:inset-0 before:rounded-2xl before:p-[1px]",
      "before:bg-gradient-to-r before:from-teal-500/50 before:via-violet-500/50 before:to-teal-500/50",
      "before:-z-10"
    )}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left group"
      >
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-lg bg-gradient-to-br from-teal-500/10 to-violet-500/10 border border-teal-400/20">
            <Sparkles className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h3 className="font-semibold group-hover:text-teal-400 transition-colors">
              Your Travel Vibes
            </h3>
            <p className="text-sm text-muted-foreground/70">{summary}</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground group-hover:text-teal-400 transition-colors" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-teal-400 transition-colors" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-5 pt-5 border-t border-teal-400/10 space-y-4 animate-in fade-in duration-300">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 rounded-lg bg-teal-500/5 border border-teal-400/10">
              <span className="text-muted-foreground/60 text-xs uppercase tracking-wide">Pace</span>
              <p className="mt-1 font-medium text-foreground">
                {userVibes.comfort.pace_score <= 30 ? 'Relaxed' :
                 userVibes.comfort.pace_score <= 60 ? 'Moderate' : 'Active'}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-violet-500/5 border border-violet-400/10">
              <span className="text-muted-foreground/60 text-xs uppercase tracking-wide">Walking</span>
              <p className="mt-1 font-medium text-foreground">
                {userVibes.comfort.walking_steps_per_day
                  ? `${userVibes.comfort.walking_steps_per_day.toLocaleString()} steps`
                  : 'Not set'}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-teal-500/5 border border-teal-400/10">
              <span className="text-muted-foreground/60 text-xs uppercase tracking-wide">Budget</span>
              <p className="mt-1 font-medium text-foreground">${userVibes.logistics.budget_ppd}/day</p>
            </div>
            <div className="p-3 rounded-lg bg-violet-500/5 border border-violet-400/10">
              <span className="text-muted-foreground/60 text-xs uppercase tracking-wide">Crowds</span>
              <p className="mt-1 font-medium text-foreground">
                {userVibes.logistics.crowd_tolerance <= 2 ? 'Avoid' :
                 userVibes.logistics.crowd_tolerance <= 3 ? 'Okay' : 'Fine'}
              </p>
            </div>
          </div>

          {userVibes.vibe_packs.length > 0 && (
            <div className="pt-2">
              <span className="text-xs text-muted-foreground/60 uppercase tracking-wide">Vibe Packs</span>
              <div className="flex flex-wrap gap-2 mt-3">
                {userVibes.vibe_packs.map((pack) => (
                  <span
                    key={pack}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal-500/10 to-violet-500/10 border border-teal-400/20 text-teal-400 text-xs font-medium"
                  >
                    {pack}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center mt-4 pt-2">
            <Link href="/preferences">
              <Button variant="outline" size="sm" className="gap-2 border-teal-400/20 hover:bg-teal-500/10 hover:border-teal-400/40">
                <Settings className="w-4 h-4" />
                Edit Preferences
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
