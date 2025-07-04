"use client";

import { Prisma } from "@prisma/client";
import Image from "next/image";

interface ChatItemProps {
  conversation: Prisma.ConversationGetPayload<{
    include: {
      listing: {
        include: {
          images: true;
        };
      };
      messages: true;
      renter: true;
      owner: true;
    };
  }>;
  currentUserId: string;
  onClick: () => void;
}

export const ChatItem = ({
  conversation,
  currentUserId,
  onClick,
}: ChatItemProps) => {
  // Determine the other user (not the current user)
  const otherUser =
    conversation.renterId === currentUserId
      ? conversation.owner
      : conversation.renter;

  // Get the most recent message
  const recentMessage = conversation.messages[0];
  console.log(conversation.listing.images[0]?.url);

  // Get listing image or fallback
  const listingImage =
    conversation.listing.images[0]?.url ||
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop&crop=center";

  // Format timestamp
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m`;
    } else if (hours < 24) {
      return `${hours}h`;
    } else {
      return `${days}d`;
    }
  };

  // Truncate message to one line
  const truncateMessage = (text: string, maxLength: number = 60) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div
      onClick={onClick}
      className="flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
    >
      {/* Avatar - Listing Image */}
      <div className="flex-shrink-0 mr-3">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
          <Image
            src={listingImage}
            alt={conversation.listing.title}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Chat Content */}
      <div className="flex-1 min-w-0">
        {/* User Name */}
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {otherUser.name || "Unknown User"}
          </h3>
          {recentMessage && (
            <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
              {formatTimestamp(recentMessage.createdAt)}
            </span>
          )}
        </div>

        {/* Recent Message */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 truncate">
            {recentMessage
              ? truncateMessage(recentMessage.text)
              : "No messages yet"}
          </p>
        </div>

        {/* Listing Title - Subtle context */}
        <div className="mt-1">
          <p className="text-xs text-gray-400 truncate">
            {conversation.listing.title}
          </p>
        </div>
      </div>
    </div>
  );
};
