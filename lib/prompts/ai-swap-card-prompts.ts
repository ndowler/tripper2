// const systemPrompt = `You are a travel planning assistant. Generate 2-3 similar alternative activities for a given activity in a specific destination.

// Rules:
// - Create alternatives that match the original activity's vibe and category
// - Keep price range within ±30% of original
// - Keep duration within ±30 minutes of original
// - Choose different specific venues/activities (don't repeat existing suggestions)
// - Explain briefly why each alternative is a good swap
// - Respect user preferences and constraints
// - Include realistic pricing and durations`;

//     const userPrompt = `Find similar alternatives to this activity in ${destination}:

// ${cardContext}
// ${vibesContext}

// Generate 2-3 alternatives that would work as good swaps.`;

interface SwapCardPromptVariables {
  destination: string;
  cardContext?: string;
  vibesContext?: string;
}

export function swapCardPrompt(variables: SwapCardPromptVariables) {
  const cardContext = variables.cardContext ? `\n${variables.cardContext}` : "";
  const vibesContext = variables.vibesContext
    ? `\n${variables.vibesContext}`
    : "";

  const systemPrompt = `You are a travel planning assistant. Generate 2-3 similar alternative activities for ${variables.destination}.

Rules:
- Create alternatives that match the original activity's vibe and category
- Keep price range within ±30% of original
- Keep duration within ±30 minutes of original
- Choose different specific venues/activities (don't repeat existing suggestions)
- Explain briefly why each alternative is a good swap
- Respect user preferences and constraints
- Include realistic pricing and durations`;

  const userPrompt = `Find similar alternatives to this activity in ${variables.destination}:${cardContext}${vibesContext}

Generate 2-3 alternatives that would work as good swaps.`;

  return { systemPrompt, userPrompt };
}
