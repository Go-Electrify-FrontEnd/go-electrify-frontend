import Navbar from "@/components/shared/navbar";

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <div className="w-full">
        <Navbar />
      </div>

      {children}
    </main>
  );
}
