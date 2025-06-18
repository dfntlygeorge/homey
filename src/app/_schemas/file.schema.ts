import { z } from "zod";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE,
  MIN_FILE_SIZE,
} from "@/config/constants";
import { formatFileSize } from "@/lib/utils";

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
