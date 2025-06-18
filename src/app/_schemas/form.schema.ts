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
import { FileSchema } from "./file.schema";
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

export const UploadImagesSchema = z.object({
  images: z
    .array(FileSchema)
    .min(1, { message: "Please upload at least one image" })
    .max(10, { message: "You can upload up to 10 images only" })
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

export const CreateListingSchema = BasicInfoSchema.merge(
  LocationContactSchema.merge(HouseRulesSchema).merge(UploadImagesSchema)
);

export const UpdateListingSchema = CreateListingSchema.partial();

// TYPES HERE:
export type BasicInfoType = z.infer<typeof BasicInfoSchema>;
export type LocationContactType = z.infer<typeof LocationContactSchema>;
export type HouseRulesType = z.infer<typeof HouseRulesSchema>;
export type UploadImagesType = z.infer<typeof UploadImagesSchema>;
export type FileInput = z.infer<typeof FileSchema>;
export type CreateListingType = z.infer<typeof CreateListingSchema>;
export type UpdateListingType = z.infer<typeof UpdateListingSchema>;
