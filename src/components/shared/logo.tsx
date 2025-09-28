import { cn } from "@/lib/utils";
import { ZapIcon } from "lucide-react";
import { Comfortaa } from "next/font/google";
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
        "flex items-center align-middle font-bold text-foreground"
      )}
    >
      <ZapIcon className="mr-2" />
      Electrify
    </Link>
  );
}
