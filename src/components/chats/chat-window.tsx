import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { MessageList } from "./message-list";

interface ChatWindowProps {
  conversation: Prisma.ConversationGetPayload<{
    include: {
      renter: true;
      owner: true;
      messages: true;
      listing: {
        include: {
          images: true;
        };
      };
    };
  }>;
}

export const ChatWindow = async ({ conversation }: ChatWindowProps) => {
  const session = await auth();
  const currentUserId = session?.user?.id;

  if (!currentUserId) {
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center text-gray-500">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-lg font-medium mb-2">
              Authentication Required
            </h3>
            <p className="text-sm">Please sign in to view messages</p>
          </div>
        </div>
      </div>
    );
  }

  // Get the other user
  const otherUser =
    conversation.renterId === currentUserId
      ? conversation.owner
      : conversation.renter;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">
              {otherUser.name || "Unknown User"}
            </h2>
            <p className="text-sm text-gray-600">
              {conversation.listing.title}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <MessageList
          messages={conversation.messages}
          currentUserId={currentUserId}
          otherUser={otherUser}
        />
      </div>
    </div>
  );
};
