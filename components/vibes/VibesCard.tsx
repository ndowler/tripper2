'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTripStore } from '@/lib/store/tripStore';
import { getVibesSummary, hasCompletedVibes } from '@/lib/utils/vibes';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ChevronDown, ChevronUp, Settings, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VibesCardProps {
  userId?: string; // Optional for demo/offline mode
}

export function VibesCard({ userId }: VibesCardProps) {
  const userVibes = useTripStore((state) => state.userVibes);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!userVibes || !hasCompletedVibes(userVibes)) {
    // Show CTA to take quiz
    return (
      <Card className="p-4 mb-4 border-primary/50 bg-primary/5">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Get personalized AI suggestions</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Take our quick vibes quiz to help AI suggest activities that match your style
            </p>
            <div className="flex gap-2">
              <Link href="/vibes">
                <Button size="sm" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Take Quiz (2 min)
                </Button>
              </Link>
              <Link href="/discover">
                <Button size="sm" variant="outline" className="gap-2">
                  <Compass className="w-4 h-4" />
                  Discover
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  const summary = getVibesSummary(userVibes);

  return (
    <Card className="p-4 mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold group-hover:text-primary transition-colors">
              Your Travel Vibes
            </h3>
            <p className="text-sm text-muted-foreground">{summary}</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Pace:</span>
              <span className="ml-2 font-medium">
                {userVibes.comfort.pace_score <= 30 ? 'Relaxed' :
                 userVibes.comfort.pace_score <= 60 ? 'Moderate' : 'Active'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Walking:</span>
              <span className="ml-2 font-medium">{userVibes.comfort.walking_steps_per_day}km/day</span>
            </div>
            <div>
              <span className="text-muted-foreground">Budget:</span>
              <span className="ml-2 font-medium">${userVibes.logistics.budget_ppd}/day</span>
            </div>
            <div>
              <span className="text-muted-foreground">Crowds:</span>
              <span className="ml-2 font-medium">
                {userVibes.logistics.crowd_tolerance <= 2 ? 'Avoid' :
                 userVibes.logistics.crowd_tolerance <= 3 ? 'Okay' : 'Fine'}
              </span>
            </div>
          </div>

          {userVibes.vibe_packs.length > 0 && (
            <div className="pt-2">
              <span className="text-sm text-muted-foreground">Vibe Packs:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {userVibes.vibe_packs.map((pack) => (
                  <span
                    key={pack}
                    className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium"
                  >
                    {pack}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 mt-2">
            <Link href="/discover" className="flex-1">
              <Button variant="default" size="sm" className="w-full gap-2">
                <Compass className="w-4 h-4" />
                Discover
              </Button>
            </Link>
            <Link href="/preferences" className="flex-1">
              <Button variant="outline" size="sm" className="w-full gap-2">
                <Settings className="w-4 h-4" />
                Edit
              </Button>
            </Link>
          </div>
        </div>
      )}
    </Card>
  );
}
