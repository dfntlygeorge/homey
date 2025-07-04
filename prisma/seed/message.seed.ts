import prisma from "@/lib/prisma";
import { faker } from "@faker-js/faker";

export async function seedMessages() {
  // Find the first conversation
  const conversation = await prisma.conversation.findFirst({
    include: {
      renter: true,
      owner: true,
    },
  });

  if (!conversation) throw new Error("No conversation found");

  const renterId = conversation.renterId;
  const ownerId = conversation.ownerId;

  // Create messages
  const messages = Array.from({ length: 5 }).map((_, i) => ({
    text: faker.lorem.sentence(),
    senderId: i % 2 === 0 ? renterId : ownerId,
    receiverId: i % 2 === 0 ? ownerId : renterId,
    conversationId: conversation.id,
    isDelivered: true,
    isSeen: i < 3, // First 3 seen
  }));

  await prisma.message.createMany({ data: messages });

  console.log(
    `✅ Seeded ${messages.length} messages for conversation ${conversation.id}`
  );
}
