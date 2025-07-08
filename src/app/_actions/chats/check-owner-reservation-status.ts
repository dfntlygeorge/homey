import prisma from "@/lib/prisma";

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
