"use client";

import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { Station } from "@/types/station";

interface StationMapProps {
  stations: Station[];
  onUserLocationUpdate?: (coordinates: [number, number]) => void;
}

export function StationMap({
  stations,
  onUserLocationUpdate,
}: StationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_BOXMAP_API || "";

    if (!mapboxgl.supported()) {
      alert("Your browser does not support Mapbox GL");
    } else {
      if (mapContainerRef.current && !mapRef.current) {
        const map = new mapboxgl.Map({
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

        stations!.forEach((station) => {
          const markerColor =
            station.status == "active" ? "#10B981" : "#EF4444";

          new mapboxgl.Marker({ color: markerColor })
            .setLngLat([station.longitude, station.latitude]) // [longitude, latitude]
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-2">
              <h3 class="font-bold text-sm mb-2 text-black">${station.name}</h3>
              <p class="text-xs mb-1 text-black">Địa Chỉ: ${station.address}</p>
              <p class="text-xs mb-1" style="color: ${
                station.status == "active" ? "#10B981" : "#EF4444"
              }">
                ${station.status == "active" ? "✅ Khả dụng" : "❌ Không khả dụng"}
              </p>
            </div>
          `),
            )
            .addTo(map);
        });

        const geolocateControl = new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
          showUserLocation: true,
          showUserHeading: true,
          showAccuracyCircle: true,
        });

        geolocateControl.on("geolocate", (e) => {
          const location = e.target._lastKnownPosition;
          if (location) {
            const coords: [number, number] = [
              location.coords.longitude,
              location.coords.latitude,
            ];
            setUserLocation(coords);
            if (onUserLocationUpdate) {
              onUserLocationUpdate(coords);
            }
          }
        });

        map.addControl(geolocateControl);
        map.addControl(new mapboxgl.FullscreenControl());

        mapRef.current = map;
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
