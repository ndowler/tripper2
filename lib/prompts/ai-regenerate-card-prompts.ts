// SAVE ORIGINAL CONTEXT FOR REFERENCE
//     const systemPrompt = `You are a travel planning assistant. Generate ONE alternative suggestion for a ${cardType} in JSON format.

// NOT NEEDED - USING ZOD STRUCTURED OUTPUTS
// Return ONLY a JSON object with this exact structure:
// {
//   "type": "${cardType}",
//   "title": "Specific name or activity",
//   "description": "Brief 1-2 sentence description",
//   "duration": number (in minutes),
//   "tags": ["tag1", "tag2"],
//   "location": "Specific location",
//   "startTime": "${timeSlot}" (keep the same time slot)
// }

// Make the suggestion:
// - Different from existing activities
// - Specific to the destination
// - Realistic and well-timed
// - Include actual place names`;

//     const userPrompt = `Destination: ${destination || "the destination"}
// Time slot: ${timeSlot || "flexible"}${contextString}

// Generate ONE alternative ${cardType} suggestion for ${
//       destination || "this destination"
//     }.`;

interface RegenerateCardPromptVariables {
  destination: string;
  cardType?: string;
  timeSlot?: string;
  contextString?: string;
}

/**
 * Generate a prompt for regenerating a single activity card
 * Ensures the alternative suggestion is different from existing activities
 */
export function regenerateCardPrompt(variables: RegenerateCardPromptVariables) {
  const cardType = variables.cardType || "activity";
  const timeSlot = variables.timeSlot
    ? `\nTime slot: ${variables.timeSlot}`
    : "";
  const context = variables.contextString ? `\n${variables.contextString}` : "";

  const systemPrompt = `You are a travel planning assistant. Generate ONE alternative ${cardType} suggestion in JSON format for ${variables.destination}.

The suggestion should be:
- Different from the existing activity (don't repeat suggestions already provided)
- Specific to ${variables.destination}
- Realistic and feasible to visit
- Include the actual place name when possible`;

  const userPrompt = `Destination: ${variables.destination}
Card type: ${cardType}${timeSlot}${context}

Generate ONE alternative ${cardType} suggestion for ${variables.destination}.`;

  return { systemPrompt, userPrompt };
}
