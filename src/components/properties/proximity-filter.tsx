"use client";
import { useState } from "react";
import { MapPin, X } from "lucide-react";
import { cn, generateSessionToken } from "@/lib/utils";
import { AddressAutocomplete } from "../create-listing/address-autocomplete";
import { Select } from "../ui/select";
import { AwaitedPageProps } from "@/config/types";
import { ListingMinimap } from "../shared/minimap";

interface ProximityFilterProps extends AwaitedPageProps {
  onLocationChange: (params: {
    latitude?: string;
    longitude?: string;
    radius?: string;
    address?: string;
  }) => void;
}

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  mapbox_id: string;
}

// Import the AddressSuggestion type (you might need to export it from the autocomplete component)
interface AddressSuggestion {
  mapbox_id: string;
  name: string;
  name_preferred?: string;
  feature_type: string;
  address?: string;
  full_address?: string;
  place_formatted?: string;
  poi_category?: string[];
}

const RADIUS_OPTIONS = [
  { label: "Within 1km", value: "1" },
  { label: "Within 2km", value: "2" },
  { label: "Within 5km", value: "5" },
  { label: "Within 10km", value: "10" },
  { label: "Within 20km", value: "20" },
];

export const ProximityFilter = (props: ProximityFilterProps) => {
  const { searchParams, onLocationChange } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    null
  );
  const [selectedRadius, setSelectedRadius] = useState(
    searchParams?.radius || "10"
  );
  const [addressInput, setAddressInput] = useState("");

  // Check if proximity filter is currently active
  const isProximityActive = searchParams?.latitude && searchParams?.longitude;
  const currentAddress = searchParams?.address || "";
  const currentRadius = searchParams?.radius || "10";

  // Function to get coordinates from mapbox_id using the retrieve endpoint
  const getCoordinatesFromMapboxId = async (
    mapbox_id: string
  ): Promise<{ latitude: number; longitude: number } | null> => {
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    if (!accessToken) {
      console.error("Mapbox access token is not configured");
      return null;
    }

    try {
      const response = await fetch(
        `https://api.mapbox.com/search/searchbox/v1/retrieve/${mapbox_id}?session_token=${generateSessionToken()}&access_token=${accessToken}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // The retrieve endpoint returns coordinates in the geometry field
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        if (feature.geometry && feature.geometry.coordinates) {
          const [longitude, latitude] = feature.geometry.coordinates;
          return { latitude, longitude };
        }
      }

      return null;
    } catch (error) {
      console.error("Error retrieving coordinates:", error);
      return null;
    }
  };

  // Handle selection from the AddressAutocomplete component
  const handleLocationSelect = async (suggestion: AddressSuggestion) => {
    try {
      // Get coordinates using the retrieve endpoint
      const coordinates = await getCoordinatesFromMapboxId(
        suggestion.mapbox_id
      );

      if (coordinates) {
        const displayAddress = suggestion.full_address || suggestion.name;

        setSelectedLocation({
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          address: displayAddress,
          mapbox_id: suggestion.mapbox_id,
        });
      } else {
        console.error("Could not retrieve coordinates for selected location");
      }
    } catch (error) {
      console.error("Error processing location selection:", error);
    }
  };

  const handleApplyFilter = () => {
    if (selectedLocation) {
      onLocationChange({
        latitude: selectedLocation.latitude.toString(),
        longitude: selectedLocation.longitude.toString(),
        radius: selectedRadius as string,
        address: selectedLocation.address,
      });
    }
    setIsModalOpen(false);
  };

  const handleClearFilter = () => {
    onLocationChange({
      latitude: undefined,
      longitude: undefined,
      radius: undefined,
      address: undefined,
    });
    setSelectedLocation(null);
    setAddressInput("");
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedLocation(null);
    setAddressInput("");
    setSelectedRadius("10");
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Location</label>

      {isProximityActive ? (
        // Active proximity filter display
        <div className="relative">
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <MapPin className="h-4 w-4 text-blue-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-blue-900 truncate">
                Within {currentRadius}km of
              </div>
              <div className="text-xs text-blue-700 truncate">
                {currentAddress}
              </div>
            </div>
            <button
              onClick={handleClearFilter}
              className="p-1 hover:bg-blue-100 rounded-full transition-colors"
              title="Clear location filter"
            >
              <X className="h-4 w-4 text-blue-600" />
            </button>
          </div>
        </div>
      ) : (
        // Inactive state - button to open modal
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center gap-2 p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-left"
        >
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">Search by location...</span>
        </button>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Filter by Location</h3>
                <button
                  onClick={handleModalClose}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Address Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Location
                  </label>
                  <AddressAutocomplete
                    value={addressInput}
                    onChange={setAddressInput}
                    onSelect={handleLocationSelect}
                    placeholder="Enter address or search for places..."
                    className="w-full"
                    includeAddresses={true}
                    includePois={true}
                  />
                </div>

                {/* Radius Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Radius
                  </label>
                  <Select
                    name="radius"
                    value={selectedRadius as string}
                    onChange={(e) => setSelectedRadius(e.target.value)}
                    options={RADIUS_OPTIONS}
                    className="w-full"
                  />
                </div>

                {/* Location Preview */}
                {selectedLocation && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Selected Location
                    </label>

                    {/* Static Map Preview */}
                    <div className="w-full h-32 bg-gray-100 rounded-md overflow-hidden">
                      <ListingMinimap
                        address={selectedLocation.address}
                        latitude={selectedLocation.latitude}
                        longitude={selectedLocation.longitude}
                        exploreMode={true}
                      />
                    </div>

                    {/* Location Details */}
                    <div className="text-xs text-gray-600 p-3 bg-gray-50 rounded-md">
                      <div className="font-medium text-gray-900 mb-1">
                        Selected Location:
                      </div>
                      <div className="truncate mb-2">
                        {selectedLocation.address}
                      </div>
                      <div className="flex gap-4 text-xs">
                        <span>Lat: {selectedLocation.latitude.toFixed(6)}</span>
                        <span>
                          Lng: {selectedLocation.longitude.toFixed(6)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleModalClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyFilter}
                  disabled={!selectedLocation}
                  className={cn(
                    "flex-1 px-4 py-2 rounded-md transition-colors",
                    selectedLocation
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  )}
                >
                  Apply Filter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
