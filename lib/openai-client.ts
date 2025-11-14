import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";

// Validate API key exists
if (!process.env.OPENAI_API_KEY) {
  console.error("⚠️ OPENAI_API_KEY is not set in environment variables");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export const defaultModel = "gpt-4o-mini";

export async function createCompletion(
  model: string,
  messages: any[],
  options: any = {}
) {
  const completion = await openai.chat.completions.create({
    model,
    messages,
    ...options,
    response_format: { type: "json_object" },
  });
  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from OpenAI");
  }
  return content;
}

export async function createZodCompletion(
  model: string,
  messages: any[],
  schema: any,
  schemaType: string, // e.g. "vibeSuggestions"
  options: any = {}
) {
  // Validate API key before making request
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env.local file.");
  }

  try {
    // Use stable API without .beta namespace (beta was removed in newer SDK versions)
    const completion = await openai.chat.completions.parse({
      model,
      messages,
      response_format: zodResponseFormat(schema, schemaType),
      ...options,
    });
    
    const parsed = completion.choices[0]?.message?.parsed;
    
    if (!parsed) {
      console.error("Structured output parsing failed. Refusal:", completion.choices[0]?.message?.refusal);
      throw new Error("Structured output parsing failed.");
    }
    
    return {
      parsed,
      model: completion.model,
      usage: completion.usage,
      response: completion,
    };
  } catch (error: any) {
    // Provide more helpful error messages
    if (error.message?.includes("API key")) {
      throw new Error("Invalid OpenAI API key. Please check your .env.local file.");
    }
    throw error;
  }
}
