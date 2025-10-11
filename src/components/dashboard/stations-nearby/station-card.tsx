"use client";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Station } from "@/types/station";
import { MapPin, Navigation, Phone, Zap } from "lucide-react";
import { Link } from "@/i18n/navigation";

interface StationCardProps {
  station: Station;
  index: number;
}

export function StationCard({ station }: StationCardProps) {
  const getStationTypeInfo = (type: string) => {
    switch (type) {
      case "super_fast":
        return {
          label: "Siêu Nhanh",
        };
      case "fast":
        return {
          label: "Nhanh",
        };
      case "normal":
        return {
          label: "Thường",
        };
      default:
        return {
          label: "Không xác định",
        };
    }
  };

  const generateURL = (coordinates: [number, number], name: string) => {
    const [lng, lat] = coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(
      name,
    )}`;
    return url;
  };

  const typeInfo = getStationTypeInfo(station.status);

  return (
    <div className="rounded-lg transition-colors">
      <div className="mb-3 flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-medium">{station.name}</h4>
          <div className="mt-1 flex items-center gap-2">
            <Badge variant="default">{typeInfo.label}</Badge>
            <div
              className={`h-2 w-2 rounded-full ${
                station.status === "active" ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
          </div>
        </div>
      </div>

      <p className="text-muted-foreground mb-3 text-xs">
        <span className="inline-flex items-center gap-2">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{station.address}</span>
        </span>
        <br />
        <span className="inline-flex items-center gap-2">
          <Zap className="h-3 w-3 flex-shrink-0" />
          <span>4/10 cổng</span>
        </span>
      </p>

      <div className="flex gap-2">
        <Link
          prefetch={false}
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className: "h-8 flex-1 text-xs",
          })}
          href={generateURL(
            [station.latitude, station.longitude],
            station.name,
          )}
          target="_blank"
        >
          <Navigation className="mr-1 h-3 w-3" />
          Chỉ đường
        </Link>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <Phone className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
