import { auth } from "@/auth";
import { getSourceId } from "@/lib/source-id";
import { Favourites } from "@/config/types";
import { redis } from "@/lib/redis-store";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ClientHeaderWrapper } from "./client-header-wrapper";

export const PublicHeader = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) notFound();

  const sourceId = await getSourceId();
  const favourites = await redis.get<Favourites>(sourceId ?? "");
  const notifications = await prisma.notification.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <ClientHeaderWrapper
      initialNotifications={notifications}
      session={session}
      favourites={favourites}
    />
  );
};
