"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { MapPin, Loader2 } from "lucide-react";
import { LocationDetails } from "./location-contact";

interface LocationPickerProps {
  onAddressChange: (props: LocationDetails) => void;
  defaultAddress?: string;
}

export const LocationPicker = ({
  onAddressChange,
  defaultAddress,
}: LocationPickerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const address = await reverseGeocode(latitude, longitude);
          onAddressChange({ address, latitude, longitude });
        } catch (err) {
          setError("Failed to get address from coordinates.");
          console.error("Geocoding error:", err);
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        setError(
          "Failed to get your location. Please enable location services."
        );
        console.error("Geolocation error:", error);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    if (!accessToken) {
      throw new Error("Mapbox access token is not configured");
    }

    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${accessToken}&types=address`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch address");
    }

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      return data.features[0].place_name;
    } else {
      throw new Error("No address found for this location");
    }
  };

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        onClick={getCurrentLocation}
        disabled={isLoading}
        className="w-full flex items-center gap-2"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <MapPin className="h-4 w-4" />
        )}
        {isLoading ? "Getting your location..." : "Use My Current Location"}
      </Button>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 p-2 rounded-md">{error}</p>
      )}

      {defaultAddress && (
        <p className="text-sm text-gray-600">Current: {defaultAddress}</p>
      )}
    </div>
  );
};
