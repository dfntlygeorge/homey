"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import {
  CaretakerAvailability,
  CurfewPolicy,
  GenderPolicy,
  KitchenAvailability,
  LaundryAvailability,
  PetPolicy,
  RoomType,
  UtilityInclusion,
  WifiAvailability,
} from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import { env } from "@/env";
import { FileSchema } from "../_schemas/file.schema";
import { ZodError } from "zod";
import { moderateListingAction } from "./moderate-listing";

export const createListingAction = async (formData: FormData) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return {
        success: false,
        message: "You must be logged in to create a listing",
      };
    }

    // Extract data from FormData
    const listingData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      roomType: formData.get("roomType") as RoomType,
      rent: Number(formData.get("rent")),
      slotsAvailable: Number(formData.get("slotsAvailable")),
      address: formData.get("address") as string,
      longitude: Number(formData.get("longitude")),
      latitude: Number(formData.get("latitude")),
      contact: formData.get("contact") as string,
      genderPolicy: formData.get("genderPolicy") as GenderPolicy,
      curfew: formData.get("curfew") as CurfewPolicy,
      caretaker: formData.get("caretaker") as CaretakerAvailability,
      pets: formData.get("pets") as PetPolicy,
      kitchen: formData.get("kitchen") as KitchenAvailability,
      wifi: formData.get("wifi") as WifiAvailability,
      laundry: formData.get("laundry") as LaundryAvailability,
      utilities: formData.get("utilities") as UtilityInclusion,
      facebookProfile: formData.get("facebookProfile") as string,
    };

    // Validate required fields
    const requiredFields = [
      "title",
      "description",
      "roomType",
      "rent",
      "slotsAvailable",
      "address",
      "contact",
      "genderPolicy",
      "curfew",
      "caretaker",
      "pets",
      "kitchen",
      "wifi",
      "laundry",
      "utilities",
      "facebookProfile",
      "longitude",
      "latitude",
    ];

    for (const field of requiredFields) {
      if (!listingData[field as keyof typeof listingData]) {
        return {
          success: false,
          message: `${field} is required`,
        };
      }
    }

    // Create the listing in the database
    const listing = await prisma.listing.create({
      data: {
        ...listingData,
        userId,
      },
    });

    await moderateListingAction(listing);

    // Set up S3 client for image uploads
    const s3Client = new S3Client({
      region: env.AWS_S3_REGION,
      credentials: {
        accessKeyId: env.AWS_S3_ACCESS_KEY_ID ?? "",
        secretAccessKey: env.AWS_S3_SECRET_ACCESS_KEY ?? "",
      },
    });

    // Handle image uploads
    const imageUrls = [];
    const imageEntries = formData.getAll("images");

    if (imageEntries.length > 0) {
      for (const image of imageEntries) {
        if (image instanceof File) {
          try {
            // ✅ Validate using FileSchema
            FileSchema.parse(image);

            const fileExtension = image.name.split(".").pop();
            const uniqueFileName = `${listing.id}/${uuidv4()}.${fileExtension}`;
            const bucketName = env.AWS_S3_BUCKET_NAME;

            // Convert file to buffer for S3 upload
            const arrayBuffer = await image.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Upload to S3
            const command = new PutObjectCommand({
              Bucket: bucketName,
              Key: uniqueFileName,
              Body: buffer,
              ContentType: image.type,
            });

            await s3Client.send(command);

            // Create the S3 URL
            const imageUrl = `https://${bucketName}.s3.${env.AWS_S3_REGION}.amazonaws.com/${uniqueFileName}`;
            imageUrls.push(imageUrl);

            // Create image record in database
            await prisma.image.create({
              data: {
                url: imageUrl,
                listingId: listing.id,
              },
            });

            console.log("Image uploaded:", imageUrl);
          } catch (error) {
            if (error instanceof ZodError) {
              console.warn("File validation failed:", error.errors);
              return {
                success: false,
                message: `Invalid image: ${error.errors[0].message}`,
              };
            } else {
              console.error("Unexpected file validation/upload error:", error);
              return {
                success: false,
                message: "Something went wrong during image upload",
              };
            }
          }
        }
      }
    }

    // Revalidate the listings page to show updated data
    revalidatePath("/listings");

    return {
      success: true,
      message: "Listing created successfully",
      listingId: listing.id,
    };
  } catch (error) {
    console.error("Error creating listing:", error);
    return {
      success: false,
      message: "Failed to create listing. Please try again.",
    };
  }
};
