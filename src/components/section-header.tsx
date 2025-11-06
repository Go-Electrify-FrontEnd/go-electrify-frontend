"use client";

export default function SectionHeader({
  title,
  subtitle,
  children,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="border-b px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-foreground text-4xl font-semibold">{title}</h1>
          {subtitle && (
            <p className="text-muted-foreground/90 text-base font-medium">
              {subtitle}
            </p>
          )}
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
