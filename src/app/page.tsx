// src/app/page.tsx
import { BookOpen, Wrench, Route } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";

const epics = [
  {
    title:       "Written Test",
    subtitle:    "Epic 1 — 1st & 2nd Year",
    description: "Manage CIE written test records, update marks, and generate summary reports.",
    href:        "/cie-written",
    icon:        BookOpen,
    color:       "text-blue-600",
    bg:          "bg-blue-50 dark:bg-blue-950",
  },
  {
    title:       "Skill Test",
    subtitle:    "Epic 2 — 1st & 2nd Year",
    description: "Track skill test components like Lab Records, Viva, and Practicals.",
    href:        "/cie-skill",
    icon:        Wrench,
    color:       "text-emerald-600",
    bg:          "bg-emerald-50 dark:bg-emerald-950",
  },
  {
    title:       "Pathway Courses",
    subtitle:    "Epic 3 — 5th Semester",
    description: "Manage pathway course CIE assessments and generate performance reports.",
    href:        "/cie-pathway",
    icon:        Route,
    color:       "text-violet-600",
    bg:          "bg-violet-50 dark:bg-violet-950",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Continuous Internal Evaluation — Written, Skill &amp; Pathway Course Management
        </p>
      </div>

      {/* Epic Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {epics.map((epic) => {
          const Icon = epic.icon;
          return (
            <Link key={epic.href} href={epic.href}>
              <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className={cn("rounded-lg p-2.5", epic.bg)}>
                      <Icon className={cn("h-5 w-5", epic.color)} />
                    </div>
                  </div>
                  <CardTitle className="mt-3 text-base">{epic.title}</CardTitle>
                  <p className="text-xs font-medium text-muted-foreground">
                    {epic.subtitle}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {epic.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Quick Actions
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {epics.map((epic) => {
            const Icon = epic.icon;
            return (
              <Link
                key={epic.href + "/new"}
                href={epic.href + "/new"}
                className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm transition-colors hover:bg-accent"
              >
                <div className={cn("rounded-md p-1.5", epic.bg)}>
                  <Icon className={cn("h-4 w-4", epic.color)} />
                </div>
                <span className="font-medium">Add {epic.title} Record</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Report Links */}
      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Reports
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {epics.map((epic) => (
            <Link
              key={epic.href + "/report"}
              href={epic.href + "/report"}
              className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm transition-colors hover:bg-accent"
            >
              <span className="font-medium">{epic.title} Report</span>
              <span className="ml-auto text-xs text-muted-foreground">View →</span>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}