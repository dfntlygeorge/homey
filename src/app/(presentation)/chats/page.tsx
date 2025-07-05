import { auth } from "@/auth";
import { ChatList } from "@/components/chats/chat-list";
import { ChatWindow } from "@/components/chats/chat-window";
import { routes } from "@/config/routes";
import { PageProps } from "@/config/types";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function ChatsPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const id = searchParams?.id as string;
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
      },
      renter: true,
      owner: true,
    },
  });

  // Find the active conversation based on search param
  const activeConversation = id
    ? conversations.find((conv) => conv.id === Number(id))
    : null;

  // Handle the seen messages update for active conversation
  if (activeConversation) {
    await prisma.message.updateMany({
      where: {
        isSeen: false,
        conversationId: activeConversation.id,
        receiverId: userId,
      },
      data: {
        isSeen: true,
      },
    });
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50">
      {/* Chat List */}
      <div
        className={`w-full md:w-80 md:border-r md:border-gray-200 bg-white ${
          id ? "hidden md:block" : ""
        }`}
      >
        <ChatList conversations={conversations} currentUserId={userId} />
      </div>

      {/* Chat Window */}
      <div
        className={`flex-1 flex flex-col ${!id ? "hidden md:flex" : "flex"}`}
      >
        {activeConversation ? (
          <ChatWindow
            conversation={activeConversation}
            currentUserId={userId}
          />
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center text-gray-500">
            Select a conversation
          </div>
        )}
      </div>
    </div>
  );
}
