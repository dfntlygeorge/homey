"use client";

import { Message, User } from "@prisma/client";
import { useEffect, useRef, useMemo } from "react";
import { MessageBubble } from "./message-bubble";
import { SystemMessageBubble } from "./system-message-bubble";
import { formatMessageTimestamp } from "@/lib/message-utils";
import { SystemMessage } from "./chat-window";

// Combined message type for rendering
type CombinedMessage =
  | { type: "user"; data: Message }
  | { type: "system"; data: SystemMessage };

interface MessageListProps {
  messages: Message[];
  systemMessages: SystemMessage[];
  currentUserId: string;
  otherUser: User;
  lastDeliveredMessage?: Message;
  lastSeenMessage?: Message;
  onReviewSubmitted: (reviewData: { rating: number; comment: string }) => void;
  onDismissSystemMessage: (systemMessageId: string) => void;
}

export const MessageList = ({
  messages,
  systemMessages,
  currentUserId,
  otherUser,
  lastDeliveredMessage,
  lastSeenMessage,
  onReviewSubmitted,
  onDismissSystemMessage,
}: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Memoize and deduplicate messages to prevent key conflicts
  const sortedMessages = useMemo(() => {
    // Combine and sort all messages by creation time
    const combineAndSortMessages = (): CombinedMessage[] => {
      const userMessages: CombinedMessage[] = messages.map((msg) => ({
        type: "user" as const,
        data: msg,
      }));

      // Deduplicate system messages by ID to prevent duplicate keys
      const uniqueSystemMessages = systemMessages.filter(
        (msg, index, self) => index === self.findIndex((m) => m.id === msg.id)
      );

      const systemMessagesFormatted: CombinedMessage[] =
        uniqueSystemMessages.map((msg) => ({
          type: "system" as const,
          data: msg,
        }));

      const allMessages = [...userMessages, ...systemMessagesFormatted];

      return allMessages.sort((a, b) => {
        const timeA = new Date(a.data.createdAt).getTime();
        const timeB = new Date(b.data.createdAt).getTime();
        return timeA - timeB;
      });
    };

    return combineAndSortMessages();
  }, [messages, systemMessages]);

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
  }, [sortedMessages]);

  // Group messages by time threshold (30 minutes)
  const messageGroups: Array<{
    timestamp: Date;
    messages: CombinedMessage[];
  }> = [];

  const TIME_THRESHOLD = 30 * 60 * 1000; // 30 minutes in milliseconds

  sortedMessages.forEach((message, index) => {
    const messageTime = new Date(message.data.createdAt);

    if (index === 0) {
      // First message always starts a new group
      messageGroups.push({
        timestamp: messageTime,
        messages: [message],
      });
    } else {
      const lastGroup = messageGroups[messageGroups.length - 1];
      const lastMessageTime = new Date(
        sortedMessages[index - 1].data.createdAt
      );
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
            {group.messages.map((message, messageIndex) => {
              if (message.type === "system") {
                return (
                  <SystemMessageBubble
                    key={`system-${groupIndex}-${messageIndex}-${message.data.id}`}
                    systemMessage={message.data}
                    onReviewSubmitted={onReviewSubmitted}
                    onDismiss={() => onDismissSystemMessage(message.data.id)}
                  />
                );
              }

              // Handle user messages
              const userMessage = message.data as Message;
              const isLastDeliveredMessage =
                lastDeliveredMessage?.id === userMessage.id;
              const isLastMessageFromCurrentUser =
                isLastDeliveredMessage &&
                userMessage.senderId === currentUserId;
              const isLastSeenMessage = lastSeenMessage?.id === userMessage.id;

              return (
                <MessageBubble
                  key={`user-${groupIndex}-${messageIndex}-${userMessage.id}`}
                  message={userMessage}
                  isCurrentUser={userMessage.senderId === currentUserId}
                  otherUser={otherUser}
                  isLastMessageFromCurrentUser={isLastMessageFromCurrentUser}
                  isLastSeenMessage={isLastSeenMessage}
                />
              );
            })}
          </div>
        </div>
      ))}

      {/* Auto-scroll target */}
      <div ref={messagesEndRef} />
    </div>
  );
};
