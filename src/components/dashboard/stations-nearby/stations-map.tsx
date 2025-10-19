"use client";

import { useEffect, useRef } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { useStationsNearby } from "@/contexts/stations-nearby-context";

export function StationMap() {
  const { stations, updateUserLocation } = useStationsNearby();
  const updateUserLocationRef = useRef(updateUserLocation);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const geolocateHandlerRef = useRef<((e: any) => void) | null>(null);
  const geolocateControlRef = useRef<mapboxgl.GeolocateControl | null>(null);

  useEffect(() => {
    updateUserLocationRef.current = updateUserLocation;
  }, [updateUserLocation]);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_BOXMAP_API || "";

    if (!mapboxgl.supported()) {
      alert("Your browser does not support Mapbox GL");
      return;
    }

    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

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

    // geolocation control — keep references for cleanup
    const geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserLocation: true,
      showUserHeading: true,
      showAccuracyCircle: true,
    });

    const handler = (e: any) => {
      const location = e?.target?._lastKnownPosition || e?.coords || null;
      if (location) {
        const coords: [number, number] = [
          location.coords?.longitude ?? location.longitude,
          location.coords?.latitude ?? location.latitude,
        ];
        updateUserLocationRef.current(coords);
      }
    };

    geolocateHandlerRef.current = handler;
    geolocateControl.on("geolocate", handler);
    geolocateControlRef.current = geolocateControl;

    map.addControl(geolocateControl);
    map.addControl(new mapboxgl.FullscreenControl());

    mapRef.current = map;

    return () => {
      // Remove any markers we created and destroy the map instance.
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      if (geolocateControlRef.current && geolocateHandlerRef.current) {
        // detach the event listener if mapbox exposes off
        try {
          // typings may not expose `off`, but it's available on Evented
          (geolocateControlRef.current as any).off?.(
            "geolocate",
            geolocateHandlerRef.current,
          );
        } catch {
          /* ignore */
        }
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers when the station list changes (add/remove markers without recreating the map).
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // clean up old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    stations.forEach((station) => {
      const markerColor = station.status === "ACTIVE" ? "#10B981" : "#EF4444";

      const marker = new mapboxgl.Marker({ color: markerColor })
        .setLngLat([station.longitude, station.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-2">
              <h3 class="font-bold text-sm mb-2 text-black">${station.name}</h3>
              <p class="text-xs mb-1 text-black">Địa Chỉ: ${station.address}</p>
                <p class="text-xs mb-1" style="color: ${station.status === "ACTIVE" ? "#10B981" : "#EF4444"}">
                ${station.status === "ACTIVE" ? "✅ Khả dụng" : "❌ Không khả dụng"}
              </p>
            </div>
          `),
        )
        .addTo(map);

      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
    };
  }, [stations]);
  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg">
      <div className="h-full w-full" ref={mapContainerRef} />
    </div>
  );
}
