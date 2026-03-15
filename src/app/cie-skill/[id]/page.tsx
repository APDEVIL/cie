"use client";

// src/app/cie-skill/[id]/page.tsx
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/trpc/react";
import { PageHeader } from "../../_components/PageHeader";
import { ScoreBadge } from "../../_components/ScoreBadge";
import { DeleteDialog } from "../../_components/DeleteDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

export default function CieSkillDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router   = useRouter();
  const recordId = Number(id);

  const { data, isLoading } = api.cieSkill.getById.useQuery({ id: recordId });

  const deleteMutation = api.cieSkill.delete.useMutation({
    onSuccess: () => {
      toast.success("Record deleted");
      router.push("/cie-skill");
    },
    onError: () => toast.error("Failed to delete"),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full max-w-2xl" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-4">
        <PageHeader title="Record Not Found" backHref="/cie-skill" />
        <p className="text-sm text-muted-foreground">
          This record does not exist or has been deleted.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Skill Test Record"
        description={`${data.student?.name ?? "—"} — ${data.subject?.name ?? "—"}`}
        backHref="/cie-skill"
      />

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Link href={`/cie-skill/${recordId}/edit`}>
          <Button size="sm" variant="outline">
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </Link>
        <DeleteDialog
          label={`${data.student?.name}'s ${data.testType} skill record`}
          isPending={deleteMutation.isPending}
          onConfirm={() => deleteMutation.mutate({ id: recordId })}
        />
      </div>

      {/* Detail Card */}
      <Card className="max-w-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Record Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">USN</dt>
              <dd className="mt-1 font-mono font-medium">{data.student?.usn ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Student Name</dt>
              <dd className="mt-1 font-medium">{data.student?.name ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Section</dt>
              <dd className="mt-1">{data.student?.section ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Branch</dt>
              <dd className="mt-1">{data.student?.branch ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Subject</dt>
              <dd className="mt-1 font-medium">{data.subject?.name ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Subject Code</dt>
              <dd className="mt-1 font-mono">{data.subject?.code ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Test Type</dt>
              <dd className="mt-1">
                <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-semibold">
                  {data.testType}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Skill Component</dt>
              <dd className="mt-1">{data.skillComponent ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Academic Year</dt>
              <dd className="mt-1">{data.academicYear}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Marks Obtained</dt>
              <dd className="mt-1 text-lg font-bold tabular-nums">
                {data.marksObtained}
                <span className="text-sm font-normal text-muted-foreground"> / {data.maxMarks}</span>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Grade</dt>
              <dd className="mt-1">
                <ScoreBadge grade={data.grade} isPassed={data.isPassed} showPass />
              </dd>
            </div>
            {data.conductedDate && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Conducted Date</dt>
                <dd className="mt-1">
                  {new Date(data.conductedDate).toLocaleDateString("en-IN", {
                    day: "2-digit", month: "short", year: "numeric",
                  })}
                </dd>
              </div>
            )}
            {data.remarks && (
              <div className="col-span-2">
                <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Remarks</dt>
                <dd className="mt-1 text-muted-foreground">{data.remarks}</dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}