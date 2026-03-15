"use client";

// src/app/cie-pathway/page.tsx
import { useState } from "react";
import Link from "next/link";
import { api } from "@/trpc/react";
import { PageHeader } from "../_components/PageHeader";
import { CieTable, type Column } from "../_components/CieTable";
import { ScoreBadge } from "../_components/ScoreBadge";
import { DeleteDialog } from "../_components/DeleteDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import type { CiePathway, Student, Subject } from "@/server/db/schema";

type Row = CiePathway & { student: Student | null; subject: Subject | null };

export default function CiePathwayPage() {
  const [academicYear, setAcademicYear] = useState("");
  const [component, setComponent]       = useState("");

  const { data, isLoading, refetch } = api.ciePathway.getAll.useQuery({
    academicYear:        academicYear || undefined,
    assessmentComponent: component    || undefined,
  });

  const deleteMutation = api.ciePathway.delete.useMutation({
    onSuccess: () => { toast.success("Record deleted"); void refetch(); },
    onError:   () => toast.error("Failed to delete"),
  });

  const columns: Column<Row>[] = [
    {
      key: "usn",
      header: "USN",
      cell: (r) => <span className="font-mono text-xs">{r.student?.usn ?? "—"}</span>,
    },
    {
      key: "name",
      header: "Student",
      cell: (r) => (
        <div>
          <p className="font-medium">{r.student?.name ?? "—"}</p>
          <p className="text-xs text-muted-foreground">{r.student?.section}</p>
        </div>
      ),
    },
    {
      key: "subject",
      header: "Subject",
      cell: (r) => (
        <div>
          <p className="font-medium">{r.subject?.name ?? "—"}</p>
          <p className="text-xs text-muted-foreground font-mono">{r.subject?.code}</p>
        </div>
      ),
    },
    {
      key: "component",
      header: "Assessment",
      cell: (r) => (
        <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
          {r.assessmentComponent}
        </span>
      ),
    },
    {
      key: "marks",
      header: "Marks",
      cell: (r) => (
        <span className="tabular-nums text-sm">
          {r.marksObtained} / {r.maxMarks}
        </span>
      ),
    },
    {
      key: "grade",
      header: "Grade",
      cell: (r) => <ScoreBadge grade={r.grade} isPassed={r.isPassed} showPass />,
    },
    {
      key: "year",
      header: "Acad. Year",
      cell: (r) => <span className="text-xs text-muted-foreground">{r.academicYear}</span>,
    },
    {
      key: "actions",
      header: "",
      cell: (r) => (
        <div className="flex items-center gap-1">
          <Link href={`/cie-pathway/${r.id}/edit`}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
          <DeleteDialog
            label={`${r.student?.name ?? "this"}'s pathway record`}
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
        title="Pathway Course Records"
        description="Epic 3 — CIE Pathway Course Assessments (5th Semester)"
        action={{ label: "+ Add Record", href: "/cie-pathway/new" }}
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Assessment component"
          value={component}
          onChange={(e) => setComponent(e.target.value)}
          className="w-52"
        />
        <Input
          placeholder="Academic year (e.g. 2024-25)"
          value={academicYear}
          onChange={(e) => setAcademicYear(e.target.value)}
          className="w-44"
        />
        <Link href="/cie-pathway/report">
          <Button variant="outline" size="sm">View Report</Button>
        </Link>
      </div>

      <CieTable
        columns={columns}
        data={data as Row[]}
        isLoading={isLoading}
        keyExtractor={(r) => r.id}
        emptyMessage="No pathway course records found. Add one to get started."
      />
    </div>
  );
}