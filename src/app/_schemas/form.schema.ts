import { ListingFormStep } from "@/config/types";
import { RoomType } from "@prisma/client";
import { z } from "zod";
import {
  CaretakerAvailability,
  CurfewPolicy,
  GenderPolicy,
  PetPolicy,
  KitchenAvailability,
  WifiAvailability,
  LaundryAvailability,
  UtilityInclusion,
} from "@prisma/client";

export const MultiStepFormSchema = z.object({
  step: z.nativeEnum(ListingFormStep),
});

export const BasicInfoSchema = z.object({
  title: z
    .string({
      message: "Title is required",
    })
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(50, { message: "Title must be at most 50 characters long" }),
  description: z
    .string({
      message: "Description is required",
    })
    .min(3, { message: "Description must be at least 3 characters long" })
    .max(500, { message: "Description must be at most 500 characters long" }),
  roomType: z.nativeEnum(RoomType),
  rent: z
    .number({
      message: "Rent is required",
    })
    .min(1, { message: "Rent must be at least 1" })
    .max(100000, { message: "Rent must be at most 100,000" }),
  slotsAvailable: z
    .number({
      message: "Slots Available is required",
    })
    .min(1, { message: "Slots Available must be at least 1" })
    .max(10, { message: "Slots Available must be at most 10" }),
});

export type BasicInfoType = z.infer<typeof BasicInfoSchema>;
export const LocationContactSchema = z.object({
  address: z.string().min(1, "Please select a complete address"),
  longitude: z
    .number()
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),
  latitude: z
    .number()
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),
  contact: z
    .string({
      message: "Contact is required",
    })
    .min(3, { message: "Contact must be at least 3 characters long" })
    .max(50, { message: "Contact must be at most 50 characters long" }),
  facebookProfile: z
    .string({
      message: "Facebook Profile is required",
    })
    .min(3, { message: "Facebook Profile must be at least 3 characters long" })
    .max(50, { message: "Facebook Profile must be at most 50 characters long" })
    .refine(
      (value) =>
        value.startsWith("https://www.facebook.com/") ||
        value.startsWith("https://www.m.me/"),
      {
        message:
          "Facebook Profile must start with https://www.facebook.com/ or https://www.m.me/",
      }
    ),
});
export type LocationContactType = z.infer<typeof LocationContactSchema>;

export const HouseRulesSchema = z.object({
  genderPolicy: z.nativeEnum(GenderPolicy),
  curfew: z.nativeEnum(CurfewPolicy),
  caretaker: z.nativeEnum(CaretakerAvailability),
  pets: z.nativeEnum(PetPolicy),
  kitchen: z.nativeEnum(KitchenAvailability),
  wifi: z.nativeEnum(WifiAvailability),
  laundry: z.nativeEnum(LaundryAvailability),
  utilities: z.nativeEnum(UtilityInclusion),
});

export type HouseRulesType = z.infer<typeof HouseRulesSchema>;

export const UploadPhotosSchema = z.object({
  photos: z
    .array(
      z.any().refine((file) => file instanceof File, {
        message: "Each photo must be a File",
      })
    )
    .min(1, { message: "Please upload at least one photo" })
    .max(10, { message: "You can upload up to 10 photos only" }),
});

export type UploadPhotosType = z.infer<typeof UploadPhotosSchema>;

export const CreateListingSchema = BasicInfoSchema.merge(
  LocationContactSchema.merge(HouseRulesSchema).merge(UploadPhotosSchema)
);

export type CreateListingType = z.infer<typeof CreateListingSchema>;

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
  value: string;
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
