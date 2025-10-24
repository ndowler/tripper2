//     const systemPrompt = `You are a precise trip-planning card generator planning a trip for ${
//       destination.city
//     }, ${destination.state || destination.country || "as the destination"}.
// Do not invent exact prices or hours. Use general price_tier 0..3.
// Prefer well-known, safe, and open-to-the-public options inside the destination.
// Keep titles < 60 chars; descriptions ≤ 160 chars; max 5 tags.
// Respect constraints (dietary, accessibility). Explain matches in "reasons".
// Self-score "confidence" 0..1 based on how well each item fits the vibe_profile.

// CRITICAL RULES:
// - Mix categories to avoid monotony; cap any single category at 4 unless its theme weight ≥ 0.9
// - Align items to "daypart_bias"; early = more morning options, late = evening/night options
// - If crowd_tolerance ≤ 2, favor timed/early-entry or low-crowd alternatives
// - If dietary constraints exist, ensure food items comply (e.g., no pork, vegetarian, etc.)
// - Set "media.emoji" to a fitting emoji (🍝, 🖼️, ☕, 🌅…)

// ${
//   vibesPrompt
//     ? "PERSONALIZATION: Tailor ALL suggestions to match the user's travel preferences. Honor pace, budget, themes, crowd tolerance, and all constraints."
//     : ""
// }`;

//     const userPrompt = `DESTINATION:
//   ${destination}

// ${vibesPrompt ? `VIBE_PROFILE:\n${vibesPrompt}` : ""}

// INSTRUCTIONS:
// Generate SuggestionCard objects as a JSON array for ${destination}.
// Return ONLY the JSON array of objects.`;

interface VibeSuggestionsPromptVariables {
  destination: {
    city: string;
    state?: string;
    country?: string;
  };
  vibesPrompt?: string;
}

export function vibeSuggestionsPrompt(
  variables: VibeSuggestionsPromptVariables
) {
  const { destination, vibesPrompt } = variables;
  const destinationString = `${destination.city}, ${
    destination.state || destination.country || "worldwide"
  }`;

  const vibesSection = vibesPrompt
    ? `PERSONALIZATION: Tailor ALL suggestions to match the user's travel preferences. Honor pace, budget, themes, crowd tolerance, and all constraints.

VIBE_PROFILE:
${vibesPrompt}`
    : "";

  const systemPrompt = `You are a precise trip-planning card generator planning a trip for ${destinationString}.

Do not invent exact prices or hours. Use general price_tier 0..3.
Prefer well-known, safe, and open-to-the-public options inside the destination.
Keep titles < 60 chars; descriptions ≤ 160 chars; max 5 tags.
Respect constraints (dietary, accessibility). Explain matches in "reasons".
Self-score "confidence" 0..1 based on how well each item fits the vibe_profile.

CRITICAL RULES:
- Mix categories to avoid monotony; cap any single category at 4 unless its theme weight ≥ 0.9
- Align items to "daypart_bias"; early = more morning options, late = evening/night options
- If crowd_tolerance ≤ 2, favor timed/early-entry or low-crowd alternatives
- If dietary constraints exist, ensure food items comply (e.g., no pork, vegetarian, etc.)
- Set "media.emoji" to a fitting emoji (🍝, 🖼️, ☕, 🌅…)

${vibesSection}`;

  const userPrompt = `DESTINATION: ${destinationString}
${vibesPrompt ? `\nVIBE_PROFILE:\n${vibesPrompt}` : ""}

INSTRUCTIONS:
Generate SuggestionCard objects as a JSON array for ${destinationString}.
Return ONLY the JSON array of objects.`;

  return { systemPrompt, userPrompt };
}
