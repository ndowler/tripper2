"use client";

import React from "react";
import { Sparkles, MapPin, Zap, Brain } from "lucide-react";

export function WelcomeModal() {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-6xl mb-4">✈️</div>
        <h2 className="text-2xl font-bold mb-2">
          Welcome to Triplio!
        </h2>
        <p className="text-muted-foreground">
          Let's show you how easy trip planning can be
        </p>
      </div>

      <div className="space-y-3 pt-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">Drag & Drop Planning</p>
            <p className="text-xs text-muted-foreground">
              Build your itinerary intuitively
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">AI-Powered Suggestions</p>
            <p className="text-xs text-muted-foreground">
              Get personalized recommendations
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">Lightning Fast</p>
            <p className="text-xs text-muted-foreground">
              Works offline, syncs everywhere
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">Everything in One Place</p>
            <p className="text-xs text-muted-foreground">
              Flights, hotels, activities, meals, and more
            </p>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t text-center text-sm text-muted-foreground">
        This tour takes about 2 minutes
      </div>
    </div>
  );
}

