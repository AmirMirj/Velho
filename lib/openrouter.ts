import OpenAI from "openai";

/** Groq OpenAI-compatible client (kept as chatJson for generate-pack). */
export function getLlmClient(): OpenAI {
  const apiKey = process.env.GROQ_API_KEY || process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not set");
  }
  const usingGroq = Boolean(process.env.GROQ_API_KEY);
  return new OpenAI({
    apiKey,
    baseURL: usingGroq
      ? "https://api.groq.com/openai/v1"
      : "https://openrouter.ai/api/v1",
    ...(usingGroq
      ? {}
      : {
          defaultHeaders: {
            "HTTP-Referer": "https://prompthack.aaltoes.com",
            "X-Title": "Velho Proof Before Pitch",
          },
        }),
  });
}

export function getLlmModel(): string {
  if (process.env.GROQ_API_KEY) {
    return process.env.GROQ_MODEL || "openai/gpt-oss-120b";
  }
  return process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";
}

export async function chatJson(system: string, user: string): Promise<string> {
  const client = getLlmClient();
  const model = getLlmModel();
  const completion = await client.chat.completions.create({
    model,
    temperature: 0.4,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });
  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("Empty LLM response");
  }
  return content;
}
