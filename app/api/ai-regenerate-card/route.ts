import { NextRequest, NextResponse } from "next/server";
import { createZodCompletion, defaultModel } from "@/lib/openai-client";
import { AISuggestionsSchema } from "@/lib/schemas/suggestions";
import { SuggestionCard } from "@/lib/types/suggestions";

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const { cardType, timeSlot, destination, context } = await request.json();

    if (!cardType) {
      return NextResponse.json(
        { error: "Card type is required" },
        { status: 400 }
      );
    }

    // Build context string
    let contextString = "";
    if (context) {
      const { existingCards, dayTitle } = context;

      if (dayTitle) {
        contextString += `\nDay theme: ${dayTitle}`;
      }

      if (existingCards && existingCards.length > 0) {
        contextString += `\n\nOther activities in this day:`;
        existingCards.forEach((card: SuggestionCard) => {
          contextString += `\n- ${card.title} (${card.type})${
            card.startTime ? ` at ${card.startTime}` : ""
          }`;
        });
      }
    }

    const systemPrompt = `You are a travel planning assistant. Generate ONE alternative suggestion for a ${cardType} in JSON format.

Return ONLY a JSON object with this exact structure:
{
  "type": "${cardType}",
  "title": "Specific name or activity",
  "description": "Brief 1-2 sentence description",
  "duration": number (in minutes),
  "tags": ["tag1", "tag2"],
  "location": "Specific location",
  "startTime": "${timeSlot}" (keep the same time slot)
}

Make the suggestion:
- Different from existing activities
- Specific to the destination
- Realistic and well-timed
- Include actual place names`;

    const userPrompt = `Destination: ${destination || "the destination"}
Time slot: ${timeSlot || "flexible"}${contextString}

Generate ONE alternative ${cardType} suggestion for ${
      destination || "this destination"
    }.`;

    const completion = await createZodCompletion(
      defaultModel,
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      destination,
      AISuggestionsSchema,
      "aiSuggestions",
      { temperature: 0.8 }
    );

    const content = completion.parsed;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const normalizedCard = content as {
      type: string;
      title: string;
      description: string;
      duration: number;
      tags: string[];
      location: string;
      startTime: string;
    };

    return NextResponse.json({
      card: {
        type: normalizedCard.type || cardType,
        title: normalizedCard.title || "Untitled",
        description: normalizedCard.description || "",
        duration: normalizedCard.duration || 120,
        tags: Array.isArray(normalizedCard.tags) ? normalizedCard.tags : [],
        location: normalizedCard.location,
        startTime: normalizedCard.startTime || timeSlot,
      },
    });
  } catch (error: unknown) {
    console.error("OpenAI API error:", error);

    // Type guard for error object
    const err = error as { status?: number; message?: string };

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
      { error: err?.message || "Failed to regenerate card" },
      { status: 500 }
    );
  }
}
