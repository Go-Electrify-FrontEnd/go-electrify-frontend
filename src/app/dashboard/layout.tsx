import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-background flex h-screen flex-col">
      <DashboardHeader />

      <div className="flex min-h-0 flex-1 pt-16">
        <DashboardSidebar />

        <main className="flex-1 overflow-x-hidden overflow-y-auto md:px-12 lg:px-24 xl:px-48">
          <div className="min-h-full p-4 sm:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
