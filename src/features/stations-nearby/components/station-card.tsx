"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useStationsNearby } from "@/contexts/stations-nearby-context";
import type { Station } from "@/features/stations/schemas/station.types";
import { calculateDistance } from "@/lib/utils";
import { Heart, MapPin, Navigation } from "lucide-react";
import Link from "next/link";
import { memo, useEffect, useState, startTransition } from "react";

interface StationCardProps {
  station: Station;
  index: number;
}

export const StationCard = memo(function StationCard({
  station,
}: StationCardProps) {
  const { userLocation } = useStationsNearby();
  const [distance, setDistance] = useState<string>("N/A");

  const generateURL = (coordinates: [number, number], name: string) => {
    const [lat, lng] = coordinates;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${lat},${lng}`,
    )}`;
  };

  // Calculate and format distance based on user location asynchronously
  useEffect(() => {
    let isCancelled = false;

    const calculateDistanceAsync = async () => {
      if (!userLocation) {
        setDistance("N/A");
        return;
      }

      if (isCancelled) return;

      try {
        // Now calculateDistance is async
        const distanceKm = await calculateDistance(userLocation, [
          station.longitude,
          station.latitude,
        ]);

        if (isCancelled) return;

        const formattedDistance =
          distanceKm < 1
            ? `${Math.round(distanceKm * 1000)} m`
            : `${distanceKm.toFixed(1)} km`;

        startTransition(() => {
          setDistance(formattedDistance);
        });
      } catch (error) {
        console.error("Error calculating distance:", error);
        if (!isCancelled) {
          setDistance("N/A");
        }
      }
    };

    calculateDistanceAsync();

    return () => {
      isCancelled = true;
    };
  }, [userLocation, station.latitude, station.longitude]);
  return (
    <Card className="border-border bg-background transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        {/* Header: Station name and favorite button */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="text-base leading-tight font-semibold">
            {station.name}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground h-8 w-8 flex-shrink-0"
          >
            <Heart className="h-5 w-5" />
          </Button>
        </div>

        {/* Address */}
        <div className="text-muted-foreground mb-4 flex items-start gap-2 text-sm">
          <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span className="line-clamp-2 break-words">{station.address}</span>
        </div>

        {/* Footer: Distance badge and directions button */}
        <div className="flex items-center justify-between gap-3">
          <Badge
            variant="secondary"
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium"
          >
            <MapPin className="h-3.5 w-3.5" />
            {distance}
          </Badge>

          <Link
            prefetch={false}
            href={generateURL(
              [station.latitude, station.longitude],
              station.name,
            )}
            target="_blank"
          >
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-xs font-medium uppercase"
            >
              <Navigation className="h-4 w-4" />
              Chỉ đường
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
});
