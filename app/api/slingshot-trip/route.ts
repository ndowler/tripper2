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
  primaryAreas: string[]; // Geographic areas/neighborhoods covered per day
  totalActivityMinutes: number;
}

// Helper function to format minutes since midnight to HH:MM
function formatTime(minutes: number): string {
  const hours = Math.floor(Math.max(0, Math.min(minutes, 1439)) / 60);
  const mins = Math.floor(Math.max(0, Math.min(minutes, 1439)) % 60);
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

// Helper function to extract primary area from location string
function extractPrimaryArea(location: string | undefined): string | null {
  if (!location) return null;
  // Extract the first meaningful part (usually neighborhood/district)
  const cleaned = location.split(',')[0].trim();
  return cleaned.length > 0 ? cleaned : null;
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
      primaryAreas: [],
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

      // Calculate daypart time shift based on vibes
      const daypartBias = vibes.daypartBias || 3; // 1=early bird, 5=night owl
      const timeShift = (daypartBias - 3) * 60; // -120 to +120 minutes
      
      // Adjust base times based on daypart preference
      const breakfastTime = formatTime(7 * 60 + timeShift); // Base 07:00
      const lunchTime = formatTime(12 * 60 + timeShift); // Base 12:00
      const dinnerTime = formatTime(19 * 60 + timeShift); // Base 19:00
      const morningStartTime = formatTime(9 * 60 + timeShift); // Base 09:00

      // Build system prompt
      const systemPrompt = `You are an expert travel planner creating a detailed itinerary.
Generate ${isFirstDay || isLastDay ? "5-8" : "6-9"} activities for a single day in ${destination}.

CRITICAL RULES:
- Return ONLY valid JSON with a "cards" array
- Each card must have: type, title, startTime (HH:MM 24h format), duration (minutes)

TIMING RULES (VERY IMPORTANT):
- ALL startTime values MUST be in HH:MM format (24-hour), e.g., "09:00", "14:30", "21:00"
- Times must flow CHRONOLOGICALLY through the day (no overlaps)
- Breakfast/morning meals: ${breakfastTime}-10:00 (duration: 45-60 min)
- Lunch: ${lunchTime}-14:00 (duration: 60-90 min)
- Dinner: ${dinnerTime}-21:00 (duration: 90-120 min)
- Morning activities: ${morningStartTime}-12:00 (duration: 90-180 min)
- Afternoon activities: 14:00-17:00 (duration: 90-180 min)
- Evening entertainment: 19:00-23:00 (duration: 90-180 min)
- ${isFirstDay ? "Hotel check-in: 14:00-16:00 (type: hotel, duration: 30)" : ""}
- ${isLastDay ? "Hotel check-out: 10:00-12:00 (type: hotel, duration: 30)" : ""}
- Transit between locations: 15-30 minutes
- Add buffer time between activities (15-30 min)

EXAMPLE TIMING FOR A DAY:
${breakfastTime}: Breakfast at local café (meal, 60 min)
${morningStartTime}: Museum visit (activity, 120 min)
${lunchTime}: Lunch (restaurant, 90 min)
14:30: Afternoon tour (activity, 150 min)
17:30: Transit to dinner area (transit, 20 min)
${dinnerTime}: Dinner (restaurant, 90 min)
21:00: Evening show (entertainment, 120 min)

GEOGRAPHIC CLUSTERING RULES (CRITICAL):
- Each day MUST focus on ONE primary neighborhood/district/area
- ALL activities on this day must be in the SAME geographic area
- DO NOT return to areas from previous days: ${dayContext.primaryAreas.length > 0 ? dayContext.primaryAreas.join(", ") : "none yet"}
- Include the primary area name in location field for each activity
- Add transit cards ONLY when moving between sub-areas within the same neighborhood
- Example for Michigan: Day 1 = Detroit downtown (all activities), Day 2 = Ann Arbor (all activities), NO returning to Detroit
- Example for Paris: Day 1 = Eiffel Tower/Trocadéro area, Day 2 = Marais district, Day 3 = Montmartre, NO returning to Eiffel Tower area

OTHER RULES:
- DO NOT repeat restaurants from previous days: ${dayContext.restaurants.join(", ") || "none yet"}
- Balance activity intensity: ${dayContext.totalActivityMinutes > 300 ? "Today should be lighter (2-3 main activities)" : "Can be more active (3-4 main activities)"}
- Budget per person per day: ${budgetRange}
- Trip purpose: ${purposeContext}
${mustDos ? `- MUST INCLUDE if possible: ${mustDos}` : ""}
${existingPlans ? `- WORK AROUND existing plans: ${existingPlans}` : ""}

Card types: activity, restaurant, meal, hotel, transit, entertainment, shopping
Costs should stay within budget
Include brief descriptions (optional but helpful)
Tags should be relevant (max 5)
Location field should include the neighborhood/area name`;

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

      // Update context and extract primary area for this day
      let dayPrimaryArea: string | null = null;
      dayCards.forEach((card) => {
        if (card.type === "restaurant" || card.type === "meal") {
          dayContext.restaurants.push(card.title);
        }
        if (card.type === "activity") {
          dayContext.activities.push(card.title);
        }
        if (card.location) {
          dayContext.locations.push(card.location);
          // Extract primary area from first non-hotel activity
          if (!dayPrimaryArea && card.type !== "hotel" && card.type !== "transit") {
            dayPrimaryArea = extractPrimaryArea(card.location);
          }
        }
        dayContext.totalActivityMinutes += card.duration || 120;
      });
      
      // Track the primary area for this day
      if (dayPrimaryArea) {
        dayContext.primaryAreas.push(dayPrimaryArea);
      }

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
    return "This is the first day. No previous context. Choose a primary neighborhood/district for today's activities.";
  }

  let prompt = `Previous days context:\n`;

  // Show geographic areas covered (MOST IMPORTANT)
  if (context.primaryAreas.length > 0) {
    prompt += `- Geographic areas ALREADY COVERED (DO NOT REUSE): ${context.primaryAreas.join(", ")}\n`;
    prompt += `- You MUST choose a NEW area/neighborhood for Day ${currentDay} that is different from the above\n`;
  }

  if (context.restaurants.length > 0) {
    prompt += `- Restaurants used (DO NOT REPEAT): ${context.restaurants.slice(-5).join(", ")}\n`;
  }

  if (context.activities.length > 0) {
    prompt += `- Recent activities: ${context.activities.slice(-5).join(", ")}\n`;
  }

  const avgActivityMinutes = Math.round(context.totalActivityMinutes / (currentDay - 1));
  prompt += `- Average activity time per day: ${avgActivityMinutes} min\n`;
  
  if (avgActivityMinutes > 350) {
    prompt += `- Previous days were very active. Consider a lighter day today.\n`;
  } else if (avgActivityMinutes < 250) {
    prompt += `- Previous days were light. You can add more activities today.\n`;
  }

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

