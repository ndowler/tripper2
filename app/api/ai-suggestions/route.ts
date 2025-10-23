import { NextRequest, NextResponse } from "next/server";
import { vibesToPrompt } from "@/lib/utils/vibes";
import type { UserVibes } from "@/lib/types/vibes";
import { createZodCompletion, defaultModel } from "@/lib/openai-client";
import { AISuggestionsResponseSchema } from "@/lib/schemas/suggestions";

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
        existingCards.forEach((card: any) => {
          contextString += `\n- ${card.title}${
            card.startTime ? ` at ${card.startTime}` : ""
          }${card.duration ? ` (${card.duration}min)` : ""}`;
          if (card.location?.name) contextString += ` @ ${card.location.name}`;
        });
      }

      if (otherDays && otherDays.length > 0) {
        contextString += `\n\nOther days in the itinerary:`;
        otherDays.forEach((day: any) => {
          contextString += `\n- ${day.title || "Day"} (${
            day.cardCount
          } activities)`;
          if (day.highlights) {
            contextString += `: ${day.highlights.join(", ")}`;
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
Each suggestion should be realistic and specific to the destination.
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

Return ONLY a JSON array with this exact structure:
[
  {
    "type": "activity" | "restaurant" | "hotel" | "transit" | "entertainment" | "shopping",
    "title": "Specific name or activity",
    "description": "Brief 1-2 sentence description with why it fits the itinerary",
    "duration": number (in minutes),
    "tags": ["tag1", "tag2"],
    "location": "Specific location or address if applicable"
  }
]

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
      AISuggestionsResponseSchema,
      "aiSuggestions",
      { temperature: 0.7 }
    );
    const suggestions = Array.isArray(
      (completion.parsed as { suggestions?: any[] })?.suggestions
    )
      ? (completion.parsed as { suggestions: any[] }).suggestions
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
      .map((suggestion: any) => ({
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
  } catch (error: any) {
    console.error("OpenAI API error:", error);

    // Handle specific OpenAI errors
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
