"use server";

import { auth } from "@/auth";
import { routes } from "@/config/routes";
import prisma from "@/lib/prisma";
import { availabilityRatelimit } from "@/lib/rate-limit";
import { revalidatePath } from "next/cache";

export const updateListingAvailabilityAction = async (
  listingId: number,
  isAvailable: boolean
) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return {
        success: false,
        message: "You must be signed in to perform this action.",
      };
    }

    const { success } = await availabilityRatelimit.limit(userId);

    if (!success) {
      return {
        success: false,
        message:
          "You've reached the limit for changing availability. Please try again later.",
      };
    }

    await prisma.listing.update({
      where: {
        id: listingId,
      },
      data: {
        isAvailable,
      },
    });

    revalidatePath(routes.manage);

    return {
      success: true,
      message: `Listing has been marked as ${
        isAvailable ? "available" : "unavailable"
      }.`,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      success: false,
      message:
        "Something went wrong while updating availability. Please try again.",
    };
  }
};
