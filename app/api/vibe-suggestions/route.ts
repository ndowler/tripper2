import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { vibesToPrompt } from '@/lib/utils/vibes';
import { SuggestionArraySchema, SuggestionCardSchema } from '@/lib/schemas/suggestions';
import type { UserVibes } from '@/lib/types/vibes';
import type { DiscoveryRequest } from '@/lib/types/suggestions';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// TypeScript definition string for prompt anchoring
const SUGGESTION_CARD_TYPE_DEF = `{
  id: string;                         // stable ID like "rom-001"
  title: string;                      // max 60 chars
  subtitle?: string;                  // neighborhood/area
  description: string;                // max 160 chars
  category: "food" | "culture" | "nature" | "shopping" | "wellness" | "nightlife" | "tour" | "coffee" | "kids" | "other";
  tags: string[];                     // max 5 tags
  est_duration_min: number;           // 15-480 minutes
  best_time: "morning" | "afternoon" | "evening" | "night" | "any";
  price_tier: 0 | 1 | 2 | 3;         // 0=free, 1=budget, 2=mid, 3=premium
  area?: string;                      // neighborhood name
  booking?: {
    url?: string;
    requires?: ("ticket" | "reservation")[];
  };
  media?: {
    emoji?: string;                   // single fitting emoji
  };
  confidence: number;                 // 0-1 (your self-score)
  reasons?: string[];                 // max 3 short bullets
}`;

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const body: DiscoveryRequest = await request.json();
    const { destination, vibe_profile } = body;

    if (!destination?.city) {
      return NextResponse.json(
        { error: 'Destination city is required' },
        { status: 400 }
      );
    }

    // Build vibes context
    let vibesPrompt = '';
    if (vibe_profile) {
      try {
        const vibes: UserVibes = vibe_profile;
        vibesPrompt = '\n\n' + vibesToPrompt(vibes);
      } catch (error) {
        console.warn('Failed to parse vibes context:', error);
      }
    }

    // Calculate max theme weight for category cap logic
    const themeWeights = vibe_profile?.taste?.theme_weights || {};
    const maxThemeWeight = Math.max(...Object.values(themeWeights).map((w: any) => w || 0), 0);

    const systemPrompt = `You are a precise trip-planning card generator.
Return ONLY valid JSON array of 20 objects that match the provided schema.
Do not invent exact prices or hours. Use general price_tier 0..3.
Prefer well-known, safe, and open-to-the-public options inside the destination.
Keep titles < 60 chars; descriptions ≤ 160 chars; max 5 tags.
Respect constraints (dietary, accessibility). Explain matches in "reasons".
Self-score "confidence" 0..1 based on how well each item fits the vibe_profile.

CRITICAL RULES:
- Mix categories to avoid monotony; cap any single category at 4 unless its theme weight ≥ 0.9
- Align items to "daypart_bias"; early = more morning options, late = evening/night options
- If crowd_tolerance ≤ 2, favor timed/early-entry or low-crowd alternatives
- If dietary constraints exist, ensure food items comply (e.g., no pork, vegetarian, etc.)
- Use "area" with neighborhood names (e.g., Trastevere, Shibuya, SoHo) when helpful
- Set "media.emoji" to a fitting emoji (🍝, 🖼️, ☕, 🌅…)
- Generate stable looking "id" values like "${destination.city.toLowerCase().slice(0, 3)}-001", "${destination.city.toLowerCase().slice(0, 3)}-002", etc.

${vibesPrompt ? 'PERSONALIZATION: Tailor ALL suggestions to match the user\'s travel preferences. Honor pace, budget, themes, crowd tolerance, and all constraints.' : ''}`;

    const userPrompt = `DESTINATION:
- city: ${destination.city}
- country: ${destination.country || 'N/A'}
- dates: ${destination.start || 'N/A'} to ${destination.end || 'N/A'} (approximate; use for seasonal context only)

${vibesPrompt ? `VIBE_PROFILE:\n${vibesPrompt}` : ''}

OUTPUT SCHEMA (TypeScript reference):
${SUGGESTION_CARD_TYPE_DEF}

INSTRUCTIONS:
Generate exactly 20 SuggestionCard objects as a JSON array for ${destination.city}${destination.country ? `, ${destination.country}` : ''}.
Return ONLY the JSON array of 20 objects.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Parse response
    let suggestions;
    try {
      const parsed = JSON.parse(content);
      // Handle both direct array and wrapped formats
      suggestions = Array.isArray(parsed) ? parsed : (parsed.suggestions || parsed.cards || []);
      
      if (!Array.isArray(suggestions) || suggestions.length === 0) {
        console.error('No suggestions array found in response:', content);
        throw new Error('AI returned no suggestions. Please try again.');
      }
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error('Invalid response format from OpenAI');
    }

    // Validate with salvage logic
    const validSuggestions = [];
    for (const suggestion of suggestions) {
      const result = SuggestionCardSchema.safeParse(suggestion);
      if (result.success) {
        validSuggestions.push(result.data);
      } else {
        console.warn('Invalid suggestion:', suggestion, result.error);
      }
    }

    // Accept 10-20 valid suggestions
    if (validSuggestions.length < 10) {
      throw new Error(`Only ${validSuggestions.length} valid suggestions generated. Please try again.`);
    }

    // Take up to 20 suggestions
    const finalSuggestions = validSuggestions.slice(0, 20);

    return NextResponse.json({
      suggestions: finalSuggestions,
      model: completion.model,
      usage: completion.usage,
    });
  } catch (error: any) {
    console.error('Vibe Suggestions API error:', error);

    if (error?.status === 401) {
      return NextResponse.json(
        { error: 'Invalid OpenAI API key' },
        { status: 401 }
      );
    }

    if (error?.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: error?.message || 'Failed to generate suggestions' },
      { status: 500 }
    );
  }
}

