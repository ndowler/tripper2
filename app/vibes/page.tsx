'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTripStore } from '@/lib/store/tripStore';
import { getDefaultVibes, calculateThemeWeights, applyVibePack } from '@/lib/utils/vibes';
import { UserVibes, VibePackName } from '@/lib/types/vibes';
import { EmojiSelector, EmojiOption } from '@/components/vibes/EmojiSelector';
import { SliderInput } from '@/components/vibes/SliderInput';
import { ThemePicker } from '@/components/vibes/ThemePicker';
import { VibePackSelector } from '@/components/vibes/VibePackSelector';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const TOTAL_QUESTIONS = 10;

export default function VibesQuizPage() {
  const router = useRouter();
  const setUserVibes = useTripStore((state) => state.setUserVibes);
  
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Partial<UserVibes>>(() => getDefaultVibes());

  const updateAnswer = (updates: Partial<UserVibes>) => {
    setAnswers(prev => ({
      ...prev,
      ...updates,
      comfort: { ...prev.comfort!, ...updates.comfort },
      taste: { ...prev.taste!, ...updates.taste },
      logistics: { ...prev.logistics!, ...updates.logistics },
      access: { ...prev.access!, ...updates.access },
    }));
  };

  const handleNext = () => {
    if (step < TOTAL_QUESTIONS) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    const vibes: UserVibes = {
      ...getDefaultVibes(),
      ...answers,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setUserVibes(vibes);
    toast.success('Travel preferences saved! 🎉');
    router.push('/demo');
  };

  const progress = (step / TOTAL_QUESTIONS) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Vibes Quiz</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">What's your travel style?</h1>
          <p className="text-muted-foreground">
            Answer 10 quick questions to get personalized AI suggestions
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Question {step} of {TOTAL_QUESTIONS}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <Card className="p-6 mb-6">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Your perfect day ends feeling...</h2>
              <EmojiSelector
                options={[
                  { value: 20, emoji: '🧘', label: 'Recharged - took it super easy' },
                  { value: 40, emoji: '🙂', label: 'Content - nice and relaxed' },
                  { value: 60, emoji: '😅', label: 'Accomplished - got a lot done!' },
                  { value: 80, emoji: '🤩', label: 'Epic - packed every minute' },
                  { value: 95, emoji: '🥵', label: 'Spent - totally exhausted (in a good way)' },
                ]}
                value={answers.comfort?.pace_score ?? null}
                onChange={(value) => updateAnswer({ comfort: { ...answers.comfort!, pace_score: value as number } })}
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">How much walking are your feet up for?</h2>
              <EmojiSelector
                options={[
                  { value: 3, emoji: '🪑', label: '<3k steps - minimal walking' },
                  { value: 5, emoji: '🚶', label: '~5k steps - light strolls' },
                  { value: 8, emoji: '🚶‍♂️', label: '~8k steps - moderate walking' },
                  { value: 12, emoji: '🥾', label: '~12k steps - active exploration' },
                  { value: 18, emoji: '⛰️', label: '18k+ steps - all-day adventures' },
                ]}
                value={answers.comfort?.walking_km_per_day ?? null}
                onChange={(value) => updateAnswer({ comfort: { ...answers.comfort!, walking_km_per_day: value as number } })}
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Mornings or nights?</h2>
              <EmojiSelector
                options={[
                  { value: 'early', emoji: '🌅', label: 'Early bird - sunrise activities' },
                  { value: 'balanced', emoji: '😌', label: 'Balanced - flexible timing' },
                  { value: 'late', emoji: '🌙', label: 'Night owl - late starts, evening adventures' },
                ]}
                value={answers.comfort?.daypart_bias ?? null}
                onChange={(value) => updateAnswer({ comfort: { ...answers.comfort!, daypart_bias: value as any } })}
              />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">How bold are your tastebuds?</h2>
              <EmojiSelector
                options={[
                  { value: 1, emoji: '🥪', label: 'Familiar - stick to what I know' },
                  { value: 2, emoji: '🍝', label: 'Regional classics - local favorites' },
                  { value: 4, emoji: '🍣', label: 'Adventurous - try authentic local cuisine' },
                  { value: 5, emoji: '🧪', label: 'Experimental - the weirder the better!' },
                ]}
                value={answers.taste?.food_adventurousness ?? null}
                onChange={(value) => updateAnswer({ taste: { ...answers.taste!, food_adventurousness: value as number } })}
              />
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Daily budget (per person, excluding hotel)?</h2>
              <EmojiSelector
                options={[
                  { value: 40, emoji: '💸', label: '€30-50 - budget-conscious' },
                  { value: 75, emoji: '💳', label: '€50-100 - moderate spending' },
                  { value: 150, emoji: '💼', label: '€100-200 - comfortable budget' },
                  { value: 250, emoji: '👑', label: '€200+ - luxury experience' },
                ]}
                value={answers.logistics?.budget_ppd ?? null}
                onChange={(value) => updateAnswer({ logistics: { ...answers.logistics!, budget_ppd: value as number } })}
              />
            </div>
          )}

          {step === 6 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Pick your top 3 themes</h2>
              <ThemePicker
                selectedThemes={Object.keys(answers.taste?.theme_weights || {})}
                onChange={(themes) => {
                  const weights = calculateThemeWeights(themes);
                  updateAnswer({ taste: { ...answers.taste!, theme_weights: weights } });
                }}
                maxSelections={3}
              />
            </div>
          )}

          {step === 7 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Crowd tolerance?</h2>
              <EmojiSelector
                options={[
                  { value: 1, emoji: '😌', label: 'Avoid lines - prefer off-peak times' },
                  { value: 3, emoji: '🙂', label: 'Some crowds okay - mix of popular and quiet' },
                  { value: 5, emoji: '😎', label: 'Big sights are fine - don\'t mind busy places' },
                ]}
                value={answers.logistics?.crowd_tolerance ?? null}
                onChange={(value) => updateAnswer({ logistics: { ...answers.logistics!, crowd_tolerance: value as number } })}
              />
            </div>
          )}

          {step === 8 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">How comfortable are you with transit?</h2>
              <EmojiSelector
                options={[
                  { value: 'rides', emoji: '🚖', label: 'Rideshares/taxis only' },
                  { value: 'metro', emoji: '🚋', label: 'Metro & trams are fine' },
                  { value: 'trains', emoji: '🚆', label: 'Intercity trains too' },
                  { value: 'buses', emoji: '🚌', label: 'Buses are okay' },
                  { value: 'all', emoji: '🗺️', label: 'All public transit - I love it!' },
                ]}
                value={(() => {
                  const modes = answers.logistics?.transit_modes_allowed || [];
                  if (modes.length === 1 && modes.includes('rideshare')) return 'rides';
                  if (modes.includes('metro') && !modes.includes('train')) return 'metro';
                  if (modes.includes('train') && !modes.includes('bus')) return 'trains';
                  if (modes.includes('bus')) return 'buses';
                  return 'all';
                })()}
                onChange={(value) => {
                  let modes: string[] = [];
                  if (value === 'rides') modes = ['rideshare', 'taxi'];
                  else if (value === 'metro') modes = ['metro', 'tram', 'rideshare'];
                  else if (value === 'trains') modes = ['metro', 'tram', 'train', 'rideshare'];
                  else if (value === 'buses') modes = ['metro', 'tram', 'train', 'bus', 'rideshare'];
                  else modes = ['metro', 'tram', 'train', 'bus', 'rideshare', 'taxi', 'ferry'];
                  updateAnswer({ logistics: { ...answers.logistics!, transit_modes_allowed: modes } });
                }}
              />
            </div>
          )}

          {step === 9 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">How much surprise do you want?</h2>
              <EmojiSelector
                options={[
                  { value: 0, emoji: '📋', label: 'No surprises - I like to plan everything' },
                  { value: 1, emoji: '🔎', label: 'A few twists - mix of known and new' },
                  { value: 2, emoji: '🎁', label: 'Surprise me daily - I love discovering!' },
                ]}
                value={answers.logistics?.surprise_level ?? null}
                onChange={(value) => updateAnswer({ logistics: { ...answers.logistics!, surprise_level: value as 0 | 1 | 2 } })}
              />
            </div>
          )}

          {step === 10 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Choose your vibe packs (optional)</h2>
              <p className="text-sm text-muted-foreground">
                These presets help us understand your style even better
              </p>
              <VibePackSelector
                selectedPacks={answers.vibe_packs || []}
                onChange={(packs) => updateAnswer({ vibe_packs: packs })}
                maxSelections={2}
              />
            </div>
          )}
        </Card>

        {/* Navigation */}
        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <Button onClick={handleNext} className="min-w-[120px]">
            {step === TOTAL_QUESTIONS ? (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Finish
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Skip Option */}
        {step < TOTAL_QUESTIONS && (
          <div className="text-center mt-4">
            <button
              onClick={handleComplete}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip and use defaults
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
