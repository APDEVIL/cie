// ─────────────────────────────────────────────────────────────────────────────
// src/app/cie-skill/new/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/trpc/react";
import { PageHeader } from "../../_components/PageHeader";
import { CieForm } from "../../_components/CieForm";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const schema = z.object({
  studentId:      z.number().min(1),
  subjectId:      z.number().min(1),
  testType:       z.enum(["CIE1", "CIE2", "CIE3"]),
  maxMarks:       z.number().min(1),
  marksObtained:  z.number().min(0),
  skillComponent: z.string().optional(),
  academicYear:   z.string().min(1),
  remarks:        z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function NewCieSkillPage() {
  const router = useRouter();
  const { data: students } = api.student.getAll.useQuery();
  const { data: subjects } = api.subject.getAll.useQuery({ isPathway: false });
  const { register, handleSubmit, setValue, formState: { errors } } =
    useForm<FormValues>({ resolver: zodResolver(schema) });

  const createMutation = api.cieSkill.create.useMutation({
    onSuccess: () => { toast.success("Skill test record created"); router.push("/cie-skill"); },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Add Skill Test Record" description="Epic 2 — Create new skill test entry" backHref="/cie-skill" />
      <CieForm title="Skill Test Details" onSubmit={handleSubmit((d) => createMutation.mutate(d))} isPending={createMutation.isPending} cancelHref="/cie-skill">
        <div className="space-y-1.5">
          <Label>Student</Label>
          <Select onValueChange={(v) => setValue("studentId", Number(v))}>
            <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
            <SelectContent>{students?.map((s) => <SelectItem key={s.id} value={String(s.id)}>{s.usn} — {s.name}</SelectItem>)}</SelectContent>
          </Select>
          {errors.studentId && <p className="text-xs text-destructive">Required</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Subject</Label>
          <Select onValueChange={(v) => setValue("subjectId", Number(v))}>
            <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
            <SelectContent>{subjects?.map((s) => <SelectItem key={s.id} value={String(s.id)}>{s.code} — {s.name}</SelectItem>)}</SelectContent>
          </Select>
          {errors.subjectId && <p className="text-xs text-destructive">Required</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Test Type</Label>
          <Select onValueChange={(v) => setValue("testType", v as "CIE1" | "CIE2" | "CIE3")}>
            <SelectTrigger><SelectValue placeholder="Select test" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="CIE1">CIE 1</SelectItem>
              <SelectItem value="CIE2">CIE 2</SelectItem>
              <SelectItem value="CIE3">CIE 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Skill Component</Label>
          <Input placeholder="e.g. Lab Record, Viva, Practical" {...register("skillComponent")} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Max Marks</Label>
            <Input type="number" defaultValue={20} {...register("maxMarks", { valueAsNumber: true })} />
          </div>
          <div className="space-y-1.5">
            <Label>Marks Obtained</Label>
            <Input type="number" step="0.5" {...register("marksObtained", { valueAsNumber: true })} />
            {errors.marksObtained && <p className="text-xs text-destructive">{errors.marksObtained.message}</p>}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Academic Year</Label>
          <Input placeholder="e.g. 2024-25" {...register("academicYear")} />
          {errors.academicYear && <p className="text-xs text-destructive">Required</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Remarks (optional)</Label>
          <Textarea rows={2} {...register("remarks")} />
        </div>
      </CieForm>
    </div>
  );
}