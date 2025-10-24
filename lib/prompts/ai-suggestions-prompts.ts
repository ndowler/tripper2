// ORIGINAL PROMPTS
//     // Create a detailed prompt for OpenAI
//     const systemPrompt = `You are a travel planning assistant. Generate exactly 3 specific, actionable travel suggestions in JSON format.
// Each suggestion should be realistic and specific to the destination, ${destination}.
// ${
//   context
//     ? "IMPORTANT: Consider the existing itinerary context to make complementary suggestions that fit well with what's already planned. Avoid duplicates and ensure good variety."
//     : ""
// }
// ${
//   vibesPrompt
//     ? "\nIMPORTANT: Tailor all suggestions to match the user's travel preferences provided below. Respect their pace, budget, themes, and constraints."
//     : ""
// }

// Make suggestions practical and specific. Include actual place names when possible.`;

//     const userPrompt = `Destination: ${destination || "the destination"}
// Category: ${category || "general"}
// Request: ${prompt}${contextString}${vibesPrompt}

// Give me 3 specific suggestions for ${prompt} in ${
//       destination || "this destination"
//     }${context ? " that complement the existing itinerary" : ""}${
//       vibesPrompt ? " that match the user's travel style and preferences" : ""
//     }.`;

interface AISuggestionsPromptVariables {
  destination: string;
  category: string;
  prompt: string;
  context?: string;
  vibesPrompt?: string;
}

export function generateAISuggestionsPrompt(
  variables: AISuggestionsPromptVariables
) {
  const { destination, category, prompt, context, vibesPrompt } = variables;

  const contextSection = context
    ? "\nIMPORTANT: Consider the existing itinerary context to make complementary suggestions that fit well with what's already planned. Avoid duplicates and ensure good variety."
    : "";

  const vibesSection = vibesPrompt
    ? "\nIMPORTANT: Tailor all suggestions to match the user's travel preferences provided below. Respect their pace, budget, themes, and constraints."
    : "";

  const systemPrompt = `You are a travel planning assistant. Generate exactly 3 specific, actionable travel suggestions in JSON format.
Each suggestion should be realistic and specific to the destination, ${destination}.${contextSection}${vibesSection}

Make suggestions practical and specific. Include actual place names when possible.`;

  const complementaryNote = context
    ? " that complement the existing itinerary"
    : "";
  const styleNote = vibesPrompt
    ? " that match the user's travel style and preferences"
    : "";

  const userPrompt = `Destination: ${destination}
Category: ${category}
Request: ${prompt}
${context ? context : ""}
${vibesPrompt ? vibesPrompt : ""}

Give me 3 specific suggestions for ${prompt} in ${destination}${complementaryNote}${styleNote}.`;

  return { systemPrompt, userPrompt };
}
