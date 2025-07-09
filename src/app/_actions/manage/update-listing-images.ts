"use server";

import prisma from "@/lib/prisma";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "@/env";
import { UploadedImage } from "@/context/edit-listing/images-context";
import { v4 as uuidv4 } from "uuid";
import { imageUploadRatelimit } from "@/lib/rate-limit";

interface UpdateImagesProps {
  listingId: number;
  deletedImageIds: number[];
  imagesToUpload: UploadedImage[];
  userId: string;
}

export async function updateImagesAction(props: UpdateImagesProps) {
  const { listingId, deletedImageIds, imagesToUpload, userId } = props;

  try {
    // Delete removed images
    if (deletedImageIds && deletedImageIds.length > 0) {
      await prisma.image.deleteMany({
        where: {
          id: { in: deletedImageIds },
          listingId, // Extra safety
        },
      });
    }

    if (imagesToUpload.length > 0) {
      const { success: successRateLimit } = await imageUploadRatelimit.limit(
        userId
      );

      if (!successRateLimit) {
        return {
          success: false,
          message:
            "You have reached your weekly image upload limit (50 images).",
        };
      }
      // Set up S3 client
      const s3Client = new S3Client({
        region: env.AWS_S3_REGION,
        credentials: {
          accessKeyId: env.AWS_S3_ACCESS_KEY_ID,
          secretAccessKey: env.AWS_S3_SECRET_ACCESS_KEY,
        },
      });

      // Get current highest order
      const existingImages = await prisma.image.findMany({
        where: { listingId },
        select: { order: true },
        orderBy: { order: "desc" },
        take: 1,
      });

      const startingOrder =
        existingImages.length > 0 ? existingImages[0].order + 1 : 0;

      // Upload images in parallel
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
              order: startingOrder + index,
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

      // Wait for uploads
      const uploadResults = await Promise.all(uploadPromises);

      // Insert new images
      await prisma.image.createMany({
        data: uploadResults,
      });

      console.log(`Successfully uploaded ${uploadResults.length} images`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating images:", error);
    return { success: false, message: "Failed to update images" };
  }
}
