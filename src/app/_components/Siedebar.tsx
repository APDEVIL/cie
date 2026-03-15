/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
"use client";

// src/app/_components/Sidebar.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Wrench,
  Route,
  LayoutDashboard,
  GraduationCap,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

// ─────────────────────────────────────────────
// NAV CONFIG
// ─────────────────────────────────────────────

const navGroups = [
  {
    label: "Overview",
    items: [
      {
        href: "/",
        label: "Dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Epic 1 — Written Test",
    items: [
      {
        href: "/cie-written",
        label: "All Records",
        icon: BookOpen,
      },
      {
        href: "/cie-written/new",
        label: "Add Record",
        icon: ChevronRight,
      },
      {
        href: "/cie-written/report",
        label: "Summary Report",
        icon: ChevronRight,
      },
    ],
  },
  {
    label: "Epic 2 — Skill Test",
    items: [
      {
        href: "/cie-skill",
        label: "All Records",
        icon: Wrench,
      },
      {
        href: "/cie-skill/new",
        label: "Add Record",
        icon: ChevronRight,
      },
      {
        href: "/cie-skill/report",
        label: "Summary Report",
        icon: ChevronRight,
      },
    ],
  },
  {
    label: "Epic 3 — Pathway Courses",
    items: [
      {
        href: "/cie-pathway",
        label: "All Records",
        icon: Route,
      },
      {
        href: "/cie-pathway/new",
        label: "Add Record",
        icon: ChevronRight,
      },
      {
        href: "/cie-pathway/report",
        label: "Performance Report",
        icon: ChevronRight,
      },
    ],
  },
];

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card">
      {/* Logo / Brand */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <GraduationCap className="h-4 w-4 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold leading-none tracking-tight">
            CIE System
          </span>
          <span className="text-[11px] text-muted-foreground">
            Evaluation Manager
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navGroups.map((group, gi) => (
          <div key={gi} className="mb-5">
            {/* Group label */}
            <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {group.label}
            </p>

            {/* Group items */}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground font-medium"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {gi < navGroups.length - 1 && (
              <Separator className="mt-4" />
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-5 py-3">
        <p className="text-[11px] text-muted-foreground">
          1st & 2nd Year · 5th Semester
        </p>
      </div>
    </aside>
  );
}