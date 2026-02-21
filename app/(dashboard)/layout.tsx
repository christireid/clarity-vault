import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import {
  FileText,
  FolderOpen,
  Play,
  BarChart3,
  CheckCircle,
  Database,
  Settings,
} from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r bg-background">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-vault-600 text-white font-bold">
            P
          </div>
          <span className="text-lg font-bold">Prompt Vault</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          <NavItem href="/prompts" icon={<FileText className="h-5 w-5" />}>
            Prompts
          </NavItem>
          <NavItem href="/collections" icon={<FolderOpen className="h-5 w-5" />}>
            Collections
          </NavItem>
          <NavItem href="/playground" icon={<Play className="h-5 w-5" />}>
            Playground
          </NavItem>
          <NavItem href="/analytics" icon={<BarChart3 className="h-5 w-5" />}>
            Analytics
          </NavItem>
          <NavItem href="/evaluations" icon={<CheckCircle className="h-5 w-5" />}>
            Evaluations
          </NavItem>
          <NavItem href="/memory" icon={<Database className="h-5 w-5" />}>
            Memory
          </NavItem>

          <div className="py-4">
            <div className="border-t" />
          </div>

          <NavItem href="/settings" icon={<Settings className="h-5 w-5" />}>
            Settings
          </NavItem>
        </nav>

        {/* User */}
        <div className="border-t p-4">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-10 w-10",
              },
            }}
          />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-muted/30">{children}</main>
    </div>
  );
}

function NavItem({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {icon}
      {children}
    </Link>
  );
}
