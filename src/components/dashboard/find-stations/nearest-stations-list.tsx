"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Navigation,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  Phone,
  Star,
} from "lucide-react";
import { StationWithDistance } from "@/app/dashboard/find-stations/page";

interface NearestStationsListProps {
  stations: StationWithDistance[];
  userLocation: [number, number] | null;
}

export function NearestStationsList({
  stations,
  userLocation,
}: NearestStationsListProps) {
  const getStationTypeInfo = (type: string) => {
    switch (type) {
      case "super_fast":
        return {
          label: "Siêu Nhanh",
          color: "bg-purple-100 text-purple-800",
          icon: "⚡",
        };
      case "fast":
        return {
          label: "Nhanh",
          color: "bg-blue-100 text-blue-800",
          icon: "🔋",
        };
      case "normal":
        return {
          label: "Thường",
          color: "bg-gray-100 text-gray-800",
          icon: "🔌",
        };
      default:
        return {
          label: "Không xác định",
          color: "bg-gray-100 text-gray-800",
          icon: "❓",
        };
    }
  };

  const openInMaps = (coordinates: [number, number], name: string) => {
    const [lng, lat] = coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(
      name
    )}`;
    window.open(url, "_blank");
  };

  if (!userLocation) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Trạm Sạc Gần Nhất
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Navigation className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-foreground mb-2">
              Đang xác định vị trí
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Vui lòng cho phép truy cập vị trí để hiển thị các trạm sạc gần bạn
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (stations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Trạm Sạc Gần Nhất
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Zap className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-foreground mb-2">
              Không tìm thấy trạm sạc
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Không có trạm sạc nào trong khu vực này. Hãy thử tìm kiếm ở khu
              vực khác.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Trạm Sạc Gần Nhất
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Tìm thấy {stations.length} trạm sạc gần bạn
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stations.map((station, index) => {
            const typeInfo = getStationTypeInfo(station.type);

            return (
              <Card
                key={station.id}
                className="relative hover:shadow-lg transition-all duration-200"
              >
                {index < 3 && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Gần nhất
                  </div>
                )}

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">
                        {station.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={typeInfo.color}>
                          {typeInfo.icon} {typeInfo.label}
                        </Badge>
                        <Badge
                          variant={
                            station.available ? "default" : "destructive"
                          }
                        >
                          {station.available ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" /> Khả dụng
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1" /> Bận
                            </>
                          )}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {station.distance !== undefined && (
                      <div className="flex items-center gap-2 text-sm">
                        <Navigation className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {station.distance.toFixed(2)} km
                        </span>
                        <span className="text-muted-foreground">
                          (~{Math.round(station.distance * 2)} phút đi bộ)
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {station.coordinates[1].toFixed(4)},{" "}
                        {station.coordinates[0].toFixed(4)}
                      </span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() =>
                          openInMaps(station.coordinates, station.name)
                        }
                        disabled={!station.available}
                      >
                        <Navigation className="mr-2 h-4 w-4" />
                        Chỉ đường
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="mr-2 h-4 w-4" />
                        Gọi
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
