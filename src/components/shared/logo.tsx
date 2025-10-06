import { cn } from "@/lib/utils";
import { ZapIcon } from "lucide-react";
import { Comfortaa } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const comfortaa = Comfortaa({
  subsets: ["latin"],
  variable: "--font-comfortaa",
});

interface AppLogoProps {
  className?: string;
}

export default function AppLogo(props: AppLogoProps) {
  return (
    <Link
      href="/"
      prefetch={false}
      className={cn(
        { [comfortaa.className]: true },
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
      <span className="text-2xl font-bold tracking-widest">Electrify</span>
    </Link>
  );
}
