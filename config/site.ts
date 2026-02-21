export const siteConfig = {
  name: "Prompt Vault",
  description:
    "A prompt management and version control platform for AI teams",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  creator: "Prompt Vault Team",
};

export type SiteConfig = typeof siteConfig;
