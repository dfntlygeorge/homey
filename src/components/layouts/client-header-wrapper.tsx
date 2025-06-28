"use client";

import { Notification } from "@prisma/client";
import { useState, useEffect } from "react";
import { PublicHeaderContent } from "./header-content";
import { Session } from "next-auth";
import { Favourites } from "@/config/types";

interface ClientHeaderWrapperProps {
  initialNotifications: Notification[];
  session: Session | null;
  favourites: Favourites | null;
}

export const ClientHeaderWrapper = ({
  initialNotifications,
  session,
  favourites,
}: ClientHeaderWrapperProps) => {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);

  // Update notifications when server data changes
  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  const handleNotificationUpdate = (updatedNotifications: Notification[]) => {
    setNotifications(updatedNotifications);
  };

  return (
    <PublicHeaderContent
      notifications={notifications}
      session={session}
      favourites={favourites}
      onNotificationUpdate={handleNotificationUpdate}
    />
  );
};
