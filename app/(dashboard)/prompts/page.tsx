"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc/client";
import { FileText, Plus, Star, Copy, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { useDebounce } from "@/hooks";

export default function PromptsPage() {
  const [search, setSearch] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  // Get current user + workspace
  const { data: user, isLoading: userLoading } = trpc.user.me.useQuery();
  const workspaceId = user?.workspaces[0]?.workspace.id;

  // Fetch prompts
  const {
    data: promptsData,
    isLoading: promptsLoading,
    refetch,
  } = trpc.prompt.list.useQuery(
    {
      workspaceId: workspaceId ?? "",
      search: debouncedSearch || undefined,
    },
    { enabled: !!workspaceId }
  );

  const prompts = promptsData?.prompts ?? [];

  // Mutations
  const createPrompt = trpc.prompt.create.useMutation({
    onSuccess: () => {
      refetch();
      setShowCreateForm(false);
      toast.success("Prompt created");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const toggleFavorite = trpc.prompt.toggleFavorite.useMutation({
    onSuccess: () => refetch(),
  });

  const deletePrompt = trpc.prompt.delete.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Prompt deleted");
    },
  });

  const duplicatePrompt = trpc.prompt.duplicate.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Prompt duplicated");
    },
  });

  const isLoading = userLoading || promptsLoading;

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
          <Button variant="vault" onClick={() => setShowCreateForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Prompt
          </Button>
        </div>

        {/* Search */}
        <div className="mt-4 flex items-center gap-4">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search prompts..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Create Form */}
      {showCreateForm && workspaceId && (
        <CreatePromptForm
          workspaceId={workspaceId}
          onSubmit={(data) => createPrompt.mutate(data)}
          onCancel={() => setShowCreateForm(false)}
          isLoading={createPrompt.isPending}
        />
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-lg border bg-muted"
              />
            ))}
          </div>
        ) : prompts.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-medium">No prompts yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Get started by creating your first prompt.
              </p>
              <Button
                className="mt-4"
                variant="vault"
                onClick={() => setShowCreateForm(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Prompt
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {prompts.map((prompt) => (
              <div
                key={prompt.id}
                className="group rounded-lg border bg-card p-4 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold line-clamp-2">{prompt.title}</h3>
                  <button
                    onClick={() => toggleFavorite.mutate({ id: prompt.id })}
                    className="ml-2 shrink-0 text-muted-foreground hover:text-yellow-500"
                  >
                    <Star
                      className={`h-4 w-4 ${prompt.favorite ? "fill-yellow-500 text-yellow-500" : ""}`}
                    />
                  </button>
                </div>

                {prompt.description && (
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {prompt.description}
                  </p>
                )}

                {prompt.currentVersion && (
                  <p className="mt-2 text-xs text-muted-foreground font-mono line-clamp-3">
                    {prompt.currentVersion.content.slice(0, 150)}
                    {prompt.currentVersion.content.length > 150 ? "..." : ""}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap gap-1">
                  <Badge variant="vault" className="text-xs">
                    v{prompt.currentVersion?.version ?? 1}
                  </Badge>
                  {prompt.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-between border-t pt-3">
                  <span className="text-xs text-muted-foreground">
                    {prompt.category.toLowerCase().replace("_", " ")}
                  </span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => duplicatePrompt.mutate({ id: prompt.id })}
                      className="rounded p-1 hover:bg-muted"
                      title="Duplicate"
                    >
                      <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Delete this prompt?")) {
                          deletePrompt.mutate({ id: prompt.id });
                        }
                      }}
                      className="rounded p-1 hover:bg-destructive/10"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CreatePromptForm({
  workspaceId,
  onSubmit,
  onCancel,
  isLoading,
}: {
  workspaceId: string;
  onSubmit: (_data: {
    title: string;
    content: string;
    description?: string;
    workspaceId: string;
  }) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSubmit({
      title: title.trim(),
      content: content.trim(),
      description: description.trim() || undefined,
      workspaceId,
    });
  };

  return (
    <div className="border-b bg-background p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My prompt..."
            required
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Description (optional)</label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does this prompt do?"
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your prompt here... Use {{variable}} for placeholders."
            required
            rows={6}
            className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-mono"
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" variant="vault" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Prompt"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
