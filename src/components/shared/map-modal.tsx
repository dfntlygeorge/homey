import { ListingMinimap } from "./minimap";

interface MapModalProps {
  address: string;
  longitude: number;
  latitude: number;
  onClose: () => void;
  onLocationChange?: (location: {
    longitude: number;
    latitude: number;
    address?: string;
  }) => void;
  interactive?: boolean;
  exploreMode?: boolean;
}

export const MapModal = (props: MapModalProps) => {
  const {
    address,
    longitude,
    latitude,
    onClose,
    onLocationChange,
    interactive,
    exploreMode,
  } = props;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Location Map</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-4">
          <ListingMinimap
            address={address}
            longitude={longitude}
            latitude={latitude}
            interactive={interactive}
            exploreMode={exploreMode}
            onLocationChange={onLocationChange}
            classname="h-full"
          />
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t bg-gray-50 rounded-b-lg">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {interactive
                ? "Click on the map or drag the marker to set location"
                : "Location preview"}
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
