"use server";

import { prisma } from "@/lib/prisma";
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
        acceptedAt: true,
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

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { slotsAvailable: true, isAvailable: true, title: true },
    });

    await prisma.notification.create({
      data: {
        userId: renterId, // notifcation for the owner
        message: `Your reservation request for "${listing?.title}" has been declined.`,
        type: NotificationType.RESERVATION,
      },
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

export async function acceptReservationByIdAction(reservationId: number) {
  try {
    // Get the reservation with listing details
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { listing: true },
    });

    if (!reservation) {
      return {
        success: false,
        error: "Reservation not found",
      };
    }

    if (reservation.status !== "PENDING") {
      return {
        success: false,
        error: "Reservation is not pending",
      };
    }

    const listing = reservation.listing;

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
        where: { id: reservationId },
        data: {
          status: "ACCEPTED",
          acceptedAt: new Date(),
        },
      });

      // Update listing slots
      const newSlotsAvailable = listing.slotsAvailable - 1;
      const shouldMarkUnavailable = newSlotsAvailable <= 0;

      await tx.listing.update({
        where: { id: listing.id },
        data: {
          slotsAvailable: newSlotsAvailable,
          isAvailable: shouldMarkUnavailable ? false : listing.isAvailable,
        },
      });
    });

    revalidatePath("/manage-listings");
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

export async function declineReservationByIdAction(reservationId: number) {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation) {
      return {
        success: false,
        error: "Reservation not found",
      };
    }

    if (reservation.status !== "PENDING") {
      return {
        success: false,
        error: "Reservation is not pending",
      };
    }

    // Update reservation status to DECLINED (or delete if you prefer)
    await prisma.reservation.update({
      where: { id: reservationId },
      data: { status: "DECLINED" },
    });

    // Alternative: Delete the reservation entirely
    // await prisma.reservation.delete({
    //   where: { id: reservationId },
    // });

    revalidatePath("/manage-listings");
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

// New function to check if review prompt should be shown
export async function checkReviewPromptEligibility(
  listingId: number,
  userId: string
) {
  try {
    const reservation = await prisma.reservation.findFirst({
      where: {
        listingId,
        userId,
        status: "ACCEPTED",
      },
      select: {
        id: true,
        acceptedAt: true,
      },
    });

    if (!reservation || !reservation.acceptedAt) {
      return {
        success: true,
        showPrompt: false,
      };
    }

    // Check if a month has passed since acceptance
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const showPrompt = reservation.acceptedAt <= oneMonthAgo;

    return {
      success: true,
      showPrompt,
      reservationId: reservation.id,
    };
  } catch (error) {
    console.error("Error checking review prompt eligibility:", error);
    return {
      success: false,
      error: "Failed to check review prompt eligibility",
    };
  }
}

// New function to check if user already reviewed the listing
export async function checkExistingReview(addressId: number, userId: string) {
  try {
    const existingReview = await prisma.review.findFirst({
      where: {
        addressId,
        userId,
      },
      select: {
        id: true,
        rating: true,
        comment: true,
      },
    });

    return {
      success: true,
      hasReview: !!existingReview,
      review: existingReview,
    };
  } catch (error) {
    console.error("Error checking existing review:", error);
    return {
      success: false,
      error: "Failed to check existing review",
    };
  }
}
