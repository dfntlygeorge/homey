"use client";

import { Message, Prisma } from "@prisma/client";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { useState, useEffect } from "react";
import { socket } from "@/socket";

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
  currentUserId: string;
}

export const ChatWindow = ({
  conversation,
  currentUserId,
}: ChatWindowProps) => {
  const [messages, setMessages] = useState(conversation.messages || []);

  useEffect(() => {
    // Update messages when conversation changes
    setMessages(conversation.messages || []);
  }, [conversation.messages]);

  useEffect(() => {
    if (conversation.id) {
      // Join the conversation room
      socket.emit("join_conversation", conversation.id);
    }
  }, [conversation.id]);

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

          return [...prev, messageWithDefaults];
        });
      }
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [conversation.id]);

  // Get the other user
  const otherUser =
    conversation.renterId === currentUserId
      ? conversation.owner
      : conversation.renter;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-white">
      {/* Fixed Header */}
      <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
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

      {/* Scrollable Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <MessageList
          messages={messages}
          currentUserId={currentUserId}
          otherUser={otherUser}
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
