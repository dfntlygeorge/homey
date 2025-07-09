"use server";

import prisma from "@/lib/prisma";
import { env } from "@/env";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { imageUploadRatelimit } from "@/lib/rate-limit";

export async function uploadListingImagesAction(
  listingId: number,
  images: File[],
  userId: string
) {
  // Check rate limit
  const { success } = await imageUploadRatelimit.limit(userId);
  if (!success) {
    return {
      success: false,
      message:
        "You can only upload images 5 times per day. Please try again later.",
    };
  }

  try {
    // Set up S3 client
    const s3Client = new S3Client({
      region: env.AWS_S3_REGION,
      credentials: {
        accessKeyId: env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_S3_SECRET_ACCESS_KEY,
      },
    });

    // Upload images in parallel
    const uploadPromises = images.map(async (image, index) => {
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
        order: index,
      };
    });

    const uploadResults = await Promise.all(uploadPromises);

    // Save to database
    await prisma.image.createMany({
      data: uploadResults,
    });

    console.log(`✅ Uploaded ${uploadResults.length} images`);

    return {
      success: true,
      message: `Successfully uploaded ${uploadResults.length} images`,
    };
  } catch (error) {
    console.error("Error uploading images:", error);
    return {
      success: false,
      message: "Failed to upload images. Please try again later.",
    };
  }
}
