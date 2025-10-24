import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import type { ZodSchema } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export const defaultModel = "gpt-4o-mini";

export async function createCompletion(
  model: string,
  messages: ChatCompletionMessageParam[],
  options: Record<string, unknown> = {}
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
  messages: ChatCompletionMessageParam[],
  destination: {
    city: string;
    state?: string | undefined;
    country?: string | undefined;
    start?: string | undefined;
    end?: string | undefined;
  },
  schema: ZodSchema,
  schemaType: string, // e.g. "vibeSuggestions"
  options: Record<string, unknown> = {}
) {
  const user_location = {
    type: "approximate" as const,
    city: destination.city,
    region: destination.state,
    country: destination.country,
  };

  // Convert messages to string format for Responses API
  const input = messages
    .map((msg) => {
      const content =
        typeof msg.content === "string"
          ? msg.content
          : JSON.stringify(msg.content);
      return `${msg.role}: ${content}`;
    })
    .join("\n");

  const response = await openai.responses.parse({
    model,
    input,
    tools: [
      {
        type: "web_search",
        user_location: user_location,
      },
    ],
    text: {
      format: zodTextFormat(schema, schemaType),
    },
    ...options,
  });
  const parsed = response.output_parsed;
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
