import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  GitBranch,
  Braces,
  Play,
  CheckCircle,
  Users,
} from "lucide-react";

export default async function HomePage() {
  const { userId } = await auth();

  // Redirect authenticated users to dashboard
  if (userId) {
    redirect("/prompts");
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-vault-600 text-white font-bold">
              P
            </div>
            <span className="text-xl font-bold">Prompt Vault</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button variant="vault">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Version Control for Your{" "}
              <span className="gradient-text">AI Prompts</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Create, version, and organize your prompts. Track changes with
              git-like history. Built for teams who ship AI products.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link href="/sign-up">
                <Button size="lg" variant="vault">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t bg-muted/50 py-24">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Prompt Management, Done Right
              </h2>
              <p className="mt-4 text-muted-foreground">
                Built for teams who take prompt engineering seriously.
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-lg border bg-card p-6"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-vault-100 text-vault-600 dark:bg-vault-900 dark:text-vault-300">
                    {feature.icon}
                  </div>
                  <h3 className="mt-4 font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                  {feature.status && (
                    <span className="mt-2 inline-block text-xs text-muted-foreground/60 italic">
                      {feature.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Prompt Vault. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: "Prompt CRUD",
    description:
      "Create, read, update, and delete prompts with a clean dashboard. Search, filter, and organize by category.",
    icon: <Braces className="h-6 w-6" />,
    status: null,
  },
  {
    title: "Version Control",
    description:
      "Git-like version control for your prompts. Track changes, create branches, and rollback with ease.",
    icon: <GitBranch className="h-6 w-6" />,
    status: null,
  },
  {
    title: "Variable System",
    description:
      "Smart {{variable}} placeholders with automatic extraction. Never hardcode values in prompts again.",
    icon: <Braces className="h-6 w-6" />,
    status: null,
  },
  {
    title: "LLM Playground",
    description:
      "Test prompts against multiple models. Compare outputs, track costs, and measure performance.",
    icon: <Play className="h-6 w-6" />,
    status: "Coming soon",
  },
  {
    title: "Evaluation Pipeline",
    description:
      "LLM-as-judge evaluation with custom criteria. Automated testing and regression detection.",
    icon: <CheckCircle className="h-6 w-6" />,
    status: "Coming soon",
  },
  {
    title: "Team Collaboration",
    description:
      "Workspaces, roles, and sharing. Built for teams with role-based access control.",
    icon: <Users className="h-6 w-6" />,
    status: "Coming soon",
  },
];
