import { User } from "@prisma/client";

interface ChatPartnerInfoProps {
  otherUser: User;
  isOwner: boolean;
}

export const ChatPartnerInfo = ({
  otherUser,
  isOwner,
}: ChatPartnerInfoProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900">
          {otherUser.name || "Unknown User"}
        </h2>
        <p className="text-sm text-zinc-500">
          {isOwner ? "Interested in your listing" : "Property Owner"}
        </p>
      </div>
    </div>
  );
};
