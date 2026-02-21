import { FolderOpen } from "lucide-react";

export default function CollectionsPage() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <FolderOpen className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-medium">Collections</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Organize prompts into collections. Coming soon.
        </p>
      </div>
    </div>
  );
}
