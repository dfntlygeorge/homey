// app/_actions/unarchive-listing.ts

"use server";

import { auth } from "@/auth";
import { routes } from "@/config/routes";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const unarchiveListingAction = async (listingId: number) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return {
        success: false,
        message: "Unauthorized action",
      };
    }

    const listing = await prisma.listing.findFirst({
      where: {
        id: listingId,
        userId,
      },
    });

    if (!listing) {
      return {
        success: false,
        message: "Listing not found",
      };
    }

    await prisma.listing.update({
      where: { id: listingId },
      data: {
        isArchived: false,
      },
    });

    revalidatePath(routes.manage);

    return {
      success: true,
      message: "Listing restored successfully",
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      success: false,
      message: "Failed to restore listing. Please try again.",
    };
  }
};
