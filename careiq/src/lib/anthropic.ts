export interface ApiLogEntry {
  timestamp: string;
  callType: "analysis" | "care_plan" | "handoff";
  request: {
    model: string;
    system: string;
    user: string;
  };
  response?: {
    raw: string;
    parsed: unknown;
    usage: { input_tokens: number; output_tokens: number };
  };
  error?: string;
  latency_ms?: number;
}

export async function callClaude(
  systemPrompt: string,
  userMessage: string
): Promise<{ parsed: unknown; raw: string; usage: { input_tokens: number; output_tokens: number } }> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const rawText: string = data.content?.[0]?.text || "";

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    // One retry with explicit JSON instruction
    const retryResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        system: systemPrompt,
        messages: [
          { role: "user", content: userMessage },
          { role: "assistant", content: rawText },
          {
            role: "user",
            content:
              "Please respond with valid JSON only. Your previous response was not valid JSON.",
          },
        ],
      }),
    });

    if (!retryResponse.ok) {
      throw new Error(`Anthropic API retry error ${retryResponse.status}`);
    }

    const retryData = await retryResponse.json();
    const retryRawText: string = retryData.content?.[0]?.text || "";
    parsed = JSON.parse(retryRawText);

    return {
      parsed,
      raw: retryRawText,
      usage: retryData.usage || { input_tokens: 0, output_tokens: 0 },
    };
  }

  return {
    parsed,
    raw: rawText,
    usage: data.usage || { input_tokens: 0, output_tokens: 0 },
  };
}
