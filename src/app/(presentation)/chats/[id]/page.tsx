import { ChatWindow } from "@/components/chats/chat-window";
import { PageProps } from "@/config/types";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function ChatPage(props: PageProps) {
  const params = await props.params;
  const conversationId = Number(params?.id as string);
  console.log(conversationId ? "YES" : "NO ID FOUND, params problem");

  if (!conversationId) notFound();

  const conversation = await prisma.conversation.findUnique({
    where: {
      id: conversationId,
    },
    include: {
      renter: true,
      owner: true,
      messages: true,
      listing: {
        include: {
          images: {
            take: 1,
          },
        },
      },
    },
  });

  if (!conversation) notFound();

  return <ChatWindow conversation={conversation} />;
}
