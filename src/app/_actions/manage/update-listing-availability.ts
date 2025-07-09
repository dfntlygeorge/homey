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
    console.log("Checked availability rate limit");

    if (!success) {
      console.log("Rate limit exceeded");
      return {
        success: false,
        message:
          "You’ve reached the limit for changing availability. Please try again later.",
      };
    }

    console.log("Updating availability status...");

    await prisma.listing.update({
      where: {
        id: listingId,
      },
      data: {
        isAvailable,
      },
    });

    console.log("Update successful");

    revalidatePath(routes.manage);

    return {
      success: true,
      message: `Listing has been marked as ${
        isAvailable ? "available" : "unavailable"
      }.`,
    };
  } catch (error) {
    console.error("Error updating listing availability:", error);

    return {
      success: false,
      message:
        "Something went wrong while updating availability. Please try again.",
    };
  }
};
