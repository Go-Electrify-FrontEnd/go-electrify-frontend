"use client";

interface SectionContentProps {
  children?: React.ReactNode;
  className?: string;
}

export default function SectionContent({
  children,
  className,
}: SectionContentProps) {
  return (
    <div
      className={`flex flex-col gap-4 px-4 sm:px-6 md:gap-6 lg:px-8 ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
