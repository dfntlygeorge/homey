"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function checkReservationStatus(
  listingId: number,
  userId: string
) {
  try {
    const session = await auth();
    const currentUser = session?.user;

    if (!currentUser) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { userId: true },
    });

    if (!listing) {
      return {
        success: false,
        error: "Listing not found",
      };
    }

    const isOwner = currentUser.id === listing.userId;
    const isRenter = currentUser.id === userId;

    if (!isOwner && !isRenter) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const reservation = await prisma.reservation.findFirst({
      where: {
        listingId,
        userId,
        status: {
          in: ["PENDING", "ACCEPTED", "DECLINED"],
        },
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      success: false,
      error: "Failed to check reservation status",
    };
  }
}
