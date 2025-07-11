"use client";
import mapboxgl from "mapbox-gl";
import { useRef, useEffect, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { Maximize2 } from "lucide-react";
import { MapModal } from "./map-modal";

interface ListingMinimapProps {
  address?: string | null;
  longitude?: number | null;
  latitude?: number | null;
  classname?: string;
  showPlaceholder?: boolean;
  interactive?: boolean;
  exploreMode?: boolean;
  showExpandButton?: boolean;
  onLocationChange?: (location: {
    longitude: number;
    latitude: number;
    address?: string;
  }) => void;
}

export const ListingMinimap = (props: ListingMinimapProps) => {
  const {
    address,
    longitude,
    latitude,
    classname,
    showPlaceholder = true,
    interactive = false,
    showExpandButton = false,
    exploreMode = false, // Default to false for backward compatibility
    onLocationChange,
  } = props;
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Default fallback coordinates (Philippines center)
  const defaultLat = 14.5995;
  const defaultLng = 120.9842;
  const defaultAddress = "Location not specified";

  // Use provided coordinates or fallback to defaults
  const mapLat = latitude ?? defaultLat;
  const mapLng = longitude ?? defaultLng;
  const displayAddress = address || defaultAddress;

  // Check if we have valid coordinates
  const hasValidCoordinates =
    typeof longitude === "number" &&
    typeof latitude === "number" &&
    !isNaN(longitude) &&
    !isNaN(latitude);

  // Determine if map should be interactive (either full interactive or explore mode)
  const isMapInteractive = interactive || exploreMode;
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
      return;
    }

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    if (map.current) return;

    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [mapLng, mapLat],
        zoom: hasValidCoordinates ? 14 : 6,
        interactive: isMapInteractive,
        attributionControl: false,
      });

      // Only add marker if we have valid coordinates
      if (hasValidCoordinates) {
        marker.current = new mapboxgl.Marker({
          color: "#ef4444",
          draggable: interactive && !exploreMode, // Make marker draggable only if interactive
        })
          .setLngLat([mapLng, mapLat])
          .addTo(map.current);

        // Handle marker drag events for interactive mode only not explore
        if (interactive && !exploreMode && onLocationChange) {
          marker.current.on("dragend", () => {
            if (marker.current) {
              const lngLat = marker.current.getLngLat();
              onLocationChange({
                longitude: lngLat.lng,
                latitude: lngLat.lat,
              });
            }
          });
        }
      }

      // Handle map clicks for interactive mode
      if (interactive && !exploreMode && onLocationChange) {
        map.current.on("click", (e) => {
          const { lng, lat } = e.lngLat;

          // Remove existing marker
          if (marker.current) {
            marker.current.remove();
          }

          // Add new marker at clicked location
          marker.current = new mapboxgl.Marker({
            color: "#ef4444",
            draggable: true,
          })
            .setLngLat([lng, lat])
            .addTo(map.current!);

          // Handle drag events for new marker
          marker.current.on("dragend", () => {
            if (marker.current) {
              const lngLat = marker.current.getLngLat();
              onLocationChange({
                longitude: lngLat.lng,
                latitude: lngLat.lat,
              });
            }
          });

          onLocationChange({
            longitude: lng,
            latitude: lat,
          });
        });
      }
    }

    // Cleanup function
    return () => {
      if (marker.current) {
        marker.current.remove();
        marker.current = null;
      }
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [
    mapLng,
    mapLat,
    hasValidCoordinates,
    interactive,
    onLocationChange,
    exploreMode,
    isMapInteractive,
  ]);

  // Show loading state if coordinates are being processed
  if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
    return (
      <div className={`relative ${classname}`}>
        <div className="w-full h-64 rounded-lg border border-gray-200 shadow-sm bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-sm font-medium">Map Unavailable</div>
            <div className="text-xs mt-1">Mapbox token not configured</div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className={`relative ${classname}`}>
        <div
          className={`w-full h-64 rounded-lg border border-gray-200 shadow-sm ${
            interactive ? "cursor-crosshair" : ""
          }`}
          ref={mapContainer}
        />

        {/* Expand button */}
        {showExpandButton && (
          <button
            onClick={() => setShowModal(true)}
            className="absolute top-2 right-2 bg-white/90 hover:bg-white backdrop-blur-sm p-2 rounded-lg shadow-sm transition-colors cursor-pointer"
            title="Expand map"
          >
            <Maximize2 className="h-4 w-4 text-gray-700" />
          </button>
        )}

        {/* Address overlay */}
        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs text-gray-700 max-w-[calc(100%-1rem)]">
          <div className="truncate font-medium">{displayAddress}</div>
        </div>

        {/* Interactive indicator */}
        {interactive && (
          <div className="absolute top-2 left-2 bg-blue-100/90 backdrop-blur-sm px-2 py-1 rounded text-xs text-blue-800">
            <div className="font-medium">📍 Click to set location</div>
          </div>
        )}

        {/* Placeholder indicator */}
        {!hasValidCoordinates && showPlaceholder && !interactive && (
          <div className="absolute top-2 left-2 bg-yellow-100/90 backdrop-blur-sm px-2 py-1 rounded text-xs text-yellow-800">
            <div className="font-medium">📍 Placeholder Location</div>
          </div>
        )}

        {/* No coordinates indicator */}
        {!hasValidCoordinates && !showPlaceholder && !interactive && (
          <div className="absolute inset-0 bg-gray-50/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-sm font-medium">No Location Set</div>
              <div className="text-xs mt-1">Add coordinates to show map</div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <MapModal
          address={displayAddress}
          longitude={mapLng}
          latitude={mapLat}
          onClose={() => setShowModal(false)}
          onLocationChange={onLocationChange}
          interactive={interactive}
          exploreMode={true}
        />
      )}
    </>
  );
};
