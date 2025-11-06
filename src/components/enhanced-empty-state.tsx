import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface EnhancedEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export function EnhancedEmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}: EnhancedEmptyStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-6 rounded-lg border border-dashed p-8 text-center">
      <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-full">
        <Icon className="text-muted-foreground h-10 w-10" />
      </div>
      <div className="flex max-w-md flex-col gap-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-col gap-2 sm:flex-row">
          {actionLabel && onAction && (
            <Button onClick={onAction}>{actionLabel}</Button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <Button variant="outline" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
