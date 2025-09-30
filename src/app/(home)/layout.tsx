import NavbarClient from "@/components/home/NavbarClient";
import PurposeWarning from "@/components/shared/purpose-warning";

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <NavbarClient />
      {children}
    </main>
  );
}
