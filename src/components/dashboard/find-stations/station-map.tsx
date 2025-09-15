"use client";

import { useEffect, useRef } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";

interface StationMapProps {
  stations?:
    | {
        id: number;
        name: string;
        coordinates: [number, number];
        type: string;
        available: boolean;
      }[]
    | null;
}

export function StationMap({ stations }: StationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_BOXMAP_API || "";

    if (!mapboxgl.supported()) {
      alert("Your browser does not support Mapbox GL");
    } else {
      if (mapContainerRef.current && !mapRef.current) {
        mapRef.current = new mapboxgl.Map({
          container: mapContainerRef.current,
          center: [106.6297, 10.8231],
          zoom: 12,
          attributionControl: false,
          style: "mapbox://styles/mapbox/standard",
          language: "vi",
          cooperativeGestures: true,
          antialias: true,
          fadeDuration: 300,
        });

        mapRef.current.on("load", () => {
          stations!.forEach((station) => {
            const markerColor = station.available ? "#10B981" : "#EF4444";

            new mapboxgl.Marker({ color: markerColor })
              .setLngLat(station.coordinates)
              .setPopup(
                new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-2">
              <h3 class="font-bold text-sm mb-2 text-black">${station.name}</h3>
              <p class="text-xs mb-1 text-black">⚡ Loại: ${station.type}</p>
              <p class="text-xs mb-1" style="color: ${
                station.available ? "#10B981" : "#EF4444"
              }">
                ${station.available ? "✅ Khả dụng" : "❌ Không khả dụng"}
              </p>
            </div>
          `),
              )
              .addTo(mapRef.current!);
          });
        });

        mapRef.current.addControl(
          new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true,
            },
            trackUserLocation: true,
            showUserHeading: true,
          }),
        );

        mapRef.current.addControl(new mapboxgl.FullscreenControl());
      }
    }

    return () => {
      if (mapRef.current) {
        // Clear cache on unmount to free memory
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);
  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg">
      <div className="h-full w-full" ref={mapContainerRef} />
    </div>
  );
}
