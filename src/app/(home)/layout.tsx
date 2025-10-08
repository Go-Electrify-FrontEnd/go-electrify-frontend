import { StickyBanner } from "@/components/ui/sticky-banner";

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main>{children}</main>;
}
