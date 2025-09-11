import { cn } from "@/lib/utils";
import { Comfortaa } from "next/font/google";
import Link from "next/link";

const comfortaa = Comfortaa({
  subsets: ["latin"],
  variable: "--font-comfortaa",
});

interface AppLogoProps {
  className?: string;
}

export default async function AppLogo(props: AppLogoProps) {
  return (
    <Link
      href="/"
      prefetch={false}
      className={cn({ [comfortaa.className]: true }, props.className)}
    >
      Electrify
    </Link>
  );
}
