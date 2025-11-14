import { NextRequest, NextResponse } from "next/server";
import { vibesToPrompt } from "@/lib/utils/vibes";
import { SuggestionResponseSchema } from "@/lib/schemas/suggestions";
import type { UserVibes } from "@/lib/types/vibes";
import type { DiscoveryRequest } from "@/lib/types/suggestions";
import { createZodCompletion, defaultModel } from "@/lib/openai-client";

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const body: DiscoveryRequest = await request.json();
    console.log("Vibe Suggestions request body:", body);
    const { destination, vibes, vibe_profile, limit = 20, category } = body;

    if (!destination) {
      return NextResponse.json(
        { error: "Destination is required" },
        { status: 400 }
      );
    }

    // Format destination string properly (fix for object-to-string conversion)
    const destinationStr = typeof destination === 'string' 
      ? destination
      : [
          destination.city, 
          destination.state, 
          destination.country
        ].filter(Boolean).join(', ');

    // If vibe_profile is not provided, use vibes
    const vibeProfile = vibe_profile || vibes;

    // Build vibes context
    let vibesPrompt = "";
    if (vibeProfile) {
      try {
        const vibes: UserVibes = vibeProfile;
        vibesPrompt = "\n\n" + vibesToPrompt(vibes);
      } catch (error) {
        console.warn("Failed to parse vibes context:", error);
      }
    }
    console.log("Vibes Prompt:", vibesPrompt);
    // Calculate max theme weight for category cap logic
    const themeWeights = vibe_profile?.taste?.theme_weights || {};
    const maxThemeWeight = Math.max(
      ...Object.values(themeWeights).map((w: any) => w || 0),
      0
    );
    console.log("Max theme weight:", maxThemeWeight);
    console.log("Vibes Prompt:", vibesPrompt);
    const systemPrompt = `You are an expert local travel guide creating personalized recommendations.
Return ONLY valid JSON in this format: { "suggestions": [...] }
Generate exactly ${limit} specific, named suggestion objects.

RESPONSE FORMAT:
{
  "suggestions": [
    { "id": "...", "title": "...", ... },
    { "id": "...", "title": "...", ... }
    ... (${limit} total objects)
  ]
}

FIELD REQUIREMENTS:
- id: unique string (e.g., "rom-001", "tok-042")
- title: SPECIFIC business/place name < 60 chars (e.g., "Blue Bottle Coffee", "The Metropolitan Museum of Art")
- description: WHY to visit - compelling reason with specific details ≤ 160 chars
- category: food, culture, nature, shopping, wellness, nightlife, tour, coffee, kids, or other
- tags: array of 1-5 descriptive tags (auto-generated, not displayed to user)
- est_duration_min: realistic visit time 15-480
- best_time: morning, afternoon, evening, night, or any (auto-generated, not displayed to user)
- price_tier: 0 (free), 1 (budget $-$$), 2 (mid $$-$$$), or 3 (premium $$$$)
- confidence: 0.0-1.0 (your confidence this matches user's preferences)
- area: specific neighborhood name (e.g., "Shibuya", "Trastevere", "SoHo")
- media.emoji: fitting single emoji (e.g., ☕🏛️🌸🍜)
- reasons: 2-3 compelling bullets explaining why this is perfect for them

✨ SPECIFICITY RULES (CRITICAL):
- ALWAYS use actual business/place names, never generic descriptions
- BAD: "Visit a coffee shop for a tasting" 
- GOOD: "Blue Bottle Coffee - Award-winning pour-over in minimalist space"
- BAD: "Local museum"
- GOOD: "Museum of Modern Art (MoMA) - Iconic collection including Van Gogh's Starry Night"
- BAD: "Traditional restaurant"
- GOOD: "Sukiyabashi Jiro - 3-Michelin-star sushi experience"

- Description MUST explain WHY someone should go (unique features, famous for, what makes it special)
- Include specific details: signature dishes, notable artworks, unique experiences, awards, historical significance

CRITICAL RULES:
- ${category ? `Focus EXCLUSIVELY on ${category} suggestions` : "Mix categories - vary suggestions across different types"}
- If crowd_tolerance ≤ 2, recommend early opening times or less touristy alternatives
- If dietary constraints exist, ensure food suggestions comply and mention specific menu items
- Use REAL, well-known, currently operating establishments
- Prioritize places with strong reputations, awards, or unique characteristics
- Do NOT invent prices, hours, or fake establishments

${
  vibesPrompt
    ? "PERSONALIZATION: Every suggestion MUST be tailored to match the user's travel preferences. Consider their pace, budget, themes, crowd tolerance, daypart preferences, and all constraints."
    : ""
}`;

    const userPrompt = `DESTINATION:
  ${destinationStr}

${vibesPrompt ? `VIBE_PROFILE:\n${vibesPrompt}` : ""}

TASK:
Generate exactly ${limit} SPECIFIC, NAMED recommendations for ${destinationStr}.

CRITICAL REQUIREMENTS:
- Each title MUST be an actual business/place name (e.g., "Tartine Bakery", "Golden Gate Park", "Ferry Building Marketplace")
- Each description MUST explain WHY to visit with compelling specific details
- Use REAL establishments that are well-known and highly rated
- Include what makes each place special: signature items, awards, unique features, historical significance

EXAMPLES OF GOOD TITLES:
✅ "Blue Bottle Coffee" (not "Local coffee shop")
✅ "The Louvre Museum" (not "Art museum")  
✅ "Tsukiji Outer Market" (not "Fish market")
✅ "Central Park" (not "City park")

Return in format: { "suggestions": [ ... ${limit} objects ... ] }

Ensure EVERY object has all required fields with SPECIFIC, REAL place names and compelling reasons to visit.`;

    const completion = await createZodCompletion(
      defaultModel,
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      SuggestionResponseSchema,
      "vibeSuggestions",
      { temperature: 0.7 }
    );
    const suggestions = Array.isArray(
      (completion.parsed as { suggestions?: any[] })?.suggestions
    )
      ? (completion.parsed as { suggestions: any[] }).suggestions
      : [];

    // Accept 3-20 valid suggestions (more lenient to reduce failures)
    if (suggestions.length < 3) {
      throw new Error(
        `Only ${suggestions.length} valid suggestions generated. Please try again.`
      );
    }

    if (suggestions.length > 20) {
      console.warn(`Generated ${suggestions.length} suggestions, truncating to 20`);
    }

    // Return up to 5 suggestions (or fewer if less were generated)
    return NextResponse.json({
      suggestions: suggestions.slice(0, Math.min(5, suggestions.length)),
      model: completion.model,
      usage: completion.usage,
    });
  } catch (error: any) {
    console.error("Vibe Suggestions API error:", error);

    if (error?.status === 401) {
      return NextResponse.json(
        { error: "Invalid OpenAI API key" },
        { status: 401 }
      );
    }

    if (error?.status === 429) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: error?.message || "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}
