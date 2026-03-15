// src/app/_components/StatsCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: string | number;
  sub?: string;
  color?: "default" | "green" | "red" | "blue" | "amber";
}

const colorMap = {
  default: "text-foreground",
  green:   "text-emerald-600 dark:text-emerald-400",
  red:     "text-red-600 dark:text-red-400",
  blue:    "text-blue-600 dark:text-blue-400",
  amber:   "text-amber-600 dark:text-amber-400",
};

export function StatsCard({ label, value, sub, color = "default" }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="pt-5 pb-4 px-5">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <p className={cn("mt-1.5 text-3xl font-bold tabular-nums", colorMap[color])}>
          {value}
        </p>
        {sub && (
          <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
        )}
      </CardContent>
    </Card>
  );
}