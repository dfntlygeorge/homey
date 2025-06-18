export interface AddressSuggestion {
  mapbox_id: string;
  name: string;
  name_preferred?: string;
  feature_type: string;
  address?: string;
  full_address?: string;
  place_formatted?: string;
  poi_category?: string[];
}

export interface SearchBoxSuggestResponse {
  suggestions: SearchBoxSuggestion[];
  attribution: string;
}

export interface SearchBoxSuggestion {
  name: string;
  name_preferred?: string;
  mapbox_id: string;
  feature_type: string;
  address?: string;
  full_address?: string;
  place_formatted?: string;
  poi_category?: string[];
  context?: {
    country?: { name: string; country_code: string };
    region?: { name: string; region_code: string };
    place?: { name: string };
  };
}

export interface AddressAutocompleteProps {
  value: string | undefined;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onSelect?: (suggestion: AddressSuggestion) => void; // New callback for when user selects
  placeholder?: string;
  className?: string;
  includeAddresses?: boolean; // Allow filtering by feature types
  includePois?: boolean;
}

export interface LocationDetails {
  address: string;
  longitude: number;
  latitude: number;
}
