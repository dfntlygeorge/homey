"use server";

import { auth } from "@/auth";
import { routes } from "@/config/routes";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const archiveListingAction = async (listingId: number) => {
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
        isArchived: true,
      },
    });

    revalidatePath(routes.manage);

    return {
      success: true,
      message: "Listing archived successfully",
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      success: false,
      message: "Failed to archive listing. Please try again.",
    };
  }
};
