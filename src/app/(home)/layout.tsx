import Navbar from "@/components/shared/navbar";
import PurposeWarning from "@/components/shared/purpose-warning";

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <PurposeWarning />
      <Navbar />
      {children}
    </main>
  );
}
