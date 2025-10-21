"use client";

import React from "react";

interface SectionContentProps {
  children?: React.ReactNode;
  className?: string;
}

export default function SectionContent({
  children,
  className,
}: SectionContentProps) {
  return (
    <div className={`mt-4 flex flex-col gap-4 md:gap-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
