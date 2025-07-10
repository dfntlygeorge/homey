"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NotificationType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function acceptReservationAction(
  listingId: number,
  ownerId: string,
  renterId: string
) {
  try {
    const session = await auth();
    const currentUser = session?.user;

    if (!currentUser || currentUser.id !== ownerId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }
    // Find the pending reservation between owner and renter
    const reservation = await prisma.reservation.findFirst({
      where: {
        listingId,
        ownerId,
        userId: renterId,
        status: "PENDING",
      },
    });

    if (!reservation) {
      return {
        success: false,
        error: "No pending reservation found",
      };
    }

    // Get current listing data
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { slotsAvailable: true, isAvailable: true, title: true },
    });

    if (!listing) {
      return {
        success: false,
        error: "Listing not found",
      };
    }

    if (listing.slotsAvailable <= 0) {
      return {
        success: false,
        error: "No slots available",
      };
    }

    // Use transaction to update both reservation and listing
    await prisma.$transaction(async (tx) => {
      // Update reservation status to ACCEPTED with acceptedAt timestamp
      await tx.reservation.update({
        where: { id: reservation.id },
        data: {
          status: "ACCEPTED",
          acceptedAt: new Date(),
        },
      });

      // Calculate new slots available
      const newSlotsAvailable = listing.slotsAvailable - 1;
      const shouldMarkUnavailable = newSlotsAvailable <= 0;

      // Update listing slots and availability
      await tx.listing.update({
        where: { id: listingId },
        data: {
          slotsAvailable: newSlotsAvailable,
          isAvailable: shouldMarkUnavailable ? false : listing.isAvailable,
        },
      });
    });

    await prisma.notification.create({
      data: {
        userId: renterId, // notifcation for the owner
        message: `Your reservation request for "${listing.title}" has been accepted!`,
        type: NotificationType.RESERVATION,
      },
    });

    // Revalidate the page to update the UI
    revalidatePath("/chats");

    return {
      success: true,
      message: "Reservation accepted successfully",
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      success: false,
      error: "Failed to accept reservation",
    };
  }
}
