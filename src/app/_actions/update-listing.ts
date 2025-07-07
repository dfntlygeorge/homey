"use server";

import { auth } from "@/auth";
import {
  UpdateListingSchema,
  UpdateListingType,
} from "../_schemas/form.schema";
import prisma from "@/lib/prisma";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
// import { env } from "@/env";
import { UploadedImage } from "@/context/edit-listing/images-context";
import { v4 as uuidv4 } from "uuid";
import { env } from "@/env";

interface UpdateListingProps {
  listingId: number;
  formData: UpdateListingType;
  deletedImageIds: number[];
  imagesToUpload: UploadedImage[];
}

export const updateListingAction = async (props: UpdateListingProps) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId)
      return {
        success: false,
        message: "Unauthorized",
      };

    const { listingId, formData, deletedImageIds, imagesToUpload } = props;

    console.log("FORM DATA: ", formData);

    const result = UpdateListingSchema.safeParse(formData);

    if (!result.success) {
      console.error("Validation Failed", result.error.message);
      return {
        success: false,
        message: result.error.message,
      };
    }

    const updates = result.data;

    const { images, address, longitude, latitude, ...rest } = updates;

    // Handle address update if address fields are provided
    if (address || longitude !== undefined || latitude !== undefined) {
      // First, get the current listing to find the addressId
      const currentListing = await prisma.listing.findUnique({
        where: { id: listingId },
        select: { addressId: true },
      });

      if (!currentListing) {
        return {
          success: false,
          message: "Listing not found",
        };
      }

      // Update the address record
      await prisma.address.update({
        where: { id: currentListing.addressId },
        data: {
          ...(address && { formattedAddress: address }),
          ...(longitude !== undefined && { longitude }),
          ...(latitude !== undefined && { latitude }),
        },
      });
    }
    await prisma.listing.update({
      where: {
        id: listingId,
      },
      data: {
        ...rest,
      },
    });

    // Delete removed images
    if (deletedImageIds && deletedImageIds.length > 0) {
      await prisma.image.deleteMany({
        where: {
          id: { in: deletedImageIds },
          listingId, // Optional: extra safety
        },
      });
    }

    if (imagesToUpload.length > 0) {
      // Set up S3 client for image uploads
      const s3Client = new S3Client({
        region: env.AWS_S3_REGION,
        credentials: {
          accessKeyId: env.AWS_S3_ACCESS_KEY_ID,
          secretAccessKey: env.AWS_S3_SECRET_ACCESS_KEY,
        },
      });

      // Get the current highest order for existing images
      const existingImages = await prisma.image.findMany({
        where: { listingId },
        select: { order: true },
        orderBy: { order: "desc" },
        take: 1,
      });

      const startingOrder =
        existingImages.length > 0 ? existingImages[0].order + 1 : 0;

      // Handle image uploads in parallel
      const uploadPromises = imagesToUpload.map(
        async (uploadedPhoto, index) => {
          try {
            const image = uploadedPhoto.file;
            const fileExtension = image.name.split(".").pop();
            const uniqueFileName = `${listingId}/${uuidv4()}.${fileExtension}`;
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
              listingId,
              order: startingOrder + index, // Maintain order for new images
            };
          } catch (error) {
            console.error(
              `Failed to upload image ${uploadedPhoto.file.name}:`,
              error
            );
            throw new Error(
              `Failed to upload image: ${uploadedPhoto.file.name}`
            );
          }
        }
      );

      // Wait for all uploads to complete
      const uploadResults = await Promise.all(uploadPromises);

      // Batch insert all images to database
      await prisma.image.createMany({
        data: uploadResults,
      });

      console.log(`Successfully uploaded ${uploadResults.length} images`);
    }

    return {
      success: true,
      message: "Updated successfully",
    };
  } catch (error) {
    console.error("Error in updating the listing: ", error);
    return {
      success: false,
      message: "Could not update the listing. Try again later.",
    };
  }
};
