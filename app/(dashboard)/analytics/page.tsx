import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <BarChart3 className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-medium">Analytics</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Track usage, costs, and performance. Coming soon.
        </p>
      </div>
    </div>
  );
}
