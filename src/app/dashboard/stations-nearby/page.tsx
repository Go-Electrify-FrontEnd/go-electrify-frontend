import { NearestStationsList } from "@/components/dashboard/stations-nearby/nearest-stations-list";
import { StationMap } from "@/components/dashboard/stations-nearby/station-map";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getBackendUrl } from "@/lib/utils";
import { Filter, MapPin, RotateCcw, Search } from "lucide-react";
import { Station } from "@/types/station";

export default async function FindStationsPage() {
  const response = await fetch(getBackendUrl("api/stations"));
  const chargingStations: Station[] = await response.json();

  return (
    <div className="container mx-auto mt-4 space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader className="pt-8 pb-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-5">
                <div className="bg-primary ring-primary/10 flex h-16 w-16 items-center justify-center rounded-2xl shadow-xl ring-4">
                  <MapPin className="text-primary-foreground h-8 w-8" />
                </div>
                <div className="space-y-1.5">
                  <CardTitle className="text-foreground text-4xl font-semibold">
                    Tìm Điểm Sạc
                  </CardTitle>
                  <CardDescription className="text-muted-foreground/90 text-base font-medium">
                    Danh sách các trạm sạc khả dụng
                  </CardDescription>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative order-2 sm:order-1">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  placeholder="Tìm kiếm trạm..."
                  className="bg-muted/50 h-9 w-full pl-10 sm:w-64"
                />
              </div>
              <div className="order-1 flex items-center gap-2 sm:order-2">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Map and Station List Section */}
      <div className="mt-4 grid grid-cols-1 gap-6 xl:grid-cols-10">
        {/* Map Section */}
        <div className="xl:col-span-7">
          <div className="mb-4 flex items-center justify-between">
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
