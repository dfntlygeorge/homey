"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function checkOwnerReservationStatus(
  listingId: number,
  ownerId: string,
  renterId: string
) {
  try {
    const session = await auth();
    const currentUser = session?.user;

    if (
      !currentUser ||
      (currentUser.id !== ownerId && currentUser.id !== renterId)
    ) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }
    const reservation = await prisma.reservation.findFirst({
      where: {
        listingId,
        ownerId,
        userId: renterId,
        status: "PENDING",
      },
      select: {
        id: true,
        status: true,
        acceptedAt: true,
      },
    });

    return {
      success: true,
      reservation: reservation || null,
    };
  } catch (error) {
    console.error("Error checking owner reservation status:", error);
    return {
      success: false,
      error: "Failed to check reservation status",
    };
  }
}
