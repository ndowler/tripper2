"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SuggestionCard } from "@/lib/types/suggestions";
import {
  formatDuration,
  formatPriceTier,
  getDaypartInfo,
  getCategoryEmoji,
  getGoogleSearchUrl,
} from "@/lib/utils/suggestions";
import { ExternalLink, Plus, Search } from "lucide-react";

interface SuggestionDetailModalProps {
  suggestion: SuggestionCard | null;
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
  onSave: (suggestion: SuggestionCard) => void;
  onBack: () => void;
}

export function SuggestionDetailModal({
  suggestion,
  isOpen,
  onClose,
  onAdd,
  onSave,
  onBack,
}: SuggestionDetailModalProps) {
  if (!suggestion) return null;

  const daypartInfo = getDaypartInfo(suggestion.best_time);
  const categoryEmoji = getCategoryEmoji(suggestion.category);

  const handleSave = () => {
    onSave(suggestion);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="text-4xl">
              {suggestion.media?.emoji || categoryEmoji}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl">{suggestion.title}</DialogTitle>
              {suggestion.subtitle && (
                <DialogDescription className="text-base mt-1">
                  {suggestion.subtitle}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">About</h3>
            <p className="text-sm text-foreground/80">
              {suggestion.description}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Duration</p>
              <p className="font-medium">
                {formatDuration(suggestion.est_duration_min)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Price</p>
              <p className="font-medium">
                {formatPriceTier(suggestion.price_tier)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Best Time</p>
              <p className="font-medium">
                {daypartInfo.emoji} {daypartInfo.label}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Category</p>
              <p className="font-medium capitalize">{suggestion.category}</p>
            </div>
          </div>

          {/* Area */}
          {suggestion.area && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Location</p>
              <p className="font-medium">📍 {suggestion.area}</p>
            </div>
          )}

          {/* Tags */}
          {suggestion.tags.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {suggestion.tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Why this suggestion? */}
          {suggestion.reasons && suggestion.reasons.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Why this suggestion?</h3>
              <ul className="space-y-1">
                {suggestion.reasons.map((reason, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-foreground/80 flex gap-2"
                  >
                    <span className="text-primary">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Booking Info */}
          {suggestion.booking && (
            <div>
              <h3 className="font-semibold mb-2">Booking</h3>
              {suggestion.booking.requires &&
                suggestion.booking.requires.length > 0 && (
                  <p className="text-sm text-foreground/80 mb-2">
                    Requires: {suggestion.booking.requires.join(", ")}
                  </p>
                )}
              {suggestion.booking.url && (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={suggestion.booking.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Visit Website
                  </a>
                </Button>
              )}
            </div>
          )}

          {/* Confidence Score */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">
              Match Confidence: {Math.round(suggestion.confidence * 100)}%
            </p>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 flex-1 rounded ${
                    idx < Math.round(suggestion.confidence * 5)
                      ? "bg-primary"
                      : "bg-secondary"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 mt-6">
          <div className="flex gap-3">
            <Button onClick={handleSave} className="flex-1">
              <Plus className="w-4 h-4 mr-2" />
              Save to Things to Do
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
          <Button variant="secondary" className="w-full">
            <a
              href={getGoogleSearchUrl(suggestion)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              Learn More on Google
              <ExternalLink className="w-3 h-3" />
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
