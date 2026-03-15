"use client";

// src/app/cie-pathway/new/page.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const schema = z.object({
  studentId:           z.number().min(1, "Select a student"),
  subjectId:           z.number().min(1, "Select a subject"),
  assessmentComponent: z.string().min(1, "Required"),
  maxMarks:            z.number().min(1),
  marksObtained:       z.number().min(0),
  academicYear:        z.string().min(1, "Required"),
  remarks:             z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

// Common pathway assessment components
const COMPONENTS = [
  "Module Test 1",
  "Module Test 2",
  "Module Test 3",
  "Assignment 1",
  "Assignment 2",
  "Seminar",
  "Mini Project",
  "Lab Record",
];

export default function NewCiePathwayPage() {
  const router = useRouter();

  // Only fetch 5th semester students
  const { data: students } = api.student.getAll.useQuery({ semester: "5" });
  // Only fetch pathway subjects
  const { data: subjects } = api.subject.getAll.useQuery({ isPathway: true });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const createMutation = api.ciePathway.create.useMutation({
    onSuccess: () => {
      toast.success("Pathway record created successfully");
      router.push("/cie-pathway");
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Pathway Course Record"
        description="Epic 3 — Create new pathway course CIE entry (5th Semester)"
        backHref="/cie-pathway"
      />

      <CieForm
        title="Pathway Course Details"
        onSubmit={handleSubmit((d) => createMutation.mutate(d))}
        isPending={createMutation.isPending}
        cancelHref="/cie-pathway"
      >
        {/* Student */}
        <div className="space-y-1.5">
          <Label>Student <span className="text-xs text-muted-foreground">(5th Semester)</span></Label>
          <Select onValueChange={(v) => setValue("studentId", Number(v))}>
            <SelectTrigger>
              <SelectValue placeholder="Select student" />
            </SelectTrigger>
            <SelectContent>
              {students?.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.usn} — {s.name} ({s.section})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.studentId && (
            <p className="text-xs text-destructive">{errors.studentId.message}</p>
          )}
        </div>

        {/* Subject */}
        <div className="space-y-1.5">
          <Label>Pathway Subject</Label>
          <Select onValueChange={(v) => setValue("subjectId", Number(v))}>
            <SelectTrigger>
              <SelectValue placeholder="Select pathway subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects?.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.code} — {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.subjectId && (
            <p className="text-xs text-destructive">{errors.subjectId.message}</p>
          )}
        </div>

        {/* Assessment Component */}
        <div className="space-y-1.5">
          <Label>Assessment Component</Label>
          <Select onValueChange={(v) => setValue("assessmentComponent", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select or type component" />
            </SelectTrigger>
            <SelectContent>
              {COMPONENTS.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Also allow free-text override */}
          <Input
            placeholder="Or type custom component name"
            onChange={(e) => {
              if (e.target.value) setValue("assessmentComponent", e.target.value);
            }}
            className="mt-1.5"
          />
          {errors.assessmentComponent && (
            <p className="text-xs text-destructive">{errors.assessmentComponent.message}</p>
          )}
        </div>

        {/* Marks */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Max Marks</Label>
            <Input type="number" defaultValue={50} {...register("maxMarks", { valueAsNumber: true })} />
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

        {/* Academic Year */}
        <div className="space-y-1.5">
          <Label>Academic Year</Label>
          <Input placeholder="e.g. 2024-25" {...register("academicYear")} />
          {errors.academicYear && (
            <p className="text-xs text-destructive">{errors.academicYear.message}</p>
          )}
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