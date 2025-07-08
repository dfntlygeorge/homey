"use server";

import { auth } from "@/auth";
import { routes } from "@/config/routes";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const updateListingAvailabilityAction = async (
  listingId: number,
  isAvailable: boolean
) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId)
      return {
        success: false,
        message: "Unauthorized action",
      };

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
      message: `Listing marked as ${isAvailable ? "available" : "unavailable"}`,
    };
  } catch (error) {
    console.error("Error updating listing availability:", error);

    return {
      success: false,
      message: "Failed to update listing availability. Please try again.",
    };
  }
};
