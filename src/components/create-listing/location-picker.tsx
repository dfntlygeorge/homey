"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { MapPin, Loader2 } from "lucide-react";
import { LocationDetails } from "@/config/types/autocomplete-address.type";
import { reverseGeocode } from "@/lib/utils";
import { toast } from "sonner";

interface LocationPickerProps {
  onAddressChange: (props: LocationDetails) => void;
  defaultAddress?: string;
}

export const LocationPicker = ({
  onAddressChange,
  defaultAddress,
}: LocationPickerProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentLocation = () => {
    setIsLoading(true);

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser.");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const address = await reverseGeocode(latitude, longitude);
          onAddressChange({ address, latitude, longitude });
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
          toast.error("Failed to get address from coordinates.");
        } finally {
          setIsLoading(false);
        }
      },
      () => {
        toast.error(
          "Failed to get your location. Please enable location services."
        );
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
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

      {defaultAddress && (
        <p className="text-sm text-gray-600">Current: {defaultAddress}</p>
      )}
    </div>
  );
};
