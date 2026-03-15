"use client";

// src/app/cie-skill/[id]/edit/page.tsx
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const schema = z.object({
  testType:       z.enum(["CIE1", "CIE2", "CIE3"]).optional(),
  maxMarks:       z.number().min(1).optional(),
  marksObtained:  z.number().min(0).optional(),
  skillComponent: z.string().optional(),
  remarks:        z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function EditCieSkillPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = api.cieSkill.getById.useQuery({ id: Number(id) });
  const { register, handleSubmit, setValue, formState: { errors } } =
    useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (data) {
      setValue("testType",       data.testType);
      setValue("maxMarks",       data.maxMarks);
      setValue("marksObtained",  data.marksObtained);
      setValue("skillComponent", data.skillComponent ?? "");
      setValue("remarks",        data.remarks ?? "");
    }
  }, [data, setValue]);

  const updateMutation = api.cieSkill.update.useMutation({
    onSuccess: () => { toast.success("Record updated"); router.push("/cie-skill"); },
    onError: (e) => toast.error(e.message),
  });

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 w-full max-w-2xl" /></div>;

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Skill Test Record" description={`${data?.student?.name ?? ""} — ${data?.subject?.name ?? ""}`} backHref="/cie-skill" />
      <CieForm title="Update Skill Test" onSubmit={handleSubmit((d) => updateMutation.mutate({ id: Number(id), ...d }))} isPending={updateMutation.isPending} submitLabel="Update" cancelHref="/cie-skill">
        <div className="space-y-1.5">
          <Label>Test Type</Label>
          <Select defaultValue={data?.testType} onValueChange={(v) => setValue("testType", v as "CIE1" | "CIE2" | "CIE3")}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="CIE1">CIE 1</SelectItem>
              <SelectItem value="CIE2">CIE 2</SelectItem>
              <SelectItem value="CIE3">CIE 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Skill Component</Label>
          <Input placeholder="e.g. Lab Record, Viva" {...register("skillComponent")} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Max Marks</Label>
            <Input type="number" {...register("maxMarks", { valueAsNumber: true })} />
          </div>
          <div className="space-y-1.5">
            <Label>Marks Obtained</Label>
            <Input type="number" step="0.5" {...register("marksObtained", { valueAsNumber: true })} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Remarks</Label>
          <Textarea rows={2} {...register("remarks")} />
        </div>
      </CieForm>
    </div>
  );
}