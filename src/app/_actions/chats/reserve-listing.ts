"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { reservationRatelimit } from "@/lib/rate-limit";
import { NotificationType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function reserveListingAction(listingId: number) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const { success } = await reservationRatelimit.limit(userId);
    if (!success) {
      return {
        success: false,
        error:
          "You can only send up to 3 reservation requests per hour. Please try again later.",
      };
    }
    // Check if user already has a reservation for this listing
    const existingReservation = await prisma.reservation.findFirst({
      where: {
        listingId,
        userId,
        status: {
          in: ["PENDING", "ACCEPTED"],
        },
      },
    });

    if (existingReservation) {
      return {
        success: false,
        error: "You already have a reservation for this listing",
      };
    }

    // Check if user has a declined reservation that can be updated
    const declinedReservation = await prisma.reservation.findFirst({
      where: {
        listingId,
        userId,
        status: "DECLINED",
      },
    });

    // Get the listing to check availability and get owner ID
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: {
        userId: true,
        slotsAvailable: true,
        isAvailable: true,
        title: true,
      },
    });

    if (!listing) {
      return {
        success: false,
        error: "Listing not found",
      };
    }

    if (!listing.isAvailable || listing.slotsAvailable <= 0) {
      return {
        success: false,
        error: "This listing is no longer available",
      };
    }

    let reservation;

    if (declinedReservation) {
      // Update the declined reservation back to PENDING
      reservation = await prisma.reservation.update({
        where: { id: declinedReservation.id },
        data: {
          status: "PENDING",
          updatedAt: new Date(),
        },
      });
    } else {
      // Create a new reservation
      reservation = await prisma.reservation.create({
        data: {
          listingId,
          userId,
          ownerId: listing.userId,
          status: "PENDING",
        },
      });
    }

    await prisma.notification.create({
      data: {
        userId: listing.userId, // notification for the owner
        message: `You have received a new reservation request for your listing ${listing.title}`,
        type: NotificationType.RESERVATION,
      },
    });

    // Revalidate the page to update the UI
    revalidatePath("/chats");

    return {
      success: true,
      reservation: {
        id: reservation.id,
        status: reservation.status,
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      success: false,
      error: "Failed to create reservation",
    };
  }
}
