// Application constants

export const APP_NAME = "Prompt Vault";
export const APP_DESCRIPTION =
  "A prompt management and version control platform for AI teams";
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Prompt categories
export const PROMPT_CATEGORIES = [
  { value: "WRITING", label: "Writing" },
  { value: "DEVELOPMENT", label: "Development" },
  { value: "ANALYSIS", label: "Analysis" },
  { value: "CREATIVE", label: "Creative" },
  { value: "PRODUCTIVITY", label: "Productivity" },
  { value: "BUSINESS", label: "Business" },
  { value: "CUSTOMER_SERVICE", label: "Customer Service" },
  { value: "EDUCATION", label: "Education" },
  { value: "OTHER", label: "Other" },
] as const;

// LLM Providers
export const LLM_PROVIDERS = [
  { value: "OPENAI", label: "OpenAI" },
  { value: "ANTHROPIC", label: "Anthropic" },
  { value: "COHERE", label: "Cohere" },
  { value: "GOOGLE", label: "Google" },
  { value: "AZURE", label: "Azure" },
  { value: "CUSTOM", label: "Custom" },
] as const;

// Model configurations (updated Feb 2026)
export const MODELS = {
  OPENAI: [
    { id: "gpt-4o", name: "GPT-4o", contextWindow: 128000 },
    { id: "gpt-4o-mini", name: "GPT-4o Mini", contextWindow: 128000 },
    { id: "o1", name: "o1", contextWindow: 200000 },
    { id: "o1-mini", name: "o1 Mini", contextWindow: 128000 },
  ],
  ANTHROPIC: [
    {
      id: "claude-opus-4-6",
      name: "Claude Opus 4.6",
      contextWindow: 200000,
    },
    {
      id: "claude-sonnet-4-5-20250514",
      name: "Claude Sonnet 4.5",
      contextWindow: 200000,
    },
    {
      id: "claude-3-5-haiku-20241022",
      name: "Claude 3.5 Haiku",
      contextWindow: 200000,
    },
  ],
  COHERE: [
    { id: "command-r-plus", name: "Command R+", contextWindow: 128000 },
    { id: "command-r", name: "Command R", contextWindow: 128000 },
  ],
  GOOGLE: [
    { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", contextWindow: 1000000 },
    { id: "gemini-2.0-pro", name: "Gemini 2.0 Pro", contextWindow: 1000000 },
  ],
} as const;

// Workspace plans
export const WORKSPACE_PLANS = [
  {
    value: "FREE",
    label: "Free",
    promptLimit: 100,
    executionLimit: 1000,
    memberLimit: 1,
  },
  {
    value: "PRO",
    label: "Pro",
    promptLimit: -1,
    executionLimit: 50000,
    memberLimit: 1,
    price: 29,
  },
  {
    value: "TEAM",
    label: "Team",
    promptLimit: -1,
    executionLimit: 200000,
    memberLimit: 25,
    price: 79,
  },
  {
    value: "ENTERPRISE",
    label: "Enterprise",
    promptLimit: -1,
    executionLimit: -1,
    memberLimit: -1,
    price: null,
  },
] as const;
