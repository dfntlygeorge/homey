import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
