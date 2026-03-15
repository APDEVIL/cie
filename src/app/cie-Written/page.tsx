"use client";

// src/app/cie-written/page.tsx
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import type { CieWritten, Student, Subject } from "@/server/db/schema";

type Row = CieWritten & { student: Student | null; subject: Subject | null };

export default function CieWrittenPage() {
  const [testType, setTestType] = useState<string>("all");
  const [academicYear, setAcademicYear] = useState("");

  const { data, isLoading, refetch } = api.cieWritten.getAll.useQuery({
    testType: testType !== "all" ? (testType as "CIE1" | "CIE2" | "CIE3") : undefined,
    academicYear: academicYear || undefined,
  });

  const deleteMutation = api.cieWritten.delete.useMutation({
    onSuccess: () => { toast.success("Record deleted"); void refetch(); },
    onError: () => toast.error("Failed to delete record"),
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
      key: "testType",
      header: "Test",
      cell: (r) => (
        <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
          {r.testType}
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
          <Link href={`/cie-written/${r.id}/edit`}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
          <DeleteDialog
            label={`${r.student?.name}'s ${r.testType} record`}
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
        title="Written Test Records"
        description="Epic 1 — CIE Written Tests for 1st & 2nd Year"
        action={{ label: "+ Add Record", href: "/cie-written/new" }}
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={testType} onValueChange={setTestType}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Test type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tests</SelectItem>
            <SelectItem value="CIE1">CIE 1</SelectItem>
            <SelectItem value="CIE2">CIE 2</SelectItem>
            <SelectItem value="CIE3">CIE 3</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Academic year (e.g. 2024-25)"
          value={academicYear}
          onChange={(e) => setAcademicYear(e.target.value)}
          className="w-52"
        />

        <Link href="/cie-written/report">
          <Button variant="outline" size="sm">View Report</Button>
        </Link>
      </div>

      <CieTable
        columns={columns}
        data={data as Row[]}
        isLoading={isLoading}
        keyExtractor={(r) => r.id}
        emptyMessage="No written test records found. Add one to get started."
      />
    </div>
  );
}