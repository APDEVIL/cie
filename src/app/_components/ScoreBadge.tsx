// src/app/_components/ScoreBadge.tsx
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  grade: string | null | undefined;
  isPassed?: boolean;
  showPass?: boolean;
}

const gradeStyles: Record<string, string> = {
  O:    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  "A+": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  A:    "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200",
  "B+": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  B:    "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  C:    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  P:    "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200",
  F:    "bg-red-200 text-red-900 dark:bg-red-800 dark:text-red-100 font-bold",
};

export function ScoreBadge({ grade, isPassed, showPass = false }: ScoreBadgeProps) {
  if (!grade) return <span className="text-xs text-muted-foreground">—</span>;

  return (
    <div className="flex items-center gap-1.5">
      <span
        className={cn(
          "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold",
          gradeStyles[grade] ?? "bg-muted text-muted-foreground"
        )}
      >
        {grade}
      </span>
      {showPass && (
        <span
          className={cn(
            "inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium",
            isPassed
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
          )}
        >
          {isPassed ? "Pass" : "Fail"}
        </span>
      )}
    </div>
  );
}