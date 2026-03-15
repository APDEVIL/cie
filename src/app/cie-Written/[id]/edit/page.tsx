"use client";

// src/app/cie-pathway/[id]/edit/page.tsx
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { api } from "@/trpc/react";
import { PageHeader } from "../../../_components/PageHeader";
import { CieForm } from "../../../_components/CieForm";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const schema = z.object({
  assessmentComponent: z.string().min(1).optional(),
  maxMarks:            z.number().min(1).optional(),
  marksObtained:       z.number().min(0).optional(),
  remarks:             z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function EditCiePathwayPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const recordId = Number(id);

  const { data, isLoading } = api.ciePathway.getById.useQuery({ id: recordId });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (data) {
      setValue("assessmentComponent", data.assessmentComponent);
      setValue("maxMarks",            data.maxMarks);
      setValue("marksObtained",       data.marksObtained);
      setValue("remarks",             data.remarks ?? "");
    }
  }, [data, setValue]);

  const updateMutation = api.ciePathway.update.useMutation({
    onSuccess: () => {
      toast.success("Pathway record updated");
      router.push("/cie-pathway");
    },
    onError: (e) => toast.error(e.message),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full max-w-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Pathway Record"
        description={`${data?.student?.name ?? ""} — ${data?.subject?.name ?? ""}`}
        backHref="/cie-pathway"
      />

      <CieForm
        title="Update Pathway Assessment"
        onSubmit={handleSubmit((d) => updateMutation.mutate({ id: recordId, ...d }))}
        isPending={updateMutation.isPending}
        submitLabel="Update"
        cancelHref="/cie-pathway"
      >
        {/* Assessment Component */}
        <div className="space-y-1.5">
          <Label>Assessment Component</Label>
          <Input
            placeholder="e.g. Module Test 1, Assignment"
            {...register("assessmentComponent")}
          />
          {errors.assessmentComponent && (
            <p className="text-xs text-destructive">{errors.assessmentComponent.message}</p>
          )}
        </div>

        {/* Marks */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Max Marks</Label>
            <Input type="number" {...register("maxMarks", { valueAsNumber: true })} />
            {errors.maxMarks && (
              <p className="text-xs text-destructive">{errors.maxMarks.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>Marks Obtained</Label>
            <Input type="number" step="0.5" {...register("marksObtained", { valueAsNumber: true })} />
            {errors.marksObtained && (
              <p className="text-xs text-destructive">{errors.marksObtained.message}</p>
            )}
          </div>
        </div>

        {/* Remarks */}
        <div className="space-y-1.5">
          <Label>Remarks (optional)</Label>
          <Textarea rows={2} {...register("remarks")} />
        </div>
      </CieForm>
    </div>
  );
}