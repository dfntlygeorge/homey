"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NotificationType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function declineReservationAction(
  listingId: number,
  ownerId: string,
  renterId: string
) {
  try {
    const session = await auth();
    const currentUser = session?.user;

    if (!currentUser || currentUser.id !== ownerId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

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

    await prisma.reservation.update({
      where: { id: reservation.id },
      data: { status: "DECLINED" },
    });

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { title: true },
    });

    await prisma.notification.create({
      data: {
        userId: renterId,
        message: `Your reservation request for "${listing?.title}" has been declined.`,
        type: NotificationType.RESERVATION,
      },
    });

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
