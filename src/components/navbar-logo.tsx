import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface NavbarLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function NavbarLogo({
  width = 60,
  height = 60,
  className,
}: NavbarLogoProps) {
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
        decoding="async"
      />
      <span className="text-2xl font-bold">Electrify</span>
    </Link>
  );
}
