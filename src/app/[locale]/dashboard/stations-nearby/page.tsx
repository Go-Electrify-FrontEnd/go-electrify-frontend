import { getTranslations } from "next-intl/server";
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

async function getData() {
  const now = new Date();
  // Mock stations in Ho Chi Minh City (Districts: 1, 3, Phu Nhuan, Binh Thanh, Tan Binh)
  const stations: Station[] = [
    {
      id: 1,
      name: "EV Station — Nguyễn Huệ",
      description: "Trạm sạc công cộng gần phố đi bộ Nguyễn Huệ",
      address: "Nguyễn Huệ, Quận 1, TP. HCM",
      imageUrl: "",
      latitude: 10.7776,
      longitude: 106.7006,
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 2,
      name: "EV Station — Phạm Ngọc Thạch",
      description: "Sạc nhanh tại khu trung tâm Quận 3",
      address: "Phạm Ngọc Thạch, Quận 3, TP. HCM",
      imageUrl: "",
      latitude: 10.7779,
      longitude: 106.6933,
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 3,
      name: "EV Station — Hồng Hà",
      description: "Trạm sạc tại sân bay Tân Sơn Nhất (gần Phú Nhuận)",
      address: "Hồng Hà, Phú Nhuận, TP. HCM",
      imageUrl: "",
      latitude: 10.813,
      longitude: 106.6644,
      status: "maintenance",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 4,
      name: "EV Station — Lê Văn Sỹ",
      description: "Trạm sạc nhỏ phục vụ khu dân cư",
      address: "Lê Văn Sỹ, Phú Nhuận, TP. HCM",
      imageUrl: "",
      latitude: 10.7901,
      longitude: 106.6761,
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 5,
      name: "EV Station — Bình Thạnh Plaza",
      description: "Sạc tại trung tâm thương mại Bình Thạnh",
      address: "Bình Quới, Bình Thạnh, TP. HCM",
      imageUrl: "",
      latitude: 10.8038,
      longitude: 106.7135,
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 6,
      name: "EV Station — Cộng Hòa",
      description: "Trạm sạc dọc tuyến Cộng Hòa, Tân Bình",
      address: "Cộng Hòa, Tân Bình, TP. HCM",
      imageUrl: "",
      latitude: 10.7893,
      longitude: 106.6494,
      status: "inactive",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 7,
      name: "EV Station — Pasteur Parking",
      description: "Bãi đỗ xe có trạm sạc, Quận 1",
      address: "Pasteur, Quận 1, TP. HCM",
      imageUrl: "",
      latitude: 10.7772,
      longitude: 106.7036,
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 8,
      name: "EV Station — Saigon Centre",
      description: "Sạc nhanh tại Saigon Centre Tower",
      address: "Lê Lợi, Quận 1, TP. HCM",
      imageUrl: "",
      latitude: 10.7769,
      longitude: 106.7035,
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
  ];

  return stations;
}

// Server Component demonstrating async translations with getTranslations
export default async function FindStationsPage() {
  const chargingStations: Station[] = await getData();
  const t = await getTranslations("stations");

  return (
    <div className="container mx-auto space-y-6">
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
                    {t("title")}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground/90 text-base font-medium">
                    {t("subtitle")}
                  </CardDescription>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative order-2 sm:order-1">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  placeholder={t("searchPlaceholder")}
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
              <span className="text-sm font-medium">{t("map")}</span>
            </div>
            <div className="text-muted-foreground flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>{t("available")}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                <span>{t("busy")}</span>
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
