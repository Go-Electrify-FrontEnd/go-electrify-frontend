import { StickyBanner } from "@/components/ui/sticky-banner";

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <StickyBanner className="z-50 bg-gradient-to-b from-blue-500 to-blue-600">
        This is demo project, please don't use it
      </StickyBanner>
      {children}
    </main>
  );
}
