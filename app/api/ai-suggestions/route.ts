import { NextRequest, NextResponse } from "next/server";
import { vibesToPrompt } from "@/lib/utils/vibes";
import type { UserVibes } from "@/lib/types/vibes";
import { createZodCompletion, defaultModel } from "@/lib/openai-client";
import { AISuggestionsResponseSchema } from "@/lib/schemas/suggestions";
import { InfoCard } from "@/lib/types";
import { AiSuggestionContext, SuggestionCard } from "@/lib/types/suggestions";

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const { prompt, destination, category, context, vibesContext } =
      await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Build context string if provided
    let contextString = "";
    if (context) {
      const { dayInfo, existingCards, otherDays } = context;

      if (dayInfo) {
        contextString += `\n\nCurrent Day: ${dayInfo.title || "Day"} - ${
          dayInfo.date
        }`;
      }

      if (existingCards && existingCards.length > 0) {
        contextString += `\n\nExisting activities on this day:`;
        existingCards.forEach((card: InfoCard) => {
          contextString += `\n- ${card.title}${
            card.startTime ? ` at ${card.startTime}` : ""
          }${card.duration ? ` (${card.duration}min)` : ""}`;
          if (card.location?.name) contextString += ` @ ${card.location.name}`;
        });
      }

      if (otherDays && otherDays.length > 0) {
        contextString += `\n\nOther days in the itinerary:`;
        otherDays.forEach((dayGroup: AiSuggestionContext) => {
          if (Array.isArray(dayGroup.otherDays)) {
            dayGroup.otherDays.forEach((otherDay) => {
              contextString += `\n- ${otherDay.title || "Day"} (${
                otherDay.cardCount
              } activities)`;
              if (otherDay.highlights && otherDay.highlights.length > 0) {
                contextString += `: ${otherDay.highlights.join(", ")}`;
              }
            });
          }
        });
      }
    }

    // Add user vibes if provided
    let vibesPrompt = "";
    if (vibesContext) {
      try {
        const vibes: UserVibes = vibesContext;
        vibesPrompt = "\n\n" + vibesToPrompt(vibes);
      } catch (error) {
        console.warn("Failed to parse vibes context:", error);
      }
    }

    // Create a detailed prompt for OpenAI
    const systemPrompt = `You are a travel planning assistant. Generate exactly 3 specific, actionable travel suggestions in JSON format.
Each suggestion should be realistic and specific to the destination, ${destination}.
${
  context
    ? "IMPORTANT: Consider the existing itinerary context to make complementary suggestions that fit well with what's already planned. Avoid duplicates and ensure good variety."
    : ""
}
${
  vibesPrompt
    ? "\nIMPORTANT: Tailor all suggestions to match the user's travel preferences provided below. Respect their pace, budget, themes, and constraints."
    : ""
}

Make suggestions practical and specific. Include actual place names when possible.`;

    const userPrompt = `Destination: ${destination || "the destination"}
Category: ${category || "general"}
Request: ${prompt}${contextString}${vibesPrompt}

Give me 3 specific suggestions for ${prompt} in ${
      destination || "this destination"
    }${context ? " that complement the existing itinerary" : ""}${
      vibesPrompt ? " that match the user's travel style and preferences" : ""
    }.`;

    const completion = await createZodCompletion(
      defaultModel,
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      destination,
      AISuggestionsResponseSchema,
      "aiSuggestions",
      { temperature: 0.7 }
    );
    const suggestions = Array.isArray(
      (completion.parsed as { suggestions?: SuggestionCard[] })?.suggestions
    )
      ? (completion.parsed as { suggestions: SuggestionCard[] }).suggestions
      : [];

    // Accept 3 valid suggestions
    if (suggestions.length < 3) {
      throw new Error(
        `Only ${suggestions.length} valid suggestions generated. Please try again.`
      );
    }

    // Validate and normalize the suggestions
    const normalizedSuggestions = suggestions
      .slice(0, 3)
      .map((suggestion: SuggestionCard) => ({
        type: suggestion.type || "activity",
        title: suggestion.title || "Untitled",
        description: suggestion.description || "",
        duration: suggestion.duration || 120,
        tags: Array.isArray(suggestion.tags) ? suggestion.tags : [],
        location: suggestion.location,
      }));

    return NextResponse.json({
      suggestions: normalizedSuggestions,
      model: completion.model,
      usage: completion.usage,
    });
  } catch (error: unknown) {
    console.error("OpenAI API error:", error);

    // Type guard for error object
    const err = error as { status?: number; message?: string };

    // Handle specific OpenAI errors
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
