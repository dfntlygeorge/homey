"use client";

import { Message, User } from "@prisma/client";
import { useEffect, useRef } from "react";
import { MessageBubble } from "./message-bubble";
import { formatMessageTimestamp } from "@/lib/message-utils";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  otherUser: User;
}

export const MessageList = ({
  messages,
  currentUserId,
  otherUser,
}: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom only if user is near the bottom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check if user is near the bottom (within 100px)
    const isNearBottom =
      container.scrollTop + container.clientHeight >=
      container.scrollHeight - 100;

    // Only scroll if user is near bottom
    if (isNearBottom) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages]);

  // Sort messages by creation time (old to newest)
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // Group messages by time threshold (30 minutes)
  const messageGroups: Array<{
    timestamp: Date;
    messages: typeof sortedMessages;
  }> = [];

  const TIME_THRESHOLD = 30 * 60 * 1000; // 30 minutes in milliseconds

  sortedMessages.forEach((message, index) => {
    const messageTime = new Date(message.createdAt);

    if (index === 0) {
      // First message always starts a new group
      messageGroups.push({
        timestamp: messageTime,
        messages: [message],
      });
    } else {
      const lastGroup = messageGroups[messageGroups.length - 1];
      const lastMessageTime = new Date(sortedMessages[index - 1].createdAt);
      const timeDiff = messageTime.getTime() - lastMessageTime.getTime();

      if (timeDiff > TIME_THRESHOLD) {
        // Start new group if time gap is > 30 minutes
        messageGroups.push({
          timestamp: messageTime,
          messages: [message],
        });
      } else {
        // Add to current group
        lastGroup.messages.push(message);
      }
    }
  });

  if (sortedMessages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-lg font-medium mb-2">No messages yet</h3>
          <p className="text-sm">
            Start the conversation by sending a message!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-6">
      {messageGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="space-y-3">
          {/* Timestamp */}
          <div className="flex justify-center">
            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {formatMessageTimestamp(group.timestamp)}
            </span>
          </div>

          {/* Messages in this group */}
          <div className="space-y-2">
            {group.messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isCurrentUser={message.senderId === currentUserId}
                otherUser={otherUser}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Auto-scroll target */}
      <div ref={messagesEndRef} />
    </div>
  );
};
