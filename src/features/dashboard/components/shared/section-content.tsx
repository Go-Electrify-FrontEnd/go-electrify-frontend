import React from "react";

interface SectionContentProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionContent({ children, className }: SectionContentProps) {
  return <div className={`space-y-4 ${className ?? ""}`}>{children}</div>;
}
