"use client";

import { startConversationWithOwner } from "@/app/_actions/listing";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/config/routes";

interface ChatOwnerButtonProps {
  listingId: number;
  ownerId: string;
}

export const ChatOwnerButton = ({
  listingId,
  ownerId,
}: ChatOwnerButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleContactOwner = async () => {
    setIsLoading(true);

    try {
      const result = await startConversationWithOwner(listingId, ownerId);

      if (result && !result.success) {
        toast.error(result.message);
      } else if (result && result.conversationId) {
        // Now do client-side redirect
        router.push(routes.chat(result.conversationId));
      }
    } catch (error) {
      console.error("Error contacting owner:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleContactOwner}
      disabled={isLoading}
      variant={"ghost"}
      className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 disabled:opacity-50"
    >
      {isLoading ? "Connecting..." : "💬 Chat Owner"}
    </Button>
  );
};
