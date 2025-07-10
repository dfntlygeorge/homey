"use server";

import { auth } from "@/auth";
import {
  UpdateListingSchema,
  UpdateListingType,
} from "../../_schemas/form.schema";
import prisma from "@/lib/prisma";
import { UploadedImage } from "@/context/edit-listing/images-context";
import { updateImagesAction } from "./update-listing-images";
import { moderateListingAction } from "../moderation/moderate-listing";

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

    const result = UpdateListingSchema.safeParse(formData);

    if (!result.success) {
      return {
        success: false,
        message: result.error.message,
      };
    }

    const updates = result.data;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

    await updateImagesAction({
      listingId,
      deletedImageIds,
      imagesToUpload,
      userId,
    });

    moderateListingAction(listingId).catch(() => {});

    return {
      success: true,
      message:
        "Updated successfully. Your listing is now under review and will be visible once approved.",
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      success: false,
      message: "Could not update the listing. Try again later.",
    };
  }
};
