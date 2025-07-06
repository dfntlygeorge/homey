"use server";

import { prisma } from "@/lib/prisma";
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

    // Get the listing to check availability and get owner ID
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: {
        userId: true,
        slotsAvailable: true,
        isAvailable: true,
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

export async function checkOwnerReservationStatus(
  listingId: number,
  ownerId: string,
  renterId: string
) {
  try {
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

export async function acceptReservationAction(
  listingId: number,
  ownerId: string,
  renterId: string
) {
  try {
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
      select: { slotsAvailable: true, isAvailable: true },
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
      // Update reservation status to ACCEPTED
      await tx.reservation.update({
        where: { id: reservation.id },
        data: { status: "ACCEPTED" },
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

    console.log("ACCEPTED RESERVATION:", reservation.id);
    console.log("UPDATED LISTING SLOTS:", listing.slotsAvailable - 1);

    // Revalidate the page to update the UI
    revalidatePath("/chats");

    return {
      success: true,
      message: "Reservation accepted successfully",
    };
  } catch (error) {
    console.error("Error accepting reservation:", error);
    return {
      success: false,
      error: "Failed to accept reservation",
    };
  }
}

export async function declineReservationAction(
  listingId: number,
  ownerId: string,
  renterId: string
) {
  try {
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

    // Update reservation status to DECLINED
    await prisma.reservation.update({
      where: { id: reservation.id },
      data: { status: "DECLINED" },
    });

    console.log("DECLINED RESERVATION:", reservation.id);

    // Revalidate the page to update the UI
    revalidatePath("/chats");

    return {
      success: true,
      message: "Reservation declined successfully",
    };
  } catch (error) {
    console.error("Error declining reservation:", error);
    return {
      success: false,
      error: "Failed to decline reservation",
    };
  }
}
