"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { messageRatelimit } from "@/lib/rate-limit";

export async function createMessage(
  conversationId: number,
  text: string,
  receiverId: string
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Not authenticated" };
    }

    const senderId = session.user.id;

    // Rate limit check
    const { success } = await messageRatelimit.limit(senderId);
    if (!success) {
      return {
        error: "You're sending messages too fast. Please slow down.",
      };
    }

    // Validate that the conversation exists and the user is part of it
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [{ renterId: senderId }, { ownerId: senderId }],
      },
    });

    if (!conversation) {
      return { error: "Conversation not found or unauthorized" };
    }

    const allowedReceiverId =
      conversation.renterId === senderId
        ? conversation.ownerId
        : conversation.renterId;

    if (receiverId !== allowedReceiverId) {
      return { error: "Invalid receiver" };
    }

    if (!text.trim() || text.trim().length > 2000) {
      return { error: "Invalid message length" };
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        text: text.trim(),
        senderId,
        receiverId,
        conversationId,
        isDelivered: true,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // Revalidate the page to show the new message
    revalidatePath("/chats");

    return { success: true, message };
  } catch (error) {
    console.error("Error creating message:", error);
    return { error: "Failed to send message" };
  }
}
