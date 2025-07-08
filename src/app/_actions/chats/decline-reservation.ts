import prisma from "@/lib/prisma";
import { NotificationType } from "@prisma/client";
import { revalidatePath } from "next/cache";

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
