import { StationMap } from "@/features/stations-nearby/components/stations-map";
import { StationsSidebar } from "@/features/stations-nearby/components/stations-sidebar";
import { StationsNearbyProvider } from "@/contexts/stations-nearby-context";
import { getStations } from "@/features/stations/api/stations-api";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default async function FindStationsPage() {
  const chargingStations = await getStations();

  return (
    <StationsNearbyProvider stations={chargingStations}>
      <div className="relative flex h-[calc(100vh-4rem)] overflow-hidden">
        <div className="flex-1">
          <StationMap />
        </div>

        {/* Desktop Sidebar - Side by side with map (only on xl screens) */}
        <div className="border-border bg-background hidden h-full w-[420px] flex-shrink-0 border-l shadow-lg xl:block">
          <StationsSidebar />
        </div>

        {/* Mobile menu trigger */}
        <div className="absolute right-6 bottom-6 z-50 xl:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="lg" className="shadow-lg">
                <Menu className="mr-2 h-5 w-5" />
                Danh sách trạm
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] p-0 sm:max-w-md">
              <SheetTitle></SheetTitle>
              <StationsSidebar />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </StationsNearbyProvider>
  );
}
