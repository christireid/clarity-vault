import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Settings className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-medium">Settings</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Workspace and account settings. Coming soon.
        </p>
      </div>
    </div>
  );
}
