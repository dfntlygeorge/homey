"use client";

import { formatHoverTimestamp, formatTimeAgo } from "@/lib/utils";
import { Message, User } from "@prisma/client";
import Image from "next/image";

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  otherUser: User;
  isLastMessageFromCurrentUser: boolean;
}

export const MessageBubble = ({
  message,
  isCurrentUser,
  otherUser,
  isLastMessageFromCurrentUser,
}: MessageBubbleProps) => {
  console.log("IS LAST MESSAGE: ", isLastMessageFromCurrentUser);
  console.log("IS CURRENT USER: ", isCurrentUser);
  const defaultAvatar =
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face";

  // Format time (you can use date-fns if you prefer)
  const formattedTime = formatHoverTimestamp(message.createdAt);

  // Format time ago for "Sent" status
  const timeAgo = formatTimeAgo(message.createdAt);
  return (
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} `}>
      <div
        className={`flex max-w-xs lg:max-w-md ${
          isCurrentUser ? "flex-row-reverse" : "flex-row"
        } items-end group`}
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

        {/* Message Bubble Container with proper spacing */}
        {/* Message Bubble Container - Wrapper for bubble and timestamp */}
        <div className="flex flex-col gap-1">
          {/* Message Bubble */}
          <div
            className={`px-4 py-2 rounded-2xl relative ${
              isCurrentUser
                ? "bg-blue-500 text-white rounded-br-md"
                : "bg-gray-200 text-gray-900 rounded-bl-md"
            }`}
          >
            <p className="text-sm whitespace-pre-wrap break-words">
              {message.text}
            </p>

            {/* Side Timestamp - Hover timestamp */}
            <span
              className={`
        absolute ${
          isCurrentUser ? "left-auto right-full mr-2" : "left-full ml-2"
        } bottom-0 text-xs text-gray-600 
        bg-white px-2 py-0.5 rounded-full shadow-sm border
        opacity-0 group-hover:opacity-100 transition-opacity duration-200
        whitespace-nowrap z-10
      `}
            >
              {formattedTime}
            </span>
          </div>

          {/* Sent Status - Below the bubble */}
          {isCurrentUser && isLastMessageFromCurrentUser && (
            <div
              className={`text-[11px] text-gray-400 px-1 ${
                isCurrentUser ? "text-right" : "text-left"
              }`}
            >
              {timeAgo}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
