"use client";

import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export type LoaderProps = ComponentProps<"div">;

export const Loader = ({ className, ...props }: LoaderProps) => (
  <div
    className={cn("flex items-center gap-2 text-muted-foreground", className)}
    {...props}
  >
    <div className="flex gap-1">
      <span className="size-2 rounded-full bg-current animate-bounce [animation-delay:-0.3s]" />
      <span className="size-2 rounded-full bg-current animate-bounce [animation-delay:-0.15s]" />
      <span className="size-2 rounded-full bg-current animate-bounce" />
    </div>
    <span className="text-sm">Thinking...</span>
  </div>
);
