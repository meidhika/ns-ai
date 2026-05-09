export interface AIModel {
  id: string;
  name: string;
}

export interface AIProvider {
  provider: string;
  models: AIModel[];
}

export const AI_PROVIDERS: readonly AIProvider[] = [
  {
    provider: "Auto",
    models: [{ id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" }],
  },
  {
    provider: "Gemini",
    models: [
      { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
      { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro" },
      { id: "gemini-3-flash-preview", name: "Gemini 3 Flash Preview" },
    ],
  },
  {
    provider: "OpenAI",
    models: [
      { id: "gpt-4o", name: "GPT-4o" },
      { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
      { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
    ],
  },
  {
    provider: "Claude",
    models: [
      { id: "claude-3-opus", name: "Claude 3 Opus" },
      { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet" },
      { id: "claude-3-haiku", name: "Claude 3 Haiku" },
    ],
  },
];
