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
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE,
  MIN_FILE_SIZE,
} from "@/config/constants";
import { formatFileSize } from "@/lib/utils";

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

export const FileSchema = z
  .any()
  .refine((file) => file instanceof File, {
    message: "Each item must be a valid file",
  })
  .refine((file: File) => file.size >= MIN_FILE_SIZE, {
    message: `File is too small. Minimum size is ${formatFileSize(
      MIN_FILE_SIZE
    )}`,
  })
  .refine((file: File) => file.size <= MAX_FILE_SIZE, {
    message: `File is too large. Maximum size is ${formatFileSize(
      MAX_FILE_SIZE
    )}`,
  })
  .refine(
    (file: File) =>
      ACCEPTED_IMAGE_TYPES.includes(
        file.type as (typeof ACCEPTED_IMAGE_TYPES)[number]
      ),
    {
      message: `Invalid file type. Only ${ACCEPTED_IMAGE_TYPES.join(
        ", "
      )} are allowed`,
    }
  )
  .refine(
    (file: File) => {
      // Additional check for file extension to prevent MIME type spoofing
      const extension = file.name.toLowerCase().split(".").pop();
      const validExtensions = ["jpg", "jpeg", "png", "webp", "avif"];
      return validExtensions.includes(extension || "");
    },
    {
      message: "File extension doesn't match an allowed image format",
    }
  )
  .refine(
    (file: File) => {
      // Check for reasonable filename length
      return file.name.length <= 255 && file.name.length > 0;
    },
    {
      message: "Filename must be between 1 and 255 characters",
    }
  )
  .refine(
    (file: File) => {
      // Basic check to prevent executable files disguised as images
      const dangerousExtensions = [
        ".exe",
        ".bat",
        ".cmd",
        ".com",
        ".pif",
        ".scr",
        ".vbs",
        ".js",
      ];
      const fileName = file.name.toLowerCase();
      return !dangerousExtensions.some((ext) => fileName.includes(ext));
    },
    {
      message: "File appears to contain executable content",
    }
  );

export const UploadPhotosSchema = z.object({
  photos: z
    .array(FileSchema)
    .min(1, { message: "Please upload at least one photo" })
    .max(10, { message: "You can upload up to 10 photos only" })
    .refine(
      (files: File[]) => {
        // Check total size of all files combined
        const totalSize = files.reduce((sum, file) => sum + file.size, 0);
        const maxTotalSize = 25 * 1024 * 1024; // 25MB total
        return totalSize <= maxTotalSize;
      },
      {
        message: `Total file size cannot exceed ${formatFileSize(
          25 * 1024 * 1024
        )}`,
      }
    )
    .refine(
      (files: File[]) => {
        // Check for duplicate filenames
        const filenames = files.map((file) => file.name.toLowerCase());
        return filenames.length === new Set(filenames).size;
      },
      {
        message: "Duplicate filenames are not allowed",
      }
    )
    .refine(
      (files: File[]) => {
        // Check for suspiciously similar file sizes (potential duplicates)
        const sizes = files.map((file) => file.size);
        const sizeCounts = sizes.reduce((acc, size) => {
          acc[size] = (acc[size] || 0) + 1;
          return acc;
        }, {} as Record<number, number>);

        // Allow up to 2 files with the same size (could be legitimate)
        return !Object.values(sizeCounts).some((count) => count > 2);
      },
      {
        message: "Too many files with identical sizes detected",
      }
    ),
});

export type UploadPhotosType = z.infer<typeof UploadPhotosSchema>;
export type FileInput = z.infer<typeof FileSchema>;

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
