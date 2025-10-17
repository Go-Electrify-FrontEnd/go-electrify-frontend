"use client";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import type { Station } from "@/lib/zod/station/station.types";
import { MapPin, Navigation, Phone, Zap } from "lucide-react";
import Link from "next/link";

interface StationCardProps {
  station: Station;
  index: number;
}

export function StationCard({ station }: StationCardProps) {
  // coordinates expected as [latitude, longitude]
  const generateURL = (coordinates: [number, number], name: string) => {
    const [lat, lng] = coordinates;
    // Use Google Maps Search URL with query=lat,lng (example: ?api=1&query=47.5951518,-122.3316393)
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${lat},${lng}`,
    )}`;
  };

  return (
    <div className="rounded-lg transition-colors">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h4 className="line-clamp-2 text-sm leading-tight font-medium break-words">
            {station.name}
          </h4>
          <div className="mt-1.5 flex items-center gap-2">
            <Badge variant="default" className="capitalize">
              {station.status}
            </Badge>
            <div
              className={`h-2 w-2 flex-shrink-0 rounded-full ${
                station.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"
              }`}
            />
          </div>
        </div>
      </div>

      <div className="text-muted-foreground mb-3 space-y-1.5 text-xs">
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-3 w-3 flex-shrink-0" />
          <span className="line-clamp-2 break-words">{station.address}</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="h-3 w-3 flex-shrink-0" />
          <span>4/10 cổng</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Link
          prefetch={false}
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className: "h-8 min-w-0 flex-1 text-xs",
          })}
          href={generateURL(
            [station.latitude, station.longitude],
            station.name,
          )}
          target="_blank"
        >
          <Navigation className="mr-1 h-3 w-3 flex-shrink-0" />
          <span className="truncate">Chỉ đường</span>
        </Link>
        <Button variant="ghost" size="sm" className="h-8 flex-shrink-0 px-2">
          <Phone className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
