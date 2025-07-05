// @/lib/actions/message-actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

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

    // Create the message
    const message = await prisma.message.create({
      data: {
        text: text.trim(),
        senderId,
        receiverId,
        conversationId,
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
    revalidatePath(`/chats/${conversation.id}`);

    return { success: true, message };
  } catch (error) {
    console.error("Error creating message:", error);
    return { error: "Failed to send message" };
  }
}
