import { Prisma } from "@prisma/client";

export type ListingWithImages = Prisma.ListingGetPayload<{
  include: {
    images: true;
  };
}>;

export type ListingWithImagesAndUser = Prisma.ListingGetPayload<{
  include: {
    images: true;
    user: true;
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
  UPLOAD_IMAGES = 5,
  REVIEW_SUBMIT = 6,
}

export type PrevState = {
  success: boolean;
  message: string;
};

export interface Favourites {
  ids: number[];
}

export interface FilterState {
  search: string;
  status: string;
  dateRange: string;
  sortBy: string;
}

export const DateRangeFilter = {
  TODAY: "TODAY",
  WEEK: "WEEK",
  MONTH: "MONTH",
} as const;

export type DateRangeFilter = keyof typeof DateRangeFilter;
