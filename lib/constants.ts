// Application constants

export const APP_NAME = "Prompt Vault";
export const APP_DESCRIPTION =
  "A comprehensive prompt management and LLMOps platform";
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

// Model configurations
export const MODELS = {
  OPENAI: [
    { id: "gpt-4o", name: "GPT-4o", contextWindow: 128000 },
    { id: "gpt-4o-mini", name: "GPT-4o Mini", contextWindow: 128000 },
    { id: "gpt-4-turbo", name: "GPT-4 Turbo", contextWindow: 128000 },
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", contextWindow: 16385 },
  ],
  ANTHROPIC: [
    {
      id: "claude-3-5-sonnet-20241022",
      name: "Claude 3.5 Sonnet",
      contextWindow: 200000,
    },
    { id: "claude-3-opus-20240229", name: "Claude 3 Opus", contextWindow: 200000 },
    { id: "claude-3-haiku-20240307", name: "Claude 3 Haiku", contextWindow: 200000 },
  ],
  COHERE: [
    { id: "command-r-plus", name: "Command R+", contextWindow: 128000 },
    { id: "command-r", name: "Command R", contextWindow: 128000 },
  ],
  GOOGLE: [
    { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", contextWindow: 1000000 },
    { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", contextWindow: 1000000 },
  ],
} as const;

// Evaluation criteria
export const EVALUATION_CRITERIA = [
  { value: "CORRECTNESS", label: "Correctness" },
  { value: "RELEVANCY", label: "Relevancy" },
  { value: "FAITHFULNESS", label: "Faithfulness" },
  { value: "COHERENCE", label: "Coherence" },
  { value: "TOXICITY", label: "Toxicity" },
  { value: "CUSTOM", label: "Custom" },
] as const;

// Memory types
export const MEMORY_TYPES = [
  { value: "FACT", label: "Fact" },
  { value: "PREFERENCE", label: "Preference" },
  { value: "CONTEXT", label: "Context" },
  { value: "CONVERSATION", label: "Conversation" },
  { value: "FEEDBACK", label: "Feedback" },
] as const;

// Context types
export const CONTEXT_TYPES = [
  { value: "FILE", label: "File" },
  { value: "NOTE", label: "Note" },
  { value: "LINK", label: "Link" },
  { value: "TEMPLATE", label: "Template" },
  { value: "DOCUMENT", label: "Document" },
] as const;

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

// Variable pattern for prompts
export const VARIABLE_PATTERN = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;

// File upload limits
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/markdown",
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
] as const;

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  NEW_PROMPT: { key: "n", description: "Create new prompt" },
  SEARCH: { key: "/", description: "Focus search" },
  FAVORITE: { key: "f", description: "Toggle favorite" },
  EDIT: { key: "e", description: "Edit prompt" },
  DELETE: { key: "Delete", description: "Delete prompt" },
  ESCAPE: { key: "Escape", description: "Close dialog/panel" },
  COPY: { key: "c", description: "Copy prompt", modifier: "cmd" },
} as const;
