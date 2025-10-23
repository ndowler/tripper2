import { NextRequest, NextResponse } from "next/server";
import { createZodCompletion, defaultModel } from "@/lib/openai-client";
import { SwapCardResponseSchema } from "@/lib/schemas/suggestions";

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

    const systemPrompt = `You are a travel planning assistant. Generate 2-3 similar alternatives to a given activity.

IMPORTANT: Return ONLY valid JSON with this exact structure:
{
  "suggestions": [
    {
      "title": "Activity name",
      "description": "2-3 sentences about this activity",
      "location": {
        "name": "Specific place name",
        "address": "Full address (optional)"
      },
      "duration": 120,
      "cost": {
        "amount": 50,
        "currency": "USD"
      },
      "tags": ["tag1", "tag2"],
      "confidence": 0.85,
      "reasoning": "Why this is a good alternative"
    }
  ]
}

Rules:
- Generate 2-3 alternatives that are SIMILAR to the original activity
- Same general category and vibe
- Similar price range (±30%)
- Similar duration (±30 minutes)
- Different specific venue/activity
- Provide reasoning for why each is a good swap
- Respect user preferences if provided
- Include realistic pricing and durations`;

    const userPrompt = `Find similar alternatives to this activity in ${destination}:

${cardContext}
${vibesContext}

Generate 2-3 similar alternatives that match the same vibe and category.`;

    const completion = await createZodCompletion(
      defaultModel,
      [
        { role: "user", content: userPrompt },
        { role: "system", content: systemPrompt },
      ],
      SwapCardResponseSchema,
      "aiSwapCard",
      { temperature: 0.8, max_output_tokens: 2000 }
    );

    const suggestions = Array.isArray(
      (completion.parsed as { suggestions?: any[] })?.suggestions
    )
      ? (completion.parsed as { suggestions: any[] }).suggestions
      : [];

    // Basic validation - at least have title and description
    const validSuggestions = suggestions.filter(
      (s: any) => s.title && s.description
    );

    if (validSuggestions.length === 0) {
      throw new Error("No valid suggestions generated");
    }

    return NextResponse.json({ suggestions: validSuggestions });
  } catch (error: any) {
    console.error("Error in AI swap card:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate alternatives" },
      { status: 500 }
    );
  }
}
