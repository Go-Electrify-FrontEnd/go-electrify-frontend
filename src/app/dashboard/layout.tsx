import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import Navbar from "@/components/shared/navbar";

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Fixed Header */}
      <DashboardHeader />

      {/* Main Content Area */}
      <div className="flex flex-1 min-h-0">
        {/* Fixed Sidebar */}
        <DashboardSidebar />

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden md:px-20 lg:px-42">
          <div className="p-4 sm:p-6 min-h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
