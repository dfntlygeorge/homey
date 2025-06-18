"use server";

import { auth } from "@/auth";
import {
  UpdateListingSchema,
  UpdateListingType,
} from "../_schemas/form.schema";
import { FileSchema } from "../_schemas/file.schema";
import prisma from "@/lib/prisma";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
// import { env } from "@/env";
import { UploadedImage } from "@/context/edit-listing/images-context";
import { v4 as uuidv4 } from "uuid";
import { ZodError } from "zod";

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

    const { photos, ...rest } = updates;

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

    const s3Client = new S3Client({
      region: process.env.NEXT_PUBLIC_AWS_S3_REGION,
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID ?? "",
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY ?? "",
      },
    });

    const imageUrls = [];
    const filesToUpload = imagesToUpload.map((img) => img.file);

    console.log(
      `Do we have an image? ${imagesToUpload.length ? "YESSS" : "NOOO"}`
    );

    if (filesToUpload.length > 0) {
      for (const image of filesToUpload) {
        console.log("FOR LOOP IS RUNNING");
        if (image instanceof File) {
          try {
            // ✅ Validate using FileSchema
            FileSchema.parse(image);

            const fileExtension = image.name.split(".").pop();
            const uniqueFileName = `${listingId}/${uuidv4()}.${fileExtension}`;
            const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME;

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
            const imageUrl = `https://${bucketName}.s3.${process.env.NEXT_PUBLIC_AWS_S3_REGION}.amazonaws.com/${uniqueFileName}`;
            imageUrls.push(imageUrl);
            console.log(imageUrl ?? "NOTHING");

            // Create image record in database
            await prisma.image.create({
              data: {
                url: imageUrl,
                listingId,
              },
            });

            console.log("Photo uploaded:", imageUrl);
          } catch (error) {
            if (error instanceof ZodError) {
              console.warn("File validation failed:", error.errors);
              return {
                success: false,
                message: `Invalid photo: ${error.errors[0].message}`,
              };
            } else {
              console.error("Unexpected file validation/upload error:", error);
              return {
                success: false,
                message: "Something went wrong during photo upload",
              };
            }
          }
        }
      }
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
