"use client";

import { navLinks } from "@/config/constants";
import { routes } from "@/config/routes";
import Link from "next/link";
import { Button } from "../ui/button";
import { MessageCircleIcon } from "lucide-react";
import { Notification } from "@prisma/client";
import { NotificationDropdown } from "./notification-dropdown";
import {
  markAllAsReadAction,
  markAsReadAction,
} from "@/app/_actions/shared/notification";
import { Session } from "next-auth";
import UserAvatarDropdown from "../ui/user-avatar-dropdown";
import { MobileNavigation } from "./mobile-navigation";
import Image from "next/image";

interface PublicHeaderContentProps {
  notifications: Notification[];
  session: Session | null;
  onNotificationUpdate: (notifications: Notification[]) => void;
  unreadMessageCount: number | null;
}

export const PublicHeaderContent = ({
  notifications,
  session,
  onNotificationUpdate,
  unreadMessageCount,
}: PublicHeaderContentProps) => {
  return (
    <header className="flex h-16 items-center justify-between gap-x-6 bg-transparent pl-4 pr-4 md:pr-8">
      <div className="flex flex-1 items-center">
        <Link
          href={routes.home}
          className="group font-heading text-foreground hover:text-primary rounded px-3 py-2 text-base font-semibold uppercase transition-all duration-300 ease-in-out flex items-center gap-2"
        >
          <Image
            src={"/brand-icon.png"}
            alt="Hestia logo"
            width={26}
            height={26}
          />
          Hestia
        </Link>
      </div>
      <nav className="hidden md:flex">
        {navLinks.map((link) => (
          <Link
            key={link.id}
            className="group font-heading text-foreground hover:text-primary rounded px-3 py-2 text-base font-semibold uppercase transition-all duration-300 ease-in-out"
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {session && (
        <>
          <NotificationDropdown
            notifications={notifications}
            onNotificationClick={markAsReadAction}
            onMarkAllAsRead={markAllAsReadAction}
            onNotificationUpdate={onNotificationUpdate}
          />
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="group relative"
          >
            <Link href={routes.chats}>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-200 hover:bg-blue-100/60 dark:hover:bg-blue-900/40">
                <MessageCircleIcon className="h-5 w-5 text-gray-600 transition-all duration-200 ease-in-out group-hover:text-blue-500 group-hover:fill-blue-500" />
              </div>
              {(unreadMessageCount ?? 0) > 0 && (
                <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white">
                  <span className="text-xs font-medium">
                    {unreadMessageCount}
                  </span>
                </div>
              )}
            </Link>
          </Button>
        </>
      )}

      <UserAvatarDropdown
        session={session}
        className="group font-heading text-foreground hover:text-primary rounded px-3 py-2 text-base font-semibold uppercase transition-all duration-300 ease-in-out cursor-pointer hidden md:flex"
      />
      {/* mobile navbar */}
      <MobileNavigation session={session} />
    </header>
  );
};
