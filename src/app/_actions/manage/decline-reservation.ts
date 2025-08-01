"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function declineReservationByIdAction(reservationId: number) {
  try {
    const session = await auth();
    const currentUser = session?.user;

    if (!currentUser) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      success: false,
      error: "Failed to decline reservation",
    };
  }
}
