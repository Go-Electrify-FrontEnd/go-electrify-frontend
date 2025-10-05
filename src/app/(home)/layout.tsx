import NavbarClient from "@/components/home/NavbarClient";

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
