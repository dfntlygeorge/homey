"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function startConversationWithOwner(
  listingId: number,
  ownerId: string
) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "You must be logged in to contact the owner",
    };
  }

  const currentUserId = session.user.id;

  if (currentUserId === ownerId) {
    return {
      success: false,
      message: "You cannot contact yourself",
    };
  }

  const existingConversation = await prisma.conversation.findUnique({
    where: {
      listingId_renterId_ownerId: {
        listingId,
        renterId: currentUserId,
        ownerId,
      },
    },
  });

  if (existingConversation) {
    return {
      success: true,
      conversationId: existingConversation.id,
    };
  }

  const newConversation = await prisma.conversation.create({
    data: {
      listingId,
      renterId: currentUserId,
      ownerId,
    },
  });

  return {
    success: true,
    conversationId: newConversation.id,
  };
}
