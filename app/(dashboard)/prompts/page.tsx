import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PromptsPage() {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b bg-background p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Prompts</h1>
            <p className="text-sm text-muted-foreground">
              Manage and organize your prompts
            </p>
          </div>
          <Button variant="vault">New Prompt</Button>
        </div>

        {/* Search and Filters */}
        <div className="mt-4 flex items-center gap-4">
          <Input
            placeholder="Search prompts..."
            className="max-w-sm"
          />
          <Button variant="outline" size="sm">
            Filters
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <svg
                className="h-8 w-8 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium">No prompts yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Get started by creating your first prompt.
            </p>
            <Button className="mt-4" variant="vault">
              Create Prompt
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
