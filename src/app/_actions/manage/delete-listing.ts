"use server";

import { auth } from "@/auth";
import { routes } from "@/config/routes";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const deleteListingAction = async (listingId: number) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId)
      return {
        success: false,
        message: "Unauthorized action",
      };

    await prisma.image.deleteMany({
      where: {
        listingId,
      },
    });
    await prisma.listing.delete({
      where: {
        id: listingId,
      },
    });

    revalidatePath(routes.manage);

    return {
      success: true,
      message: "Deleted successfully",
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      success: false,
      message: "Failed to delete listing. Please try again.",
    };
  }
};
