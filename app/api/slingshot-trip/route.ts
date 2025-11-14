import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { addDays, format } from "date-fns";
import { vibesToPrompt } from "@/lib/utils/vibes";
import { parseTime } from "@/lib/utils/time";
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
      // Convert daypart_bias string to numeric value: early=1, balanced=3, late=5
      const daypartBiasStr = vibes.comfort?.daypart_bias || "balanced";
      const daypartBias = daypartBiasStr === "early" ? 1 : daypartBiasStr === "late" ? 5 : 3;
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

⏰ TIMING RULES (ABSOLUTELY CRITICAL - VIOLATIONS WILL FAIL THE TASK):
- ALL startTime values MUST be in HH:MM format (24-hour), e.g., "09:00", "14:30", "21:00"
- Times MUST flow CHRONOLOGICALLY - NO TWO CARDS CAN HAVE THE SAME START TIME
- Each card starts AFTER the previous card ends (startTime + duration + buffer)
- Calculate next start time: previous startTime + previous duration + 15-30 min buffer

TIMING SEQUENCE (follow this pattern exactly):
1. ${breakfastTime}: Breakfast (meal, 60 min) → ends ${formatTime(parseTime(breakfastTime) + 60)}
2. ${formatTime(parseTime(breakfastTime) + 90)}: Morning activity (activity, 120 min) → ends ${formatTime(parseTime(breakfastTime) + 210)}
3. ${lunchTime}: Lunch (restaurant, 90 min) → ends ${formatTime(parseTime(lunchTime) + 90)}
4. ${formatTime(parseTime(lunchTime) + 120)}: Afternoon activity (activity, 150 min) → ends ${formatTime(parseTime(lunchTime) + 270)}
5. ${formatTime(parseTime(dinnerTime) - 30)}: Transit (transit, 20 min) → ends ${dinnerTime}
6. ${dinnerTime}: Dinner (restaurant, 90 min) → ends ${formatTime(parseTime(dinnerTime) + 90)}
7. ${formatTime(parseTime(dinnerTime) + 120)}: Evening activity (entertainment, 120 min)

SPECIAL CARDS:
- ${isFirstDay ? `Hotel check-in MUST be around 15:00 (type: hotel, duration: 30)` : ""}
- ${isLastDay ? `Hotel check-out MUST be around 10:00-11:00 (type: hotel, duration: 30)` : ""}

🍽️ RESTAURANT DUPLICATION RULES (BREAKING THESE = COMPLETE FAILURE):
${dayContext.restaurants.length > 0 ? `
- FORBIDDEN RESTAURANTS (NEVER USE): ${dayContext.restaurants.join(", ")}
- You have used ${dayContext.restaurants.length} restaurants so far
- Today's restaurants MUST have completely different names
- If you use a chain (e.g., Starbucks), vary location: "Starbucks Downtown" vs "Starbucks Airport"
- Double-check EVERY restaurant name against the forbidden list above
` : "- This is the first day, no restrictions yet"}

🗺️ GEOGRAPHIC CLUSTERING RULES (CRITICAL):
- Choose ONE neighborhood/district for this entire day
- State it clearly: "Today's area: [NEIGHBORHOOD NAME]"
${dayContext.primaryAreas.length > 0 ? `
- FORBIDDEN AREAS (already visited): ${dayContext.primaryAreas.join(", ")}
- You MUST choose a DIFFERENT area not in the list above
` : ""}
- ALL activities, meals, and entertainment MUST be within 2km of each other
- Include the neighborhood name in every location field
- Add transit cards only for moves within the same neighborhood

OTHER RULES:
- Balance activity intensity: ${dayContext.totalActivityMinutes > 300 ? "Today should be lighter (2-3 main activities)" : "Can be more active (3-4 main activities)"}
- Budget per person per day: ${budgetRange}
- Trip purpose: ${purposeContext}
${mustDos ? `- MUST INCLUDE if possible: ${mustDos}` : ""}
${existingPlans ? `- WORK AROUND existing plans: ${existingPlans}` : ""}

Card types: activity, restaurant, meal, hotel, transit, entertainment, shopping
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

        // ✅ POST-GENERATION VALIDATION
        
        // 1. Check for duplicate start times
        const startTimes = dayCards
          .filter(c => c.startTime)
          .map(c => c.startTime);
        const uniqueStartTimes = new Set(startTimes);
        if (uniqueStartTimes.size !== startTimes.length) {
          console.warn(`⚠️  Day ${dayNum}: Found ${startTimes.length - uniqueStartTimes.size} cards with duplicate start times`);
          // Sort by startTime to ensure chronological order
          dayCards.sort((a, b) => {
            if (!a.startTime || !b.startTime) return 0;
            return parseTime(a.startTime) - parseTime(b.startTime);
          });
        }

        // 2. Check for duplicate restaurants
        const dayRestaurants = dayCards
          .filter(c => c.type === 'restaurant' || c.type === 'meal')
          .map(c => c.title.toLowerCase().trim());
        
        // Check against previous days
        const conflicts = dayRestaurants.filter(r => 
          dayContext.restaurants.some(prev => prev.toLowerCase().trim() === r)
        );
        
        if (conflicts.length > 0) {
          console.warn(`⚠️  Day ${dayNum}: Found ${conflicts.length} duplicate restaurants:`, conflicts);
          // Remove conflicting restaurant cards
          dayCards = dayCards.filter(c => {
            if (c.type === 'restaurant' || c.type === 'meal') {
              const isDuplicate = conflicts.includes(c.title.toLowerCase().trim());
              if (isDuplicate) {
                console.log(`   Removing duplicate: ${c.title}`);
              }
              return !isDuplicate;
            }
            return true;
          });
        }

        // 3. Verify chronological order
        let lastTime = 0;
        let hasTimingIssues = false;
        dayCards.forEach((card, idx) => {
          if (card.startTime) {
            const currentTime = parseTime(card.startTime);
            if (currentTime < lastTime) {
              hasTimingIssues = true;
              console.warn(`⚠️  Day ${dayNum}: Card ${idx + 1} (${card.title}) starts at ${card.startTime} but previous card was at ${formatTime(lastTime)}`);
            }
            lastTime = currentTime + (card.duration || 60);
          }
        });

        if (hasTimingIssues) {
          console.log(`   Sorting cards chronologically for Day ${dayNum}`);
          dayCards.sort((a, b) => {
            if (!a.startTime || !b.startTime) return 0;
            return parseTime(a.startTime) - parseTime(b.startTime);
          });
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

  // Track ALL restaurants (not just last 5) - CRITICAL to prevent duplicates
  if (context.restaurants.length > 0) {
    prompt += `- ALL restaurants used so far (NEVER REPEAT ANY): ${context.restaurants.join(", ")}\n`;
  }

  // Track recent activities for variety
  if (context.activities.length > 0) {
    const recentActivities = context.activities.slice(-8); // Show last 8 for context
    prompt += `- Recent activities (aim for variety): ${recentActivities.join(", ")}\n`;
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

