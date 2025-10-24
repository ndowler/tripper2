import { NextRequest, NextResponse } from "next/server";
import { createZodCompletion, defaultModel } from "@/lib/openai-client";
import { SwapCardResponseSchema } from "@/lib/schemas/suggestions";
import { SuggestionCard } from "@/lib/types/suggestions";
import { swapCardPrompt } from "@/lib/prompts/ai-swap-card-prompts";

export async function POST(req: NextRequest) {
  try {
    const { card, destination, vibes } = await req.json();

    if (!card || !card.title) {
      return NextResponse.json(
        { error: "Card data is required" },
        { status: 400 }
      );
    }

    // Build context about the card
    const cardContext = `
Current activity: ${card.title}
Type: ${card.type}
${card.location?.name ? `Location: ${card.location.name}` : ""}
${card.duration ? `Duration: ${card.duration} minutes` : ""}
${card.cost ? `Cost: $${card.cost.amount}` : ""}
${card.tags?.length > 0 ? `Tags: ${card.tags.join(", ")}` : ""}
${card.notes ? `Notes: ${card.notes}` : ""}
`;

    // Build vibes context if provided
    let vibesContext = "";
    if (vibes) {
      vibesContext = `
User Preferences:
- Budget: $${vibes.logistics?.budget_ppd || 100}/day
- Pace: ${vibes.comfort?.pace_score || 50}/100
- Crowd tolerance: ${vibes.logistics?.crowd_tolerance || 3}/5
${
  vibes.taste?.dietary_constraints?.length > 0
    ? `- Dietary: ${vibes.taste.dietary_constraints.join(", ")}`
    : ""
}
`;
    }

    const { userPrompt, systemPrompt } = swapCardPrompt({
      destination,
      cardContext,
      vibesContext,
    });

    const completion = await createZodCompletion(
      defaultModel,
      [
        { role: "user", content: userPrompt },
        { role: "system", content: systemPrompt },
      ],
      destination,
      SwapCardResponseSchema,
      "aiSwapCard",
      { temperature: 0.8, max_output_tokens: 2000 }
    );

    const suggestions = Array.isArray(
      (completion.parsed as { suggestions?: SuggestionCard[] })?.suggestions
    )
      ? (completion.parsed as { suggestions: SuggestionCard[] }).suggestions
      : [];

    // Basic validation - at least have title and description
    const validSuggestions = suggestions.filter(
      (s: SuggestionCard) => s.title && s.description
    );

    if (validSuggestions.length === 0) {
      throw new Error("No valid suggestions generated");
    }

    return NextResponse.json({ suggestions: validSuggestions });
  } catch (error: unknown) {
    console.error("OpenAI API error:", error);

    // Type guard for error object
    const err = error as { status?: number; message?: string };
    return NextResponse.json(
      { error: err.message || "Failed to generate alternatives" },
      { status: 500 }
    );
  }
}
