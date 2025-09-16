import { NearestStationsList } from "@/components/dashboard/find-stations/nearest-stations-list";
import { StationMap } from "@/components/dashboard/find-stations/station-map";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getBackendUrl } from "@/lib/utils";
import { Filter, MapPin, RotateCcw, Search } from "lucide-react";

export interface StationWithDistance {
  id: number;
  name: string;
  coordinates: [number, number];
  type: string;
  address: string;
  available: boolean;
  available_connectors: number;
  total_connectors: number;
  distance?: number;
}

export default async function FindStationsPage() {
  const response = await fetch(getBackendUrl("api/stations"));
  const chargingStations: StationWithDistance[] = await response.json();

  return (
    <div>
      <div className="border-b">
        <div className="py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-foreground text-2xl font-bold sm:text-3xl">
                  Tìm Điểm Sạc
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Danh sách các trạm sạc khả dụng
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  placeholder="Tìm kiếm trạm..."
                  className="bg-muted/50 h-9 w-64 pl-10"
                />
              </div>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto py-6">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
          <div className="xl:col-span-3">
            <div className="mb-4 flex h-[30px] items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="text-muted-foreground h-4 w-4" />
                <span className="text-sm font-medium">Bản đồ</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>Khả dụng</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                  <span>Bận</span>
                </div>
              </div>
            </div>
            <div className="h-[65vh] overflow-hidden rounded-xl border">
              <StationMap stations={chargingStations} />
            </div>
          </div>

          <div className="xl:col-span-1">
            <div className="mb-4 flex h-[30px] items-center justify-between"></div>
            <div className="h-[65vh] overflow-y-auto">
              <NearestStationsList
                stations={chargingStations}
                location={null}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
