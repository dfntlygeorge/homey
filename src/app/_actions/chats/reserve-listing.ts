"use server";

import prisma from "@/lib/prisma";
import { NotificationType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function reserveListingAction(listingId: number, userId: string) {
  try {
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
      console.log("UPDATED DECLINED RESERVATION TO PENDING:", reservation.id);
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
      console.log("CREATED NEW RESERVATION:", reservation.id);
    }

    await prisma.notification.create({
      data: {
        userId: listing.userId, // notification for the owner
        message: `You have received a new reservation request for your listing ${listing.title}`,
        type: NotificationType.RESERVATION,
      },
    });

    console.log("RESERVED THE LISTING UNDER OWNER: ", listing.userId);
    console.log("WHO RESERVED IT? ", userId);
    console.log("WHAT LISTING IS RESERVED: ", listingId);
    console.log("WHAT IS THE STATUS: ", "PENDING");

    // Revalidate the page to update the UI
    revalidatePath("/chats");

    return {
      success: true,
      reservation: {
        id: reservation.id,
        status: reservation.status,
      },
    };
  } catch (error) {
    console.error("Error creating reservation:", error);
    return {
      success: false,
      error: "Failed to create reservation",
    };
  }
}
