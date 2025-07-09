import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { ClientHeaderWrapper } from "./client-header-wrapper";

export const PublicHeader = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  // For unauthenticated users, show header with empty data
  if (!userId || !session) {
    return (
      <ClientHeaderWrapper
        initialNotifications={[]}
        session={null} // Pass null session
        unreadMessageCount={null}
      />
    );
  }

  // For authenticated users, fetch their data

  const notifications = await prisma.notification.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const unreadMessagesCount = await prisma.message.count({
    where: {
      receiverId: userId,
      isDelivered: true,
      isSeen: false,
    },
  });

  return (
    <ClientHeaderWrapper
      initialNotifications={notifications}
      session={session}
      unreadMessageCount={unreadMessagesCount}
    />
  );
};
