import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";

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
}

export async function createZodCompletion(
  model: string,
  messages: any[],
  schema: any,
  schemaType: string, // e.g. "vibeSuggestions"
  options: any = {}
) {
  const response = await openai.responses.parse({
    model,
    input: messages,
    text: {
      format: zodTextFormat(schema, schemaType),
    },
    ...options,
  });
  const parsed = response.output_parsed;
  // console.log("Parsed response:", parsed);
  if (!parsed) {
    throw new Error("Structured output parsing failed.");
  }
  return {
    parsed,
    model: response.model,
    usage: response.usage,
    response,
  };
}
