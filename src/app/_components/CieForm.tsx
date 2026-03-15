"use client";

// src/app/_components/CieForm.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface CieFormProps {
  title: string;
  description?: string;
  onSubmit: (e: React.FormEvent) => void;
  isPending?: boolean;
  submitLabel?: string;
  cancelHref?: string;
  children: React.ReactNode;
}

export function CieForm({
  title,
  description,
  onSubmit,
  isPending,
  submitLabel = "Save",
  cancelHref,
  children,
}: CieFormProps) {
  return (
    <Card className="max-w-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-base">{title}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-5">
          {children}

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={isPending} size="sm">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Saving..." : submitLabel}
            </Button>
            {cancelHref && (
              <a href={cancelHref}>
                <Button type="button" variant="outline" size="sm">
                  Cancel
                </Button>
              </a>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}