import { AIPort } from "../../ports/ai.port";

export class AtlasCloudAdapter implements AIPort {
  private readonly apiKey: string;

  constructor() {
    this.apiKey = process.env.AI_API_KEY!;
    // Allow instantiation without API key for build time
    // Validation will happen at runtime when methods are called
  }

  async textToText(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error("AI_API_KEY environment variable is required");
    }

    const url = "https://api.atlascloud.ai/v1/chat/completions";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-ai/deepseek-v3.2",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 65536,
        temperature: 1,
        repetition_penalty: 1.1,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `AtlasCloud API error: ${response.status} ${response.statusText}`
      );
    }

    const json = await response.json();
    const output = json.choices[0].message.content;

    return output;
  }
}
