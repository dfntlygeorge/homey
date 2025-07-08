"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import { env } from "@/env";

import { moderateListingAction } from "../moderation/moderate-listing";
import {
  CreateListingSchema,
  CreateListingType,
} from "../../_schemas/form.schema";

export const createListingAction = async (
  createListingData: CreateListingType
) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return {
        success: false,
        message: "You must be logged in to create a listing",
      };
    }

    const { data, success, error } =
      CreateListingSchema.safeParse(createListingData);

    if (!success) {
      console.error("Validation Failed", error.message);
      return {
        success: false,
        message: error.message,
      };
    }

    const { images, longitude, latitude, address, ...listingData } = data;

    const addressId = (
      await prisma.address.create({
        data: {
          formattedAddress: address,
          longitude,
          latitude,
        },
      })
    ).id;

    console.log("ADDRESS CREATED: ", addressId);

    // Create the listing in the database
    const listing = await prisma.listing.create({
      data: {
        ...listingData,
        userId,
        addressId,
      },
    });

    console.log("LISTING CREATED: ", listing);

    // Set up S3 client for image uploads
    const s3Client = new S3Client({
      region: env.AWS_S3_REGION,
      credentials: {
        accessKeyId: env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_S3_SECRET_ACCESS_KEY,
      },
    });

    // Handle image uploads
    // Handle image uploads in parallel
    const uploadPromises = images.map(async (image, index) => {
      try {
        const fileExtension = image.name.split(".").pop();
        const uniqueFileName = `${listing.id}/${uuidv4()}.${fileExtension}`;
        const bucketName = env.AWS_S3_BUCKET_NAME;

        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const command = new PutObjectCommand({
          Bucket: bucketName,
          Key: uniqueFileName,
          Body: buffer,
          ContentType: image.type,
        });

        await s3Client.send(command);

        const imageUrl = `https://${bucketName}.s3.${env.AWS_S3_REGION}.amazonaws.com/${uniqueFileName}`;

        return {
          url: imageUrl,
          listingId: listing.id,
          order: index, // Maintain order if needed
        };
      } catch (error) {
        console.error(`Failed to upload image ${image.name}:`, error);
        throw new Error(`Failed to upload image: ${image.name}`);
      }
    });

    // Wait for all uploads to complete
    const uploadResults = await Promise.all(uploadPromises);

    // Batch insert all images to database
    await prisma.image.createMany({
      data: uploadResults,
    });

    console.log(`Successfully uploaded ${uploadResults.length} images`);
    revalidatePath("/listings");
    console.log("MODERATING THE LISTING:");
    moderateListingAction(listing.id).catch((e) => {
      console.error("Error running background moderation:", e);
    });

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
