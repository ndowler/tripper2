import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { addDays, format } from "date-fns";
import { vibesToPrompt } from "@/lib/utils/vibes";
import { createZodCompletion, defaultModel } from "@/lib/openai-client";
import {
  SlingshotDayResponseSchema,
  SlingshotExplanationSchema,
} from "@/lib/schemas/suggestions";
import type {
  SlingshotRequest,
  DayGenerationContext,
} from "@/lib/types/slingshot";

interface DayContext {
  activities: string[];
  restaurants: string[];
  locations: string[];
  totalActivityMinutes: number;
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const body: SlingshotRequest = await request.json();
    const {
      destination,
      startDate,
      duration,
      budget,
      travelers,
      tripPurpose,
      mustDos,
      existingPlans,
      vibes,
    } = body;

    // Validation
    if (!destination || !startDate || !duration) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!vibes) {
      return NextResponse.json(
        { error: "User vibes are required for Slingshot" },
        { status: 400 }
      );
    }

    if (duration < 1 || duration > 30) {
      return NextResponse.json(
        { error: "Duration must be between 1 and 30 days" },
        { status: 400 }
      );
    }

    // Generate vibes prompt
    const vibesPrompt = vibesToPrompt(vibes);

    // Budget mapping
    const budgetMap = {
      budget: "$30-50",
      moderate: "$75-125",
      comfortable: "$150-250",
      luxury: "$300+",
    };
    const budgetRange = budgetMap[budget] || "$75-125";

    // Trip purpose context
    const purposeContextMap: Record<string, string> = {
      honeymoon:
        "Romantic experiences, special dining, couples activities, privacy",
      family_vacation:
        "Family-friendly activities, kid-appropriate timing, varied interests",
      solo_adventure:
        "Solo traveler-friendly, safety-conscious, opportunities to meet people",
      business_leisure:
        "Balance work and leisure, flexible timing, good connectivity",
      friend_getaway:
        "Group activities, social experiences, late-night options",
      other: "General interests",
    };
    const purposeContext =
      purposeContextMap[tripPurpose] || "General interests";

    console.log(`Generating Slingshot trip for ${destination}, ${duration} days`);

    // Initialize response structure
    const allDays: any[] = [];
    let dayContext: DayContext = {
      activities: [],
      restaurants: [],
      locations: [],
      totalActivityMinutes: 0,
    };

    // Generate each day sequentially
    for (let dayNum = 1; dayNum <= duration; dayNum++) {
      const currentDate = format(
        addDays(new Date(startDate), dayNum - 1),
        "yyyy-MM-dd"
      );
      const isFirstDay = dayNum === 1;
      const isLastDay = dayNum === duration;

      console.log(`Generating day ${dayNum}/${duration}...`);

      // Build context from previous days
      const contextPrompt = buildContextPrompt(dayContext, dayNum);

      // Build system prompt
      const systemPrompt = `You are an expert travel planner creating a detailed itinerary.
Generate ${isFirstDay || isLastDay ? "5-8" : "6-9"} activities for a single day in ${destination}.

CRITICAL RULES:
- Return ONLY valid JSON with a "cards" array
- Each card must have: type, title, startTime (HH:MM 24h format), duration (minutes)
- ${isFirstDay ? "Include hotel check-in around 14:00-15:00 (type: hotel, duration: 30)" : ""}
- ${isLastDay ? "Include hotel check-out at 11:00 (type: hotel, duration: 30)" : ""}
- DO NOT repeat restaurants from previous days: ${dayContext.restaurants.join(", ") || "none yet"}
- DO NOT duplicate locations from previous days unless different activity
- Balance activity intensity: ${dayContext.totalActivityMinutes > 300 ? "Today should be lighter" : "Can be more active"}
- Include realistic travel time between locations (15-30 min transit cards)
- Honor vibes: daypart, pace, budget, crowd tolerance
- Budget per person per day: ${budgetRange}
- Trip purpose: ${purposeContext}
${mustDos ? `- MUST INCLUDE if possible: ${mustDos}` : ""}
${existingPlans ? `- WORK AROUND existing plans: ${existingPlans}` : ""}

Card types: activity, restaurant, meal, hotel, transit, entertainment, shopping
Times must follow daypart preferences (early/balanced/late)
Costs should stay within budget
Include brief descriptions (optional but helpful)
Tags should be relevant (max 5)`;

      const userPrompt = `Create a complete itinerary for Day ${dayNum} of ${duration} in ${destination}.
Date: ${currentDate}
${dayNum === 1 ? "First day of trip" : ""}
${dayNum === duration ? "Last day of trip" : ""}
Budget: ${budgetRange} per person
Travelers: ${travelers}

${vibesPrompt}

${contextPrompt}

Generate ${isFirstDay || isLastDay ? "5-8" : "6-9"} activity cards for this day.`;

      // Call OpenAI
      let dayCards: any[] = [];
      try {
        const completion = await createZodCompletion(
          defaultModel,
          [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          SlingshotDayResponseSchema,
          "slingshotDay",
          { temperature: 0.7, max_tokens: 2000 }
        );

        const parsed = completion.parsed as { cards?: any[] };
        dayCards = parsed.cards || [];

        if (dayCards.length < 3) {
          throw new Error(`Only ${dayCards.length} cards generated for day ${dayNum}`);
        }
      } catch (error) {
        console.error(`Error generating day ${dayNum}:`, error);
        // Fallback: create basic day structure
        dayCards = createFallbackDay(dayNum, isFirstDay, isLastDay);
      }

      // Update context
      dayCards.forEach((card) => {
        if (card.type === "restaurant" || card.type === "meal") {
          dayContext.restaurants.push(card.title);
        }
        if (card.type === "activity") {
          dayContext.activities.push(card.title);
        }
        if (card.location) {
          dayContext.locations.push(card.location);
        }
        dayContext.totalActivityMinutes += card.duration || 120;
      });

      allDays.push({
        dayNumber: dayNum,
        date: currentDate,
        cards: dayCards,
      });
    }

    console.log("All days generated, creating vibe explanation...");

    // Generate vibe explanation
    let explanation = "";
    try {
      const explanationPrompt = `Write a fun, informal paragraph (3-5 sentences) explaining how this ${duration}-day ${destination} trip reflects the traveler's preferences.

Traveler preferences:
${vibesPrompt}

Trip details:
- ${duration} days in ${destination}
- Budget: ${budgetRange}/day
- ${travelers} traveler(s)
- Purpose: ${tripPurpose.replace("_", " ")}

Write in a casual, enthusiastic tone. Use "we" and "you". Mention 2-3 specific ways the itinerary matches their vibe. Be brief and exciting.
Example tone: "Yo! We packed this trip with slow morning starts and late-night jazz because you said you're a night owl..."`;

      const explCompletion = await createZodCompletion(
        defaultModel,
        [{ role: "user", content: explanationPrompt }],
        SlingshotExplanationSchema,
        "slingshotExplanation",
        { temperature: 0.8, max_tokens: 300 }
      );

      const explParsed = explCompletion.parsed as { explanation?: string };
      explanation =
        explParsed.explanation ||
        `We've crafted a ${duration}-day adventure in ${destination} that matches your travel style perfectly!`;
    } catch (error) {
      console.error("Error generating explanation:", error);
      explanation = `Your personalized ${duration}-day trip to ${destination} is ready! We've matched everything to your preferences — from activity pace to meal times to budget. Let's go!`;
    }

    console.log("Slingshot trip generation complete!");

    return NextResponse.json({
      success: true,
      days: allDays,
      explanation,
      metadata: {
        destination,
        duration,
        budget,
        travelers,
        tripPurpose,
      },
    });
  } catch (error: any) {
    console.error("Slingshot API error:", error);

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
      {
        error: error?.message || "Failed to generate trip",
        details: error?.toString(),
      },
      { status: 500 }
    );
  }
}

function buildContextPrompt(context: DayContext, currentDay: number): string {
  if (currentDay === 1) {
    return "This is the first day. No previous context.";
  }

  let prompt = `Previous days context:\n`;

  if (context.restaurants.length > 0) {
    prompt += `- Restaurants used: ${context.restaurants.slice(-5).join(", ")}\n`;
  }

  if (context.activities.length > 0) {
    prompt += `- Recent activities: ${context.activities.slice(-5).join(", ")}\n`;
  }

  if (context.locations.length > 0) {
    prompt += `- Visited areas: ${[...new Set(context.locations.slice(-8))].join(", ")}\n`;
  }

  const avgActivityMinutes = Math.round(context.totalActivityMinutes / (currentDay - 1));
  prompt += `- Average activity time: ${avgActivityMinutes} min/day\n`;

  return prompt;
}

function createFallbackDay(
  dayNum: number,
  isFirstDay: boolean,
  isLastDay: boolean
): any[] {
  const cards: any[] = [];

  if (isFirstDay) {
    cards.push({
      type: "hotel",
      title: "Hotel Check-in",
      startTime: "15:00",
      duration: 30,
      tags: ["accommodation"],
    });
  }

  cards.push({
    type: "activity",
    title: "Morning Exploration",
    startTime: isFirstDay ? "10:00" : "09:00",
    duration: 120,
    tags: ["sightseeing"],
  });

  cards.push({
    type: "meal",
    title: "Lunch",
    startTime: "13:00",
    duration: 60,
    tags: ["food"],
  });

  cards.push({
    type: "activity",
    title: "Afternoon Activity",
    startTime: "15:00",
    duration: 120,
    tags: ["sightseeing"],
  });

  cards.push({
    type: "restaurant",
    title: "Dinner",
    startTime: "19:00",
    duration: 90,
    tags: ["food"],
  });

  if (isLastDay) {
    cards.unshift({
      type: "hotel",
      title: "Hotel Check-out",
      startTime: "11:00",
      duration: 30,
      tags: ["accommodation"],
    });
  }

  return cards;
}

