"use client";

// src/app/cie-skill/page.tsx
import { useState } from "react";
import Link from "next/link";
import { api } from "@/trpc/react";
import { PageHeader } from "../_components/PageHeader";
import { CieTable, type Column } from "../_components/CieTable";
import { ScoreBadge } from "../_components/ScoreBadge";
import { DeleteDialog } from "../_components/DeleteDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import type { CieSkill, Student, Subject } from "@/server/db/schema";

type Row = CieSkill & { student: Student | null; subject: Subject | null };

export default function CieSkillPage() {
  const [testType, setTestType]         = useState("all");
  const [academicYear, setAcademicYear] = useState("");

  const { data, isLoading, refetch } = api.cieSkill.getAll.useQuery({
    testType: testType !== "all" ? (testType as "CIE1" | "CIE2" | "CIE3") : undefined,
    academicYear: academicYear || undefined,
  });

  const deleteMutation = api.cieSkill.delete.useMutation({
    onSuccess: () => { toast.success("Record deleted"); void refetch(); },
    onError:   () => toast.error("Failed to delete"),
  });

  const columns: Column<Row>[] = [
    { key: "usn",     header: "USN",     cell: (r) => <span className="font-mono text-xs">{r.student?.usn ?? "—"}</span> },
    { key: "name",    header: "Student", cell: (r) => <div><p className="font-medium">{r.student?.name ?? "—"}</p><p className="text-xs text-muted-foreground">{r.student?.section}</p></div> },
    { key: "subject", header: "Subject", cell: (r) => <div><p className="font-medium">{r.subject?.name ?? "—"}</p><p className="text-xs text-muted-foreground font-mono">{r.subject?.code}</p></div> },
    { key: "component", header: "Component", cell: (r) => <span className="text-xs">{r.skillComponent ?? "—"}</span> },
    { key: "testType", header: "Test",   cell: (r) => <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium">{r.testType}</span> },
    { key: "marks",   header: "Marks",   cell: (r) => <span className="tabular-nums text-sm">{r.marksObtained} / {r.maxMarks}</span> },
    { key: "grade",   header: "Grade",   cell: (r) => <ScoreBadge grade={r.grade} isPassed={r.isPassed} showPass /> },
    { key: "year",    header: "Acad. Year", cell: (r) => <span className="text-xs text-muted-foreground">{r.academicYear}</span> },
    {
      key: "actions", header: "",
      cell: (r) => (
        <div className="flex items-center gap-1">
          <Link href={`/cie-skill/${r.id}/edit`}>
            <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-4 w-4" /></Button>
          </Link>
          <DeleteDialog
            label={`${r.student?.name}'s ${r.testType} skill record`}
            isPending={deleteMutation.isPending}
            onConfirm={() => deleteMutation.mutate({ id: r.id })}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Skill Test Records"
        description="Epic 2 — CIE Skill Tests for 1st & 2nd Year"
        action={{ label: "+ Add Record", href: "/cie-skill/new" }}
      />
      <div className="flex flex-wrap items-center gap-3">
        <Select value={testType} onValueChange={setTestType}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Test type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tests</SelectItem>
            <SelectItem value="CIE1">CIE 1</SelectItem>
            <SelectItem value="CIE2">CIE 2</SelectItem>
            <SelectItem value="CIE3">CIE 3</SelectItem>
          </SelectContent>
        </Select>
        <Input placeholder="Academic year" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} className="w-44" />
        <Link href="/cie-skill/report"><Button variant="outline" size="sm">View Report</Button></Link>
      </div>
      <CieTable columns={columns} data={data as Row[]} isLoading={isLoading} keyExtractor={(r) => r.id} emptyMessage="No skill test records found." />
    </div>
  );
}