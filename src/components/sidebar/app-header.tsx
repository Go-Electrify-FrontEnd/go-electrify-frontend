import { SidebarTrigger } from "@/components/ui/sidebar";

export function AppHeader() {
  return (
    <header className="flex h-12 w-full shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="mx-auto flex w-full items-center gap-1 px-4 pt-5 lg:gap-2 lg:px-6">
        <SidebarTrigger />
      </div>
    </header>
  );
}
