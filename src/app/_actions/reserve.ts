"use server";

import { prisma } from "@/lib/prisma"; // Adjust import path as needed
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

    // Get the listing to get the owner ID
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

    // Create the reservation
    const reservation = await prisma.reservation.create({
      data: {
        listingId,
        userId,
        ownerId: listing.userId,
        status: "PENDING",
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

export async function checkReservationStatus(
  listingId: number,
  userId: string
) {
  try {
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
      },
    });

    return {
      success: true,
      reservation: reservation || null,
    };
  } catch (error) {
    console.error("Error checking reservation status:", error);
    return {
      success: false,
      error: "Failed to check reservation status",
    };
  }
}
