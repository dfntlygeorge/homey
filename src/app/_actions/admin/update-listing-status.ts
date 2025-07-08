"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ListingStatus } from "@prisma/client";
import { auth } from "@/auth";

export async function updateListingStatus(id: number, status: ListingStatus) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user || user.role !== "ADMIN") {
      return {
        success: false,
        message: "You are not authorized to update listing status.",
      };
    }

    await prisma.listing.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/admin");

    return {
      success: true,
      message: "Listing status updated successfully.",
    };
  } catch (error) {
    console.error("Error updating listing status:", error);
    return {
      success: false,
      message:
        "An unexpected error occurred while updating the listing status.",
    };
  }
}
