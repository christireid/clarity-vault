import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Prompt Vault",
  description:
    "A comprehensive prompt management and LLMOps platform for teams",
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
      "A comprehensive prompt management and LLMOps platform for teams",
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
        <body className={`${inter.variable} font-sans antialiased`}>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
