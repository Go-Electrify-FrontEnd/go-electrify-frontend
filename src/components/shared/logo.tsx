import { cn } from "@/lib/utils";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

interface AppLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function AppLogo({
  width = 60,
  height = 60,
  className,
}: AppLogoProps) {
  return (
    <Link
      href="/"
      prefetch={false}
      className={cn(className, "flex items-center align-middle font-bold")}
    >
      <Image
        src="/assets/images/logo01.png"
        alt="Electrify Logo"
        width={width}
        height={height}
        className="object-contain"
      />
      <span className="text-2xl font-bold">Electrify</span>
    </Link>
  );
}
