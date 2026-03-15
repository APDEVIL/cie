/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
/** biome-ignore-all assist/source/useSortedAttributes: <explanation> */
"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { PageHeader } from "../../_components/PageHeader";
import { ReportView } from "../../_components/ReportView";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

// We keep the logic inside a standard Page component with no custom props
export default function CieSkillReportPage() {
  const { data: subjects } = api.subject.getAll.useQuery({ isPathway: false });
  const [subjectId, setSubjectId]       = useState<number | null>(null);
  const [testType, setTestType]         = useState<"CIE1" | "CIE2" | "CIE3">("CIE1");
  const [academicYear, setAcademicYear] = useState("2024-25");
  const [shouldFetch, setShouldFetch]   = useState(false);

  const { data, isLoading } = api.cieSkill.getSummaryReport.useQuery(
    { subjectId: subjectId!, testType, academicYear },
    { enabled: shouldFetch && !!subjectId }
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Skill Test Summary Report" 
        description="Epic 2 — Generate report by subject, test type and year" 
        backHref="/cie-skill" 
      />

      <div className="flex flex-wrap items-end gap-4 rounded-lg border border-border bg-card p-4">
        <div className="space-y-1.5">
          <Label className="text-xs">Subject</Label>
          <Select onValueChange={(v) => setSubjectId(Number(v))}>
            <SelectTrigger className="w-56">
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
          <Label className="text-xs">Test Type</Label>
          <Select value={testType} onValueChange={(v) => setTestType(v as typeof testType)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CIE1">CIE 1</SelectItem>
              <SelectItem value="CIE2">CIE 2</SelectItem>
              <SelectItem value="CIE3">CIE 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Academic Year</Label>
          <Input 
            className="w-32" 
            value={academicYear} 
            onChange={(e) => setAcademicYear(e.target.value)} 
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

      {isLoading && (
        <div className="space-y-4">
          <div className="grid grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      )}

      {data && !isLoading && (
        <ReportView
          title={`Skill Test Report — ${testType}`}
          subtitle={`Academic Year: ${academicYear}`}
          stats={data.stats}
          records={data.records as any}
          extraColumns={[
            { 
              header: "Component", 
              cell: (r: any) => <span className="text-xs">{r.skillComponent ?? "—"}</span> 
            }
          ]}
        />
      )}
    </div>
  );
}