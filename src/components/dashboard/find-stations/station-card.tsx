"use client";

import { StationWithDistance } from "@/app/dashboard/find-stations/page";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Phone, Zap } from "lucide-react";

interface StationCardProps {
  station: StationWithDistance;
  index: number;
}

export function StationCard({ station }: StationCardProps) {
  const getStationTypeInfo = (type: string) => {
    switch (type) {
      case "super_fast":
        return {
          label: "Siêu Nhanh",
          icon: "⚡",
        };
      case "fast":
        return {
          label: "Nhanh",
          icon: "🔋",
        };
      case "normal":
        return {
          label: "Thường",
          icon: "🔌",
        };
      default:
        return {
          label: "Không xác định",
          icon: "❓",
        };
    }
  };

  const openInMaps = (coordinates: [number, number], name: string) => {
    const [lng, lat] = coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(
      name,
    )}`;
    window.open(url, "_blank");
  };

  const typeInfo = getStationTypeInfo(station.type);

  return (
    <div className="border-border/30 hover:border-border/60 bg-card/50 rounded-lg border p-4 transition-colors">
      <div className="mb-3 flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-medium">{station.name}</h4>
          <div className="mt-1 flex items-center gap-2">
            <span className="bg-primary/10 text-primary rounded-md px-2 py-1 text-xs">
              {typeInfo.icon} {typeInfo.label}
            </span>
            <div
              className={`h-2 w-2 rounded-full ${
                station.available ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
          </div>
        </div>
      </div>

      <div className="text-muted-foreground mb-3 space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{station.address}</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="h-3 w-3 flex-shrink-0" />
          <span>
            {station.available_connectors}/{station.total_connectors} cổng
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="h-8 flex-1 text-xs"
          onClick={() => openInMaps(station.coordinates, station.name)}
          disabled={!station.available}
        >
          <Navigation className="mr-1 h-3 w-3" />
          Chỉ đường
        </Button>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <Phone className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
