import { cn } from "@/lib/utils";
import Image from "next/image";

interface GradientCardProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
  backgroundImage?: string;
}

export function GradientCard({
  title,
  subtitle,
  children,
  className,
  backgroundImage = "/assets/images/gradient-background.png",
}: GradientCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden shadow-lg",
        "bg-cover bg-center bg-no-repeat",
        // layout: stack content at the top with extra space above
        "flex min-h-96 flex-col justify-start",
        // create a larger top padding so content sits with space above
        // increased from pt-16 to pt-24 to ensure visible empty area above text
        "px-6 pt-24 pb-8",
        className,
      )}
    >
      <Image alt="" src={backgroundImage} fill={true} />
      <div className="z-10 mt-auto max-w-[18rem] text-balance">
        <h1 className="mb-2 text-3xl text-black">{title}</h1>
        {subtitle && <p className="mb-6 text-sm text-black/70">{subtitle}</p>}
        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  );
}

interface CardDetailProps {
  label: string;
  value: string | number;
  className?: string;
}

export function GradientCardDetail({
  label,
  value,
  className,
}: CardDetailProps) {
  return (
    <div className={cn("text-black", className)}>
      <span className="font-medium">{label}: </span>
      <span className="text-black/80">{value}</span>
    </div>
  );
}

interface CardSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function GradientCardSection({ children, className }: CardSectionProps) {
  return <div className={cn("space-y-1.5", className)}>{children}</div>;
}
