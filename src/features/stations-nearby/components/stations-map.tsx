"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { useStationsNearby } from "@/contexts/stations-nearby-context";
import type { Station } from "@/features/stations/schemas/station.types";

// Constants
const DEFAULT_CENTER: [number, number] = [106.6297, 10.8231]; // Ho Chi Minh City
const DEFAULT_ZOOM = 12;
const POPUP_OFFSET = 25;

// Color scheme for station status
const STATION_COLORS = {
  ACTIVE: "#10B981",
  INACTIVE: "#EF4444",
} as const;

export function StationMap() {
  const router = useRouter();
  const { stations, updateUserLocation, selectedStation } = useStationsNearby();

  // Refs
  const updateUserLocationRef = useRef(updateUserLocation);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const geolocateHandlerRef = useRef<((e: unknown) => void) | null>(null);
  const geolocateControlRef = useRef<mapboxgl.GeolocateControl | null>(null);

  // Sync updateUserLocation ref to avoid stale closures
  useEffect(() => {
    updateUserLocationRef.current = updateUserLocation;
  }, [updateUserLocation]);

  // Handle booking station click - navigates to reservations with station ID
  const handleBookNow = useCallback(
    (stationId: number) => {
      router.push(`/dashboard/reservations?stationId=${stationId}`);
    },
    [router],
  );

  // Create popup content with Book Now button
  const createPopupContent = useCallback(
    (station: Station) => {
      const isActive = station.status === "ACTIVE";
      const statusBadgeColor = isActive ? "#10B981" : "#EF4444";
      const statusBgColor = isActive ? "#ECFDF5" : "#FEF2F2";
      const statusText = isActive ? "Đang hoạt động" : "Không hoạt động";

      return `
        <div style="
          min-width: 280px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        ">
          <!-- Station Name -->
          <div style="
            padding: 16px 16px 12px 16px;
            border-bottom: 1px solid #f1f5f9;
          ">
            <h3 style="
              margin: 0;
              font-size: 16px;
              font-weight: 600;
              color: #0f172a;
              line-height: 1.4;
              margin-bottom: 8px;
            ">${station.name}</h3>

            <!-- Status Badge -->
            <div style="
              display: inline-flex;
              align-items: center;
              gap: 6px;
              padding: 4px 10px;
              border-radius: 12px;
              background-color: ${statusBgColor};
              font-size: 12px;
              font-weight: 500;
            ">
              <span style="
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background-color: ${statusBadgeColor};
                display: inline-block;
              "></span>
              <span style="color: ${statusBadgeColor};">${statusText}</span>
            </div>
          </div>

          <!-- Address Section -->
          <div style="
            padding: 12px 16px;
            border-bottom: 1px solid #f1f5f9;
          ">
            <div style="
              display: flex;
              align-items: flex-start;
              gap: 8px;
            ">
              <svg style="
                width: 16px;
                height: 16px;
                margin-top: 2px;
                flex-shrink: 0;
              " fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <p style="
                margin: 0;
                font-size: 13px;
                color: #64748b;
                line-height: 1.5;
              ">${station.address}</p>
            </div>
          </div>

          <!-- Book Now Button -->
          <div style="padding: 16px;">
            <button
              id="book-now-${station.id}"
              style="
                width: 100%;
                padding: 12px 20px;
                background: linear-gradient(135deg, #10B981 0%, #059669 100%);
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
              "
              onmouseover="
                this.style.transform='translateY(-1px)';
                this.style.boxShadow='0 4px 12px rgba(16, 185, 129, 0.35)';
              "
              onmouseout="
                this.style.transform='translateY(0)';
                this.style.boxShadow='0 2px 8px rgba(16, 185, 129, 0.25)';
              "
              onmousedown="this.style.transform='translateY(0)'"
            >
              <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Đặt Chỗ Ngay
            </button>
          </div>
        </div>
      `;
    },
    [],
  );

  // Initialize map instance
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
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      attributionControl: false,
      style: "mapbox://styles/mapbox/standard",
      language: "vi",
      cooperativeGestures: true,
      antialias: true,
      fadeDuration: 300,
    });

    // Initialize geolocation control
    const geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserLocation: true,
      showUserHeading: true,
      showAccuracyCircle: true,
    });

    // Type-safe geolocate event handler
    type GeolocateListener = Parameters<typeof geolocateControl.on>[1];
    type GeolocateEvent = Parameters<GeolocateListener>[0];

    const handler = (e: GeolocateEvent) => {
      // Normalize geolocation data from different Mapbox versions
      const normalized = (
        e as unknown as {
          target?: { _lastKnownPosition?: GeolocationPosition };
        }
      )?.target
        ? (
            e as unknown as {
              target?: { _lastKnownPosition?: GeolocationPosition };
            }
          ).target?._lastKnownPosition
        : ((e as unknown as { coords?: GeolocationPosition | null }).coords ??
          null);

      if (!normalized) return;

      const { longitude, latitude } = normalized.coords;
      if (typeof longitude === "number" && typeof latitude === "number") {
        updateUserLocationRef.current([longitude, latitude]);
      }
    };

    // Store handler for cleanup
    geolocateHandlerRef.current = handler as unknown as (e: unknown) => void;
    geolocateControl.on("geolocate", handler);
    geolocateControlRef.current = geolocateControl;

    // Add map controls
    map.addControl(geolocateControl);
    map.addControl(new mapboxgl.FullscreenControl());

    mapRef.current = map;

    // Cleanup function
    return () => {
      // Remove all markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      // Detach geolocate event listener
      if (geolocateControlRef.current && geolocateHandlerRef.current) {
        try {
          const maybeEvented = geolocateControlRef.current as unknown as {
            off?: (event: string, handler: (e: GeolocateEvent) => void) => void;
          };
          maybeEvented.off?.(
            "geolocate",
            geolocateHandlerRef.current as (e: GeolocateEvent) => void,
          );
        } catch {
          // Silently ignore if off method is not available
        }
      }

      // Destroy map instance
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Fly to selected station when it changes
  useEffect(() => {
    if (!selectedStation || !mapRef.current) return;

    mapRef.current.flyTo({
      center: [selectedStation.longitude, selectedStation.latitude],
      zoom: 15,
      duration: 1000,
    });
  }, [selectedStation]);

  // Update markers when the station list changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clean up old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Create markers for each station
    stations.forEach((station) => {
      const markerColor =
        station.status === "ACTIVE"
          ? STATION_COLORS.ACTIVE
          : STATION_COLORS.INACTIVE;

      // Create popup with Book Now button
      const popup = new mapboxgl.Popup({
        offset: POPUP_OFFSET,
        className: "station-popup",
        closeButton: true,
        closeOnClick: false,
        maxWidth: "320px",
      }).setHTML(createPopupContent(station));

      // Create and add marker
      const marker = new mapboxgl.Marker({ color: markerColor })
        .setLngLat([station.longitude, station.latitude])
        .setPopup(popup)
        .addTo(map);

      // Attach click listener to Book Now button when popup opens
      popup.on("open", () => {
        const bookButton = document.getElementById(`book-now-${station.id}`);
        if (bookButton) {
          bookButton.onclick = () => {
            handleBookNow(station.id);
          };
        }
      });

      markersRef.current.push(marker);
    });

    // Cleanup function
    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
    };
  }, [stations, createPopupContent, handleBookNow]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="h-full w-full" ref={mapContainerRef} />
    </div>
  );
}
