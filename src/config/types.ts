import { Prisma } from "@prisma/client";

export type PropertyWithImages = Prisma.ListingGetPayload<{
  include: {
    images: true;
  };
}>;

type Params = {
  [x: string]: string | string[];
};

export type PageProps = {
  params?: Promise<Params>;
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

export type AwaitedPageProps = {
  params?: Awaited<PageProps["params"]>;
  searchParams?: Awaited<PageProps["searchParams"]>;
};

export type FilterOptions<LType, VType> = Array<{ label: LType; value: VType }>; // basically an array of objects where each object has a label and a value.

export interface SidebarProps extends AwaitedPageProps {
  minMaxValues: Prisma.GetListingAggregateType<{
    _min: {
      rent: true;
    };
    _max: {
      rent: true;
    };
  }>;
}

export enum ListingFormStep {
  WELCOME = 1,
  BASIC_INFO = 2,
  LOCATION_CONTACT = 3,
  HOUSE_RULES = 4,
  UPLOAD_PHOTOS = 5,
  REVIEW_SUBMIT = 6,
}

export type PrevState = {
  success: boolean;
  message: string;
};

export interface Favourites {
  ids: number[];
}

export type Region = {
  id: number;
  code: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type Province = {
  id: number;
  code: string;
  name: string;
  region_id: number;
  created_at: string;
  updated_at: string;
};

export type CityMunicipality = {
  id: number;
  code: string;
  name: string;
  zip_code: string;
  district: string;
  type: string;
  region_id: number;
  province_id: number;
  created_at: string;
  updated_at: string;
};

export type Barangay = {
  id: number;
  code: string;
  name: string;
  status: string;
  region_id: number;
  province_id: number;
  city_municipality_id: number;
  created_at: string;
  updated_at: string;
};

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
