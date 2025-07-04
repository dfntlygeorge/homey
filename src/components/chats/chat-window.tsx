import { Prisma } from "@prisma/client";

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

export const ChatWindow = ({ conversation }: ChatWindowProps) => {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-gray-900">
          {conversation.listing.title}
        </h2>
      </div>

      {/* Empty State */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-lg font-medium mb-2">Chat Window</h3>
          <p className="text-sm">
            This is where the conversation will appear.
            <br />
            Chat functionality coming soon!
          </p>
        </div>
      </div>
    </div>
  );
};
