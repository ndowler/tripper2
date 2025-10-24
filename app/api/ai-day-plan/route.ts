import { NextRequest, NextResponse } from "next/server";
import { createZodCompletion, defaultModel } from "@/lib/openai-client";
import { SuggestionCard } from "@/lib/types/suggestions";
import { vibesToPrompt } from "@/lib/utils/vibes";
import type { UserVibes } from "@/lib/types/vibes";
import { SuggestionCardSchema } from "@/lib/schemas/suggestions";

import { buildDayPlanPrompts } from "@/lib/prompts/ai-day-plan-prompts";

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
    console.log(`location ${location}`);
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

    // Build prompts from templates
    const { systemPrompt, userPrompt } = buildDayPlanPrompts({
      location,
      vibesPrompt,
      startTime,
      endTime,
      notes,
    });

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
      const parsed = completion.parsed as AIResponse | SuggestionCard;
      // console.log("Parsed OpenAI response:", JSON.stringify(parsed, null, 2));

      // Handle single card object or array responses
      if (Array.isArray(parsed)) {
        cards = parsed;
      } else if (parsed && typeof parsed === "object") {
        if ("cards" in parsed && Array.isArray(parsed.cards)) {
          cards = parsed.cards;
        } else if ("activities" in parsed && Array.isArray(parsed.activities)) {
          cards = parsed.activities;
        } else if ("title" in parsed && "description" in parsed) {
          // Single card object returned directly
          cards = [parsed as SuggestionCard];
        }
      }

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
