"use client";

// src/app/_components/ReportView.tsx
import { StatsCard } from "./StatsCard";
import { ScoreBadge } from "./ScoreBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface GradeDistribution {
  O: number; "A+": number; A: number;
  "B+": number; B: number; C: number;
  P: number; F: number;
}

interface ReportStats {
  totalStudents: number;
  avgMarks: number;
  passCount: number;
  failCount: number;
  passRate: number;
  maxScore: number;
  minScore: number;
  gradeDistribution: GradeDistribution;
}

interface ReportRecord {
  id: number;
  marksObtained: number;
  maxMarks: number;
  grade: string | null;
  isPassed: boolean;
  student: { usn: string; name: string; section: string } | null;
  subject: { code: string; name: string } | null;
}

interface ReportViewProps {
  title: string;
  subtitle?: string;
  stats: ReportStats;
  records: ReportRecord[];
  extraColumns?: { header: string; cell: (r: ReportRecord) => React.ReactNode }[];
}

const gradeOrder = ["O", "A+", "A", "B+", "B", "C", "P", "F"] as const;

export function ReportView({ title, subtitle, stats, records, extraColumns = [] }: ReportViewProps) {
  return (
    <div className="space-y-6">
      {/* Report Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatsCard label="Total Students" value={stats.totalStudents} />
        <StatsCard label="Avg Marks"      value={stats.avgMarks}      color="blue" />
        <StatsCard label="Pass Count"     value={stats.passCount}     color="green" />
        <StatsCard label="Fail Count"     value={stats.failCount}     color="red" />
        <StatsCard label="Pass Rate"      value={`${stats.passRate}%`} color="green" />
        <StatsCard label="Highest"        value={stats.maxScore}      color="amber" />
      </div>

      {/* Grade Distribution */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Grade Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {gradeOrder.map((g) => (
              <div key={g} className="flex flex-col items-center gap-1">
                <ScoreBadge grade={g} />
                <span className="text-sm font-semibold tabular-nums">
                  {stats.gradeDistribution[g]}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Student Records Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">
            Student Records ({records.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs uppercase tracking-wider">#</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">USN</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Name</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Section</TableHead>
                {extraColumns.map((c) => (
                  <TableHead key={c.header} className="text-xs uppercase tracking-wider">
                    {c.header}
                  </TableHead>
                ))}
                <TableHead className="text-xs uppercase tracking-wider">Marks</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((r, idx) => (
                <TableRow key={r.id} className="hover:bg-muted/40">
                  <TableCell className="text-muted-foreground text-xs">{idx + 1}</TableCell>
                  <TableCell className="font-mono text-xs">{r.student?.usn ?? "—"}</TableCell>
                  <TableCell className="font-medium text-sm">{r.student?.name ?? "—"}</TableCell>
                  <TableCell className="text-sm">{r.student?.section ?? "—"}</TableCell>
                  {extraColumns.map((c) => (
                    <TableCell key={c.header} className="text-sm">{c.cell(r)}</TableCell>
                  ))}
                  <TableCell className="tabular-nums text-sm">
                    {r.marksObtained} / {r.maxMarks}
                  </TableCell>
                  <TableCell>
                    <ScoreBadge grade={r.grade} isPassed={r.isPassed} showPass />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}