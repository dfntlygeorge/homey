"use client";

import { Message, Prisma } from "@prisma/client";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { useState, useEffect, useCallback } from "react";
import { socket } from "@/socket";
import { markMessagesAsSeen } from "@/app/_actions/mark-as-seen";
import { ListingChatHeader } from "./listing-chat-header";

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
    } catch (error) {
      console.error("Error marking messages as seen:", error);
    }
  }, [conversation.id, currentUserId]);

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
    }
  }, [conversation.id, markMessagesAsSeenHandler]);

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
      console.log("Received messages_seen event:", data);

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
          currentUserId={currentUserId}
          otherUser={otherUser}
          lastDeliveredMessage={lastDeliveredMessage}
          lastSeenMessage={lastSeenMessage}
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
