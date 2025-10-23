import { cn } from "@/lib/utils";
import React from "react";

interface SectionContentProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionContent({
  children,
  className,
}: SectionContentProps) {
  return (
    <div className={cn("space-y-4 px-2 lg:px-8", className)}>{children}</div>
  );
}
