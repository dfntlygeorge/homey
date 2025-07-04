"use client";

import { Message, User } from "@prisma/client";
import Image from "next/image";

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  otherUser: User;
}

export const MessageBubble = ({
  message,
  isCurrentUser,
  otherUser,
}: MessageBubbleProps) => {
  const defaultAvatar =
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face";

  // Format time (you can use date-fns if you prefer)
  const formattedTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex max-w-xs lg:max-w-md ${
          isCurrentUser ? "flex-row-reverse" : "flex-row"
        } group relative`} // ⬅️ Added group & relative for hover effect
      >
        {/* Avatar - Only show for other user */}
        {!isCurrentUser && (
          <div className="flex-shrink-0 mr-3">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <Image
                src={otherUser.image || defaultAvatar}
                alt={otherUser.name || "User"}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={`px-4 py-2 rounded-2xl ${
            isCurrentUser
              ? "bg-blue-500 text-white rounded-br-md"
              : "bg-gray-200 text-gray-900 rounded-bl-md"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.text}
          </p>
        </div>

        {/* Hover Timestamp */}
        <span
          className={`absolute ${
            isCurrentUser ? "right-0 -bottom-5" : "left-0 -bottom-5"
          } text-xs text-gray-400 hidden group-hover:block`} // ⬅️ Hidden by default, show on hover
        >
          {formattedTime}
        </span>
      </div>
    </div>
  );
};
