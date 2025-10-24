//     const systemPrompt = `You are an expert travel planner. Generate a complete, realistic day itinerary in JSON format for ${location}.
// ${
//   vibesPrompt
//     ? "CRITICAL: Tailor the entire itinerary to match the user's travel preferences. Respect their pace, budget, theme interests, crowd tolerance, walking limits, and all other preferences."
//     : ""
// }

// Requirements:
// - Include realistic start times and durations
// - Add 15-30 min travel time between locations
// - Consider meal times (breakfast ~8am, lunch ~1pm, dinner ~7pm)
// - Mix of activities (sightseeing, food, rest)
// - Total day should fit within time constraints
// - Include estimated costs
// ${
//   vibesPrompt
//     ? "\n- Match activities to user's theme preferences and interests\n- Stay within user's budget constraints\n- Respect user's pace and walking limits\n- Consider user's crowd tolerance and timing preferences"
//     : ""
// }`;

//     const userPrompt = `Location: ${location}
// ${startTime ? `Start time: ${startTime}` : "Start time: 9:00"}
// ${endTime ? `End time: ${endTime}` : "End time: 22:00"}
// ${notes ? `Additional notes: ${notes}` : ""}${vibesPrompt}

// Create a complete day itinerary for ${location}${
//       vibesPrompt
//         ? " that perfectly matches the user's travel style and preferences"
//         : ""
//     }.`;

interface PromptVariables {
  location: string;
  vibesPrompt?: string;
  startTime?: string;
  endTime?: string;
  notes?: string;
}

export function buildDayPlanPrompts(vars: PromptVariables) {
  const { location, vibesPrompt, startTime, endTime, notes } = vars;

  const vibesSection = vibesPrompt
    ? "\nCRITICAL: Tailor the entire itinerary to match the user's travel preferences. Respect their pace, budget, theme interests, crowd tolerance, walking limits, and all other preferences."
    : "";

  const vibesRequirements = vibesPrompt
    ? "\n- Match activities to user's theme preferences and interests\n- Stay within user's budget constraints\n- Respect user's pace and walking limits\n- Consider user's crowd tolerance and timing preferences"
    : "";

  const systemPrompt = `You are an expert travel planner. Generate a complete, realistic day itinerary in JSON format for ${location}.${vibesSection}

Requirements:
- Include realistic start times and durations
- Add 15-30 min travel time between locations
- Consider meal times (breakfast ~8am, lunch ~1pm, dinner ~7pm)
- Mix of activities (sightseeing, food, rest)
- Total day should fit within time constraints
- Include estimated costs${vibesRequirements}`;

  const notesSection = notes ? `\nAdditional notes: ${notes}` : "";
  const vibesMatch = vibesPrompt
    ? " that perfectly matches the user's travel style and preferences"
    : "";

  const userPrompt = `Location: ${location}
Start time: ${startTime || "9:00"}
End time: ${endTime || "22:00"}${notesSection}${
    vibesPrompt ? `\n\n${vibesPrompt}` : ""
  }

Create a complete day itinerary for ${location}${vibesMatch}.`;

  return { systemPrompt, userPrompt };
}
