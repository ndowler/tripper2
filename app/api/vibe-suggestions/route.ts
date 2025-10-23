import { NextRequest, NextResponse } from "next/server";
import { vibesToPrompt } from "@/lib/utils/vibes";
import { SuggestionResponseSchema } from "@/lib/schemas/suggestions";
import type { UserVibes } from "@/lib/types/vibes";
import type { DiscoveryRequest, SuggestionCard } from "@/lib/types/suggestions";
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
    // console.log("Vibe Suggestions request body:", body);
    const { destination, vibes, vibe_profile } = body;

    if (!destination) {
      return NextResponse.json(
        { error: "Destination is required" },
        { status: 400 }
      );
    }

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
    // // Calculate max theme weight for category cap logic
    // const themeWeights = vibe_profile?.taste?.theme_weights || {};
    // const maxThemeWeight = Math.max(
    //   ...Object.values(themeWeights).map((w: any) => w || 0),
    //   0
    // );
    const systemPrompt = `You are a precise trip-planning card generator planning a trip for ${
      destination.city
    }, ${destination.state || destination.country || "as the destination"}.
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
- Set "media.emoji" to a fitting emoji (🍝, 🖼️, ☕, 🌅…)

${
  vibesPrompt
    ? "PERSONALIZATION: Tailor ALL suggestions to match the user's travel preferences. Honor pace, budget, themes, crowd tolerance, and all constraints."
    : ""
}`;

    const userPrompt = `DESTINATION:
  ${destination}

${vibesPrompt ? `VIBE_PROFILE:\n${vibesPrompt}` : ""}

INSTRUCTIONS:
Generate SuggestionCard objects as a JSON array for ${destination}.
Return ONLY the JSON array of objects.`;

    const completion = await createZodCompletion(
      defaultModel,
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      destination,
      SuggestionResponseSchema,
      "vibeSuggestions",
      { temperature: 0.7 }
    );
    // console.log("Vibe Suggestions completion:", completion);
    const suggestions = Array.isArray(
      (completion.parsed as { suggestions?: SuggestionCard[] })?.suggestions
    )
      ? (completion.parsed as { suggestions: SuggestionCard[] }).suggestions
      : [];

    // Accept 5-20 valid suggestions
    if (suggestions.length > 20) {
      throw new Error(
        `Only ${suggestions.length} valid suggestions generated. Please try again.`
      );
    }

    return NextResponse.json({
      suggestions: suggestions.slice(0, 20),
      model: completion.model,
      usage: completion.usage,
    });
  } catch (error: unknown) {
    console.error("Vibe Suggestions API error:", error);

    // Type guard for error object
    const err = error as { status?: number; message?: string };

    if (err.status === 401) {
      return NextResponse.json(
        { error: "Invalid OpenAI API key" },
        { status: 401 }
      );
    }

    if (err.status === 429) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: err.message || "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}
