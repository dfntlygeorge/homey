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
