import { cn } from "@/lib/utils";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

interface AppLogoProps {
  className?: string;
}

export default function AppLogo(props: AppLogoProps) {
  return (
    <Link
      href="/"
      prefetch={false}
      className={cn(
        props.className,
        "flex items-center align-middle font-bold",
      )}
    >
      <Image
        src="/assets/images/logo01.png"
        alt="Electrify Logo"
        width={60}
        height={60}
        className="object-contain"
      />
      <span className="text-2xl font-bold">Electrify</span>
    </Link>
  );
}
