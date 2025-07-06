"use client";

import { Message, Prisma } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { socket } from "@/socket";

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
  // Local state to track the most recent message and seen status
  const [recentMessage, setRecentMessage] = useState(conversation.messages[0]);
  const [unseenCount, setUnseenCount] = useState(0);

  // Calculate initial unseen count
  useEffect(() => {
    const count = conversation.messages.filter(
      (msg) => msg.receiverId === currentUserId && !msg.isSeen
    ).length;
    setUnseenCount(count);
  }, [conversation.messages, currentUserId]);

  // Listen for real-time updates
  useEffect(() => {
    // Join the conversation room to listen for updates
    socket.emit("join_conversation", conversation.id);

    // Handle new messages
    const handleNewMessage = (newMessage: Message) => {
      // Only update if this message belongs to this conversation
      if (newMessage.conversationId === conversation.id) {
        // Create a proper message object
        const messageWithDefaults = {
          id: Date.now(),
          text: newMessage.text,
          senderId: newMessage.senderId,
          receiverId: newMessage.receiverId,
          conversationId: newMessage.conversationId,
          isDelivered: newMessage.isDelivered || true,
          isSeen: false,
          createdAt: new Date(),
        };

        // Update the recent message
        setRecentMessage(messageWithDefaults);

        // If the message is for the current user, increment unseen count
        if (messageWithDefaults.receiverId === currentUserId) {
          setUnseenCount((prev) => prev + 1);
        }
      }
    };

    // Handle messages being marked as seen
    const handleMessagesSeen = (data: {
      conversationId: number;
      seenByUserId: string;
      seenAt: Date;
    }) => {
      // Only update if this is for this conversation
      if (data.conversationId === conversation.id) {
        // If the current user's messages were seen by the other user
        if (
          recentMessage?.senderId === currentUserId &&
          recentMessage?.receiverId === data.seenByUserId
        ) {
          setRecentMessage((prev) => (prev ? { ...prev, isSeen: true } : prev));
        }

        // If the other user marked messages as seen and current user sent them
        if (data.seenByUserId === currentUserId) {
          setUnseenCount(0);
        }
      }
    };

    socket.on("new_message", handleNewMessage);
    socket.on("messages_seen", handleMessagesSeen);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("messages_seen", handleMessagesSeen);
    };
  }, [
    conversation.id,
    currentUserId,
    recentMessage?.senderId,
    recentMessage?.receiverId,
  ]);

  // Determine the other user (not the current user)
  const otherUser =
    conversation.renterId === currentUserId
      ? conversation.owner
      : conversation.renter;

  // Get listing image or fallback
  const listingImage =
    conversation.listing.images[0]?.url ||
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop&crop=center";

  // Format timestamp
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (seconds < 60) {
      return "Just now";
    } else if (minutes < 60) {
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

  const isFromCurrentUser = recentMessage?.senderId === currentUserId;

  // Format message text based on sender and seen status
  const formatMessageText = () => {
    if (!recentMessage) return "No messages yet";

    if (isFromCurrentUser) {
      // Case 1: Message from current user - prefix with "You:"
      return `You: ${truncateMessage(recentMessage.text)}`;
    } else {
      // Case 2: Message from other user
      return truncateMessage(recentMessage.text);
    }
  };

  return (
    <div
      onClick={onClick}
      className="flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
    >
      {/* Avatar - Listing Image */}
      <div className="flex-shrink-0 mr-3 relative">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
          <Image
            src={listingImage}
            alt={conversation.listing.title}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Unread count badge */}
        {unseenCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unseenCount > 9 ? "9+" : unseenCount}
          </div>
        )}
      </div>

      {/* Chat Content */}
      <div className="flex-1 min-w-0">
        {/* User Name */}
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {otherUser.name || "Unknown User"}
          </h3>
        </div>

        {/* Recent Message */}
        <div className="flex items-center justify-between">
          <p
            className={`text-sm truncate ${
              unseenCount
                ? "font-bold text-gray-900" // Bold for unread messages from other users
                : "text-gray-600" // Normal weight for read messages or current user's messages
            }`}
          >
            {formatMessageText()}
            {recentMessage && (
              <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                • {formatTimestamp(recentMessage.createdAt)}
              </span>
            )}
          </p>
        </div>

        {/* Listing Title - Subtle context */}
        <div className="mt-1">
          <p className="text-xs text-gray-400 truncate">
            {conversation.listing.title}
          </p>
        </div>
      </div>

      {/* Seen indicator for current user's messages */}
      {isFromCurrentUser && (
        <div className="flex-shrink-0 ml-2">
          {recentMessage.isSeen ? (
            <div className="w-2 h-2 rounded-full bg-blue-500" title="Seen" />
          ) : (
            <div
              className="w-2 h-2 rounded-full bg-gray-400"
              title="Delivered"
            />
          )}
        </div>
      )}
    </div>
  );
};
