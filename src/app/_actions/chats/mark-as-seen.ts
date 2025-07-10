"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function markMessagesAsSeen(conversationId: number) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return { error: "Unauthorized" };
    }

    // Update all unseen messages in the conversation where current user is the receiver
    const updatedMessages = await prisma.message.updateMany({
      where: {
        conversationId,
        receiverId: userId,
        isSeen: false,
      },
      data: {
        isSeen: true,
      },
    });

    return {
      success: true,
      updatedCount: updatedMessages.count,
      seenByUserId: userId,
      seenAt: new Date(),
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { error: "Failed to mark messages as seen" };
  }
}
