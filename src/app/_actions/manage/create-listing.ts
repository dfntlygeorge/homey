"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { moderateListingAction } from "../moderation/moderate-listing";
import {
  CreateListingSchema,
  CreateListingType,
} from "../../_schemas/form.schema";
import { listingRatelimit } from "@/lib/rate-limit";
import { uploadListingImagesAction } from "./upload-listing-images";

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

    const { success: successRateLimit } = await listingRatelimit.limit(userId);
    if (!successRateLimit) {
      return {
        success: false,
        message: "You can only create 1 listing every 10 minutes. Please wait.",
      };
    }

    const { data, success, error } =
      CreateListingSchema.safeParse(createListingData);

    if (!success) {
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

    // Create the listing in the database
    const listing = await prisma.listing.create({
      data: {
        ...listingData,
        userId,
        addressId,
      },
    });

    await uploadListingImagesAction(listing.id, images, userId);
    revalidatePath("/listings");
    moderateListingAction(listing.id).catch(() => {});

    return {
      success: true,
      message: "Listing created successfully",
      listingId: listing.id,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      success: false,
      message: "Failed to create listing. Please try again.",
    };
  }
};
