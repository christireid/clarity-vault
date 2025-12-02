export const siteConfig = {
  name: "Prompt Vault",
  description:
    "A comprehensive prompt management and LLMOps platform for teams",
  url:
    process.env.NEXT_PUBLIC_APP_URL || "https://promptvault.dev",
  ogImage: "https://promptvault.dev/og.png",
  links: {
    github: "https://github.com/promptvault",
    docs: "https://docs.promptvault.dev",
  },
  creator: "Prompt Vault Team",
};

export type SiteConfig = typeof siteConfig;
