"use client";

import { startConversationWithOwner } from "@/app/_actions/chats/start-conversation";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/config/routes";
import { MessageCircleIcon } from "lucide-react";

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleContactOwner}
      disabled={isLoading}
      className="w-full flex items-center gap-2 text-sm"
    >
      <MessageCircleIcon className="h-4 w-4" />
      {isLoading ? "Connecting..." : "Send Message"}
    </Button>
  );
};
