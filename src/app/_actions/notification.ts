"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NotificationType } from "@prisma/client";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createNotificationAction(
  userId: string,
  message: string,
  type: NotificationType,
  listingId: number
) {
  await prisma.notification.create({
    data: {
      userId,
      message,
      type,
      listingId,
    },
  });

  // Revalidate to refresh server components
  revalidatePath("/");
}

export async function markAsReadAction(notificationId: number) {
  await prisma.notification.update({
    where: {
      id: notificationId,
    },
    data: {
      read: true,
    },
  });

  // Revalidate to refresh server components
  revalidatePath("/");
}

export async function markAllAsReadAction() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) notFound();

  await prisma.notification.updateMany({
    where: {
      userId,
    },
    data: {
      read: true,
    },
  });

  // Revalidate to refresh server components
  revalidatePath("/");
}
