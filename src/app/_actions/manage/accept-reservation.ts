import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
