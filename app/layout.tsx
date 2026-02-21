import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prompt Vault",
  description:
    "A prompt management and version control platform for AI teams",
  keywords: [
    "prompt management",
    "LLM",
    "AI",
    "prompt engineering",
    "LLMOps",
  ],
  authors: [{ name: "Prompt Vault Team" }],
  openGraph: {
    title: "Prompt Vault",
    description:
      "A prompt management and version control platform for AI teams",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="font-sans antialiased">
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
