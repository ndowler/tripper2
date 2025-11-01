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
    const { destination, vibe_profile, category } = body as DiscoveryRequest & { category?: string };

    if (!destination?.city) {
      return NextResponse.json(
        { error: "Destination city is required" },
        { status: 400 }
      );
    }

    // Build vibes context
    let vibesPrompt = "";
    if (vibe_profile) {
      try {
        const vibes: UserVibes = vibe_profile;
        vibesPrompt = "\n\n" + vibesToPrompt(vibes);
      } catch (error) {
        console.warn("Failed to parse vibes context:", error);
      }
    }

    // Calculate max theme weight for category cap logic
    const themeWeights = vibe_profile?.taste?.theme_weights || {};
    const maxThemeWeight = Math.max(
      ...Object.values(themeWeights).map((w: any) => w || 0),
      0
    );

    // Category-specific instructions
    const categoryInstructions = category
      ? `\n\nCATEGORY FOCUS: The user specifically requested "${category}" suggestions.
${
  category === "food"
    ? "Generate ONLY food-related suggestions: restaurants, cafes, street food, markets, food tours, cooking classes."
    : category === "culture"
    ? "Generate ONLY cultural and activity suggestions: museums, historical sites, art galleries, cultural experiences, guided tours, workshops."
    : category === "nature"
    ? "Generate ONLY nature and outdoor suggestions: parks, gardens, hiking trails, beaches, scenic viewpoints, outdoor activities."
    : category === "entertainment"
    ? "Generate ONLY entertainment suggestions: shows, concerts, theaters, nightlife, clubs, bars, live music venues."
    : category === "shopping"
    ? "Generate ONLY shopping suggestions: markets, boutiques, malls, local shops, craft stores, specialty stores."
    : ""
}`
      : "";

    const systemPrompt = `You are a precise trip-planning card generator.
Return ONLY valid JSON array of 5 objects that match the provided schema.
Do not invent exact prices or hours. Use general price_tier 0..3.
Prefer well-known, safe, and open-to-the-public options inside the destination.
Keep titles < 60 chars; descriptions ≤ 160 chars; max 5 tags.
Respect constraints (dietary, accessibility). Explain matches in "reasons".
Self-score "confidence" 0..1 based on how well each item fits the vibe_profile.

CRITICAL RULES:
- ${category ? `Focus EXCLUSIVELY on ${category} suggestions as specified` : "Mix categories to avoid monotony; vary the suggestions across different types"}
- Align items to "daypart_bias"; early = more morning options, late = evening/night options
- If crowd_tolerance ≤ 2, favor timed/early-entry or low-crowd alternatives
- If dietary constraints exist, ensure food items comply (e.g., no pork, vegetarian, etc.)
- Use "area" with neighborhood names (e.g., Trastevere, Shibuya, SoHo) when helpful
- Set "media.emoji" to a fitting emoji (🍝, 🖼️, ☕, 🌅…)
- Generate stable looking "id" values like "${destination.city
      .toLowerCase()
      .slice(0, 3)}-001", "${destination.city
      .toLowerCase()
      .slice(0, 3)}-002", etc.
${categoryInstructions}

${
  vibesPrompt
    ? "PERSONALIZATION: Tailor ALL suggestions to match the user's travel preferences. Honor pace, budget, themes, crowd tolerance, and all constraints."
    : ""
}`;

    const userPrompt = `DESTINATION:
- city: ${destination.city}
- country: ${destination.country || "N/A"}

${vibesPrompt ? `VIBE_PROFILE:\n${vibesPrompt}` : ""}

INSTRUCTIONS:
Generate exactly 5 SuggestionCard objects as a JSON array for ${
      destination.city
    }${destination.country ? `, ${destination.country}` : ""}.
Return ONLY the JSON array of 5 objects.`;

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

    // Accept 3-5 valid suggestions
    if (suggestions.length < 3) {
      throw new Error(
        `Only ${suggestions.length} valid suggestions generated. Please try again.`
      );
    }

    return NextResponse.json({
      suggestions: suggestions.slice(0, 5),
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
