import { NearestStationsList } from "@/components/dashboard/stations-nearby/stations-nearby-list";
import { StationMap } from "@/components/dashboard/stations-nearby/stations-map";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Filter, MapPin, RotateCcw, Search } from "lucide-react";
import { Station } from "@/types/station";
import { getStations } from "../admin/stations/page";
import SectionHeader from "@/components/dashboard/shared/section-header";

export default async function FindStationsPage() {
  const chargingStations: Station[] = await getStations();

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <SectionHeader title="Tìm trạm sạc" subtitle="Tìm trạm sạc gần bạn">
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Tìm kiếm trạm..."
              className="bg-muted/50 h-9 w-full pl-10 sm:w-64"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SectionHeader>

      {/* Map and Station List Section */}
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
            <StationMap stations={chargingStations} />
          </div>
        </div>

        {/* Station List Section */}
        <div className="xl:col-span-3">
          <div className="mt-9 h-[65vh] overflow-y-auto">
            <NearestStationsList stations={chargingStations} location={null} />
          </div>
        </div>
      </div>
    </div>
  );
}
