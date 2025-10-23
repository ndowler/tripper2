import { NextRequest, NextResponse } from "next/server";
import { vibesToPrompt } from "@/lib/utils/vibes";
import type { UserVibes } from "@/lib/types/vibes";
import { createZodCompletion, defaultModel } from "@/lib/openai-client";
import { SuggestionCardSchema } from "@/lib/schemas/suggestions";
import { SuggestionCard } from "@/lib/types/suggestions";

interface AIResponse {
  cards?: SuggestionCard[];
  activities?: SuggestionCard[];
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const { location, startTime, endTime, notes, vibesContext } =
      await request.json();

    if (!location) {
      return NextResponse.json(
        { error: "Location is required" },
        { status: 400 }
      );
    }

    // Build vibes prompt
    let vibesPrompt = "";
    if (vibesContext) {
      try {
        const vibes: UserVibes = vibesContext;
        vibesPrompt = "\n\n" + vibesToPrompt(vibes);
      } catch (error) {
        console.warn("Failed to parse vibes context:", error);
      }
    }

    const systemPrompt = `You are an expert travel planner. Generate a complete, realistic day itinerary in JSON format for ${location}.
${
  vibesPrompt
    ? "CRITICAL: Tailor the entire itinerary to match the user's travel preferences. Respect their pace, budget, theme interests, crowd tolerance, walking limits, and all other preferences."
    : ""
}

Requirements:
- Include realistic start times and durations
- Add 15-30 min travel time between locations
- Consider meal times (breakfast ~8am, lunch ~1pm, dinner ~7pm)
- Mix of activities (sightseeing, food, rest)
- Total day should fit within time constraints
- Include estimated costs
${
  vibesPrompt
    ? "\n- Match activities to user's theme preferences and interests\n- Stay within user's budget constraints\n- Respect user's pace and walking limits\n- Consider user's crowd tolerance and timing preferences"
    : ""
}`;

    const userPrompt = `Location: ${location}
${startTime ? `Start time: ${startTime}` : "Start time: 9:00"}
${endTime ? `End time: ${endTime}` : "End time: 22:00"}
${notes ? `Additional notes: ${notes}` : ""}${vibesPrompt}

Create a complete day itinerary for ${location}${
      vibesPrompt
        ? " that perfectly matches the user's travel style and preferences"
        : ""
    }.`;

    const completion = await createZodCompletion(
      defaultModel,
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      location,
      SuggestionCardSchema,
      "aiDayPlan",
      { temperature: 0.7 }
    );

    let cards: SuggestionCard[] = [];

    try {
      const parsed = completion.parsed as AIResponse;
      // console.log("Parsed OpenAI response:", JSON.stringify(parsed, null, 2));
      cards = Array.isArray(parsed.cards)
        ? parsed.cards
        : Array.isArray(parsed.activities)
        ? parsed.activities
        : [];

      if (!cards || cards.length === 0) {
        console.error("No cards found in response:", parsed);
        throw new Error("AI returned no activities. Please try again.");
      }
    } catch (parseError) {
      console.error("Failed to parse OpenAI response:", completion.parsed);
      console.error("Parse error:", parseError);
      throw new Error("Invalid response format from OpenAI");
    }

    // Normalize the cards
    const normalizedCards = cards.slice(0, 8).map((card: SuggestionCard) => ({
      type: card.type || "activity",
      title: card.title || "Untitled",
      description: card.description || "",
      startTime: card.startTime || "",
      duration: card.duration || 120,
      tags: Array.isArray(card.tags) ? card.tags : [],
      location: card.location,
      cost: card.cost || undefined,
    }));

    return NextResponse.json({
      cards: normalizedCards,
      model: completion.model,
      usage: completion.usage,
    });
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };
    console.error("AI Day Plan error:", error);

    if (err?.status === 401) {
      return NextResponse.json(
        { error: "Invalid OpenAI API key" },
        { status: 401 }
      );
    }

    if (err?.status === 429) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: err?.message || "Failed to generate day plan" },
      { status: 500 }
    );
  }
}
