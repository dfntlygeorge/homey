"use client";

import { useState, useTransition } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { createMessage } from "@/app/_actions/create-message";
import { socket } from "@/socket";
import { Message } from "@prisma/client";

interface ChatInputProps {
  conversationId: number;
  receiverId: string;
  currentUserId: string;
  onOptimisticMessage?: (message: Message & { isPending: boolean }) => void;
}

export const ChatInput = ({
  conversationId,
  receiverId,
  currentUserId,
  onOptimisticMessage,
}: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setError(null);
    const messageText = message.trim();

    // Clear input immediately for better UX
    setMessage("");

    // Create optimistic message
    const optimisticMessage = {
      id: Date.now(), // Temporary ID
      text: messageText,
      senderId: currentUserId,
      receiverId: receiverId,
      conversationId: conversationId,
      isDelivered: false, // Mark as not delivered initially
      isSeen: false,
      createdAt: new Date(),
      isPending: true, // Flag to show "Sending..." status
    };

    // Add optimistic message immediately
    if (onOptimisticMessage) {
      onOptimisticMessage(optimisticMessage);
    }

    startTransition(async () => {
      const result = await createMessage(
        conversationId,
        messageText,
        receiverId
      );

      if (result.error) {
        setError(result.error);
        // Restore message text if there was an error
        setMessage(messageText);
        // TODO: Remove optimistic message or mark as failed
      } else {
        // Emit socket event after successful DB save
        socket.emit("send_message", {
          text: messageText,
          senderId: currentUserId,
          receiverId: receiverId,
          conversationId: conversationId,
          isDelivered: true,
        });
      }
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      {error && (
        <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          disabled={isPending}
          className="flex-1"
        />
        <Button
          onClick={handleSendMessage}
          disabled={isPending || !message.trim()}
          size="icon"
          className="shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
