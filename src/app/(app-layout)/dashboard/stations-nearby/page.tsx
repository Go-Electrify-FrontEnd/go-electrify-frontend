import { NearestStationsList } from "@/components/dashboard/stations-nearby/stations-nearby-list";
import { StationMap } from "@/components/dashboard/stations-nearby/stations-map";
import { Button } from "@/components/ui/button";
import { Filter, RotateCcw } from "lucide-react";
import type { Station } from "@/lib/zod/station/station.types";
import { getStations } from "../(admin-layout)/admin/stations/page";
import SectionHeader from "@/components/dashboard/shared/section-header";
import SectionContent from "@/components/dashboard/shared/section-content";
import { StationsNearbyProvider } from "@/contexts/stations-nearby-context";
import NearbyStationSearch from "@/components/dashboard/stations-nearby/search-input";

export default async function FindStationsPage() {
  const chargingStations: Station[] = await getStations();

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <StationsNearbyProvider stations={chargingStations}>
        <SectionHeader title="Tìm trạm sạc" subtitle="Tìm trạm sạc gần bạn">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
            <NearbyStationSearch />
          </div>
        </SectionHeader>

        {/* Map and Station List Section */}

        <SectionContent>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-10">
            {/* Map Section */}
            <div className="xl:col-span-7">
              <div className="text-muted-foreground mb-4 flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span>Khả dụng</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span>Bận</span>
                </div>
              </div>
              <div className="h-[65vh] overflow-hidden rounded-xl border">
                <StationMap />
              </div>
            </div>

            {/* Station List Section */}
            <div className="xl:col-span-3">
              <div className="mt-9 h-[65vh] overflow-y-auto">
                <NearestStationsList />
              </div>
            </div>
          </div>
        </SectionContent>
      </StationsNearbyProvider>
    </div>
  );
}
