import { Link, useRouterState } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { FileText, Gamepad2, Ghost, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface Tab {
  name: string;
  href: string;
  icon: LucideIcon;
  matchPattern: RegExp;
  disabled?: boolean;
}

// Tab definitions - expand as features are built
const tabs: Tab[] = [
  {
    name: "Spirits",
    href: "/spirits",
    icon: Ghost,
    matchPattern: /^\/spirits/,
    disabled: false,
  },
  {
    name: "Games",
    href: "/games",
    icon: Gamepad2,
    matchPattern: /^\/games/,
    disabled: false,
  },
  {
    name: "Notes",
    href: "/notes",
    icon: FileText,
    matchPattern: /^\/notes/,
    disabled: true, // Phase 6
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    matchPattern: /^\/settings/,
    disabled: false,
  },
];

export function BottomNav() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border"
      style={{ viewTransitionName: "bottom-nav" }}
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = tab.matchPattern.test(currentPath);
          const Icon = tab.icon;

          if (tab.disabled) {
            return (
              <div
                key={tab.name}
                className="flex flex-col items-center justify-center flex-1 h-full opacity-40"
              >
                <Icon className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground mt-1">
                  {tab.name}
                </span>
              </div>
            );
          }

          return (
            <Link
              key={tab.name}
              to={tab.href as "/spirits" | "/games" | "/settings"}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full",
                "transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
              <span
                className={cn("text-xs mt-1", isActive ? "font-medium" : "")}
              >
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
      {/* Safe area inset for iOS */}
      <div className="h-safe-area-inset-bottom bg-background" />
    </nav>
  );
}
