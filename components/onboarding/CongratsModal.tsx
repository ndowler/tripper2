"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, Sparkles, Command, Brain, GripVertical } from "lucide-react";

export function CongratsModal() {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-4">
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              {['🎉', '✨', '🎊', '⭐', '🌟'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">
          You're All Set! 🎉
        </h2>
        <p className="text-muted-foreground">
          You've learned the essentials of Triplio
        </p>
      </div>

      <div className="bg-muted/50 rounded-lg p-4 space-y-3">
        <p className="font-medium text-sm mb-3">Quick Tips to Remember:</p>
        
        <div className="flex items-start gap-2 text-sm">
          <Command className="h-4 w-4 mt-0.5 text-primary shrink-0" />
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-background border text-xs">Cmd+K</kbd> for quick actions</span>
        </div>

        <div className="flex items-start gap-2 text-sm">
          <GripVertical className="h-4 w-4 mt-0.5 text-primary shrink-0" />
          <span>Drag cards and days to rearrange your itinerary</span>
        </div>

        <div className="flex items-start gap-2 text-sm">
          <Brain className="h-4 w-4 mt-0.5 text-primary shrink-0" />
          <span>Use AI Discover for personalized suggestions</span>
        </div>

        <div className="flex items-start gap-2 text-sm">
          <Sparkles className="h-4 w-4 mt-0.5 text-primary shrink-0" />
          <span>Everything auto-saves and syncs across devices</span>
        </div>
      </div>

      <div className="pt-2 text-center text-sm text-muted-foreground">
        You can restart this tour anytime from your profile
      </div>

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotateZ(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotateZ(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
      `}</style>
    </div>
  );
}

