"use client";

import { Message, Prisma } from "@prisma/client";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { useState, useEffect, useCallback } from "react";
import { socket } from "@/socket";
import { markMessagesAsSeen } from "@/app/_actions/chats/mark-as-seen";
import { ListingChatHeader } from "./listing-chat-header";
import { checkReviewPromptEligibility } from "@/app/_actions/chats/check-review-prompt-eligibility";
import { checkExistingReview } from "@/app/_actions/chats/check-existing-review";

// System message type
export interface SystemMessage {
  id: string;
  type: "review_prompt" | "review_submitted";
  createdAt: Date;
  data: {
    addressId?: number;
    listingTitle?: string;
    existingReview?: {
      id: number;
      rating: number;
      comment: string;
    } | null;
  };
}

interface ChatWindowProps {
  conversation: Prisma.ConversationGetPayload<{
    include: {
      renter: true;
      owner: true;
      messages: true;
      listing: {
        include: {
          images: true;
          address: true;
          user: true;
        };
      };
    };
  }>;
  currentUserId: string;
}

export const ChatWindow = ({
  conversation,
  currentUserId,
}: ChatWindowProps) => {
  const [messages, setMessages] = useState(conversation.messages || []);
  const [systemMessages, setSystemMessages] = useState<SystemMessage[]>([]);

  // Check if current user is the renter
  const isRenter = conversation.renterId === currentUserId;

  const markMessagesAsSeenHandler = useCallback(async () => {
    try {
      const result = await markMessagesAsSeen(conversation.id);

      if (result.success && result.updatedCount > 0) {
        // Update local state immediately
        setMessages((prev) =>
          prev.map((msg) =>
            msg.receiverId === currentUserId && !msg.isSeen
              ? { ...msg, isSeen: true }
              : msg
          )
        );

        // Emit socket event to notify other users
        socket.emit("mark_messages_seen", {
          conversationId: conversation.id,
          seenByUserId: currentUserId,
          seenAt: result.seenAt,
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {}
  }, [conversation.id, currentUserId]);

  // Check review prompt eligibility
  const checkReviewPrompt = useCallback(async () => {
    if (!isRenter || !conversation.listing.address?.id) return;

    try {
      // Check if user is eligible for review prompt
      const eligibilityResult = await checkReviewPromptEligibility(
        conversation.listing.id,
        currentUserId
      );

      if (eligibilityResult.success && eligibilityResult.showPrompt) {
        // Check if user already has a review
        const reviewResult = await checkExistingReview(
          conversation.listing.address.id,
          currentUserId
        );

        if (reviewResult.success) {
          const systemMessageId = `review_${conversation.listing.address.id}_${currentUserId}`;

          // Check if we already have a system message for this review
          const existingSystemMessage = systemMessages.find(
            (msg) => msg.id === systemMessageId
          );

          if (!existingSystemMessage) {
            const newSystemMessage: SystemMessage = {
              id: systemMessageId,
              type: reviewResult.hasReview
                ? "review_submitted"
                : "review_prompt",
              createdAt: new Date(),
              data: {
                addressId: conversation.listing.address.id,
                listingTitle: conversation.listing.title,
                existingReview: reviewResult.hasReview
                  ? reviewResult.review
                  : null,
              },
            };

            setSystemMessages((prev) => [...prev, newSystemMessage]);
          }
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {}
  }, [
    isRenter,
    conversation.listing.id,
    conversation.listing.address?.id,
    currentUserId,
    systemMessages,
    conversation.listing.title,
  ]);

  // Handle review submission success
  const handleReviewSubmitted = useCallback(
    (reviewData: { rating: number; comment: string }) => {
      if (!conversation.listing.address?.id) return;

      const systemMessageId = `review_${conversation.listing.address.id}_${currentUserId}`;

      setSystemMessages((prev) =>
        prev.map((msg) =>
          msg.id === systemMessageId
            ? {
                ...msg,
                type: "review_submitted" as const,
                data: {
                  ...msg.data,
                  existingReview: {
                    id: Date.now(), // Temporary ID
                    rating: reviewData.rating,
                    comment: reviewData.comment,
                  },
                },
              }
            : msg
        )
      );
    },
    [conversation.listing.address?.id, currentUserId]
  );

  // Handle system message dismissal
  const handleDismissSystemMessage = useCallback((systemMessageId: string) => {
    setSystemMessages((prev) =>
      prev.filter((msg) => msg.id !== systemMessageId)
    );
  }, []);

  useEffect(() => {
    // Update messages when conversation changes
    setMessages(conversation.messages || []);
  }, [conversation.messages]);

  useEffect(() => {
    if (conversation.id) {
      // Join the conversation room
      socket.emit("join_conversation", conversation.id);

      // Mark messages as seen when entering conversation
      markMessagesAsSeenHandler();

      // Check review prompt eligibility
      checkReviewPrompt();
    }
  }, [conversation.id, markMessagesAsSeenHandler, checkReviewPrompt]);

  useEffect(() => {
    // Listen for new messages
    const handleNewMessage = (newMessage: Message & { isPending: boolean }) => {
      // Only add messages for this conversation
      if (newMessage.conversationId === conversation.id) {
        // Create a proper Message object with required fields
        const messageWithDefaults = {
          id: Date.now(), // Temporary ID - you might want to use a proper UUID
          text: newMessage.text,
          senderId: newMessage.senderId,
          receiverId: newMessage.receiverId,
          conversationId: newMessage.conversationId,
          isDelivered: newMessage.isDelivered || true,
          isSeen: false,
          createdAt: new Date(),
        };

        setMessages((prev) => {
          // Avoid duplicate messages (in case of optimistic updates)
          const existingMessage = prev.find(
            (msg) =>
              msg.text === messageWithDefaults.text &&
              msg.senderId === messageWithDefaults.senderId &&
              Math.abs(
                new Date(msg.createdAt).getTime() -
                  messageWithDefaults.createdAt.getTime()
              ) < 5000
          );

          if (existingMessage) {
            // Update existing message to remove pending state
            return prev.map((msg) =>
              msg.id === existingMessage.id
                ? { ...msg, isDelivered: true, isPending: false }
                : msg
            );
          }

          const newMessages = [...prev, messageWithDefaults];

          // Auto-mark as seen if the message is for current user
          // Only if the current user is actively viewing the conversation
          if (messageWithDefaults.receiverId === currentUserId) {
            // Add a small delay to ensure the message is rendered first
            setTimeout(() => markMessagesAsSeenHandler(), 500);
          }

          return newMessages;
        });
      }
    };

    // Listen for messages being marked as seen
    const handleMessagesSeen = (data: {
      conversationId: number;
      seenByUserId: string;
      seenAt: Date;
    }) => {
      if (data.conversationId === conversation.id) {
        setMessages((prev) =>
          prev.map((msg) => {
            // Mark messages as seen if:
            // 1. Current user sent the message (msg.senderId === currentUserId)
            // 2. The other user marked them as seen (msg.receiverId === data.seenByUserId)
            if (
              msg.senderId === currentUserId &&
              msg.receiverId === data.seenByUserId
            ) {
              return { ...msg, isSeen: true };
            }
            return msg;
          })
        );
      }
    };

    socket.on("new_message", handleNewMessage);
    socket.on("messages_seen", handleMessagesSeen);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("messages_seen", handleMessagesSeen);
    };
  }, [conversation.id, currentUserId, markMessagesAsSeenHandler]);

  // Get the other user
  const otherUser =
    conversation.renterId === currentUserId
      ? conversation.owner
      : conversation.renter;

  // Calculate seen status based on current messages state
  const lastDeliveredMessage = messages
    .filter((m) => m.isDelivered)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

  // Get the most recent message sent by current user that has been seen
  const lastSeenMessage = messages
    .filter((m) => m.senderId === currentUserId && m.isSeen)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-white">
      {/* Listing Context Header */}
      <ListingChatHeader
        listing={conversation.listing}
        currentUserId={currentUserId}
        otherUser={otherUser}
      />

      {/* Scrollable Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <MessageList
          messages={messages}
          systemMessages={systemMessages}
          currentUserId={currentUserId}
          otherUser={otherUser}
          lastDeliveredMessage={lastDeliveredMessage}
          lastSeenMessage={lastSeenMessage}
          onReviewSubmitted={handleReviewSubmitted}
          onDismissSystemMessage={handleDismissSystemMessage}
        />
      </div>

      {/* Fixed Chat Input */}
      <div className="flex-shrink-0">
        <ChatInput
          conversationId={conversation.id}
          receiverId={otherUser.id}
          currentUserId={currentUserId}
          onOptimisticMessage={(message) => {
            setMessages((prev) => [...prev, message]);
          }}
        />
      </div>
    </div>
  );
};
