"use client";

import { Prisma } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import { ChatItem } from "./chat-item";

interface ChatListProps {
  conversations: Prisma.ConversationGetPayload<{
    include: {
      listing: {
        include: {
          images: true;
          address: true;
          user: true;
        };
      };
      messages: true;
      renter: true;
      owner: true;
    };
  }>[];
  currentUserId: string;
}

export const ChatList = ({ conversations, currentUserId }: ChatListProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const isChatPage = pathname.startsWith("/chats/") && pathname !== "/chats";

  if (isChatPage) return;

  const handleChatClick = (conversationId: number) => {
    router.push(`/chats?id=${conversationId}`);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex items-center justify-center h-full p-8 text-center">
            <div className="text-gray-500">
              <div className="text-lg font-medium mb-2">
                No conversations yet
              </div>
              <div className="text-sm">
                Start browsing listings to connect with others!
              </div>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {conversations.map((conversation) => (
              <ChatItem
                key={conversation.id}
                conversation={conversation}
                currentUserId={currentUserId}
                onClick={() => handleChatClick(conversation.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
