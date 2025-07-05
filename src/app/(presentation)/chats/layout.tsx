import { auth } from "@/auth";
import { ChatList } from "@/components/chats/chat-list";
import { routes } from "@/config/routes";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

export default async function ChatsLayout({ children }: PropsWithChildren) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect(routes.signIn);

  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ renterId: userId }, { ownerId: userId }],
    },
    include: {
      listing: {
        include: {
          images: {
            take: 1,
          },
        },
      },
      messages: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1, // Only get the most recent message for sidebar
      },
      renter: true,
      owner: true,
    },
  });

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50">
      {/* Chat List - Always visible on desktop, full screen on mobile */}
      <div className="w-full md:w-80 md:border-r md:border-gray-200 bg-white">
        <ChatList conversations={conversations} currentUserId={userId} />
      </div>

      {/* Chat Window - Hidden on mobile, visible on desktop */}
      <div className="hidden md:flex flex-1 flex-col">{children}</div>
    </div>
  );
}
