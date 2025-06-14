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
      contactInfo: formData.get("contact") as string,
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
      "contactInfo",
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

    console.log("Listing created:", listing);

    // Set up S3 client for photo uploads
    const s3Client = new S3Client({
      region: env.NEXT_PUBLIC_AWS_S3_REGION,
      credentials: {
        accessKeyId: env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID ?? "",
        secretAccessKey: env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY ?? "",
      },
    });

    // Handle photo uploads
    const photoUrls = [];
    const photoEntries = formData.getAll("photos");

    if (photoEntries.length > 0) {
      for (const photo of photoEntries) {
        if (photo instanceof File) {
          const fileExtension = photo.name.split(".").pop();
          const uniqueFileName = `${listing.id}/${uuidv4()}.${fileExtension}`;
          const bucketName = env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME;

          // Convert file to buffer for S3 upload
          const arrayBuffer = await photo.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          // Upload to S3
          const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: uniqueFileName,
            Body: buffer,
            ContentType: photo.type,
          });

          await s3Client.send(command);

          // Create the S3 URL
          const photoUrl = `https://${bucketName}.s3.${env.NEXT_PUBLIC_AWS_S3_REGION}.amazonaws.com/${uniqueFileName}`;
          photoUrls.push(photoUrl);

          // Create image record in database
          await prisma.image.create({
            data: {
              url: photoUrl,
              listingId: listing.id,
            },
          });

          console.log("Photo uploaded:", photoUrl);
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
