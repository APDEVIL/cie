/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
"use client";

// src/app/cie-pathway/report/page.tsx
import { useState } from "react";
import { api } from "@/trpc/react";
import { PageHeader } from "../../_components/PageHeader";
import { ReportView } from "../../_components/ReportView";
import { StatsCard } from "../../_components/StatsCard";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CiePathwayReportPage() {
  const { data: subjects } = api.subject.getAll.useQuery({ isPathway: true });

  const [subjectId, setSubjectId]       = useState<number | null>(null);
  const [academicYear, setAcademicYear] = useState("2024-25");
  const [component, setComponent]       = useState("");
  const [shouldFetch, setShouldFetch]   = useState(false);

  const { data, isLoading } = api.ciePathway.getPerformanceReport.useQuery(
    {
      subjectId:           subjectId!,
      academicYear,
      assessmentComponent: component || undefined,
    },
    { enabled: shouldFetch && !!subjectId }
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pathway Course Performance Report"
        description="Epic 3 — Generate component-wise performance report (5th Semester)"
        backHref="/cie-pathway"
      />

      {/* Filter Panel */}
      <div className="flex flex-wrap items-end gap-4 rounded-lg border border-border bg-card p-4">
        <div className="space-y-1.5">
          <Label className="text-xs">Pathway Subject</Label>
          <Select onValueChange={(v) => setSubjectId(Number(v))}>
            <SelectTrigger className="w-60">
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects?.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.code} — {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Academic Year</Label>
          <Input
            className="w-32"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            placeholder="2024-25"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Component (optional)</Label>
          <Input
            className="w-44"
            value={component}
            onChange={(e) => setComponent(e.target.value)}
            placeholder="e.g. Module Test 1"
          />
        </div>

        <Button
          onClick={() => setShouldFetch(true)}
          disabled={!subjectId}
          size="sm"
        >
          Generate Report
        </Button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-4">
          <div className="grid grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      )}

      {/* Report Output */}
      {data && !isLoading && (
        <div className="space-y-6">
          {/* Component Breakdown — unique to Epic 3 */}
          {data.componentBreakdown.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">
                  Component-wise Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {data.componentBreakdown.map((c) => (
                    <div
                      key={c.component}
                      className="rounded-lg border border-border bg-muted/30 p-4"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {c.component}
                      </p>
                      <div className="mt-2 flex items-end justify-between">
                        <div>
                          <p className="text-2xl font-bold tabular-nums">
                            {c.avgMarks}
                          </p>
                          <p className="text-xs text-muted-foreground">avg marks</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                            {c.passRate}%
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {c.passCount}/{c.total} passed
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main report with overall stats + student table */}
          <ReportView
            title="Pathway Course Report"
            subtitle={`Academic Year: ${academicYear}${component ? ` — ${component}` : ""}`}
            stats={data.stats}
            records={data.records as any}
            extraColumns={[
              {
                header: "Component",
                cell: (r: any) => (
                  <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
                    {r.assessmentComponent}
                  </span>
                ),
              },
            ]}
          />
        </div>
      )}
    </div>
  );
}